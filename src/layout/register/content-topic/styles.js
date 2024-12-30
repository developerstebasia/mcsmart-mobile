import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
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
    width: moderateScale(147),
    height: moderateScale(131),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  inputWrapper: {
    marginBottom: moderateScale(20),
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
    flex: 1,
    // justifyContent: 'space-between',
    paddingBottom: moderateScale(90),
  },
  ctnGoalsInput: {
    paddingTop: moderateScale(30),
  },
  ctnWelcome: {
    backgroundColor: colors.yellow,
    // alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
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
  btnOption: {
    width: moderateScale(240),
    alignSelf: 'center',
  },
  ctnQuotes: {
    width: '100%',
    height: moderateScale(300),
    position: 'absolute',
    resizeMode: 'contain',
    bottom: 0,
    paddingBottom: moderateScale(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctnTextQuote: {
    width: sizing.getDimensionWidth(1),
    height: 300,
    paddingTop: moderateScale(30),
    paddingHorizontal: moderateScale(20),
    // backgroundColor: 'red',
  },
  txtQuote: {
    textAlign: 'center',
    fontFamily: 'Capriola-Regular',
    color: '#000',
    fontSize: moderateScale(17),
    lineHeight: moderateScale(28),
  },
  ctnFlatlist: {
    flex: 1,
  },
  ctnItem: {
    // backgroundColor: 'red',
    position: 'relative',
  },
  dotWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    position: 'absolute',
    bottom: moderateScale(110),
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
});
