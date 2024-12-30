import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {isIphone, isIphoneXorAbove} from '../../../shared/devices';
import {colors, fonts} from '../../../shared/styling';

const isSmallPhone = isIphone && !isIphoneXorAbove();

export default StyleSheet.create({
  ctnRoot: {
    flex: 1,
  },
  ctnBanner: {
    position: 'relative',
    paddingTop: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(20),
  },
  iconBanner: {
    width: moderateScale(120),
    height: moderateScale(120),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  inputWrapper: {
    marginBottom: moderateScale(20),
    marginTop: moderateScale(16),
  },
  txtInput: {
    marginHorizontal: moderateScale(20),
    fontFamily: fonts.MontSerratExtraBold,
    color: colors.white,
    textAlign: 'center',
    fontSize: moderateScale(18),
    lineHeight: moderateScale(28),
  },
  txtDesc: {
    marginHorizontal: moderateScale(20),
    fontFamily: fonts.InterRegular,
    color: colors.black,
    textAlign: 'center',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(23),
    marginTop: moderateScale(12),
  },
  ctnRowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    marginTop: moderateScale(12),
  },
  btnStyle: {
    width: '48%',
    marginHorizontal: 0,
    marginTop: moderateScale(0),
    marginBottom: moderateScale(12),
  },
  ctnGoalsInput: {
    marginTop: moderateScale(30),
  },
});
