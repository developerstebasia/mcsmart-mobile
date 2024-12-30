import React, {useEffect, useState} from 'react';
import {ImageBackground, View, Text, Image, ScrollView} from 'react-native';
import {RewardedAd, RewardedAdEventType} from 'react-native-google-mobile-ads';
import styles from './styles';
import {handleBasicPaywallPress, handlePayment} from '../../../helpers/user';
import Button from '../../../components/button';
import {getRewardedOutOfQuotesID} from '../../../shared/static/adsId';
import {setTodayAdsLimit} from '../../../store/defaultState/actions';
import {loadRewarded} from '../../../helpers/loadReward';
import {isIphoneXorAbove} from '../../../shared/devices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PremiumRocket from "../../../assets/svg/PremiumRocketWhite.svg";

const imgBg = require('../../../assets/icons/quote_bg.png');
const bannerCountdown = require('../../../assets/icons/banner_img.png');
const crownIcon = require('../../../assets/icons/crown_icon.png');
const playIcon = require('../../../assets/icons/play_black.png');
const arrowTop = require('../../../assets/icons/arrow-top.png');

const adUnitId = getRewardedOutOfQuotesID();

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

const PageCountDown = ({ handleLoad,  loading }) => {
  const [loadingAds, setLoadingAds] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hour: 0,
    minutes: 0,
    second: 0,
  });

  useEffect(() => {
    if(loading === false){
      setLoadingAds(false)
    }

  }, [loading])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );
      const timeUntilTomorrow = tomorrow - now;
      const hours = Math.floor(timeUntilTomorrow / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilTomorrow / (1000 * 60)) % 60);
      const seconds = Math.floor((timeUntilTomorrow / 1000) % 60);
      setTimeLeft({
        hour: hours,
        minutes,
        second: seconds,
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleShowAds = async () => {
    AsyncStorage.setItem('interstial', 'yes');
    setLoadingAds(true);
    try {
      const advert = await loadRewarded();
    const pageCountDownReward = advert.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
       // console.log('Earn page countdown reward:', reward);
        if (reward) {
            handleLoad()
            setLoadingAds(false);
        }
        setLoadingAds(false);
      },
    );
    } catch (error) {
      setLoadingAds(false);
      // handleLoad()
    }
    
    
  };

  return (
    <View style={styles.ctnRoot}>
      <ImageBackground source={imgBg} style={styles.ctnBgCountdown}>
        <ScrollView scrollEnabled={!isIphoneXorAbove()}>
          <View style={styles.ctnCountdown}>
            <ImageBackground
              source={bannerCountdown}
              style={styles.ctnBannerCountdown}>
              <View style={styles.ctnTitle}>
                <Text style={styles.txtTitle}>New Facts in...</Text>
              </View>
              <View style={styles.ctnTimer}>
                <Text style={styles.txtTimer}>
                  {`${timeLeft.hour}h ${timeLeft.minutes}m`}{' '}
                  <Text style={styles.txtSmall}>{`${timeLeft.second}s`}</Text>
                </Text>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.ctnText}>
            <Text style={styles.txtTitleQuotes}>
              You are out of free Facts for today!
            </Text>
            <Text style={styles.txtDesc}>
              {isIphoneXorAbove()
                ? 'Don’t stop there. Watch a short Video\nto unlock more Facts for today for\nFree and without waiting or go\nPremium for Full Unlimited Access!'
                : 'Don’t stop there. Watch a short Video to unlock more Facts for today for Free and without waiting or go Premium for Full Unlimited Access!'}
            </Text>
          </View>
          <View style={styles.ctnBtn}>
            <View style={styles.ctnWatch}>
              <Button
                type="white-button"
                txtStyle={styles.txtBtnStyle}
                btnStyle={styles.btnIcon}
                prependIcon={
                  <View style={styles.ctnIcon}>
                    <Image
                      source={playIcon}
                      style={[styles.btnImgStyle, styles.icnPlay]}
                    />
                  </View>
                }
                isLoading={loadingAds}
                onPress={handleShowAds}
                label="Watch Video!"
              />
              <View style={styles.ctnFree}>
                <Text style={styles.txtFree}>FREE</Text>
              </View>
            </View>
            <Button
              type="green"
              txtStyle={styles.txtBtnStyle}
              btnStyle={[styles.btnIcon, styles.mgRight]}
              prependIcon={
                <View style={styles.ctnIconCrown}>
                   <PremiumRocket width="100%" height="100%" />
                </View>
              }
              onPress={handleBasicPaywallPress}
              label={`Get McSmart\nPremium!`}
            />
          </View>
          <View style={styles.ctnSwipe}>
            <Image source={arrowTop} style={styles.icnSwipe} />
            <Text style={styles.txtSwipe}>
              Swipe to go back to today's facts
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default PageCountDown;
