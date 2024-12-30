import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  Linking,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import InAppBrowser from "react-native-inappbrowser-reborn";
import styles from "./styles";
import stylesWatermark from "../../screens/main-page/styles";
import { colors, sizing } from "../../shared/styling";
import { removeRepeat, repeatQuotes } from "../../shared/request";
import { setAnimationCounter } from "../../store/defaultState/actions";
import { isUserPremium } from "../../helpers/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IconLove from "../../assets/svg/icon_love_tap.svg";
import IconLike from "../../assets/svg/icon_like.svg";
import IconShare from "../../assets/svg/icon_share.svg";
import FastImage from "react-native-fast-image";

const lightbulbIcon = require("../../assets/icons/lightbulb.png");
const searchWhiteIcon = require("../../assets/icons/search_white.png");
const lightBulbBlack = require("../../assets/icons/lightbulb_black.png");
const traceWhite = require("../../assets/icons/background_trace_white.png");
const traceYellow = require("../../assets/icons/background_trace_yellow.png");
const waterMark = require("../../assets/icons/watermark.png");
const watertMark_gray = require("../../assets/icons/watermark_new2.png");
const UnionImage = require('../../assets/images/union.png');
export default function QuotesContent({
  item,
  themeUser,
  source,
  isActive,
  isAnimationStart,
  showButtonOption,
  isYellowTrace,
  onPressRating,
  handleShowInterstialAdsLearn,
  main,
  handleShare,
  handleLike,
  showSharePopup,
  quoteLikeStatus
}) {
  const [isRepeat, setRepeat] = useState(
    item?.repeat?.time != undefined || item?.isRepeat ? true : false
  );
  const handleRepeat = () => {
    setRepeat(!isRepeat);
    if (isRepeat) {
      removeRepeat(item.id);
    } else {
      onPressRating();
      repeatQuotes(item.id);
    }
  };
  const translateX = useRef(new Animated.Value(0)).current;
  const counter = useRef(0);
  const activeStatus = useRef(false);
  useEffect(() => {
    if (isActive && isAnimationStart) {
      runAnimation();
      activeStatus.current = true;
    } else {
      stopAnimation();
    }
  }, [isActive, isAnimationStart]);

  const runAnimation = () => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      counter.current += 1;
      Animated.timing(translateX, {
        toValue: -160,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => {
        if (isAnimationStart && activeStatus.current) {
          const isStopAnimation =
            counter.current !== 0 && counter.current % 2 === 0;
          if (isStopAnimation) {
            setAnimationCounter(false);
            setTimeout(() => {
              Animated.timing(translateX, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }).start(() => {
                setTimeout(() => {
                  setTimeout(() => {
                    setAnimationCounter(true);
                  }, 100);
                  runAnimation();
                }, 3500);
              });
            });
          } else {
            runAnimation();
          }
        }
      });
    });
  };

  const openLink = async () => {
    try {
      const url = encodeURI(`https://www.google.com/search?q=${item.title}`);
      const isAvailable = await InAppBrowser.isAvailable();
      //console.log("IS AVAILABLE", isAvailable, url);
      AsyncStorage.setItem('interstial', 'yes');
      if (isAvailable) {
        const result = await InAppBrowser.open(url, {
          dismissButtonStyle: "done",
          enableUrlBarHiding: true,
          hasBackButton: false,
          modalPresentationStyle: "popover",
          ephemeralWebSession: false,
          showTitle: false,
          enableDefaultShare: false,
        });
        if (result.type === "cancel") {
        
          setTimeout(() => {
            if (typeof handleShowInterstialAdsLearn === "function")
              handleShowInterstialAdsLearn();
          }, 500);
        }
      } else Linking.openURL(url);
    } catch (error) {
     // console.log("ERror open browser:", error);
    }
  };

  const stopAnimation = () => {
    if (activeStatus.current) {
      activeStatus.current = false;
      setTimeout(() => {
        //console.log("RESET ANIMATION");
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
        //  console.log("SUCCESS RESET ANIMATION");

          translateX.setValue(0);
          Animated.timing(translateX).stop();
        });
      });
    }
  };

  function renderBackgroundImage() {
    if (isActive) {
      return (
        <FastImage
          source={source}
          style={[styles.ctnBackgroundImage, styles.ctnAbsolute]}
        />
      );
    }
    return null;
  }

  function renderButtonOption() {
    if (showButtonOption) {
      return (
        <View style={themeUser.name === 'Theme 2' && item?.title?.length > 170 ? styles.ctnRowButton2 : styles.ctnRowButton}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.ctnBtn, isRepeat && styles.bgYellow]}
            onPress={handleRepeat}
          >
            <Image
              source={isRepeat ? lightBulbBlack : lightbulbIcon}
              style={styles.imgBtn}
            />
            <Text style={[styles.txtButton, isRepeat && styles.txtBlack]}>
              Repeat
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openLink}
            style={[styles.ctnBtn, styles.mgLeft]}
          >
            <Image source={searchWhiteIcon} style={styles.imgBtn} />
            <Text style={[styles.txtButton]}>Learn More</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }

  function renderWaterMark() {
    if (showButtonOption && !isUserPremium()) {
      return (
        <View style={styles.ctnWatermark}>
          <Text style={styles.txtWatermark}>@mcsmart_app</Text>
        </View>
      );
    }
    return null;
  }
  function renderWatermarkIcon(){
    if(!isUserPremium()){
      return(
        <View style={styles.ctnBgWatermark}>

        <Image source={themeUser.name === 'Theme 2' ? watertMark_gray : waterMark } style={styles.traceBg} />
      </View>
      )
    }
    return null
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
  return (
    <View style={styles.ctnWrapper}>
      {renderBackgroundImage()}
      <Animated.View
        style={{
          width: "100%",
          height: sizing.getDimensionHeight(1),
          transform: [{ translateY: translateX }],
        }}
      >
        <ImageBackground source={source} style={styles.ctnBackgroundImage}>
          {renderWatermarkIcon()}
         
          <View style={styles.ctnIcon}>
            <View style={styles.quotesWrapper}>
              <View style={styles.txtQuotesWrapper}>
                <Text
                  style={[
                    styles.ctnQuotes,
                    {
                      fontSize: themeUser.font_size && item?.title?.length < 150
                        ? moderateScale(Number(themeUser.font_size))
                        : themeUser.name === 'Theme 2' && item?.title?.length > 170 ? moderateScale(16) :  moderateScale(18),
                      backgroundColor: themeUser.background_color || undefined,
                      color: themeUser.text_color || colors.white,
                      fontFamily: themeUser.font_family,
                      marginTop: themeUser.name === 'Theme 2' && item?.title?.length < 110 ? moderateScale(0) : themeUser.name === 'Theme 2' && item?.title?.length > 110 && item?.title?.length < 200 ? moderateScale(30) : themeUser.name === 'Theme 2' && item?.title?.length > 200 ? moderateScale(50) : null,
                      textShadowColor: themeUser.text_shadow,
                      textShadowOffset: themeUser.text_shadow_offset
                        ? JSON.parse(themeUser.text_shadow_offset)
                        : undefined,
                      textShadowRadius: themeUser.text_shadow ? 10 : undefined,
                      lineHeight: themeUser.line_height && item?.title?.length < 130
                        ?  themeUser.name === 'Theme 2' ? moderateScale(30) : moderateScale(Number(themeUser.line_height))
                        : themeUser.name === 'Theme 2' && item?.title?.length > 130 ?  moderateScale(30) : moderateScale(30),
                      // textShadowOffset: {width: 1, height: 1},
                    },
                  ]}
                >
                  {item?.title}
                </Text>
                {item?.author && (
                  <Text
                    style={[
                      styles.ctnQuotes,
                      {
                        backgroundColor:
                          themeUser.background_color || undefined,
                        color: themeUser.text_color || colors.white,
                        fontFamily: themeUser.font_family,
                        // fontFamily: 'Iceberg-Regular',
                        textShadowColor: themeUser.text_shadow,
                        textShadowOffset: themeUser.text_shadow_offset
                          ? JSON.parse(themeUser.text_shadow_offset)
                          : undefined,
                        textShadowRadius: themeUser.text_shadow
                          ? 10
                          : undefined,
                        lineHeight: themeUser.line_height
                          ? moderateScale(Number(themeUser.line_height))
                          : moderateScale(24),
                      },
                    ]}
                  >
                    - {item?.author}
                  </Text>
                )}
              </View>
              {renderButtonOption()}
              {renderButtonShare()}
            </View>
            {main ? null : renderWaterMark()}
          </View>
        </ImageBackground>
      </Animated.View>
    </View>
  );
}
