import React, { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Alert, BackHandler, LogBox, Modal, Platform, StatusBar, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";

import FullScreenChz from "react-native-fullscreen-chz";
import Purchasely, { RunningMode } from "react-native-purchasely";

import { Adjust, AdjustConfig } from "react-native-adjust";
import Navigator from "./screens/app-routes";
import store, { persistor } from "./store/configure-store";
import { networkDebugger } from "./shared/networkDebugger";
import ModalFirstPremium from "./components/modal-first-premium";
import ModalLock from "./layout/main-page/modal-lock";
import { askTrackingPermission } from "./helpers/eventTracking";
import notifee, { EventType } from "@notifee/react-native";
import { Settings } from "react-native-fbsdk-next";
import messaging from "@react-native-firebase/messaging";
import { Notifications } from "react-native-notifications";
import DeviceInfo from "react-native-device-info";
import { checkDeviceRegister, checkVersion, resetBadge } from "./shared/request";
import { AdEventType, AppOpenAd } from "react-native-google-mobile-ads";
import SplashScreen from "react-native-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAppOpenID } from "./shared/static/adsId";
import * as Sentry from "@sentry/react-native";
import { SENTRY_DSN } from "./shared/static";
import crashlytics from "@react-native-firebase/crashlytics";
import { fetchListQuote } from "./store/defaultState/actions";
import JailMonkey from "jail-monkey";

LogBox.ignoreAllLogs();

Purchasely.startWithAPIKey(
  "c88ec51a-b7ce-485e-8192-038a120da596",
  ["Google"],
  null,
  Purchasely.logLevelDebug,
  RunningMode.FULL
);
const adUnitId = getAppOpenID();
const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ["fashion", "clothing"],
});
// appOpenAd.load();

const App = () => {
  // if (Platform.OS !== 'ios') {
  Sentry.init({
    // environment: "production", // production development
    environment: "development", // pr
    dsn: SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
  // }
  const [showAdsOverlay, setAdsOverlay] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const openAdsOpened = useRef(false);
  const configTracker = () => {
    const adjustConfig = new AdjustConfig(
      "6qpsj2ssc03k",
      AdjustConfig.EnvironmentSandbox,
      // AdjustConfig.EnvironmentProduction
    );
    adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);
    Adjust.create(adjustConfig);
    //console.log("Finish set configtracker");
  };
  Settings.initializeSDK();
  Settings.setAppID("637815961525510");
  useEffect(() => {
    if (JailMonkey.isJailBroken()) {
      Alert.alert('Your Device Root', '', [
        {
          text: 'Ok',
          onPress: () => {
            BackHandler.exitApp()
          },
        },
      ]);
    }
  }, []);

  useEffect(() => {
    async function check() {
      const data = await AsyncStorage.getItem("version");
      if (data === null) {
        const resp = await checkVersion();
        // console.log('check version',JSON.stringify(resp))
        if (resp?.status === "success") {
          AsyncStorage.setItem("version", JSON.stringify(resp?.data[0]?.is_close_button));
        }
      }
    }
    check();
  }, []);
  const firstChecking = async () => {
    DeviceInfo.getUniqueId().then(async (uniqueId) => {
      try {
        await resetBadge({
          device_id: uniqueId,
        });
      } catch (err) {
        //  console.log("Err get device info:", err);
      }
    });
  };

  useEffect(() => {
    crashlytics().log("App Index");
    networkDebugger();
    configTracker();
    Notifications.removeAllDeliveredNotifications();
    firstChecking();

    if (Platform.OS === "android") {
      FullScreenChz.enable();
    } else {
      askTrackingPermission();
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle='dark-content' backgroundColor='#fff' />
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <PaperProvider>
            <Navigator />
            <ModalFirstPremium />
            <ModalLock />
            {showAdsOverlay && <AdsOverlay />}
          </PaperProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default Sentry.wrap(App);
