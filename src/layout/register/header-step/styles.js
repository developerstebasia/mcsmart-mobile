import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {isIphoneXorAbove} from '../../../shared/devices';

export default StyleSheet.create({
  ctnRoot: {
    margin: moderateScale(20),
    paddingTop: isIphoneXorAbove() ? moderateScale(28) : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgStep: {
    width: '100%',
    height: moderateScale(40),
    resizeMode: 'contain',
  },
  ctnImgLamp: {
    height: moderateScale(24),
    width: moderateScale(24),
    resizeMode: 'contain',
  },
  ctnUnactiveLamp: {
    height: moderateScale(24),
    width: moderateScale(52),
    resizeMode: 'contain',
  },
  ctnGiftLamp: {
    height: moderateScale(70),
    width: moderateScale(78),
    resizeMode: 'contain',
    // backgroundColor: 'red',
    left: -26,
    top: -26,
  },
  ctnGift: {
    height: moderateScale(24),
    width: moderateScale(52),
  },
});
