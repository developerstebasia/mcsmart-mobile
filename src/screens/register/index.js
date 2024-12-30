import React, { useEffect, useState } from 'react';
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Keyboard,
  StatusBar,
  BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import notifee from '@notifee/react-native';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import Lottie from 'lottie-react-native';
import TimeZone from 'react-native-timezone';
import Purchasely from 'react-native-purchasely';
import { sign } from "react-native-pure-jwt";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createAnimatableComponent } from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/button';
import styles from './styles';
import states from './states';
import dispatcher from './dispatcher';
import {
  handleBasicPaywall,
  handlePayment,
  handlePaymentTwo,
  handleSubscriptionStatus,
  isUserPremium,
  openPrivacyPolicy,
  openTermsofUse,
  reloadUserProfile,
} from '../../helpers/user';
import LoadingIndicator from '../../components/loading-indicator';
import { isIphoneXorAbove } from '../../shared/devices';
import store from "../../store/configure-store";
import HeaderStep from '../../layout/register/header-step';
import ContentName from '../../layout/register/content-step-1';
import ContentGender from '../../layout/register/content-step-2';
import ContentNotification from '../../layout/register/content-step-3';
// import ContentStep5 from '../../layout/register/content-step-5';
// import ContentStep6 from '../../layout/register/content-step-6';
import ContentImpress from '../../layout/register/content-step-7';
import ContentTopic from '../../layout/register/content-topic';
// import ChangeLife from '../../layout/register/change-life';
import ChooseCommitment from '../../layout/register/choose-commitment';
import Contract from '../../layout/register/contract';
import { listTopic } from '../../shared/staticData';
import { reset } from '../../shared/navigationRef';
import {
  checkDeviceRegister,
  postRegister,
  updateProfile,
} from '../../shared/request';
import { storeRegistrationData } from '../../store/defaultState/actions';
import { sizing } from '../../shared/styling';
import {
  firstStepSelection,
  forthStepSelection,
  secondStepSelection,
  thirdStepSelection,
} from './categoriesArr';
import { removeDuplicatesArray } from '../../helpers/arrayHandler';
import { ONBOARDING_COMPLETE, eventTracking } from '../../helpers/eventTracking';
import { reformatDate } from '../../helpers/user';
import { isMoreThanThreeHoursSinceLastTime } from '../../helpers/timeHelpers';
import crashlytics from '@react-native-firebase/crashlytics';
import { STATIC_ONBOARD } from '../../shared/static';
import Clipboard from '@react-native-clipboard/clipboard';


const Convetti = require('../../assets/lottie/hello.json');

const AnimateAbleTouch = createAnimatableComponent(View);

function Register({
  handleSetProfile,
  fetchListQuote,
  fetchCollection,
  registerData,
}) {
  const isIpad = DeviceInfo.getSystemName() === 'iPadOS' || Platform.isPad;
  const [isInitial, setInitial] = useState(true);
  const [keyboardShow, setKeyboardShow] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);
  const [substep, setSubstep] = useState('a');
  const [notificationStep, setNotificationStep] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [isHasRegister, setHasRegister] = useState(false);
  const [getFcmToken, setFcmToken] = useState(null);
  const [token, setToken] = useState('');
  const [mutateForm, setMutateForm] = useState({
    icon: 1,
    fcm_token: null,
    purchasely_id: null,
    device_id: null,
  });
  const [values, setFormValues] = useState({
    name: '',
    gender: '',
    start_at: moment(new Date(2018, 11, 24, 8, 0, 30, 0)).format(
      'YYYY-MM-DD HH:mm',
    ),
    end_at: moment(new Date(2018, 11, 24, 20, 0, 30, 0)).format(
      'YYYY-MM-DD HH:mm',
    ),
    often: 3,
    selectedCategory: [],
    impress_friends: '',
    impress_business: '',
    impress_children: '',
    impress_members: '',
    commit_goal: '12',

    selectedFeeling: [],
    causeFeeling: [],
    isAnytime: null,
    specific_goal: null,
    important_change: null,
    is_impress: null,
    platform: Platform.OS
  });

  
  const createToken = async() => {
    try {
      const token = await sign(
        {
          name: ''
        },
        'pEsR74eADk6PTuvcOwPtUt16f8=', // Secret Key
        {
          alg: "HS256", // Algoritma
        }
      );
     
      setToken(token)
      return token;
    } catch (error) {
     
      console.error("Error generating token:", error);
    }
  }
  
  // Panggil fungsi untuk membuat token

  useEffect(() => {

    createToken();
    crashlytics().log('Register Screen');
    setTimeout(() => {
      AsyncStorage.removeItem('allowTracking')
    }, 500); 
    const handleInitial = async () => {
      setSubstep(registerData?.substep || substep);
      setRegisterStep(registerData?.registerStep || registerStep);
      setMutateForm(registerData?.mutateForm || mutateForm);
      setFormValues(registerData?.values || values);
      setHasRegister(registerData?.isHasRegister || isHasRegister);
      setNotificationStep(registerData?.notificationStep || notificationStep);
      setInitial(false);
      if (
        registerData &&
        registerData.registerStep &&
        registerData.registerStep === 7 &&
        registerData.substep === 'a'
      ) {
        setTimeout(() => {
          setSubstep('b');
        }, 2300);
      }
      // await AsyncStorage.removeItem('isFinishTutorial');
    };

    DeviceInfo.getUniqueId().then(async uniqueId => {
      try {
        const id = await Purchasely.getAnonymousUserId();
        console.log(uniqueId)
        setMutateForm({
          ...mutateForm,
          device_id: uniqueId,
          // device_id: Date.now().toString(),
          purchasely_id: id,
        });
      } catch (err) {
        // console.log('Err get device info:', err);
      }
    });
    handleInitial();
    setTimeout(async () => {
      const fcmToken = await messaging().getToken();
      console.log(fcmToken)
      setFcmToken(fcmToken);
    }, 3000);
  }, []);

  const handleSubmitRegist = async () => {
    try {
      setLoading(true);
      const timeZone = await TimeZone.getTimeZone();
      const payload = {
        ...mutateForm,
        name: values.name,
        anytime: values.isAnytime,
        often: values.often,
        start: moment(values.start_at).format('HH:mm'),
        end: moment(values.end_at).format('HH:mm'),
        gender: values.gender,
        timezone: timeZone,
        platform: Platform.OS,
        impress_friends: values.impress_friends,
        impress_business: values.impress_business,
        impress_children: values.impress_children,
        impress_members: values.impress_members,
        commit_goal: values.commit_goal,
        // topics: values.selectedCategory,
        fcm_token: getFcmToken,
        token: token
      };
      const res = await postRegister(payload);
      // console.log(' register:', JSON.stringify(res));
      handleSetProfile(res);
      fetchListQuote();
      fetchCollection();
      setTimeout(() => {
        reloadUserProfile();
      }, 2000);
      AsyncStorage.setItem("isLogin", "yes");
    } catch (err) {
    //  console.log('Error register:', err);
    }
  };

  const checkMinute = (start) => {
    let timeNow = new Date();
    let timeRemaining = (timeNow - start) / 1000; // Waktu dalam detik
  
    if (timeRemaining > 600) { // Jika lebih dari 600 detik (10 menit)
     // console.log("Sudah lebih dari 10 menit sejak proses dimulai.");
      return true
    } else {
    //  console.log("Belum lebih dari 10 menit sejak proses dimulai.");
      return false
    }
  }

  const checkDays = (start) => {
    let timeNow = new Date();
    let timeRemaining = (timeNow - start) / 1000; // Waktu dalam detik
  
    if (timeRemaining > 86400) { // Jika lebih dari 600 detik (10 menit)
    //  console.log("Sudah lebih dari 24 jam sejak proses dimulai.");
      return true
    } else {
    //  console.log("Belum lebih dari 10 jam sejak proses dimulai.");
      return false
    }
  }

  

  useEffect(() => {
    console.log(registerStep)
    if (registerStep === 7) {
      const getDeviceID = async () => {
        try {
          const timeZone = await TimeZone.getTimeZone();
          const payload = {
            ...mutateForm,
            name: values.name,
            anytime: values.isAnytime,
            often: values.often,
            start: moment(values.start_at).format("HH:mm"),
            end: moment(values.end_at).format("HH:mm"),
            gender: values.gender,
            timezone: timeZone,
            impress_friends: values.impress_friends,
            impress_business: values.impress_business,
            impress_children: values.impress_children,
            impress_members: values.impress_members,
            commit_goal: values.commit_goal,
            // topics: values.selectedCategory,
            fcm_token: getFcmToken,
           
          };
          const res = await checkDeviceRegister({
            device_id: mutateForm.device_id,
          });
          // console.log('DEVICE ID REGIST 1=', JSON.stringify(res))
          setHasRegister(true);
          handleSetProfile(res);
          handleSubscriptionStatus(res.data.subscription);
          fetchListQuote();
          fetchCollection();
          const stringifyDate = Date.now().toString();
          AsyncStorage.setItem('set10min', stringifyDate);
          const stringifyDateNow = new Date();
          let strTanggalSekarang = stringifyDateNow.getDate().toString();
          AsyncStorage.setItem('setToday', strTanggalSekarang);
          // handlePaymentTwo("onboarding");
          AsyncStorage.setItem('afterOnboard', "yes");
          await updateProfile({
            ...payload,
            _method: "PATCH",
          });
          setTimeout(() => {
            reloadUserProfile();
          }, 2000);
          AsyncStorage.setItem("isLogin", "yes");
        } catch (err) {
          // console.log("Device id not register");
          handleSubmitRegist(true);
        }
      };
      getDeviceID();
    } else if (registerStep === 8) {
 
      const getDeviceID = async () => {
        try {
          await AsyncStorage.removeItem('afterOnboard');
          const timeZone = await TimeZone.getTimeZone();
          const payload = {
            ...mutateForm,
            name: values.name,
            anytime: values.isAnytime,
            often: values.often,
            start: moment(values.start_at).format("HH:mm"),
            end: moment(values.end_at).format("HH:mm"),
            gender: values.gender,
            timezone: timeZone,

            impress_friends: values.impress_friends,
            impress_business: values.impress_business,
            impress_children: values.impress_children,
            impress_members: values.impress_members,
            commit_goal: values.commit_goal,
            // topics: values.selectedCategory,
            fcm_token: getFcmToken,
          };
          const res = await checkDeviceRegister({
            device_id: mutateForm.device_id,
          });
          // console.log('DEVICE ID REGIST=', JSON.stringify(res))
          const stringifyDateTime = new Date();
          let strTanggalSekarang = stringifyDateTime.getDate().toString();
            AsyncStorage.setItem('setToday', strTanggalSekarang);
    
          setHasRegister(true);
          handleSetProfile(res);
          handleSubscriptionStatus(res.data?.subscription);
          fetchListQuote();
          fetchCollection();
          const getCurrentOpenApps = await AsyncStorage.getItem('latestOpenApps');
          const mainDate = reformatDate(parseFloat(getCurrentOpenApps));
          const isMoreThan3Hours = isMoreThanThreeHoursSinceLastTime(mainDate);
          const stringifyDate = Date.now().toString();
          if (!getCurrentOpenApps || isMoreThan3Hours) {
            const isFinishTutorial = await AsyncStorage.getItem("isFinishTutorial");
            setTimeout(async() => {
              if (isFinishTutorial === "yes") {
                await AsyncStorage.setItem('latestOpenApps', stringifyDate);
               // console.log('ada ko ini')
                handleBasicPaywall(() => {
                  reset("MainPage", { isFromOnboarding: true });
                });
              } else {
                if(!isUserPremium()){
                  const set10min = await AsyncStorage.getItem('set10min');
                  const main10 = reformatDate(parseFloat(set10min));
                  const data = checkMinute(main10)
                  if(data){
                    const data = checkDays(main10)
                    if(data){
                      handlePayment("24_hours_after_onboarding", () => {
                        reset("MainPage", { isFromOnboarding: true });
                      });
                    }else{
                      // handlePayment("10_minutes_after_onboarding", () => {
                      //   reset("MainPage", { isFromOnboarding: true });
                      // });
                    }
                  }else{
                    await AsyncStorage.setItem('afterOnboard', 'yes');
                    handlePayment(STATIC_ONBOARD, () => {
                      reset("MainPage", { isFromOnboarding: true });
                    });
                  }
                }else{
               
                  reset("MainPage", { isFromOnboarding: true });
                }
              }
            }, 200);
          } else {
            reset("MainPage", { isFromOnboarding: true });
          };
          // await updateProfile({
          //   ...payload,
          //   _method: "PATCH",
          // });
          setTimeout(() => {
            reloadUserProfile();
          }, 2000);
          reset("MainPage", { isFromOnboarding: true });
          AsyncStorage.setItem("isLogin", "yes");
        } catch (err) {
          console.log("Device id not register");
          handleSubmit(true);
        }
      };
      getDeviceID();
    }
  }, [registerStep]);

  useEffect(() => {
    if (!isInitial) {
      // storeRegistrationData(null);
      storeRegistrationData({
        substep,
        registerStep,
        mutateForm,
        values,
        isHasRegister,
        notificationStep,
      });
    }
  }, [
    substep,
    registerStep,
    mutateForm,
    values,
    isHasRegister,
    notificationStep,
  ]);

  const handleAfterRegister = async () => {
   // console.log('AFter register called');
    await fetchListQuote();
    await fetchCollection();
    handlePayment('onboarding', () => {
      reset('MainPage', { isFromOnboarding: true });
    });
    AsyncStorage.setItem('isLogin', 'yes');
    setLoading(false);
  };
  


  const handleSubmit = async () => {
    try {
      setLoading(true);
      const timeZone = await TimeZone.getTimeZone();
      const payload = {
        ...mutateForm,
        name: values.name,
        anytime: values.isAnytime,
        often: values.often,
        start: moment(values.start_at).format('HH:mm'),
        end: moment(values.end_at).format('HH:mm'),
        gender: values.gender,
        timezone: timeZone,

        impress_friends: values.impress_friends,
        impress_business: values.impress_business,
        impress_children: values.impress_children,
        impress_members: values.impress_members,
        commit_goal: values.commit_goal,
        platform: Platform.OS,
        // topics: values.selectedCategory,
        fcm_token: getFcmToken,
        token: token
      };
     
      const res = await postRegister(payload);
      // console.log('SUKSESS REGIST', JSON.stringify(res))
      handleSetProfile(res);
      setHasRegister(true);
      handleAfterRegister();
      setTimeout(() => {
        reloadUserProfile();
      }, 2000);
    } catch (err) {
      // console.log('Error register:', err);
      setLoading(false);
    }
  };

  function getStatusDisable() {
    if (registerStep === 5 && !values.commit_goal) {
      return true;
    }
    if (registerStep === 1) {
      if (substep === 'b') {
        return false;
      }
      if (!values.name) {
        return true;
      }
    }
    if (registerStep === 4 && !values.selectedCategory.length) {
      return true;
    }
    return false;
  }

  function getLabelDarkButton() {
    if (registerStep === 6) {
      if (notificationStep === 2) {
        return 'Ok, let’s do it!';
      }
      if (notificationStep === 3 || notificationStep === 4) {
        return 'Got it!';
      }
    }
    // if (registerStep === 4) {
    //   return 'Got it!';
    // }
    return 'Continue';
  }

  function getLabelSkip() {
    if (registerStep === 6) {
      if (notificationStep === 2) {
        return 'I’m not ready yet';
      }
      return 'I want Facts at any time';
    }
    if (registerStep === 4) {
      return 'I want to know everything';
    }
    return 'Skip for now';
  }

  const nextStepAnimate = () => {
    setTimeout(() => {
      setSubstep('b');
    }, 2300);
  };

  const handleContinueStep = async () => {
    if (registerStep === 1) {
      if (substep === 'a') {
        setSubstep('b');
        Keyboard.dismiss();
      } else {
        setRegisterStep(registerStep + 1);
        setSubstep('a');
      }
    } else if (registerStep === 6) {
      // FOR WIDGET  CONDITION
      // if (notificationStep === 4) {
      //   setRegisterStep(7);
      //   setSubstep('a');
      //   nextStepAnimate();
      // } else if (notificationStep === 3) {
      //   setNotificationStep(4);
      // } else if (notificationStep === 2) {
      //   const settings = await notifee.requestPermission();
      //   setNotificationStep(3);
      // } else {
      //   setNotificationStep(2);
      // }
      if (notificationStep === 2) {
        const settings = await notifee.requestPermission();
        setRegisterStep(7);
        setSubstep('a');
        nextStepAnimate();
      } else {
        setNotificationStep(2);
      }
    } else if (registerStep === 5) {
      setRegisterStep(registerStep + 1);
      setSubstep('a');
    } else if (registerStep === 6) {
      if (substep === 'a') {
        if (!values.selectedFeeling.length) {
          setRegisterStep(7);
        } else {
          setSubstep('b');
        }
      } else {
        setRegisterStep(7);
      }
    } else if (registerStep === 7) {
   //   console.log('NOTHING');
      const stringifyDate = Date.now().toString();
      AsyncStorage.setItem('set10min', stringifyDate);
      setRegisterStep(8);
    } else {
      setRegisterStep(registerStep + 1);
      setSubstep('a');
    }
  };

  const handleChangeValue = (stateName, value) => {
    setFormValues({
      ...values,
      [stateName]: value,
    });
    if (stateName === 'gender') {
      setTimeout(() => {
        setRegisterStep(registerStep + 1);
      }, 300);
    }
  };

  const handleSelectCategory = (stateName, value, categorySelected = []) => {
    const listContent = removeDuplicatesArray([
      ...values.selectedCategory,
      ...categorySelected,
    ]);
    setFormValues({
      ...values,
      [stateName]: value,
      selectedCategory: listContent,
    });
  };

  const handleSkipBtn = async () => {
    if (registerStep === 1) {
      if (substep === 'a') {
        setSubstep('b');
        Keyboard.dismiss();
      } else {
        setRegisterStep(registerStep + 1);
        setSubstep('a');
      }
    } else if (registerStep === 6) {
      handleChangeValue('isAnytime', 1);
      setRegisterStep(7);
      setSubstep('a');
      nextStepAnimate();

      // FOR WIDGET  CONDITION
      // if (notificationStep === 4) {
      //   setRegisterStep(7);
      //   setSubstep('a');
      //   nextStepAnimate();
      // } else if (notificationStep === 3) {
      //   setNotificationStep(4);
      // } else if (notificationStep === 2) {
      //   setNotificationStep(3);
      // } else {
      //   setNotificationStep(2);
      // }
    } else if (registerStep === 4) {
      setRegisterStep(registerStep + 1);
      handleChangeValue(
        'selectedCategory',
        listTopic.map(item => item.id),
      );
    } else {
      setRegisterStep(registerStep + 1);
      setSubstep('a');
    }
  };



  function renderContent() {
    if (registerStep === 8) {
      return <LoadingIndicator fullscreen />;
    }

    if (registerStep === 7) {
      return (
        <Contract
          values={values}
          substep={substep}
          listCategory={values.selectedCategory}
          onLongPress={handleContinueStep}
        />
      );
    }
    if (registerStep === 6) {
      return (
        <ContentNotification
          values={values}
          contentStep={notificationStep}
          handleChangeValue={handleChangeValue}
        />
      );
    }
    if (registerStep === 5) {
      return (
        <ChooseCommitment
          onPress={value => {
            handleChangeValue('commit_goal', value);
          }}
          commit_goal={values.commit_goal}
        />
      );
    }
    if (registerStep === 4) {
      // return (
      //   <ContentTopic
      //     name={values.name}
      //     initialCategory={values.selectedCategory}
      //     onSelect={value => {
      //       handleChangeValue('selectedCategory', value);
      //     }}
      //   />
      return (
        <ContentImpress
          name={values.name}
          substep={substep}
          onPressGoals={value => {
            if (substep === 'c') {
              handleSelectCategory(
                'impress_children',
                value,
                value === 'yes' ? thirdStepSelection : [],
              );
              setSubstep('d');
            }
            if (substep === 'd') {
              handleSelectCategory(
                'impress_members',
                value,
                value === 'yes' ? forthStepSelection : [],
              );
              setRegisterStep(registerStep + 1);
            }
          }}
        />
      );
    }
    if (registerStep === 3) {
      return (
        <ContentImpress
          name={values.name}
          substep={substep}
          onPressGoals={value => {
            if (substep === 'a') {
              handleSelectCategory(
                'impress_friends',
                value,
                value === 'yes' ? firstStepSelection : [],
              );
              setSubstep('b');
            }
            if (substep === 'b') {
              handleSelectCategory(
                'impress_business',
                value,
                value === 'yes' ? secondStepSelection : [],
              );
              setSubstep('c');
              setRegisterStep(registerStep + 1);
            }
          }}
        />
      );
    }
    if (registerStep === 2) {
      return (
        <ContentGender
          name={values.name}
          selectedGender={values.gender}
          handleSelect={handleChangeValue}
        />
      );
    }
    return (
      <ContentName
        keyboardShow={keyboardShow}
        value={values.name}
        substep={substep}
        onSubmitEditing={handleContinueStep}
        onChangeText={name => {
          setFormValues({
            ...values,
            name,
          });
        }}
      />
    );
  }

  function renderBottomButton() {
    if (registerStep === 8) {
      return (
        <View style={styles.ctnRow}>
          <TouchableOpacity style={styles.btnTerms} onPress={openTermsofUse}>
            <Text style={styles.txtTerms}>Terms & Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnTerms} onPress={openPrivacyPolicy}>
            <Text style={styles.txtTerms}>Privacy policy</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (registerStep === 6 && notificationStep === 2) {
      return (
        <TouchableOpacity style={styles.btnSkip} onPress={handleSkipBtn}>
          <Text style={styles.txtSkip}>{getLabelSkip()}</Text>
        </TouchableOpacity>
      );
    }
    return null;
  }

  function renderSkipButton() {
    if (
      registerStep === 3 ||
      registerStep === 4 ||
      registerStep === 5 ||
      (registerStep === 6 && notificationStep !== 1)
    ) {
      return null;
    }
    if (registerStep === 1 && substep === 'b') {
      return null;
    }
    if (registerStep === 8) {
      return (
        <Text style={styles.txtSubscription}>
          3 days free, then just USD 19.99/year
        </Text>
      );
    }
    return (
      <TouchableOpacity style={styles.btnSkip} onPress={handleSkipBtn}>
        <Text style={styles.txtSkip}>{getLabelSkip()}</Text>
      </TouchableOpacity>
    );
  }

  function renderButton(ctnStyle, delayDuration) {
    if (registerStep === 8 || registerStep === 9 || registerStep === 7) {
      return null;
    }
    if (registerStep === 3 || registerStep === 4) {
      return null;
    }
    if (registerStep === 2) {
      return (
        <View style={[styles.btnWrapper, ctnStyle]}>
          <TouchableOpacity
            style={styles.btnSkip}
            onPress={() => {
              handleChangeValue('gender', '');
            }}>
            <Text style={styles.txtSkip}>Prefer not to say</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (registerStep === 1 && substep === 'b') {
      return (
        <AnimateAbleTouch
          animation="fadeIn"
          duration={500}
          delay={delayDuration || 800}
          style={[styles.btnWrapper, ctnStyle]}>
          <Button
            btnStyle={[
              styles.btnContinue,
              notificationStep === 2 && registerStep === 7 && styles.noMgBtm,
            ]}
            type="white-button"
            label={getLabelDarkButton()}
            isDisable={getStatusDisable()}
            onPress={handleContinueStep}
            isLoading={isLoading}
          />
        </AnimateAbleTouch>
      );
    }
    return (
      <View style={[styles.btnWrapper, ctnStyle]}>
        {renderSkipButton()}
        <Button
          btnStyle={[
            styles.btnContinue,
            notificationStep === 2 && registerStep === 7 && styles.noMgBtm,
          ]}
          disableWhite
          label={getLabelDarkButton()}
          isDisable={getStatusDisable()}
          onPress={handleContinueStep}
          isLoading={isLoading}
        />
        {renderBottomButton()}
      </View>
    );
  }

  function renderAnimation() {
    if (registerStep === 1 && substep === 'b') {
      return (
        <View style={styles.ctnConvetti}>
          <Lottie
            source={Convetti}
            style={styles.animationStyle}
            autoPlay
            loop={false}
          />
        </View>
      );
    }
    return null;
  }

  function renderHeader() {
    if (registerStep === 1 && substep === 'b') {
      return null;
    }
    if (registerStep === 8 && substep === 'a') {
      return null;
    }
    if (registerStep === 8) {
      return null;
    }
    return <HeaderStep currentStep={registerStep} />;
  }

  return (
    <View style={styles.ctnRoot}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000"
      // hidden={statusbarStatus}
      />
      {renderAnimation()}
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <KeyboardAwareScrollView
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="always"
          onKeyboardDidHide={() => {
            setKeyboardShow(false);
          }}
          onKeyboardDidShow={() => {
            setKeyboardShow(true);
          }}
          style={styles.flexOne}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ctnScroll}
          scrollEnabled={
            (!isIphoneXorAbove() && registerStep === 7) ||
            (isIpad && registerStep !== 1) ||
            sizing.getWindowHeight(1) < 844
          }>
          {renderHeader()}
          {renderContent()}
          {registerStep === 1 && substep === 'a'
            ? null
            : renderButton(
              styles.mgBtm40,
              registerStep === 1 && substep === 'b' ? 2500 : null,
            )}
        </KeyboardAwareScrollView>

        {registerStep === 1 && substep === 'a' && renderButton()}
      </KeyboardAvoidingView>
    </View>
  );
}

Register.propTypes = {};

Register.defaultProps = {};

export default connect(states, dispatcher)(Register);
