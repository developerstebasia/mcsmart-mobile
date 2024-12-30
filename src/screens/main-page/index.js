import React, { createRef, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
  Modal,
  StatusBar,
  Platform,
  ImageBackground,
  BackHandler,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import notifee, { EventType } from "@notifee/react-native";

import AnimatedLottieView from "lottie-react-native";
import { createAnimatableComponent } from "react-native-animatable";
import { connect, useDispatch } from "react-redux";
import ViewShot from "react-native-view-shot";
import RNFS from "react-native-fs";
import {
  PanGestureHandler,
  State,
  TapGestureHandler,
} from "react-native-gesture-handler";
import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";
import messaging from '@react-native-firebase/messaging';
import styles from "./styles";
import { sizing } from "../../shared/styling";
import { useBackgroundQuotes } from "../../helpers/hook/useBackgroundQuotes";
import QuotesContent from "../../components/quotes-content-fast-image";
import states from "./states";

import PremiumRocket from "../../assets/svg/PremiumRocketWhite.svg";
import IconCategories from "../../assets/svg/icon_categories.svg";
import IconShare from "../../assets/svg/icon_share.svg";
import IconSetting from "../../assets/svg/icon_setting.svg";
import IconLove from "../../assets/svg/icon_love_tap.svg";
import IconLike from "../../assets/svg/icon_like.svg";
import ThemeIcon from "../../assets/svg/theme_icon.svg";
import ButtonIcon from "../../components/button-icon";
import ModalTheme from "../../layout/main-page/modal-theme";
import ModalSetting from "../../layout/main-page/modal-setting";
import ModalShare from "../../layout/main-page/modal-share";
import {
  checkHours,
  handleBasicPaywall,
  handleBasicPaywallPress,
  handlePayment,
  handleRatingModal,
  isPremiumToday,
  isUserPremium,
} from "../../helpers/user";
import {
  changeAskRatingParameter,
  changeQuoteLikeStatus,
  fetchListQuoteFilter,
  setAnimationSlideStatus,
  setInitialLoaderStatus,
  setQuoteRef,
} from "../../store/defaultState/actions";
import ModalCategories from "../../layout/main-page/modal-categories";
import {
  addPastQuotes,
  dislikeQuotes,
  getListQuotes,
  getListRepeat,
  getRatingStatus,
  getSetting,
  setSubcription,
} from "../../shared/request";
import useLocalNotif from "../../shared/useLocalNotif";
import ModalRating from "../../components/modal-rating";
import { showModalPremium } from "../../shared/globalContent";
import ModalRepeat from "../../components/modal-repeat";
import {
  getAdaptiveBannerID,
  getRewardedInsterstialID,
  getRewardedInsterstialLearnMoreID,
  getRewardedOutOfQuotesID,
} from "../../shared/static/adsId";
import { checkAdsTracking } from "../../helpers/adsTracking";
import { loadInterstialAds } from "../../helpers/loadReward";
import LoadingFullScreen from "../../components/loading-fullscreen";
import ModalCountDown from "../../components/modal-countdown";
import PageCountDown from "../../layout/main-page/page-countdown";
import { isMoreThanThreeHoursSinceLastTime } from "../../helpers/timeHelpers";
import { reformatDate } from "../../shared/dateHelper";
import { scrollToTopQuote } from "../../store/defaultState/selector";
import ContentSubscription from "../../layout/setting/content-subscription";
import dispatcher from "./dispatcher";
import store from "../../store/configure-store";
import moment from "moment";
import { ONBOARDING_COMPLETE, QUOTE_LIKED, eventTracking } from "../../helpers/eventTracking";
import crashlytics from '@react-native-firebase/crashlytics'
import { SUCCESS_FETCH_QUOTE } from "../../store/defaultState/types";
import { useIsFocused } from "@react-navigation/native";
import { Item } from "react-native-paper/lib/typescript/src/components/Drawer/Drawer";
const adUnitId = getRewardedOutOfQuotesID();

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ["fashion", "clothing"],
});

const interstialAds = InterstitialAd.createForAdRequest(
  getRewardedInsterstialLearnMoreID(),
  {
    requestNonPersonalizedAdsOnly: true,
    keywords: ["fashion", "clothing"],
  }
);

const interstialAdsLearn = InterstitialAd.createForAdRequest(
  getRewardedInsterstialLearnMoreID(),
  {
    requestNonPersonalizedAdsOnly: true,
    keywords: ["fashion", "clothing"],
  }
);

const ViewAnimation = createAnimatableComponent(View);

const doubleTap = require("../../assets/lottie/double_tap.json");
const swipeupIcon = require("../../assets/lottie/swipe_up.json");
const arrowBottom = require("../../assets/icons/arrow-bottom.png");

const learnMoreButton = require("../../assets/icons/tutorial/learn_more_button.json");
const repeatButton = require("../../assets/icons/tutorial/repeat_button.json");
const repeatClick = require("../../assets/icons/tutorial/repeat_click.json");
const UnionImage = require('../../assets/images/union.png');
const learnMoreClickLottie = require("../../assets/icons/tutorial/learn_more_click.json");

let intervalTutorial = null;
const limitIndex = 1;

function MainPage({
  quotes,
  userProfile,
  runAnimationSlide,
  animationCounter,
  todayAdsLimit,
  route,
  paywallNotifcation,
  finishInitialLoader,
  fetchListQuote,
}) {

  const [isTutorial, setTutorial] = useState({
    visible: false,
    step: 1,
  });
  const isFromOnboarding = route.params?.isFromOnboarding;
  const initialIndexContent = isUserPremium() ? 0 : limitIndex;
  const [showModalSubscribe, setShowModalSubscribe] = useState(false);
  const [activeSlide, setActiveSlide] = useState(initialIndexContent);
  const [currentSlide, setCurrentSlide] = useState(initialIndexContent);
  const themesId = userProfile.data?.themes[0]?.id;
  const [themeUser] = useBackgroundQuotes(userProfile.data?.themes[0]);
  const [quoteLikeStatus, setQuoteLikeStatus] = useState(false);
  const [captureUri, setCaptureUri] = useState(null);
  const [showModalLike, setShowModalLike] = useState(false);
  const [modalRatingVisible, setModalRating] = useState(false);
  const [modalRepeat, setModalRepeat] = useState(false);
  const [scheduleTime] = useLocalNotif(userProfile);
  const [showSharePopup, setShowSharePopup] = useState(true);
  const [runQuoteAnimation, setRunQuoteAnimation] = useState(false);
  const [isUserHasScroll, setUserScrollQuotes] = useState(false);
  const [isShowTutorial, setShowNextTutorial] = useState(true);
  const [isShowNextQuooteAnimation, setShowNextQuoteAnimation] =
    useState(false);
  const [statusbarStatus, setStatusBar] = useState(false);
  const [isLoadingInterstial, setLoadingInterstial] = useState(false);
  const [showModalCountdown, setModalCountdown] = useState(false);
  const [loadingAds, setLoadingAds] = useState(true);
  const [isPremiumBefore, setPremiumBefore] = useState(isUserPremium());
  const [dataQuote, setQuoteList] = useState(quotes)
  const [page, setPage] = useState(2)
  const isFocused = useIsFocused();
  const refThemes = useRef();
  const refSetting = createRef();
  const refShare = createRef();
  const captureRef = useRef();
  const refCategory = createRef();
  const firstStepTutorial = useRef();
  const flatListRef = useRef();
  const buttonPressAnimationTutorial = useRef();
  // console.log(JSON.stringify(dataQuote))
  const handleShowPopupShare = () => {
    setShowSharePopup(true);
    setTimeout(() => {
      setShowSharePopup(false);
    }, 10000);
  };

  const getActiveQuote = () => {
    if (dataQuote?.listData?.length > 0 && dataQuote?.listData[activeSlide]) {
      return dataQuote?.listData[activeSlide];
    }
    return null;
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSharePopup(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, [showSharePopup]);

  // useEffect(() => {
  //   async function fetchNotif () {
  //     const initNotification = await messaging().getInitialNotification().then((notificationOpen) => {
  //       console.log('masuk open notif', JSON.stringify(initNotification))
  //       if (notificationOpen) {
  //         return notificationOpen;
  //       } else {
  //         return null;
  //       };
  //     });
  //     const getInitialPlacement = initNotification?.data || paywallNotifcation;
  //     if (getInitialPlacement) {
  //       const paywallNotifCb = () => {
  //         setInitialLoaderStatus(false);
  //       };
  //       handlePayment(getInitialPlacement?.placement, paywallNotifCb);
  //     } 
  //   }
  //   fetchNotif()
    
  // }, [isFocused])


  // const handleFetch = async (id) => {
  //   console.log(id)
  //   const params = {
  //     category: id,
  //   };
  //   store.dispatch(fetchListQuoteFilter(params));
  //   getActiveQuote()
  // }

  const fetchInitial = async () => {
    
      const stringifyDate = new Date();
      let strTanggalSekarang = stringifyDate.getDate().toString();
      const value = await AsyncStorage.getItem('setToday');
      const set10min = await AsyncStorage.getItem('set10min');
      const main10 = reformatDate(parseFloat(set10min));
      const data = checkHours(main10)
      const hitvalue = await AsyncStorage.getItem('hit6hours');
    
      if(isUserPremium()){
        const response = await getListQuotes({
          length: 1000,
          page: 1,
        });
        dataQuote.listData = [...response.data.data,];
        store.dispatch({
          type: SUCCESS_FETCH_QUOTE,
          payload: dataQuote,
          arrData:  dataQuote?.listData,
        });
      }
      if(!isUserPremium()){
        if(data && hitvalue === null){
          const response = await getListQuotes({
            length: 3,
            page: 4,
          });
          dataQuote.listData = [{ item_type: "countdown_page" }, ...response.data.data, { item_type: "countdown_page" }];
          store.dispatch({
            type: SUCCESS_FETCH_QUOTE,
            payload: dataQuote,
            arrData:  dataQuote?.listData,
          });
          AsyncStorage.setItem('hit6hours', 'yes');
        }
        if(value != null){
          if(value != strTanggalSekarang){
            const response = await getListQuotes({
              length: 3,
              page: strTanggalSekarang,
            });
            dataQuote.listData = [{ item_type: "countdown_page" }, ...response.data.data, { item_type: "countdown_page" }];
            store.dispatch({
              type: SUCCESS_FETCH_QUOTE,
              payload: dataQuote,
              arrData:  dataQuote?.listData,
            });
            AsyncStorage.setItem('setToday', strTanggalSekarang);
          }
        }
      }
   
  }

  useEffect(() => {
    fetchInitial()
    fetchRepeat()
}, [])

const fetchRepeat = async () => {
  const params = {
    length: 100,
    page: 1,
  };
  const res = await getListRepeat(params);
  const existingId = dataQuote?.listData?.map(obj => obj.id);

  const newObjSecond = res?.data?.data
    ?.filter(obj => !existingId.includes(obj.id))
    ?.map(obj => ({ ...obj, isRepeat: true }));
  
 
 
  if(!isUserPremium()){
    dataQuote?.listData?.splice(1, 0, ...newObjSecond);
  }else{
    dataQuote?.listData?.splice(0, 0, ...newObjSecond);
  }
 
  
  store.dispatch({
    type: SUCCESS_FETCH_QUOTE,
    payload: dataQuote,
    arrData:  dataQuote?.listData,
  })
}

  const handleScreenshot = () => {
    captureRef.current.capture().then((uri) => {
      // setCaptureUri(`data:image/png;base64,${uri}`);
      const uriArray = uri.split("/");
      const nameToChange = uriArray[uriArray.length - 1];
      const renamedURI = uri.replace(
        nameToChange,
        `McSmart - ${(dataQuote?.listData[activeSlide].title || "").substring(
          0,
          10
        )}.png`
      );
      RNFS.copyFile(uri, renamedURI)
        .then(async () => {
          // await CameraRoll.save(renamedURI, {album: 'mooty', type: 'photo'});
          setCaptureUri(renamedURI);
        })
        .catch((err) => {
          console.log(err.message);
        });
    });
  };

  const handleShare = () => {
    refShare.current.show();
    handleScreenshot();
  };

  const handleRatingStatus = async () => {
    const res = await getRatingStatus();
    if (res.data === false) {
      handleRatingModal(() => {
        setModalRating(true);
      });
    }
  };
  const handleShowPaywall = async () => {
    const res = await getSetting();
    // const initNotification = await notifee.getInitialNotification();
    const initNotification = await messaging().getInitialNotification().then((notificationOpen) => {
      if (notificationOpen) {
        return notificationOpen;
      } else {
        return null;
      };
    });
    const getInitialPlacement = initNotification?.data || paywallNotifcation;
    
    if (res.data.value === 'true' && !isUserPremium() && !isFromOnboarding) {
      // Paywall open apps
      if (getInitialPlacement) {
        // const paywallNotifCb = () => {
        //   setInitialLoaderStatus(false);
        // };
        // handlePayment(getInitialPlacement?.placement, paywallNotifCb);
      } else {
        const getCurrentOpenApps = await AsyncStorage.getItem('latestOpenApps');
        const mainDate = reformatDate(parseFloat(getCurrentOpenApps));
        const isMoreThan3Hours = isMoreThanThreeHoursSinceLastTime(mainDate);
        const stringifyDate = Date.now().toString();
        if (!getCurrentOpenApps || isMoreThan3Hours) {
          handleBasicPaywall();
          await AsyncStorage.setItem('latestOpenApps', stringifyDate);
        } else {
          setAnimationSlideStatus(true);
        }
      }

      handleRatingStatus();
    } else {
      handleRatingStatus();
      setAnimationSlideStatus(true);
    }
  };

  const checkInstall = async() => {
    const getFirstInstall = await AsyncStorage.getItem('firstInstall');
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss').toString();
    if (getFirstInstall === null) {
      await AsyncStorage.setItem('firstInstall', currentDate);
    };
  };

  const checkToday = async() => {
    const stringifyDate = new Date();
    let strTanggalSekarang = stringifyDate.getDate().toString();
    // let strTanggalSet = tanggalSet.toISOString().slice(0,10);
    const value = await AsyncStorage.getItem('setToday');
    if(value === null){
      AsyncStorage.setItem('setToday', strTanggalSekarang);
    }
  }

  useEffect(() => {
    
    crashlytics().log('Main Page');
    // checkToday()
    // setSubcription({
    //   subscription_type: 1,
    // });
    checkInstall();
    if (isFromOnboarding) {
      scrollToTopQuote();
    }
    const checkTutorial = async () => {
      const isFinishTutorial = await AsyncStorage.getItem("isFinishTutorial");
      if (isFinishTutorial !== "yes") {
        setTutorial({
          visible: true,
          step: 1,
        });
        intervalTutorial = setInterval(() => {
          if (firstStepTutorial.current) {
            firstStepTutorial.current?.play();
          }
        }, 3500);
      }
    };
    checkTutorial();

    // Handle interstial reward quote ads

    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
       // console.log("LOAD ADS FROM MAIN PAGE REWARD");
      }
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        
       // console.log("User earned reward of ", reward);
      }
    );

    const rewardedOpen = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setStatusBar(true);
     
     // console.log("LOAD ADS MODAL COUNTDOWN");
    });
    const rewardedClose = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setTimeout(() => {
          AsyncStorage.removeItem('interstial')
         }, 1000);
        setStatusBar(false);
        //console.log("LOAD ADS MODAL COUNTDOWN");
      }
    );
    const interstialListenerAds = interstialAds.addAdEventListener(AdEventType.CLOSED,  () => {
      // Do not allow AppOpenAd to show right after InterstitialAd is closed.
      // We can depend on this as it's called soon enough before AppState event fires.
      interstialAds.load();
     setTimeout(() => {
      AsyncStorage.removeItem('interstial')
     }, 1000);
    
    });
    const interstialListener = interstialAdsLearn.addAdEventListener(AdEventType.CLOSED,  () => {
      // Do not allow AppOpenAd to show right after InterstitialAd is closed.
      // We can depend on this as it's called soon enough before AppState event fires.
     setTimeout(() => {
      AsyncStorage.removeItem('interstial')
     }, 1000);
    });
    // rewarded.load();
    // interstialAds.load();
    // interstialAdsLearn.load();
    if (Platform.OS === "ios") {
      checkAdsTracking();
    }
    return () => {
      // unsubscribeLoaded();
      // unsubscribeEarned();
      // rewardedOpen();
      // rewardedClose();
      // interstialListener();
      // interstialListenerAds();
    };
  }, []);

  useEffect(() => {
    //console.log('active'+activeSlide)
    const handleAddPastQuotes = async (currentSlideId) => {
      try {
        if (
          dataQuote.listData[currentSlideId] &&
          dataQuote.listData[currentSlideId]?.id
        ) {
         // console.log('passs quote'+dataQuote.listData[currentSlideId].id)
          await addPastQuotes(dataQuote.listData[currentSlideId].id);
        }
      } catch (err) {
      //  console.log("Error add past quotes:", err);
      }
    };
    const activeQuote = getActiveQuote();
 //   console.log('active quote'+JSON.stringify(activeQuote))
    if (activeSlide > currentSlide) {
   //   console.log('set curent slide'+currentSlide)
      setCurrentSlide(activeSlide);
      handleAddPastQuotes(currentSlide);
    }

    let isLiked = false;
    if (activeQuote) {
      if (!activeQuote.like) {
        isLiked = false;
      }
      if (activeQuote.like) {
        if (activeQuote.like?.type) {
          if (activeQuote.like?.type === "1" || activeQuote.like?.type === 1) {
            isLiked = true;
          }
        }
      }
    }

    setQuoteLikeStatus(isLiked);

    if (activeSlide !== currentSlide) {
      // if (activeQuote) {
      //   handleWidgetData(activeQuote);
      // }

      if (!isUserPremium()) {
        AsyncStorage.setItem('interstial', 'yes');
        // setTimeout(() => {
        //   handleShowInterstialAds(activeQuote, activeSlide);
        // }, 200);
       
      }
      // if (!interstialAds.loaded) {
      //   interstialAds.load();
      // }
      // if (!interstialAdsLearn.loaded) {
      //   interstialAdsLearn.load();
      // }
    }
    // if (!isPremiumToday()) {
    //   if (currentSlide === 16 || activeSlide === 16) {
    //     if (
    //       activeSlide === 0 ||
    //       activeSlide === 3 ||
    //       activeSlide === 7 ||
    //       activeSlide === 10 ||
    //       activeSlide === 13 ||
    //       activeSlide === 16
    //     ) {
    //       // setModalCountdown(true);
    //     }
    //   }
    // }
      // if (!interstialAds.loaded) {
      //   interstialAds.load();
      // }
  }, [activeSlide]);

  useEffect(() => {
    if (runAnimationSlide && !isUserHasScroll && !isTutorial.visible) {
      setTimeout(() => {
        if (!isUserHasScroll) {
          setShowNextQuoteAnimation(true);
        }
      }, 2000);
      setTimeout(() => {
        setRunQuoteAnimation(true);
      }, 1800);
    }
  }, [runAnimationSlide, isUserHasScroll, isTutorial]);

  useEffect(() => {
    // setTimeout(() => {
    //   rewarded.load();
    // }, 2000);
  }, [todayAdsLimit]);

  useEffect(() => {
    if (finishInitialLoader && !isTutorial.visible) {
      handleShowPaywall();
    }
  }, [finishInitialLoader]);

  useEffect(() => {
    if (!isPremiumBefore && isUserPremium()) {
      setPremiumBefore(true);
      setShowModalSubscribe(true);
      fetchListQuote();
    }
  }, [userProfile, isPremiumBefore]);

  const handleShowInterstialAds = async () => {
   // console.log("TRY SHOW INTERSTIAL ADS", interstialAds.loaded);
    if (!isUserPremium()) {
      // if (interstialAds.loaded) {
        interstialAds.show().catch(error => console.warn('ERRROR INTER'+error));
      // }
        const cbFinish = () => {
          setLoadingInterstial(false);
        };
        setLoadingInterstial(true);
        await loadInterstialAds(interstialAds, cbFinish);
        cbFinish();
    }
  };

  const handleShowInterstialAdsLearn = async () => {
   // console.log("TRY SHOW INTERSTIAL ADS", interstialAdsLearn.loaded);
    if (!isUserPremium()) {
      if (interstialAdsLearn.loaded) {
        interstialAdsLearn.show().catch(error => console.warn(error));
        setTimeout(async() => {
          const cbFinish = () => {
            setLoadingInterstial(false);
          };
          setLoadingInterstial(true);
          await loadInterstialAds(interstialAdsLearn, cbFinish);
          cbFinish();
        }, 200);
      }else{
        const cbFinish = () => {
          setLoadingInterstial(false);
        };
        setLoadingInterstial(true);
        await loadInterstialAds(interstialAdsLearn, cbFinish);
        cbFinish();
      
    }
  }
  };

  const showInterStialAds = async () => {
   // console.log("TRY SHOW INTERSTIAL ADS", interstialAds.loaded);
    AsyncStorage.setItem('interstial', 'yes')
    if (!isUserPremium()) {
      if (interstialAds.loaded) {
        interstialAds.show();
      } else {
        const cbFinish = () => {
          setLoadingInterstial(false);
        };
        setLoadingInterstial(true);
        await loadInterstialAds(interstialAds, cbFinish);
        cbFinish();
      }
    }
  };

  const isHideContent = () => {
    if (getActiveQuote()?.item_type === "countdown_page") {
      return true;
    }
    return false;
  };

  const handleQuoteActive = () => {
    if (dataQuote?.listData?.length > 0) {
      return dataQuote?.listData[activeSlide]?.title;
    }
    return null;
  };

  const handleIdQuoteActive = () => {
    if (dataQuote?.listData?.length > 0 && dataQuote?.listData[activeSlide]) {
      return dataQuote?.listData[activeSlide].id;
    }
    return null;
  };

  const handleLike = async () => {
    try {
      setShowModalLike(true);
      setQuoteLikeStatus(!quoteLikeStatus);
      setTimeout(() => {
        setShowModalLike(false);
      }, 500);
      const activeQuote = getActiveQuote();
      let isLiked = false;
      if (activeQuote) {
        if (!activeQuote.like) {
          isLiked = false;
        }
        if (activeQuote.like) {
          if (activeQuote.like?.type) {
            if (
              activeQuote.like?.type === "1" ||
              activeQuote.like?.type === 1
            ) {
              isLiked = true;
            }
          }
        }
      }
      const payload = {
        type: isLiked ? "2" : "1",
      };
      if(isLiked){
        eventTracking(QUOTE_LIKED)
      } 
      await dislikeQuotes(payload, activeQuote.id);
      changeQuoteLikeStatus(activeQuote.id);
    } catch (err) {
     // console.log("Error liked:", err);
    }
  };

  const onMomentoumScrollEnd = (e) => {
    handleShowPopupShare()
    const height = sizing.getDimensionHeight(1);
    const pageNumber = Math.min(
      Math.max(Math.floor(e.nativeEvent.contentOffset.y / height + 0.5) + 1, 0),
      dataQuote?.listData?.length || 0
    );
    setLoadingAds(false);
    setActiveSlide(pageNumber - 1);
    if (pageNumber - 1 !== activeSlide && !isUserHasScroll) {
      setUserScrollQuotes(true);
    }
  };

  const handleSkipTutorial = async () => {
    setShowNextTutorial(false);
    setTimeout(() => {
      setShowNextTutorial(true);
    });
    if (isTutorial.step === 4) {
      await AsyncStorage.setItem("isFinishTutorial", "yes");
      eventTracking(ONBOARDING_COMPLETE)
      setTutorial({
        visible: false,
        step: 1,
      });
    } else {
      clearInterval(intervalTutorial);
      intervalTutorial = null;
      if (isTutorial.step + 1 === 1 || isTutorial.step + 1 === 2) {
        setTimeout(() => {
          intervalTutorial = setInterval(() => {
            if (firstStepTutorial.current) {
              firstStepTutorial.current?.play();
            }
          }, 3000);
        }, 100);
      }
      setTutorial({
        ...isTutorial,
        step: isTutorial.step + 1,
      });
    }
  };
  const handleGesture = (evt) => {
    const { nativeEvent } = evt;
    if (nativeEvent.velocityX < -614) {
      refThemes.current.show();
    }
  };
  const fectListCategory = async () => {
     if(isUserPremium()){
        const response = await getListQuotes({
          length: 1000,
          page: 1,
        });
        dataQuote.listData = [...response.data.data,];
        store.dispatch({
          type: SUCCESS_FETCH_QUOTE,
          payload: dataQuote,
          arrData:  dataQuote?.listData,
        });
      }
      if(!isUserPremium()){
          const response = await getListQuotes({
            length: dataQuote?.listData?.length - 2,
            page: 1,
          });
          dataQuote.listData = [{ item_type: "countdown_page" }, ...response.data.data, { item_type: "countdown_page" }];
          store.dispatch({
            type: SUCCESS_FETCH_QUOTE,
            payload: dataQuote,
            arrData:  dataQuote?.listData,
          });
        }
        fetchRepeat()
  }

  const onDoubleTap = (event) => {
    if (!isUserHasScroll && event.nativeEvent.state === State.BEGAN) {
      setUserScrollQuotes(true);
    }
    if (event.nativeEvent.state === State.ACTIVE) {
      handleLike();
    }
  };
  const pressRepeat = async () => {
    const repeateDate = new Date();
    const data = await AsyncStorage.getItem("repeat");
    if (data === null) {
      await AsyncStorage.setItem("repeat", repeateDate.toString());
      setModalRepeat(true);
      setTimeout(() => {
        setModalRepeat(false);
      }, 2000);
    } else {
      const storedDateTime = new Date(data);
      const timeDifferenceInMilliseconds = repeateDate - storedDateTime;
      const timeDifferenceInHours =
        timeDifferenceInMilliseconds / (1000 * 60 * 60);

      if (timeDifferenceInHours > 4) {
        setModalRepeat(true);
        setTimeout(() => {
          setModalRepeat(false);
        }, 2000);
        await AsyncStorage.setItem("repeat", repeateDate.toString());
      } else {
        // Waktu saat ini belum mencapai 4 jam
        // Lakukan sesuatu di sini jika waktu belum mencapai 4 jam
       // console.log("Waktu belum mencapai 4 jam: false");
      }
    }
  };

  function renderArrowSwipe() {
    if (
      runAnimationSlide &&
      !isUserHasScroll &&
      !isTutorial.visible &&
      isShowNextQuooteAnimation &&
      animationCounter
    ) {
      return (
        <ViewAnimation
          animation="fadeIn"
          duration={1000}
          style={[
            styles.ctnSwipe,
            isUserPremium() && styles.adjustBtmPremiumSwipe,
          ]}
        >
          <ViewAnimation
            animation="slideInUp"
            duration={500}
            style={styles.ctnSlideUp}
          >
            <ViewAnimation
              animation="slideOutDown"
              duration={1000}
              delay={1500}
              style={styles.ctnSlideDown}
            >
              <ViewAnimation
                animation="fadeOut"
                duration={200}
                delay={1600}
                onAnimationEnd={() => {
                  setShowNextQuoteAnimation(false);
                  setShowNextQuoteAnimation(true);
                }}
                style={styles.ctnSlideDown}
              >
                <Text style={styles.txtSwipe}>Swipe to see next Quote</Text>
                <Image source={arrowBottom} style={styles.icnSwipe} />
              </ViewAnimation>
            </ViewAnimation>
          </ViewAnimation>
        </ViewAnimation>
      );
    }
    return null;
  }

  const handleLoadMore = async () => {
   
    const quote = await getListQuotes({
      length: 5,
      page: page + 1,
    });
    // dataQuote.listData = [{ item_type: "countdown_page" }, ...dataQuote.listData];
    // dataQuote.listData = [{ item_type: "countdown_page" }, ...dataQuote.listData, { item_type: "countdown_page" }];
    dataQuote?.listData?.splice(dataQuote?.listData?.length - 1, 0, ...quote.data.data);
    store.dispatch({
      type: SUCCESS_FETCH_QUOTE,
      payload: dataQuote,
      arrData:  dataQuote?.listData,
    });
   
    if(activeSlide != 0){
     // console.log('active slide sini='+activeSlide)
      setActiveSlide(activeSlide + 1);//
    }else{
      // console.log('active slide sini dong='+dataQuote?.listData?.length - 6)
      setActiveSlide(dataQuote?.listData?.length - 6);
      flatListRef.current?.scrollToIndex({ index: dataQuote?.listData?.length - 6, animated: true });  
    }
  }

  const renderFactItem = ({ item, index, disableAnimation }) => {
  
    const getImageContent = themeUser?.imgLocal;
    const listWhiteYellowTrace = [2, 3];
    if (item?.item_type === "countdown_page" && !isUserPremium()) {
      return <PageCountDown handleLoad={() => handleLoadMore()} loading={loadingAds} />;
    }
    return (
      <QuotesContent
        item={item}
        onPressRating={() => pressRepeat()}
        handleShowInterstialAds={() => {
          // showInterStialAds();
        }}
        handleShowInterstialAdsLearn={() => {
          // handleShowInterstialAdsLearn();
        }}
        themeUser={themeUser}
        source={getImageContent}
        isYellowTrace={listWhiteYellowTrace.includes(themeUser.id)}
        isActive={activeSlide === index}
        index={index}
        main={true}
        showButtonOption={!isTutorial.visible && !disableAnimation}
        isAnimationStart={
          !disableAnimation &&
          runAnimationSlide &&
          !isUserHasScroll &&
          !isTutorial.visible &&
          runQuoteAnimation
        }
        handleShare={handleShare}
        handleLike={handleLike}
        showSharePopup={showSharePopup}
        quoteLikeStatus={quoteLikeStatus}
      // source={require(themeUser.urlLocal)}
      />
    );
  };

  function renderWaterMark() {
    if (isUserPremium()) {
      return null;
    }
    return (
      <View style={styles.ctnWatermark}>
        <Text style={styles.txtWatermark}>@mcsmart_app</Text>
      </View>
    );
  }

  function renderScreenshot() {
    if (dataQuote?.listData?.length > 0) {
      return (
        <ViewShot
          style={styles.ctnViewShot}
          ref={captureRef}
          options={{
            fileName: `McSmart${Date.now()}`,
            format: "png",
            quality: 1.0,
          }}
        >
          {renderFactItem({
            item: dataQuote?.listData[activeSlide],
            index: activeSlide,
            disableAnimation: true,
          })}
          {renderWaterMark()}
        </ViewShot>
      );
    }
    return null;
  }

  function renderBottomAds() {
    if (isUserPremium() || isHideContent() || isTutorial.visible) {
      return null;
    }
    return (
      <View style={styles.ctnBannerAds}>
        <BannerAd
          unitId={getAdaptiveBannerID()}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    );
  }
  function renderSharePopup() {
    if (showSharePopup && !isUserPremium()) {
      return (
        <View source={UnionImage} style={styles.ctnPopupShare}>
          <ImageBackground source={UnionImage} style={styles.ctnUnion}>
          </ImageBackground>
        </View>
      );
    }
    return null;
  }

  const renderButtonShare = () => {
     const bgStyle = {
      // backgroundColor:
      //   themeUser.id === 4 || themeUser.id === 2
      //     ? 'rgba(255, 255, 255, 0.2)'
      //     : 'rgba(0, 0, 0, 0.7)',
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    };
    return(
      <View style={styles.subBottomWrapper}>
          <TouchableWithoutFeedback onPress={handleShare}>
            <View style={[styles.ctnRounded, bgStyle]}>
           
              <IconShare width="90%" height="90%" />
              {renderSharePopup()}
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={handleLike}>
            <View style={[styles.ctnRounded, bgStyle]}>
              {quoteLikeStatus ? (
                <IconLove width="80%" height="80%" />
              ) : (
                <IconLike width="80%" height="80%" />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
    )
  }

  function renderButton() {
    const bgStyle = {
      // backgroundColor:
      //   themeUser.id === 4 || themeUser.id === 2
      //     ? 'rgba(255, 255, 255, 0.2)'
      //     : 'rgba(0, 0, 0, 0.7)',
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    };
    if (isHideContent() || isTutorial.visible) {
      return null;
    }
    return (
      <View
        style={[
          styles.btnWrapper,
          !isUserPremium() && !isHideContent() && styles.ctnPdAds,
        ]}
      >
        {renderArrowSwipe()}
        
        <View style={styles.ctnRow}>
          <View style={styles.rowLef}>
            <ButtonIcon
              type="dark"
              source={<IconCategories width="100%" height="100%" />}
              ctnIcon={styles.ctnIconCategories}
              label="Categories"
              btnStyle={styles.btnCategories}
              txtStyle={styles.txtCategory}
              onPress={() => {
                refCategory.current.show();
              }}
            />
          </View>
          <View style={styles.rowRight}>
            <View style={styles.ctnShare}>
              <ButtonIcon
                type="dark"
                source={<ThemeIcon width="100%" height="100%" />}
                btnStyle={styles.btnRight}
                onPress={() => {
                  refThemes.current.show();
                }}
              />
            </View>
            <ButtonIcon
              type="dark"
              source={<IconSetting width="100%" height="100%" />}
              btnStyle={[styles.btnRight, styles.mgLeft]}
              onPress={() => {
                refSetting.current.show();
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  function renderContentTutorial() {
    if (isTutorial.step === 1) {
      return (
        <View style={styles.ctnRound}>
          <ViewAnimation
            animation="bounceIn"
            duration={200}
            style={styles.ctnCenter}
          >
            <View style={styles.ctnIconTutorial}>
              <AnimatedLottieView
                source={swipeupIcon}
                style={styles.animationStyle}
                autoPlay
                ref={firstStepTutorial}
                duration={3000}
                loop={false}
              />
            </View>
            <Text style={styles.txtTutorial}>Swipe up for the next Fact.</Text>
            <View style={styles.ctnHeightTutorial}>
              {isShowTutorial && (
                <ViewAnimation delay={1000} animation="fadeIn" duration={2000}>
                  <Text style={styles.txtDescTutorial}>
                    {"Tap anywhere to go\nto the next tutorial"}
                  </Text>
                </ViewAnimation>
              )}
            </View>
          </ViewAnimation>
        </View>
      );
    }
    if (isTutorial.step === 2) {
      return (
        <View style={styles.ctnRound}>
          <ViewAnimation
            animation="bounceIn"
            duration={800}
            style={styles.ctnCenter}
          >
            <View style={styles.ctnIconTutorial}>
              <AnimatedLottieView
                source={doubleTap}
                style={styles.animationStyle}
                autoPlay
                ref={firstStepTutorial}
                duration={3000}
                loop={false}
              />
            </View>
            <Text style={styles.txtTutorial}>Double tap to like the Fact.</Text>
            <View style={styles.ctnHeightTutorial}>
              {isShowTutorial && (
                <ViewAnimation delay={1000} animation="fadeIn" duration={2000}>
                  <Text style={styles.txtDescTutorial}>
                    {"Tap anywhere to go\nto the next tutorial"}
                  </Text>
                </ViewAnimation>
              )}
            </View>
          </ViewAnimation>
        </View>
      );
    }
    if (isTutorial.step === 3) {
      return (
        <View style={styles.ctnRound}>
          <ViewAnimation
            animation="bounceIn"
            duration={800}
            style={styles.ctnCenter}
          >
            <View style={styles.btnTutorialStyle}>
              <AnimatedLottieView
                source={repeatButton}
                style={styles.btnLottie}
                autoPlay
                ref={firstStepTutorial}
                duration={3000}
                loop={false}
              />
            </View>
            <Text style={styles.txtTutorial}>
              Tap this button to repeat the Fact tomorrow to make sure you
              remember it.
            </Text>
            <View style={styles.ctnHeightTutorial}>
              {isShowTutorial && (
                <ViewAnimation delay={1000} animation="fadeIn" duration={2000}>
                  <Text style={styles.txtDescTutorial}>
                    {"Tap anywhere to go\nto the next tutorial"}
                  </Text>
                </ViewAnimation>
              )}
            </View>
          </ViewAnimation>
        </View>
      );
    }
    if (isTutorial.step === 4) {
      return (
        <View style={styles.ctnRound}>
          <ViewAnimation
            animation="bounceIn"
            duration={800}
            style={styles.ctnCenter}
          >
            <View style={styles.btnTutorialStyle}>
              <AnimatedLottieView
                source={learnMoreButton}
                style={styles.btnLottie}
                autoPlay
                duration={3000}
                loop={false}
              />
            </View>
            <Text style={styles.txtTutorial}>
              To get more information on a Fact, tap this button.
            </Text>
            <View style={styles.ctnHeightTutorial}>
              {isShowTutorial && (
                <ViewAnimation delay={1000} animation="fadeIn" duration={2000}>
                  <Text style={styles.txtDescTutorial}>
                    {"Tap anywhere to go\nto finish the tutorial"}
                  </Text>
                </ViewAnimation>
              )}
            </View>
          </ViewAnimation>
        </View>
      );
    }
    return null;
  }

  function renderClickButtonTutorial() {
    if (isTutorial.step === 3) {
      return (
        <View style={styles.ctnBtnTutorial}>
          <AnimatedLottieView
            source={repeatClick}
            style={styles.lottieClickTutorial}
            autoPlay
            ref={buttonPressAnimationTutorial}
            duration={3000}
            loop={false}
          />
        </View>
      );
    }
    if (isTutorial.step === 4) {
      return (
        <View style={styles.ctnBtnTutorial}>
          <AnimatedLottieView
            source={learnMoreClickLottie}
            style={styles.lottieClickTutorial}
            autoPlay
            ref={buttonPressAnimationTutorial}
            duration={3000}
            loop={false}
          />
        </View>
      );
    }
    return null;
  }

  function renderTutorial() {
    if (isTutorial.visible) {
      return (
        <TouchableWithoutFeedback onPress={handleSkipTutorial}>
          <View style={styles.ctnTutorial}>
            <View style={styles.ctnTutorialWrapper}>
              {renderClickButtonTutorial()}
              {renderContentTutorial()}
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return null;
  }

  function renderFreeBadge() {
    if (isTutorial.visible || isUserPremium() || isHideContent()) {
      return null;
    }
    return (
      <TouchableOpacity
        style={styles.ctnFreeBadge}
        onPress={handleBasicPaywallPress}
      >
        <View style={styles.ctnIconCrown}>
          <PremiumRocket width="100%" height="100%" />
        </View>
        <Text style={styles.txtFreeBadge}>Go Premium!</Text>
      </TouchableOpacity>
    );
  }

  function renderModalLike() {
    if (showModalLike === true) {
      return (
        <Modal
          animationType="fade"
          visible={showModalLike}
          transparent
          onDismiss={() => {
            setShowModalLike(false);
          }}
        >
          <View style={styles.ctnLike}>
            <View style={styles.iconLikeWrap}>
              {quoteLikeStatus ? (
                <IconLove width="100%" height="100%" />
              ) : (
                <IconLike width="100%" height="100%" />
              )}
            </View>
          </View>
        </Modal>
      );
    }
    return null;
  }

  function renderFlatList() {
    return (
      <PanGestureHandler
        onGestureEvent={handleGesture}
        activeOffsetX={[-40, 40]}
      >
        <TapGestureHandler onHandlerStateChange={onDoubleTap} numberOfTaps={3}>
          <FlatList
            windowSize={5} // mengatur jumlah batch item yang dirender saat melakukan scrolling
            initialNumToRender={20}
            removeClippedSubviews={true}
            ref={flatListRef}
            style={styles.ctnRoot}
            data={dataQuote?.listData || []}
            pagingEnabled
            onMomentumScrollEnd={onMomentoumScrollEnd}
            scrollsToTop={false}
            showsVerticalScrollIndicator={false}
            // onEndReached={handleEndReach}
            onEndReachedThreshold={0.9}
            renderItem={renderFactItem}
            keyExtractor={(item, index) => `${item.id} ${index}`}
            initialScrollIndex={isUserPremium() ? 0 : limitIndex}
            getItemLayout={(data, index) => ({
              length: sizing.getDimensionHeight(1),
              offset: sizing.getDimensionHeight(1) * index,
              index,
            })}
            onScrollToIndexFailed={() => {
              //console.log("FAILED SCROLL TO INDEX", 5);
            }}
          />
        </TapGestureHandler>
      </PanGestureHandler>
    );
  }

  const isDarkTheme = [
    4, 9, 11, 14, 17, 17, 19, 6, 8, 22, 24, 7, 25, 26, 27, 29, 31, 32,
  ].includes(themesId);

  return (
    <View style={styles.ctnRoot}>
      <StatusBar
        barStyle={isDarkTheme ? "light-content" : "dark-content"}
        backgroundColor={isDarkTheme ? "#000" : "#fff"}
        hidden={statusbarStatus}
      />
     
      {renderScreenshot()}
      {renderFlatList()}
      {renderButton()}

      {renderBottomAds()}
      {renderFreeBadge()}
      {renderTutorial()}
      {renderModalLike()}
      <ModalTheme
        contentRef={refThemes}
        onClose={() => {
          refThemes.current.hide();
        }}
      />

      <ModalSetting
        contentRef={(c) => {
          if (c) {
            refSetting.current = {
              ...c,
            };
          }
        }}
        onClose={() => {
          refSetting.current.hide();
        }}
      />

      <ModalShare
        contentRef={(c) => {
          if (c) {
            refShare.current = {
              ...c,
            };
          }
        }}
        onClose={() => {
          refShare.current.hide();
        }}
        captureUri={captureUri}
        onPremium={() => {
          refShare.current.hide();
        }}
        idQuote={handleIdQuoteActive()} // mengambil data id active
        quoteText={handleQuoteActive()} // mengambil data title active
      />

      <ModalCategories
        dataQuoteLength={dataQuote}
        refPanel={refCategory}
        contentRef={(c) => {
          if (c) {
            refCategory.current = {
              ...c,
            };
          }
        }}
        onClose={() => {
          refCategory.current.hide();
        }}
        updateList={() => fectListCategory()}
      // onCustomSelectCategory={(value) => {
      //   handleFetch(value)
      // }}
      />

      <ModalRating
        visible={modalRatingVisible}
        handleClose={() => {
          setModalRating(false);
          changeAskRatingParameter();
        }}
      />
      <ModalRepeat
        isVisible={modalRepeat}
        onClose={() => {
          setModalRepeat(false);
        }}
      />

      {/* <ModalCountDown
        adsRef={rewarded}
        hideStatusbar={() => {
          setStatusBar(true);
        }}
        showStatusBar={() => {
          setStatusBar(false);
        }}
        visible={showModalCountdown}
        handleClose={() => {
          setModalCountdown(false);
        }}
      /> */}

      <ContentSubscription
        isVisible={showModalSubscribe}
        onClose={() => {
          setShowModalSubscribe(false);
        }}
      />
      <LoadingFullScreen isLoading={isLoadingInterstial} />
    </View>
  );
}

export default connect(states, dispatcher)(MainPage);
