import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {colors, fonts} from '../../shared/styling';

export default StyleSheet.create({
  ctnRoot: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctnItem: {
    backgroundColor: '#262628',
    // width: moderateScale(230),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(20),
    paddingVertical: moderateScale(26),
    paddingHorizontal: moderateScale(40),
    marginBottom: 140,
  },
  iconStyle: {
    width: moderateScale(50),
    height: moderateScale(50),
    resizeMode: 'contain',
    marginBottom: moderateScale(20),
  },
  txtRepeat: {
    fontSize: moderateScale(16),
    color: colors.white,
    fontFamily: fonts.InterMedium,
    textAlign: 'center',
    lineHeight: moderateScale(24),
  },
});
