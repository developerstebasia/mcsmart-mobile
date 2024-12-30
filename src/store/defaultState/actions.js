import SplashScreen from "react-native-splash-screen";
import notifee, { EventType } from "@notifee/react-native";
import moment from "moment";
import { isArray } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";
import {
  getListQuotes,
  getListCollection,
  getListPastQuotes,
  getListLiked,
  getListCategory,
  getListFactRegister,
  updateProfile,
  getSetting,
  selectTheme,
} from "../../shared/request";
import { APP_VERSION } from "../../shared/static";
import store from "../configure-store";
import * as types from "./types";
import {
  checkHours,
  checkIsHasLogin,
  handlePayment,
  handleSubscriptionStatus,
  handleUpdateTimezone,
  isPremiumToday,
  isUserPremium,
  reformatDate,
  reloadUserProfile,
} from "../../helpers/user";
import { handleModalFirstPremium } from "../../shared/globalContent";
import { scrollToTopQuote } from "./selector";
import dummyPastQuotes from "../../shared/static/dummyPastQuotes";
import { loadOpenAddsReward } from "../../helpers/loadReward";
import {
  OPEN_OFFER_NOTIFICATION,
  eventTracking,
} from "../../helpers/eventTracking";
import pastQuotes from "../../layout/your-quotes/past-quotes";

export const setModalFirstPremium = (payload) => ({
  type: types.SET_MODAL_FIRST_PREMIUM,
  payload,
});

export const setModalPremium = (payload) => ({
  type: types.SET_MODAL_PREMIUM_VISIBILITY,
  payload,
});

export const setStorageStatus = (payload) => ({
  type: types.SET_STORAGE_STATUS,
  payload,
});

export const handleSetProfile = (payload) => ({
  type: types.SET_PROFILE_DATA,
  payload,
});

export const fetchListQuoteFilter =
  (params, isPassPremium) => async (dispatch) =>
    new Promise(async (resolve, reject) => {
      try {
        const { freeUserPremium } = store.getState().defaultState;
        let isFreeUserPremium = isPremiumToday();
        const todayDate = moment().format("YYYY-MM-DD");
        if (
          isPremiumToday() &&
          !isUserPremium() &&
          todayDate !== freeUserPremium
        ) {
          isFreeUserPremium = false;
        }
        const set10min = await AsyncStorage.getItem('set10min');
        const main10 = reformatDate(parseFloat(set10min));
        const data = checkHours(main10)
        dispatch({ type: types.START_FETCH_QUOTES });
        const quote = await getListQuotes({
          length: isPassPremium ? 1000 : data ? 3 : 10,
          page: 1,
          ...params,
        });
        let restPas = [];
        if (!isUserPremium()) {
          const pastQuote = await getListPastQuotes({
            length: 5,
            page: 1,
          });
          restPas = isArray(pastQuote?.data)
            ? pastQuote?.data
            : pastQuote?.data || dummyPastQuotes;
        }
        if (quote.data?.length > 0) {
          // let overallData = [...restPas, ...quote.data];
          let overallData = [];

          if (!isPassPremium) {
            // console.log(!isPassPremium)
            overallData = [
              ...[{ item_type: "countdown_page" }],
              ...restPas,
              ...quote.data,
              ...[{ item_type: "countdown_page" }],
            ];
            overallData = overallData.map((ctn, itemIndex) => {
              if (
                itemIndex === 2 ||
                itemIndex === 5 ||
                itemIndex === 8 ||
                itemIndex === 12
              ) {
                return {
                  ...ctn,
                  item_type: "in_app_ads",
                };
              }
              return ctn;
            });
          } else if (!isUserPremium()) {
            overallData = overallData.map((ctn, itemIndex) => {
              if (
                itemIndex === 2 ||
                itemIndex === 5 ||
                itemIndex === 8 ||
                itemIndex === 12 ||
                itemIndex === 16
              ) {
                return {
                  ...ctn,
                  item_type: "in_app_ads",
                };
              }
              if (itemIndex > 16) {
                if (itemIndex % 4 === 0) {
                  return {
                    ...ctn,
                    item_type: "in_app_ads",
                  };
                }
              }

              return {
                ...ctn,
                item_type: "normal_quote",
              };
            });
          }
          dispatch({
            type: types.SUCCESS_FETCH_QUOTE,
            payload: quote.data,
            arrData: overallData,
            listBasicQuote:
              isFreeUserPremium || isPassPremium ? [] : quote.data,
            restPassLength: restPas?.length,
            isPassPremium,
            isFreeUserPremium:
              isFreeUserPremium || isPassPremium ? todayDate : null,
          });
        }
        resolve(quote);
      } catch (err) {
       // console.log("ERr fetch quote:", err);
        dispatch({ type: types.ERROR_FETCH_QUOTES });
        reject(err);
      }
    });
    
export const fetchListQuote = (params, isPassPremium) => async (dispatch) =>
  new Promise(async (resolve, reject) => {
    const stringifyDate = new Date();
    let strTanggalSekarang = stringifyDate.getDate().toString();
    const value = await AsyncStorage.getItem('setToday');
      try {
        const { freeUserPremium } = store.getState().defaultState;
  
        let isFreeUserPremium = isPremiumToday();
        const todayDate = moment().format("YYYY-MM-DD");
        if (
          isPremiumToday() &&
          !isUserPremium() &&
          todayDate === freeUserPremium
        ) {
          isFreeUserPremium = false;
        }
      
        dispatch({ type: types.START_FETCH_QUOTES });
        const set10min = await AsyncStorage.getItem('set10min');
        const main10 = reformatDate(parseFloat(set10min));
        const data = checkHours(main10)
       // console.log('ini data tanggal berapa'+data)
        if(value != strTanggalSekarang || isUserPremium()){
        const quote = await getListQuotes({
          length: isPassPremium ? 1000 : data ? 3 : 10,
          page: 1,
          ...params,
        });
        let restPas = [];
        // AsyncStorage.setItem('setToday', strTanggalSekarang);
        if (isUserPremium()) {
          const pastQuote = await getListPastQuotes({
            length: 5,
            page: 1,
          });
          restPas = isArray(pastQuote?.data)
            ? pastQuote?.data
            : pastQuote?.data?.data || dummyPastQuotes;
        }
        if (quote.data?.data?.length > 0) {
          let overallData = [...restPas, ...quote.data.data];
          if (!isPassPremium) {
            overallData = [
              ...[{ item_type: "countdown_page" }],
              ...restPas,
              ...quote.data.data,
              ...[{ item_type: "countdown_page" }],
            ];
            overallData = overallData.map((ctn, itemIndex) => {
              if (
                itemIndex === 2 ||
                itemIndex === 5 ||
                itemIndex === 8 ||
                itemIndex === 12
              ) {
                return {
                  ...ctn,
                  item_type: "in_app_ads",
                };
              }
              return ctn;
            });
          } else if (!isUserPremium()) {
            overallData = overallData.map((ctn, itemIndex) => {
              if (
                itemIndex === 2 ||
                itemIndex === 5 ||
                itemIndex === 8 ||
                itemIndex === 12 ||
                itemIndex === 16
              ) {
                return {
                  ...ctn,
                  item_type: "in_app_ads",
                };
              }
              if (itemIndex > 16) {
                if (itemIndex % 4 === 0) {
                  return {
                    ...ctn,
                    item_type: "in_app_ads",
                  };
                }
              }
  
              return {
                ...ctn,
                item_type: "normal_quote",
              };
            });
          }
          dispatch({
            type: types.SUCCESS_FETCH_QUOTE,
            payload: quote.data,
            arrData: overallData,
            listBasicQuote:
              isFreeUserPremium || isPassPremium ? [] : quote.data.data,
            restPassLength: restPas?.length,
            isPassPremium,
            isFreeUserPremium:
              isFreeUserPremium || isPassPremium ? todayDate : null,
          });
        }
        resolve(quote);
      }
      } catch (err) {
      //  console.log("ERr fetch quote:", err);
        dispatch({ type: types.ERROR_FETCH_QUOTES });
        reject(err);
      }
    
   
  });
  
export const fetchCollection = () => async (dispatch) =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch({ type: types.START_FETCH_COLLECTION });
      const collection = await getListCollection();
      dispatch({
        type: types.SUCCESS_FETCH_COLLECTION,
        payload: collection.data,
      });
      resolve(collection);
    } catch (err) {
    //  console.log("ERr fetch collections:", err);
      dispatch({ type: types.ERROR_FETCH_COLLECTION });
      reject(err);
    }
  });

  export const fetchPastQuotes = () => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch({type: types.START_PAST_QUOTES});
      const pastQuote = await getListPastQuotes();
      if (pastQuote.data.data.length > 0) {
        dispatch({
          type: types.SUCCESS_PAST_QUOTES,
          payload: pastQuote.data,
        });
      } else {
        // const resp = await getListQuotes({
        //   length: 15,
        //   page: 1,
        // });
        // dispatch({
        //   type: types.SUCCESS_PAST_QUOTES,
        //   payload: resp.data,
        // });
      }
      resolve(pastQuote);
    } catch (err) {
     // console.log('ERr fetch past quotes:', err);
      dispatch({type: types.ERROR_PAST_QUOTES});
      reject(err);
    }
  });

export const fetchListLiked = (params) => async (dispatch) =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch({ type: types.START_LIKE_QUOTE });
      const like = await getListLiked(params);
      dispatch({
        type: types.SUCCESS_LIKE_QUOTE,
        payload: like.data,
      });
      resolve(like);
    } catch (err) {
   //   console.log("ERr fetch past quotes:", err);
      dispatch({ type: types.ERROR_LIKE_QUOTE });
      reject(err);
    }
  });

export const getInitialData = (isHasLogin) => async (dispatch) =>
  new Promise(async (resolve, reject) => {
    try {
      let listFactRegister = [];
      const category = await getListCategory();
      if (!isHasLogin) {
        const resFact = await getListFactRegister();
        listFactRegister = resFact.data;
      }

      dispatch({
        type: types.SET_DEFAULT_DATA,
        categories: category.data,
        listFactRegister,
        // link: link.data,
      });
      resolve("success");
    } catch (err) {
   //   console.log("Err fetch data:", err);
      reject(err);
    }
  });

export const handleAppVersion = () => async (dispatch) => {
  const { activeVersion } = store.getState().defaultState;
  if (activeVersion !== APP_VERSION) {
    dispatch({
      type: types.SET_APP_VERSION,
      payload: APP_VERSION,
    });
  }
};

export const handleEndQuote = () => {
  store.dispatch({ type: types.SET_END_REACH_QUOTE });
};

export const setQuoteRef = (ref) => {
  store.dispatch({ type: types.SET_LIST_QUOTE_REF, payload: ref });
};

export const changeAskRatingParameter = () => {
  store.dispatch({
    type: types.CHANGE_ASK_RATING_PARAMETER,
  });
};

export const changeQuoteLikeStatus = (id) => {
  store.dispatch({ type: types.SET_LIKE_STATUS, payload: id });
};
export const storeRegistrationData = (payload) => {
  store.dispatch({ type: types.SET_REGISTER_STEP, payload });
};

export const showLoadingModal = () => {
  store.dispatch({
    type: types.SHOW_LOADING_MODAL,
  });
};

export const hideLoadingModal = () => {
  store.dispatch({
    type: types.HIDE_LOADING_MODAL,
  });
};

export const setCounterNumber = (payload) => {
  store.dispatch({
    type: types.CHANGE_COUNTER_LOADING_MODAL,
    payload,
  });
};

export const setTodayAdsLimit = (payload) => {
  store.dispatch(fetchListQuote({}, true));
};

export const setNewQuoteData = (payload) => {
  store.dispatch({
    type: types.SET_NEW_QUOTE_DATA,
    payload,
  });
};

export const resetTodayAdsLimit = (payload) => {
  store.dispatch({
    type: types.SET_TODAY_ADS_LIMIT,
    payload,
  });
};

export const setAnimationSlideStatus = (payload) => {
  store.dispatch({
    type: types.SET_ANIMATION_SLIDE_DATA,
    payload,
  });
};

export const setInitialLoaderStatus = (payload) => {
  store.dispatch({
    type: types.SET_INITIAL_FINISH_LOADER,
    payload,
  });
};

export const setPaywallNotification = (payload) => {
  store.dispatch({
    type: types.SET_PAYWALL_NOTIFICATION,
    payload,
  });
};

export const setAnimationCounter = (payload) => {
  store.dispatch({
    type: types.SET_ANIMATION_COUNTER,
    payload,
  });
};

const handleSelectTheme = async (res) => {
  const profile = store.getState().defaultState.userProfile;
  if (profile.data.themes?.length > 0) {
    if (
      res.themes.length === 0 ||
      profile.data.themes[0].id !== res.themes[0].id
    ) {
      selectTheme({
        _method: "PATCH",
        themes: [profile.data.themes[0].id],
      });
    }
  }
};

const handleDecrementBadgeCount = () => {
  notifee
    .decrementBadgeCount()
    .then(() => notifee.getBadgeCount())
    .then((count) => {
      if (checkIsHasLogin()) {
        updateProfile({
          notif_count: count,
          _method: "PATCH",
        });
      }
    });
};

export const resetNotificationBadge = (isHasLogin) => {
  notifee.setBadgeCount(0).then(() => {
    if (isHasLogin) {
      // updateProfile({
      //   notif_count: 0,
      //   _method: "PATCH",
      // });
    }
  });
};

const handleNotificationQuote = async (res, remoteMessage, getInitialURL) => {

  let idQuote = null;
  if (getInitialURL) {
    const urlArr = getInitialURL.split("/");
    if (urlArr[3]) {
      idQuote = urlArr[3];
    }
  }
  if (remoteMessage?.data?.id || idQuote) {

    await store.dispatch(
      fetchListQuote({ notif: remoteMessage?.data?.id || idQuote || null })
    );
    if (remoteMessage) {
      handleDecrementBadgeCount();
    } else {
      resetNotificationBadge();
    }
  } else {
    store.dispatch(fetchListQuote());
  }
};

const handleNotificationOpened = (resProfile, loadingRef) => {
  let isAbleToFetchQuote = true;
  notifee.onForegroundEvent(async ({ type, detail }) => {
    if (type === EventType.ACTION_PRESS || type === EventType.PRESS) {
      if (detail.notification.data?.id) {
        isAbleToFetchQuote = false;
        handleDecrementBadgeCount();
        if (detail.notification.data?.id) {
          await store.dispatch(
            fetchListQuote({
              notif: detail.notification.data?.id || null,
            })
          );
          scrollToTopQuote();
        }
      }
      // if (detail.notification.data?.type === "paywall") {
      //   console.log("Check paywall data:", detail.notification.data);
      //   if (loadingRef.current) {
      //     setPaywallNotification(detail.notification.data);
      //     loadingRef.current = false;
      //   } else {
      //     setTimeout(() => {
      //       handlePayment(detail.notification.data?.placement);
      //     }, 1000);
      //   }
      //   eventTracking(OPEN_OFFER_NOTIFICATION);
      // }
    }
  });
  setTimeout(async () => {
    if (isAbleToFetchQuote) {
      const getInitialURL = await Linking.getInitialURL();
      handleNotificationQuote(resProfile, null, getInitialURL);
    }
  }, 1000);
};

const handleShowAds = async (appOpenAd) => {
  const isFinishTutorial = await AsyncStorage.getItem("isFinishTutorial");
  appOpenAd.load();
  if (isFinishTutorial === "yes") {
    if (appOpenAd.loaded) {
      appOpenAd.show();
    } else {
      const cbFinishOpenAds = () => {
        SplashScreen.hide();
        setInitialLoaderStatus(true);
      //  console.log("CALLBACK FINISH CALLED");
      };
     // console.log("LOAD IN APP ADS VIA FORCE LOAD");
      // cbFinishOpenAds();
      loadOpenAddsReward(appOpenAd, cbFinishOpenAds);
    }
  } else {
    SplashScreen.hide();
    setInitialLoaderStatus(true);
  }
};

export const fetchUserLoginData = async (appOpenAd, loadingRef) => {
  if (!isUserPremium()) {
    // handleShowAds(appOpenAd);
  }
  store.dispatch(getInitialData());
  store.dispatch(fetchCollection());
  const resProfile = await reloadUserProfile();
  handleNotificationOpened(resProfile, loadingRef);
  await handleSelectTheme(resProfile);
  handleSubscriptionStatus(resProfile.subscription);
  handleUpdateTimezone();
  if (isUserPremium()) {
    SplashScreen.hide();
  }
};

export const setUserTheme = (payload) => {
  store.dispatch({
    type: types.SET_USER_THEMES,
    payload,
  });
};

const handleSubmitPremiumStatusWeekly = async (submitObj) => {
  handleModalFirstPremium(true);
  const objData = JSON.stringify(submitObj);
  await AsyncStorage.setItem("freePremiumStatusWeekly", objData);
};

const handleSubmitPremiumStatusDaily = async (submitObj) => {
  const objData = JSON.stringify(submitObj);
  await AsyncStorage.setItem("freePremiumStatusDaily", objData);
};

const handleShowFreePremiumWeekly = async () => {
  const premiumStatus = await AsyncStorage.getItem("freePremiumStatusWeekly");
  if (premiumStatus) {
    const objStatus = JSON.parse(premiumStatus);
    if (
      (objStatus.activeDate !== moment().format("YYYY-MM-DD") &&
        objStatus.activeStatus <= 6) ||
      (objStatus.activeStatus > 7 && objStatus.activeStatus % 3 === 0)
    ) {
      const submitObj = {
        activeDate: moment().format("YYYY-MM-DD"),
        activeStatus: objStatus.activeStatus + 1,
      };
      handleSubmitPremiumStatusWeekly(submitObj);
    }
  } else {
    const submitObj = {
      activeDate: moment().format("YYYY-MM-DD"),
      activeStatus: 1,
    };
    handleSubmitPremiumStatusWeekly(submitObj);
  }
};

const handleShowFreePremiumDaily = async () => {
  const premiumStatus = await AsyncStorage.getItem("freePremiumStatusDaily");
  if (premiumStatus) {
    const objStatus = JSON.parse(premiumStatus);
    if (objStatus.activeDate !== moment().format("YYYY-MM-DD")) {
      const submitObj = {
        activeDate: moment().format("YYYY-MM-DD"),
        activeStatus: 1,
      };
      handleSubmitPremiumStatusDaily(submitObj);
    } else if (objStatus.activeStatus === 5) {
      handleModalFirstPremium(true);
      const submitObj = {
        activeDate: moment().format("YYYY-MM-DD"),
        activeStatus: objStatus.activeStatus + 1,
      };
      handleSubmitPremiumStatusDaily(submitObj);
    } else {
      const submitObj = {
        activeDate: moment().format("YYYY-MM-DD"),
        activeStatus: objStatus.activeStatus + 1,
      };
      handleSubmitPremiumStatusDaily(submitObj);
    }
  } else {
    const submitObj = {
      activeDate: moment().format("YYYY-MM-DD"),
      activeStatus: 1,
    };
    handleSubmitPremiumStatusDaily(submitObj);
  }
};

export const fetchInitialData = async (isHasLogin, appOpenAd, loadingRef) => {
  resetNotificationBadge(isHasLogin);
  if (isHasLogin) {
    setInitialLoaderStatus(false);
    await fetchUserLoginData(appOpenAd, loadingRef);
  } else {
    await store.dispatch(getInitialData(false));
    SplashScreen.hide();
  }
};
