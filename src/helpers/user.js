import moment from "moment";
import { Linking, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TimeZone from "react-native-timezone";
import messaging from "@react-native-firebase/messaging";
import Purchasely, { ProductResult } from "react-native-purchasely";

import {
  checkDeviceRegister,
  getUserProfile,
  postRegister,
  setSubcription,
  updateProfile,
} from "../shared/request";
import store from "../store/configure-store";
import { fetchCollection, handleSetProfile } from "../store/defaultState/actions";
import { SUCCESS_FETCH_COLLECTION } from "../store/defaultState/types";
import {
  CANCEL_SUBSCRIBE_AFTER_TRIAL,
  FREE_TRIAL,
  SHOW_PAYWALL,
  SUBSCRIPTION_STARTED,
  eventTracking,
  revenueTracking,
} from "./eventTracking";
import { reset } from "../shared/navigationRef";
import DeviceInfo from "react-native-device-info";
import { STATIC_ONBOARD } from "../shared/static";

export const dateToUnix = (date) => moment(date).unix();
export const getFutureDate = (defaultDate, day) =>
  moment(defaultDate).add(day, "days").format("YYYY-MM-DD");

export const openPrivacyPolicy = () => {
  Linking.openURL("https://mcsmartapp.com/privacy");
};

export const openTermsofUse = () => {
  Linking.openURL("https://mcsmartapp.com/terms");
};

export const openImprint = () => {
  Linking.openURL("https://mcsmartapp.com/imprint");
};

export const isUserPremium = () => {
  const profile = store.getState().defaultState.userProfile;
  if (profile?.data != undefined) {
    const { type } = profile?.data?.subscription;
    if (type === 1 || type === 5) {
      return false;
    }
    return true;
  }
  return true;
};

export const handlePayment = async (vendorId, cb) =>
new Promise(async (resolve, reject) => {
  try {
    eventTracking(SHOW_PAYWALL);
    let stringVendor = vendorId;
    // const subscriptions = await Purchasely.userSubscriptions();
    // console.log('Subscription status:', subscriptions);
    const purchaseId = await Purchasely.getAnonymousUserId();
      if (vendorId === STATIC_ONBOARD) {
        // await setSubcription({
        //   subscription_type: 1,
        //   purchasely_id: purchaseId,
        // });
      } else if (!stringVendor) {
        const currentDate = moment().format("YYYY-MM-DD");
        const getInstallDate = await AsyncStorage.getItem("firstInstall");
        if (getInstallDate === currentDate) {
          stringVendor = "offer_no_purchase_after_onboarding_paywall";
        } else {
          stringVendor = "offer_no_purchase_after_onboarding_paywall_2nd";
        }
      }
     // console.log("OPEN Purchasely", vendorId);
      const res = await Purchasely.presentPresentationForPlacement({
        placementVendorId:
          stringVendor || "offer_no_purchase_after_onboarding_paywall",
        isFullscreen: true,
      });
   //   console.log("Purchasely result:", res.result);
      const user = store.getState().defaultState.userProfile;
      //console.log("Check user data purchase:", user);
      switch (res.result) {
        case ProductResult.PRODUCT_RESULT_PURCHASED:
         // console.log("FINISH PURCHASED:", user.token);
          if (user.token) {
            await setSubcription({
              subscription_type: vendorId === "one_month_free" ? 3 : 2,
              subscription_data: res,
              purchasely_id: purchaseId,
            });
            await reloadUserProfile();
            Purchasely.closePaywall();
          }
          eventTracking(FREE_TRIAL);
          break;
        case ProductResult.PRODUCT_RESULT_RESTORED:
        //  console.log("Payment restored");
          // let message = null;
          // if (res.plan != null) {
          //   console.log(`User purchased ${res.plan.name}`);
          //   message = res.plan.name;
          // }

          // eventTracking(RESTORE_PURCHASED, message);
          break;
        case ProductResult.PRODUCT_RESULT_CANCELLED:
          console.log("Payment cancel");
          if (Platform.OS === "android") {
            if (
              !vendorId ||
              vendorId === STATIC_ONBOARD ||
              vendorId === "offer_no_purchase_after_onboarding_paywall"
            ) {
              // handlePayment(vendorId);
            }
          }
          // await setSubcription({
          //   subscription_type: 1,
          //   purchasely_id: purchaseId,
          // });
          break;
        default:
          break;
      }
      if (typeof cb === "function") cb();
      resolve(res);
    } catch (err) {
      //console.log("error payment:", err);
    }
  });

export const createUniqueID = () =>
  Date.now().toString(36) + Math.random().toString(36);

export const handlePaymentTwo = async (vendorId, cb) =>
  new Promise(async (resolve, reject) => {
    try {
      const purchaseId = await Purchasely.getAnonymousUserId();
      if (vendorId === STATIC_ONBOARD) {
        await setSubcription({
          subscription_type: 1,
          purchasely_id: purchaseId,
        });
      }
      const user = store.getState().defaultState.userProfile;
      if (user.token) {
        await reloadUserProfile();
      }
    } catch (err) {
      //console.log("error payment:", err);
    }
  });


export const handlePaymentBypass = async (vendorId, cb) =>
  new Promise(async (resolve, reject) => {
    try {
      const purchaseId = await Purchasely.getAnonymousUserId();
      if (vendorId === STATIC_ONBOARD) {
        await setSubcription({
          subscription_type: 1,
          purchasely_id: purchaseId,
        });
      }
    } catch (err) {
      //console.log("error payment:", err);
    }
  });
export const reloadUserProfile = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const res = await getUserProfile();
      const currentUserProfile = store.getState().defaultState.userProfile;
      store.dispatch(
        handleSetProfile({
          ...currentUserProfile,
          ...res,
        })
      );
      if (res.data.subscription.type !== 5) {
        if (currentUserProfile.data) {
          if (currentUserProfile.data.subscription.type !== 1) {
            if (res.data.subscription.type === 1) {
              eventTracking(CANCEL_SUBSCRIBE_AFTER_TRIAL);
            }
            if (
              currentUserProfile.data.subscription.type !==
              res.data.subscription.type
            ) {
              if (res.data.subscription.type !== 1) {
                eventTracking(SUBSCRIPTION_STARTED);
                const objPurchase = JSON.parse(
                  res.data.subscription.purchasely_data
                );
                if (objPurchase) {
                  console.log(objPurchase)
                  revenueTracking(
                    objPurchase.plan_price_in_customer_currency,
                    objPurchase.customer_currency
                  );
                }
              }
            }
          }
        }
      }
      resolve(res.data);
    } catch (err) {
      // Register Default User
      registerUserDefault();
      reject("error get profile");
    }
  });

export const registerUserDefault = async () => {
  DeviceInfo.getUniqueId().then(async deviceId => {
    try {
      const fcmToken = await messaging().getToken();
      const id = await Purchasely.getAnonymousUserId();
      try {
        const timeZone = await TimeZone.getTimeZone();
        const payload = {
          icon: 1,
          fcm_token: fcmToken,
          purchasely_id: id,
          device_id: deviceId,
          purchaseId: id,
          name: "User",
          anytime: null,
          often: 3,
          start: "08:00",
          end: "20:00",
          gender: "",
          timezone: timeZone,

          impress_friends: "yes",
          impress_business: "yes",
          impress_children: "yes",
          impress_members: "yes",
          commit_goal: "12",
          // topics: values.selectedCategory,
        };
        const res = await postRegister(payload);
        store.dispatch(
          handleSetProfile(res)
        );
        await handlePaymentTwo(STATIC_ONBOARD);
        await AsyncStorage.setItem("isFinishTutorial", "yes");
        await updateProfile({
          ...payload,
          _method: "PATCH",
        });
        setTimeout(() => {
          reloadUserProfile();
        }, 2000);
      } catch (err) {
       // console.log("Error register:", err);
      }
    } catch (err) {
      //console.log('Err get device info:', err);
    }
  })
}
export const refetchCollection = () => {
  store.dispatch(fetchCollection());
};
export const handleSubscriptionStatus = async (subscription = {}) => {
  const purchaseId = await Purchasely.getAnonymousUserId();
  if (subscription.type === 2 || subscription.type === 3) {
    const trialDay = subscription.type === 2 ? 3 : 30;
    const dateEndFreeTrial = getFutureDate(subscription.started, trialDay);
    const nowaDay = moment().format("YYYY-MM-DD");
    const objPurchase = JSON.parse(subscription.purchasely_data);
    if (dateToUnix(dateEndFreeTrial) < dateToUnix(nowaDay)) {
      await setSubcription({
        subscription_type: 4,
        purchasely_id: purchaseId,
      });
      await reloadUserProfile();
      eventTracking(SUBSCRIPTION_STARTED);
      if (objPurchase) {
        revenueTracking(
          objPurchase.plan_price_in_customer_currency,
          objPurchase.customer_currency
        );
      }
    }
  }
};

export const setCollectionData = (payload) => {
  store.dispatch({ type: SUCCESS_FETCH_COLLECTION, payload });
};

  export const checkDays = (start) => {
    let timeNow = new Date();
    let timeRemaining = (timeNow - start) / 1000; // Waktu dalam detik
    // Jika lebih dari 2 hari
  if (timeRemaining > 86400 && timeRemaining < 2 * 86400) { // Jika lebih dari 600 detik (10 menit)
     // console.log("Sudah lebih dari 24 jam sejak proses dimulai.");
      return true
    } else if (timeRemaining < 600) {
     // console.log("Belum lebih dari 10 menit sejak proses dimulai.");
      return false
    }
  }
export const handleBasicPaywall = async (cbPaywall) => {
  if (data !== '0') {
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const getInstallDate = await AsyncStorage.getItem('firstInstall');
    const endDate = moment(getInstallDate)
    .add(1, 'days')
    .format('YYYY-MM-DD HH:mm:ss');
    const paywallType =
    currentDate > endDate ?
    "offer_no_purchase_after_onboarding_paywall_2nd"
    : "offer_no_purchase_after_onboarding_paywall";
    await handlePayment(paywallType, cbPaywall);
  }
};

export const handleBasicPaywallPress = async (cbPaywall) => {
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const getInstallDate = await AsyncStorage.getItem('firstInstall');
    const endDate = moment(getInstallDate)
    .add(1, 'days')
    .format('YYYY-MM-DD HH:mm:ss');
    const paywallType =
    currentDate > endDate ?
    "offer_no_purchase_after_onboarding_paywall_2nd"
    : "offer_no_purchase_after_onboarding_paywall";
    await handlePayment(paywallType, cbPaywall);
};

export const isCompletedOnboarding = () => {
  const profile = store.getState().defaultState.userProfile;
  const { type } = profile.data.subscription;
  if (type !== 5) {
    return true;
  }
  return false;
};

export const iconNameToId = (name) => {
  switch (name) {
    case "second":
      return 2;
    case "third":
      return 3;
    case "fourth":
      return 4;
    default:
      return 1;
  }
};

export const checkIsHasLogin = async () => {
  const resLogin = await AsyncStorage.getItem("isLogin");
  return resLogin === "yes";
};

export const handleUpdateTimezone = async () => {
  const profile = store.getState().defaultState.userProfile;
  if (profile.token) {
    const timeZone = await TimeZone.getTimeZone();
    if (profile.data.schedule.timezone !== timeZone)
      await updateProfile({
        timezone: timeZone,
        _method: "PATCH",
      });
    setTimeout(() => {
      reloadUserProfile();
    }, 3000);
  }
};

export const handleRatingModal = async (cbSuccess) => {
  // await AsyncStorage.removeItem('openAppsCounter');
  // await AsyncStorage.removeItem('skipRatingCount');
  const isHasRating = store.getState().defaultState.haveBeenAskRating;
  const openAppsCounter = await AsyncStorage.getItem("openAppsCounter");
  const skipCounter = await AsyncStorage.getItem("skipRatingCount");
  if (openAppsCounter) {
    const currentTotalOpenApps = Number(openAppsCounter);
    const skipCounterToNumber = skipCounter ? Number(skipCounter) : 0;
    const currentDate = moment().format("YYYY-MM-DD");
    if (currentTotalOpenApps % 3 === 0) {
      if (
        !skipCounterToNumber ||
        skipCounterToNumber < 3 ||
        (skipCounter >= 3 && currentDate === getFutureDate(isHasRating, 12))
      ) {
        if (typeof cbSuccess === "function") {
          cbSuccess();
        }
        if (skipCounter >= 3 && currentDate === getFutureDate(new Date(), 12)) {
          await AsyncStorage.removeItem("skipRatingCount");
        }
      }
    }
    const counterToString = (currentTotalOpenApps + 1).toString();
    await AsyncStorage.setItem("openAppsCounter", counterToString);
  } else {
    await AsyncStorage.setItem("openAppsCounter", "2");
  }
};

export const isPremiumToday = () => {
  const { freeUserPremium } = store.getState().defaultState;
  if (isUserPremium()) {
    return true;
  }
  if (freeUserPremium) {
    return true;
  }
  return false;
};

const changeStatus = async (res) => {
  const purchaseId = await Purchasely.getAnonymousUserId();

  const subscriptions = await Purchasely.userSubscriptions();
  //console.log("SUbscription status:", subscriptions);
  if (subscriptions.length > 0 && !isUserPremium()) {
    const planData = subscriptions[0].plan;
    await setSubcription({
      subscription_type: planData.vendorId === "one_month_free" ? 3 : 2,
      subscription_data: planData,
      purchasely_id: purchaseId,
    });
    await reloadUserProfile();
    Purchasely.closePaywall();
  }
};

export const purchaselyListener = () => {
  Purchasely.addEventListener((event) => {
    //console.log("Purchasely listener", event);
    if (event.name === "RECEIPT_FAILED") {
      setTimeout(() => {
        changeStatus(event.properties);
      }, 1000);
    }
  });

  Purchasely.addPurchasedListener((res) => {
    // User has successfully purchased a product, reload content
   // console.log("User has purchased", res);
  });
};
export const checkHours = (start) => {
  let timeNow = new Date();
  let timeRemaining = (timeNow - start) / 1000; // Waktu dalam detik

  if (timeRemaining > 21600) { // Jika lebih dari 600 detik (10 menit)
   // console.log("Sudah lebih dari 6 jam sejak proses dimulai.");
    return true
  } else {
   // console.log("Belum lebih dari 6 jam sejak proses dimulai.");
    return false
  }
}

export const reformatDate = valueDate => {
  if (valueDate) {
    const formatYears = moment(valueDate).format('YYYY');
    const formatMonth = moment(valueDate).format('MM');
    const formatDay = moment(valueDate).format('DD');
    const formatHours = moment(valueDate).format('HH');
    const minutes = moment(valueDate).format('mm');
    return new Date(
      formatYears,
      formatMonth - 1,
      formatDay,
      formatHours,
      minutes,
      0,
      0,
    );
  }
  return new Date();
};
