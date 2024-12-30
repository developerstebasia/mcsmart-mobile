import {Platform, StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {colors, fonts, sizing} from '../../../shared/styling';
import {isIphoneXorAbove} from '../../../shared/devices';

export default StyleSheet.create({
  ctnRoot: {
    flex: 1,
    position: 'relative',
  },
  ctnBanner: {
    position: 'relative',
    paddingTop: moderateScale(0),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBanner: {
    width: moderateScale(147),
    height: moderateScale(131),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  inputWrapper: {
    // marginBottom: moderateScale(20),
    marginTop: moderateScale(20),
  },
  txtInput: {
    marginHorizontal: moderateScale(12),
    fontFamily: fonts.MontSerratExtraBold,
    color: colors.white,
    textAlign: 'center',
    fontSize: moderateScale(18),
    lineHeight: moderateScale(28),
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    transform: [{ translateX: -200 }], // Sesuaikan jarak swipe yang diinginkan
  },
  txtDesc: {
    marginHorizontal: moderateScale(20),
    fontFamily: fonts.InterMedium,
    color: colors.black,
    textAlign: 'center',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
    marginTop: moderateScale(18),
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

  ctnInputWrapper: {
    // flex: 1,
    // justifyContent: 'space-between',
    paddingBottom: moderateScale(90),
  },
  ctnGoalsInput: {
    paddingTop:
      Platform.OS === 'ios' && !isIphoneXorAbove()
        ? moderateScale(0)
        : moderateScale(40),
    // backgroundColor: 'red',
  },
  ctnWelcome: {
    backgroundColor: colors.yellow,
    // alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: moderateScale(20),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(15),
    borderRadius: moderateScale(10),
  },
  txtWelcome: {
    textAlign: 'center',
    fontSize: moderateScale(14),
    fontFamily: fonts.InterSemiBold,
    color: colors.black,
    lineHeight: moderateScale(20),
  },
  btnOption: {
    width: moderateScale(240),
    alignSelf: 'center',
  },
  ctnQuotes: {
    width: '100%',
    height: moderateScale(240),
    position: 'absolute',
    resizeMode: 'cover',
    bottom: 0,
    // paddingBottom: moderateScale(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctnTextQuote: {
    width: sizing.getDimensionWidth(1),
    height: moderateScale(230),
    paddingHorizontal: moderateScale(20),
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: moderateScale(16),
  },
  txtQuote: {
    textAlign: 'center',
    fontFamily: 'Capriola-Regular',
    color: '#000',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(28),
  },
  ctnFlatlist: {
    // flex: 1,
    // backgroundColor: 'red',
  },
  ctnItem: {
    // backgroundColor: 'red',
    // position: 'relative',
    height: moderateScale(230),
    // backgroundColor: 'blue',
    position: 'absolute',
    bottom: 0,
  },
  dotWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    position: 'absolute',
    bottom: moderateScale(-4),
    width: '100%',
  },
  ctnDot: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(10 / 2),
    backgroundColor: '#fff',
    marginHorizontal: moderateScale(3),
    marginTop: moderateScale(-80),
  },
  blackDot: {
    backgroundColor: '#000',
  },
  ctnList: {
    // flex: 1
  },
  imgQuote: {
    width: moderateScale(146),
    height: moderateScale(146),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  ctnImg: {
    position: 'absolute',
    bottom: moderateScale(50),
    alignSelf: 'center',
  },
  ctnText: {
    minHeight:
      Platform.OS === 'ios' && !isIphoneXorAbove()
        ? moderateScale(80)
        : moderateScale(120),
  },
});
