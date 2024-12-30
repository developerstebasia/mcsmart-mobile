import {Platform, StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import responsiveFont from '../../../helpers/responsiveFont';
import {colors, fonts, sizing} from '../../../shared/styling';

export default StyleSheet.create({
  ctnRoot: {
    flex: 1,
  },
  ctnBanner: {
    position: 'relative',
    paddingTop: moderateScale(0),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBanner: {
    width: moderateScale(108),
    height: moderateScale(110),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  inputWrapper: {
    marginBottom: moderateScale(20),
    marginTop: moderateScale(16),
  },
  ctnText: {
    marginHorizontal: moderateScale(20),
    marginBottom: moderateScale(20),
  },
  txtInput: {
    fontFamily: fonts.MontSerrateSemiBold,
    color: colors.white,
    textAlign: 'center',
    fontSize: moderateScale(24),
    lineHeight: moderateScale(34),
  },
  ctnSuccess: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: moderateScale(40),
  },
  txtSuccessTitle: {
    fontFamily: fonts.MontSerrateSemiBold,
    // fontSize: moderateScale(50),
    fontSize:
      Platform.OS === 'android' ? responsiveFont(50) : responsiveFont(40),
    color: colors.black,
    textAlign: 'center',
  },
  txtDescTitle: {
    marginHorizontal: moderateScale(20),
    fontFamily: fonts.InterMedium,
    color: colors.black,
    textAlign: 'center',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
  },
  welcomeText: {
    // marginTop: 0,
    fontSize: moderateScale(16),
    marginTop: moderateScale(6),
  },
  mainStyle: {},
  ctnDesc: {
    backgroundColor: '#FFD600',
    alignSelf: 'center',
    borderRadius: moderateScale(12),
    marginTop: moderateScale(18),
    marginBottom: moderateScale(40),
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(0),
  },
  ctnYellow: {
    // backgroundColor: colors.yellow,
  },
  ctnImg: {
    position: 'absolute',
    width: sizing.getDimensionWidth(1),
    height: sizing.getWindowHeight(1),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgSuccess: {
    width: moderateScale(420),
    height: moderateScale(420),
    resizeMode: 'contain',
    marginTop: moderateScale(410),
  },
  ctnCircular: {
    width: moderateScale(300),
    height: 300,
    // resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    marginTop: 70,
    alignSelf: 'center',
  },
  ctnLottieName: {
    width: 200,
    height: 200,
  },
  animationStyle: {
    width:
      Platform.OS === 'android'
        ? sizing.getWindowWidth(1.2)
        : sizing.getWindowWidth(1),
    height:
      Platform.OS === 'android'
        ? sizing.getWindowHeight(1.2)
        : sizing.getWindowHeight(1),
    backgroundColor: 'red',
  },
});
