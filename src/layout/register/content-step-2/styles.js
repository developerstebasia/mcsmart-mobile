import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {colors, fonts} from '../../../shared/styling';

export default StyleSheet.create({
  ctnRoot: {
    flex: 1,
  },
  ctnBanner: {
    position: 'relative',
    paddingTop: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBanner: {
    width: moderateScale(217),
    height: moderateScale(201),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  inputWrapper: {
    marginBottom: moderateScale(20),
    marginTop: moderateScale(16),
  },
  txtInput: {
    marginHorizontal: moderateScale(20),
    fontFamily: fonts.MontSerrateSemiBold,
    color: colors.white,
    textAlign: 'center',
    fontSize: moderateScale(24),
    lineHeight: moderateScale(36),
  },
  ctnWelcome: {
    backgroundColor: colors.yellow,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '80%',
    marginHorizontal: moderateScale(20),
    paddingVertical: moderateScale(15),
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(10),
  },
  txtWelcome: {
    textAlign: 'center',
    fontSize: moderateScale(14),
    fontFamily: fonts.InterSemiBold,
    color: colors.black,
    lineHeight: moderateScale(20),
  },
});
