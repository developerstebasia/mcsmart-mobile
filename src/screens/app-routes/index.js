import React, {useEffect, useRef, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Redux
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AdEventType,
  AppOpenAd,
  InterstitialAd,
} from 'react-native-google-mobile-ads';
import SplashScreen from 'react-native-splash-screen';
import Purchasely from 'react-native-purchasely';
import {AppState, BackHandler, Linking, Platform, View} from 'react-native';
import states from './states';
import dispatcher from './dispatcher';
import PropTypes from 'prop-types';
// Ref routing
import {navigationRef, reset} from '../../shared/navigationRef';
import navigationData from '../../shared/navigationData';
import messaging from '@react-native-firebase/messaging';
// Screen
import WelcomePage from '../welcome-page';
import {navigationLinking} from '../../shared/navigationLinking';
import Register from '../register';
import MainPage from '../main-page';
import {
  fetchInitialData,
  fetchListQuote,
  handleSetProfile,
  resetNotificationBadge,
  setAnimationSlideStatus,
  setInitialLoaderStatus,
  setPaywallNotification,
} from '../../store/defaultState/actions';
import {getAppOpenID, getRewardedInsterstialLearnMoreID} from '../../shared/static/adsId';
import {
  handleBasicPaywall,
  handlePayment,
  handlePaymentBypass,
  handlePaymentTwo,
  handleUpdateTimezone,
  isUserPremium,
  reformatDate,
  reloadUserProfile,
} from '../../helpers/user';
import AdsOverlay from '../../components/ads-overlay';
import {
  getUserProfile,
  postRegister,
  updateProfile,
} from '../../shared/request';
import DeviceInfo from 'react-native-device-info';
import TimeZone from 'react-native-timezone';
import store from '../../store/configure-store';
import {OPEN_OFFER_NOTIFICATION, askTrackingPermission, eventTracking} from '../../helpers/eventTracking';
import notifee, {EventType} from '@notifee/react-native';
import {Notifications} from 'react-native-notifications';
import { event } from 'react-native-reanimated';
import { isMoreThanThreeHoursSinceLastTime } from '../../helpers/timeHelpers';
import crashlytics from '@react-native-firebase/crashlytics';

const Stack = createNativeStackNavigator();

const adUnitId = getAppOpenID();

const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});
// appOpenAd.load();

const interstialAdsLearn = InterstitialAd.createForAdRequest(
  getRewardedInsterstialLearnMoreID(),
  {
    requestNonPersonalizedAdsOnly: true,
    keywords: ["fashion", "clothing"],
  }
);
interstialAdsLearn.load();
function Routes({registerData, userProfile, props}) {
  console.log(JSON.stringify(userProfile))
  const [isLoading, setLoading] = useState(true);
  const [isLogin, setLogin] = useState(false);
  const [showAdsOverlay, setAdsOverlay] = useState(false);
  const [disableNavigate, setDisable] = useState(true);
  const openAdsOpened = useRef(false);
  const loadingRef = useRef(true);
  const [getFcmToken, setFcmToken] = useState(null);
  const paywallStatus = useRef(null);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const handleLoadInAppAds = async () => {
    const isFinishTutorial = await AsyncStorage.getItem('isFinishTutorial');
    if (isFinishTutorial === 'yes') {
      // if (appOpenAd.loaded && !isUserPremium()) {
      //   setAdsOverlay(true);
      //   appOpenAd.show();
      //   setDisable(false);
      // }
    }
  };

  const checkMinute = (start) => {
    let timeNow = new Date();
    let timeRemaining = (timeNow - start) / 1000; // Waktu dalam detik
  
    if (timeRemaining > 600) { // Jika lebih dari 600 detik (10 menit)
    //  console.log("Sudah lebih dari 10 menit sejak proses dimulai.");
      return true
    } else {
    //  console.log("Belum lebih dari 10 menit sejak proses dimulai.");
      return false
    }
  }

  const checkDays = (start) => {
    let timeNow = new Date();
    let timeRemaining = (timeNow - start) / 1000; // Waktu dalam detik
    // Jika lebih dari 2 hari
  if (timeRemaining > 86400 || timeRemaining < 2 * 86400) { // Jika lebih dari 600 detik (10 menit)
    //  console.log("Sudah lebih dari 24 jam sejak proses dimulai.");
      return true
    } else if (timeRemaining < 600) {
   //   console.log("Belum lebih dari 10 menit sejak proses dimulai.");
      return false
    }
  }
  const checkMinues = (start) => {
    let timeNow = new Date();
    let timeRemaining = (timeNow - start) / 1000; // Waktu dalam detik
    // Jika lebih dari 2 hari
  if (timeRemaining < 86400) {
    //  console.log("Belum lebih dari 10 menit sejak proses dimulai.");
      return true
    }
  }

  useEffect(() => {
    async function fetchData() {
      crashlytics().log('App Route');
      if(!isUserPremium()){
        checkingPaywall()
      }
    }
    fetchData()
   
  }, [])

  const checkingPaywall = async() => {
    const dataVersion = await AsyncStorage.getItem('version')
    const set10min = await AsyncStorage.getItem('set10min');
    const afterOnboard = await AsyncStorage.getItem('afterOnboard');
    const main10 = reformatDate(parseFloat(set10min));

    if (afterOnboard !== 'yes'){
      handlePayment("onboarding");
      await AsyncStorage.setItem('afterOnboard', 'yes');
    } else {
    if(dataVersion === '0'){
     
      const data = checkDays(main10)
      const value = checkMinues(main10)
      if(value){
        handlePayment("10_minutes_after_onboarding", () => {
          reset("MainPage", { isFromOnboarding: true });
        });
      }else if(data){
        handlePayment("24_hours_after_onboarding", () => {
          reset("MainPage", { isFromOnboarding: true });
        });
      }else{
        handleBasicPaywall(() => {
          reset("MainPage", { isFromOnboarding: true })}
        )
      }
    } else {
      const getCurrentOpenApps = await AsyncStorage.getItem('latestOpenApps');
      const mainDate = reformatDate(parseFloat(getCurrentOpenApps));
      const isMoreThan3Hours = isMoreThanThreeHoursSinceLastTime(mainDate);
      const stringifyDate = Date.now().toString();
      if (!getCurrentOpenApps || isMoreThan3Hours) {
        handleBasicPaywall(() => {
          reset("MainPage", { isFromOnboarding: true })}
        )
        await AsyncStorage.setItem('latestOpenApps', stringifyDate);
      } else {
        setAnimationSlideStatus(true);
      }
    }  
  }
  }

  // const handleSubmit = async () => {
  //   try {
  //     const id = await Purchasely.getAnonymousUserId();
  //     const deviceId = await DeviceInfo.getUniqueId();
  //     const timeZone = await TimeZone.getTimeZone();
  //     const resLogin = await AsyncStorage.getItem("isLogin");
  //     const payload = {
  //       icon: 1,
  //       fcm_token: getFcmToken,
  //       purchasely_id: id,
  //       device_id: deviceId,
  //       purchaseId: id,
  //       name: "User",
  //       anytime: null,
  //       often: 15,
  //       start: "08:00",
  //       end: "20:00",
  //       gender: "",
  //       timezone: timeZone,
  //       impress_friends: "yes",
  //       impress_business: "yes",
  //       impress_children: "yes",
  //       impress_members: "yes",
  //       commit_goal: "12",
  //       // topics: values.selectedCategory,
  //     };
  //     const res = await postRegister(payload);
  //     const currentUserProfile = store.getState().defaultState.userProfile;

  //     store.dispatch(
  //       handleSetProfile({
  //         ...res,
  //       })
  //     );
  //     await updateProfile({
  //       ...payload,
  //       _method: "PATCH",
  //     });
  //     setTimeout(() => {
  //       handlePaymentBypass("onboarding", () => {
  //         reset("MainPage", { isFromOnboarding: true });
  //       });
  //     }, 200);
  //     await AsyncStorage.setItem("isFinishTutorial", "yes");
  //     AsyncStorage.setItem("isLogin", "yes");
  //     fetchInitialData(resLogin === "yes", appOpenAd, loadingRef);
  //   } catch (err) {
  //     console.log("Error register:", err);
  //   }
  // };

  const purchaselyListener = () => {
    Purchasely.addEventListener(async event => {
     // console.log('ada disni', event.name);
      paywallStatus.current = event.name;
      const animationStatus = store.getState().defaultState.runAnimationSlide;
       const data = await AsyncStorage.getItem('version')
        
      if (event.name === 'PRESENTATION_CLOSED') {
       
        if(data === "0" && Platform.OS === 'android'){
          checkingPaywall()
        }
       
        if (animationStatus === false) {
          setAnimationSlideStatus(true);
        }
      }
    });

    Purchasely.addPurchasedListener(res => {
      // User has successfully purchased a product, reload content
     // console.log('User has purchased', res);
    });
  };

  const callOnce = (function() {
    let isCalled = false;

    return function() {
        if (!isCalled) {
          notifee.onForegroundEvent(async ({ type, detail }) => {
            if (type === EventType.ACTION_PRESS || type === EventType.PRESS) {
              const data = await AsyncStorage.getItem("version");
              if (data === '0') {
              }else{
                if (detail.notification.data?.type === "paywall") {
                  console.log("Check paywall data new banget:", detail.notification.data);
                    setTimeout(() => {
                      handlePayment(detail.notification.data?.placement);
                    }, 1000);
                  eventTracking(OPEN_OFFER_NOTIFICATION);
                }
              }
            }
          });
            isCalled = true;
        }
    }
})();
  const fetchNotif = async () => {
    callOnce()
    // const initNotification = await messaging().getInitialNotification().then((notificationOpen) => {
    //   console.log('masuk open notif new', JSON.stringify(notificationOpen))
    //   if (notificationOpen) {
    //     return notificationOpen;
    //   } else {
    //     return null;
    //   };
    // });
    // const getInitialPlacement = initNotification?.data;
    // console.log('data notif new', JSON.stringify(getInitialPlacement))
    // if (getInitialPlacement) {
    //   const paywallNotifCb = () => {
    //     setInitialLoaderStatus(false);
    //   };
    //   handlePayment(getInitialPlacement?.placement, paywallNotifCb);
    // } 
  }
  useEffect(() => {
    const getInitial = async () => {
      const resLogin = await AsyncStorage.getItem('isLogin');
      if (resLogin === 'yes') {
        setLogin(true);
        // try {
        //   const res = await getUserProfile();
        //   setTimeout(() => {
        //     reset("MainPage", { isFromOnboarding: false });
        //   }, 200);
        // } catch (error) {
        //   handleSubmit();
        // }
      }

      fetchInitialData(resLogin === 'yes', appOpenAd, loadingRef);
      setLoading(false);
    };
    getInitial();
    Notifications.removeAllDeliveredNotifications();
    Purchasely.isReadyToPurchase(true);
    purchaselyListener();
    crashlytics().log('OPEN ADS')
    const unsubscribeAppOpenAds = appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
      setAdsOverlay(false);
      setDisable(false);
    });
    const listenerLoadApps = appOpenAd.addAdEventListener(
      AdEventType.LOADED,
      async () => {
        
        const isFinishTutorial = await AsyncStorage.getItem('isFinishTutorial');
        if (isFinishTutorial === 'yes' && Platform.OS === 'ios') {
            SplashScreen.hide();
            appOpenAd.show();
            setAdsOverlay(true);
            openAdsOpened.current = true;

        }
      },
    );

    const listenerOpenApps =  appOpenAd.addAdEventListener(
      AdEventType.OPENED,
      async () => {
        const isFinishTutorial = await AsyncStorage.getItem('isFinishTutorial');
        if (isFinishTutorial === 'yes') {
            SplashScreen.hide();
            appOpenAd.show();
            setAdsOverlay(true);
            openAdsOpened.current = true;
          }
        // }
       
      },
    );

    const listenerIAPAds = appOpenAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        openAdsOpened.current = false;
        setInitialLoaderStatus(true);
        if (loadingRef.current) {
          loadingRef.current = false;
        }
      },
    );
   

    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          resetNotificationBadge();
          handleUpdateTimezone();
        }
        if (appState.current.match('background') && nextAppState === 'active') {
        
            fetchNotif()
        
         
          // appOpenAd.load();
          if (
            paywallStatus &&
            paywallStatus.current !== 'PRESENTATION_CLOSED'
          ) {
           
            if (Platform.OS === 'ios') {
              handleLoadInAppAds();
            }
            const data = await AsyncStorage.getItem('interstial');
            if (Platform.OS === 'android' && data === null) {
              handleLoadInAppAds();
            }
          } else {
            // appOpenAd.load();
          }
        } else {
          paywallStatus.current = 'READY';
          // appOpenAd.load();
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
      },
    );

    return () => {
      subscription.remove();
      Purchasely.removeEventListener();
      // listenerOpenApps();
      // listenerIAPAds();
      unsubscribeAppOpenAds();
      // listenerLoadApps();
    };
  }, []);

  const checking = async () => {
    const data = await AsyncStorage.getItem('version')
    return data
  }

  function  getInitialRoute() {
    if (
      (userProfile?.token && !disableNavigate) ||
      (registerData?.registerStep === 7 || registerData?.registerStep === 8) && 
      checking() !== '0' && !isUserPremium()
    ) {
      return 'MainPage';
    }
    if (registerData) {
      return 'Register';
    }
    if (Platform.OS === 'ios') {
      askTrackingPermission();
    }
    return 'WelcomePage';
  }


  // if (isLoading) return null;
  return (
    <View style={{flex: 1, position: 'relative'}}>
      <NavigationContainer ref={navigationRef} linking={navigationLinking}>
        <Stack.Navigator initialRouteName={getInitialRoute()}>
          <Stack.Screen
            options={navigationData.noHeader.options}
            name="WelcomePage"
            component={WelcomePage}
          />
          <Stack.Screen
            options={navigationData.noHeader.options}
            name="Register"
            component={Register}
          />
          <Stack.Screen
            options={navigationData.noHeader.options}
            name="MainPage"
            component={MainPage}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {showAdsOverlay && <AdsOverlay />}
    </View>
  );
}

Routes.propTypes = {
  activeVersion: PropTypes.any,
};

Routes.defaultProps = {
  activeVersion: null,
};

export default connect(states, dispatcher)(Routes);