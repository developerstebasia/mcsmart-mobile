import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Modal,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { changeIcon, getIcon } from "react-native-change-icon";
import {
  RewardedAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";
import HeaderButton from "../../../components/header-button";
import styles from "./styles";
import dispatcher from "./dispatcher";
import states from "./states";
import {
  iconNameToId,
  isUserPremium,
  reloadUserProfile,
} from "../../../helpers/user";

import IconLockWhite from "../../../assets/svg/lock_white_icon.svg";
import ModalUnlockCategory from "../../../components/modal-unlock-ads";
import { getRewardedCategoryID } from "../../../shared/static/adsId";
import { updateProfile } from "../../../shared/request";
import LoadingIndicator from "../../../components/loading-indicator";

const bannerIcon1 = require("../../../assets/app_icon_asset/first.png");
const bannerIcon2 = require("../../../assets/app_icon_asset/second_new.png");
const bannerIcon3 = require("../../../assets/app_icon_asset/third.png");
const bannerIcon4 = require("../../../assets/app_icon_asset/fourth.png");

const adsIcon = require("../../../assets/icons/ads_icon.png");

const rewarded = RewardedAd.createForAdRequest(getRewardedCategoryID(), {
  requestNonPersonalizedAdsOnly: true,
  keywords: ["fashion", "clothing"],
});

function ModalChangeIcon({
  isVisible,
  onClose,
  selectModal,
  handleSetProfile,
  userProfile,
}) {
  const [selectedIcon, setSelectedIcon] = useState(userProfile.data.icon?.id);
  const [loadingAds, setLoadingAds] = useState(false);
  const selectedTemporary = useRef(null);

  const listIcon = [
    {
      id: 1,
      name: "first",
      icon: bannerIcon1,
    },
    {
      id: 2,
      name: "second",
      icon: bannerIcon2,
    },
    {
      id: 3,
      name: "third",
      icon: bannerIcon3,
    },
    {
      id: 4,
      name: "fourth",
      icon: bannerIcon4,
    },
  ];

  useEffect(() => {
    const getInitialIcon = async () => {
      const isSetBefore = await AsyncStorage.getItem("customIcon");

      const resIcon = await getIcon();
    //  console.log("Check resIcon", resIcon);
      if (isSetBefore) {
        setSelectedIcon(iconNameToId(isSetBefore));
      }
    };
    getInitialIcon();
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
       // console.log("LOAD ADS change icon");
      }
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        if (reward) {
          handleChangeIcon(selectedTemporary.current);
        }
      }
    );

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  useEffect(() => {
    rewarded.load();
  }, [isVisible]);

  const handleSubmit = async (item) => {
    try {
      const payload = {
        icon: item,
        _method: "PATCH",
      };
      await updateProfile(payload);
      reloadUserProfile();
    } catch (err) {
      //console.log("Error select:", err);
    }
  };

  const handleChangeIcon = (icon) => {
    changeIcon(icon.name)
      .then(async () => {
        setSelectedIcon(icon.id);
        await AsyncStorage.setItem("customIcon", icon.name);
        handleSubmit(icon.id);
        // selectModal();
      })
      .catch((e) => {
        Alert.alert("Sorry, can't change icon at this time.");
      //  console.log("Error change icon:", e.message);
      });

  };

  function renderInput() {
    return (
      <View style={styles.inputWrapper}>
        <Text style={styles.txtInput}>
          Change the app icon for your home screen.
        </Text>
        <View style={styles.ctnRowIcon}>
          {listIcon.map((icon, index) => (
            <TouchableWithoutFeedback
              key={icon.id}
              disabled={loadingAds}
              onPress={async () => {
                if (!isUserPremium() && icon.id !== 1) {
                  selectedTemporary.current = icon;
                  if (icon.id === selectedIcon) {
                    handleChangeIcon(icon);
                  } else {
                    if (rewarded.loaded) {
                      rewarded.show();
                    } else {
                      setLoadingAds(true);
                      rewarded.load();
                      setTimeout(() => {
                        if (rewarded.loaded) {
                          rewarded.show();
                          setLoadingAds(false);
                        } else {
                          setLoadingAds(false);
                        }
                      }, 3000);
                    }
                  }
                } else {
                  handleChangeIcon(icon);
                }
              }}
            >
              <View
                style={[
                  styles.iconWrapper,
                  selectedIcon === icon.id && styles.activeIcon,
                ]}
              >
                <View style={[styles.ctnIconApp]}>
                  <ImageBackground
                    source={icon.icon}
                    style={styles.ctnIconStyle}
                  >
                    {!isUserPremium() && icon.id !== selectedIcon && (
                      <View style={styles.ctnSelectPremium}>
                        <View style={styles.ctnIconIndicator}>
                          <View style={styles.ctnIconItem}>
                            <IconLockWhite width="100%" height="100%" />
                          </View>
                        </View>

                        <View style={styles.ctnAdsIcon}>
                          <Image source={adsIcon} style={styles.iconAds} />
                          <Text style={styles.txtAds}>Free</Text>
                        </View>
                      </View>
                    )}
                    {loadingAds &&
                      icon.id === selectedTemporary.current?.id && (
                        <LoadingIndicator stylesRoot={styles.loadingStyle} />
                      )}
                  </ImageBackground>
                </View>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </View>
    );
  }

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent
      onDismiss={onClose}
    >
      <View style={styles.ctnRoot}>
        <View style={styles.ctnContent}>
          <HeaderButton title="Change app icon" onPress={onClose} />
          {renderInput()}
        </View>
      </View>
    </Modal>
  );
}

ModalChangeIcon.propTypes = {
  handleSetProfile: PropTypes.func.isRequired,
  userProfile: PropTypes.object.isRequired,
};

export default connect(states, dispatcher)(ModalChangeIcon);