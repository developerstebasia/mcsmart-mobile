import React, {Fragment, useState} from 'react';
import {TouchableWithoutFeedback, View, Text, Image} from 'react-native';
import IconChecklist from '../../assets/svg/icon_checklist.svg';
import IconChecklistWhite from '../../assets/svg/checklist_white.svg';
import IconLockWhite from '../../assets/svg/lock_white_icon.svg';
import {BACKEND_URL} from '../../shared/static';
import styles from './styles';
import ModalUnlockCategory from '../modal-unlock-ads';
import {isUserPremium} from '../../helpers/user';
import {colors} from '../../shared/styling';
import { getListFactRegister } from '../../shared/request';
import { fetchListQuoteFilter } from '../../store/defaultState/actions';
import store from '../../store/configure-store';
import { getRewardedCategoryID } from '../../shared/static/adsId';
const adsIcon = require('../../assets/icons/ads_icon.png');
const categoryAdsIcon = require('../../assets/icons/category_icon.png');

const CategoryItem = ({onPress, item, isSelected}) => {
  const [showUnlockByAds, setUnlockByAds] = useState(false);
  const isGeneralCategory = item.id === 1;

  const handlePressAds = () => {
    const data = isUserPremium()
    if (item.is_free === 0 && !data) {
      if (isSelected) {
        onPress();
      } else {
        setUnlockByAds(true);
      }
    } else {
      onPress();
    }
  };
 


  function renderSelectedBox() {
    if (!isUserPremium() && item.is_free === 0 && !isSelected) {
      return (
        <View style={styles.ctnSelectPremium}>
          <View
            style={[styles.ctnIconIndicator, {backgroundColor: colors.black}]}>
            <View style={styles.ctnIconItem}>
              <IconLockWhite width="100%" height="100%" />
            </View>
          </View>

          <View style={styles.ctnAdsIcon}>
            <Image source={adsIcon} style={styles.iconAds} />
            <Text style={styles.txtAds}>Free</Text>
          </View>
        </View>
      );
    }
    return (
      <View
        style={[
          styles.ctnIconIndicator,
          isGeneralCategory ? styles.bgGray : {},
        ]}>
        <View style={styles.ctnIconItem}>
          {isGeneralCategory ? (
            <IconChecklistWhite width="100%" height="100%" />
          ) : isSelected ? (
            <IconChecklist width="100%" height="100%" />
          ) : (
            <IconChecklistWhite width="100%" height="100%" />
          )}
        </View>
      </View>
    );
  }

  return (
    <>
      <TouchableWithoutFeedback
        onPress={handlePressAds}
        disabled={isGeneralCategory}>
        <View style={styles.ctnItemCategory}>
          <View style={styles.checklistContainer}>{renderSelectedBox()}</View>
          <View style={styles.ctnText}>
            <Text style={styles.txtCategory}>{item.name}</Text>
          </View>
          <View style={styles.ctnIconCategory}>
            <Image
              source={{uri: `${BACKEND_URL}${item.icon.url}`}}
              style={styles.imgIconStyle}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>

      {showUnlockByAds && (
        <ModalUnlockCategory
          idAds={getRewardedCategoryID()}
          visible={showUnlockByAds}
          handleClose={(selectedCategory) => {
            setUnlockByAds(false);
          }}
          imgSource={categoryAdsIcon}
          selectedCategory={item}
          handleUnlock={onPress}
        />
      )}
    </>
  );
};

export default CategoryItem;
