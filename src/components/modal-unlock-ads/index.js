import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Modal, Portal} from 'react-native-paper';
import {RewardedAd, RewardedAdEventType} from 'react-native-google-mobile-ads';
import styles from './styles';
import Button from '../button';
import {handleBasicPaywallPress, handlePayment} from '../../helpers/user';
import {getRewardedCategoryID} from '../../shared/static/adsId';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categoryImg = require('../../assets/icons/unlock_category.png');
const crownIcon = require('../../assets/icons/crown_icon.png');
const playIcon = require('../../assets/icons/play_black.png');
const iconClose = require('../../assets/icons/close.png');



const ModalUnlockCategory = ({
  visible,
  handleUnlock,
  handleClose,
  selectedCategory,
  imgSource,
  title,
  label,
  successMessage,
  idAds
}) => {
  const [loadingAds, setLoadingAds] = useState(false);
  const [statusbarStatus, setStatusBar] = useState(false);
  const [clikAble, setClick] = useState(false);
  const rewardedAds = RewardedAd.createForAdRequest(idAds, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
  });
  // useEffect(() => {
  //   if (!rewarded.loaded){
  //     // setLoadingAds(true);
  //   }
  // }, [200]);
  
  useEffect(() => {
  
    if(clikAble){
      //console.log('ada siniiii loh')
      const unsubscribeLoaded = rewardedAds.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
  
         
            setStatusBar(true);
            setLoadingAds(false);
            rewardedAds.show();
        
         
        },
      );
  
      const unsubscribeEarned = rewardedAds.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        reward => {
            handleUnlock();
            if (Platform.OS === 'ios') {
            
              Alert.alert(
                successMessage ||
                  'Congrats! You have unlocked the selected Premium Category.',
                null,
                [{text: 'OK'}],
              );
            }
            handleClose(selectedCategory);
            setStatusBar(false);
            setTimeout(() => {
              AsyncStorage.removeItem('interstial');
            }, 1000);
          
         // console.log('masukkk iiiiii')
          setClick(false)
          
        },
      );
  
       rewardedAds.load()
       return () => {
        unsubscribeLoaded();
        unsubscribeEarned();
       }
      
    }
  }, [clikAble]);

  // useEffect(() => {
  //   if(loadingAds){
  //     rewardedAds.load()

  //     setTimeout(() => {
  //       if(!rewardedAds.loaded){
  //         rewardedAds.show()
  //       }else{
  //         rewardedAds.show()
  //       }
       
  //     }, 1000);
  //     console.log('apa '+rewardedAds.loaded)
  //     // if(!rewardedAds.loaded){
  //     //   rewardedAds.show()
  //     // }
  //     //  rewardedAds.load()
  //     // if(!rewardedAds.loaded){
  //     //   rewardedAds.show()
  //     //   console.log('apa niiiii'+rewardedAds.loaded)
  //     // }else{
  //     //   console.log(' niiiii'+rewardedAds.loaded)
  //     //   rewardedAds.show()
  //     // }
     
  //   }
  // }, [loadingAds])

  function renderIconClose() {
    return (
      <TouchableOpacity style={styles.btnStyle} onPress={handleClose}>
        <Image source={iconClose} style={styles.btnClose} />
      </TouchableOpacity>
    );
  }
  const isDarkTheme = [
    4, 9, 11, 14, 17, 17, 19, 6, 8, 22, 24, 7, 25, 26, 27, 29, 31, 32,
  ].includes(4);
  return (
    <View>
       <StatusBar
        barStyle={isDarkTheme ? "light-content" : "dark-content"}
        backgroundColor={isDarkTheme ? "#000" : "#fff"}
        hidden={statusbarStatus}
      />
        <Portal>
      <Modal
        onDismiss={handleClose}
        contentContainerStyle={{justifyContent: 'center'}}
        visible={visible}>
        <View style={styles.ctnRoot}>
          <Image source={imgSource || categoryImg} style={styles.categoryImg} />
          <View style={styles.ctnText}>
            <Text style={styles.txtTitle}>
              {title || 'Unlock\nthis category for free now'}
            </Text>
            <Text style={styles.txtDesc}>
              {label ||
                'Watch a Video to unlock this Category for Free or go Premium for full access!'}
            </Text>
          </View>
          <View style={styles.ctnBtn}>
            <Button
              type="black"
              txtStyle={styles.txtBtnStyle}
              btnStyle={[styles.btnIcon, styles.mgRight]}
              prependIcon={
                <View style={styles.ctnIcon}>
                  <Image source={crownIcon} style={styles.btnImgStyle} />
                </View>
              }
              onPress={handleBasicPaywallPress}
              label="Go Premium!"
            />
            <View style={styles.ctnWatch}>
              <Button
                type="yellow"
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
                onPress={() => {
                  setClick(true)
                  setLoadingAds(true);
                
                  AsyncStorage.setItem('interstial', 'yes');
                  rewardedAds.load()
                  // setTimeout(() => {
                  //   rewardedAds.show();
                  // }, 200);
                  // if (rewardedAds.loaded) {
                  //   rewardedAds.show();
                  //   setTimeout(() => {
                       
                  //     if (rewardedAds.loaded) {
                  //       rewardedAds.show();
                  //       setLoadingAds(false);
                  //     }
                  //   }, 100);
                  // } else {
                  //   setLoadingAds(true);
                  //   // rewardedAds.load();
                  //   setTimeout(() => {
                  //     if (rewardedAds.loaded) {
                  //       console.log('masuk kesini ya')
                  //       rewardedAds.show();
                  //       setLoadingAds(false);
                  //     }
                  //   }, 100);
                  // }
                }}
                label="Watch Video!"
              />
              <View style={styles.ctnFree}>
                <Text style={styles.txtFree}>FREE</Text>
              </View>
            </View>
          </View>

          {renderIconClose()}
        </View>
      </Modal>
    </Portal>
    </View>
  
  );
};

export default ModalUnlockCategory;
