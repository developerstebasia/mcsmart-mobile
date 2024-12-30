import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {isIphone, isIphoneXorAbove} from '../../shared/devices';
import {colors, fonts} from '../../shared/styling';

const isSmallPhone = isIphone && !isIphoneXorAbove();

export default StyleSheet.create({
  ctnRoot: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FFD600',
  },
  ctnIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  ctnLogoIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: moderateScale(70),
  },
  btnWrapper: {
    paddingBottom: isIphoneXorAbove() ? moderateScale(60) : moderateScale(40),
  },
  ctnText: {
    // marginHorizontal: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: isSmallPhone ? moderateScale(12) : moderateScale(12),
  },
  txtTitle: {
    marginHorizontal: moderateScale(16),
    fontFamily: fonts.MontSerrateSemiBold,
    color: colors.black,
    textAlign: 'center',
    fontSize: moderateScale(22),
    lineHeight: moderateScale(32),
  },
  txtDesc: {
    marginHorizontal: moderateScale(20),
    marginTop: moderateScale(2),
    fontFamily: fonts.InterMedium,
    color: colors.black,
    textAlign: 'center',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(26),
    marginBottom: moderateScale(20),
  },
  imgBanner: {
    width: moderateScale(260),
    height: moderateScale(260),
    resizeMode: 'contain',
  },
});
