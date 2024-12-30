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
    width: moderateScale(140),
    height: moderateScale(140),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  inputWrapper: {
    marginBottom: moderateScale(20),
    marginTop: moderateScale(16),
    flex: 1,
  },
  txtInput: {
    marginHorizontal: moderateScale(20),
    fontFamily: fonts.MontSerratBold,
    color: colors.white,
    textAlign: 'center',
    fontSize: moderateScale(24),
    lineHeight: moderateScale(34),
  },
  txtAlt: {
    marginHorizontal: moderateScale(20),
    fontFamily: fonts.InterSemiBold,
    color: colors.white,
    textAlign: 'center',
    fontSize: moderateScale(20),
    lineHeight: moderateScale(28),
  },
  txtNotif: {
    marginTop: moderateScale(20),
    marginHorizontal: moderateScale(20),
    fontFamily: fonts.InterMedium,
    color: colors.white,
    textAlign: 'center',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22),
  },
  txtBlod: {
    fontFamily: fonts.InterBold,
  },
  ctnInput: {
    marginHorizontal: moderateScale(20),
    marginTop: moderateScale(20),
    height: moderateScale(48),
    backgroundColor: colors.white,
    borderRadius: moderateScale(18),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: moderateScale(20),
  },
  leftInput: {
    flex: 1,
  },
  txtLeftInput: {
    fontFamily: fonts.InterSemiBold,
    color: colors.black,
    fontSize: moderateScale(14),
  },
  rightInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctnSelect: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(26 / 2),
    backgroundColor: colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctnValue: {
    width: moderateScale(94),
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtValue: {
    fontFamily: fonts.InterSemiBold,
    color: colors.black,
    fontSize: moderateScale(14),
  },
  txtDecrease: {
    fontFamily: fonts.InterSemiBold,
    color: colors.black,
    fontSize: moderateScale(18),
  },
  txtIncrease: {
    fontFamily: fonts.InterSemiBold,
    color: colors.black,
    fontSize: moderateScale(18),
    marginTop: moderateScale(-3),
  },
  ctnCenter: {
    // flex: 1,
    paddingTop: moderateScale(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctnStep2: {
    // flex: 1,
    paddingTop: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctnBannerAlt: {
    paddingTop: 0,
    marginTop: moderateScale(-30),
  },
  ctnNotification: {
    width: moderateScale(200),
    height: moderateScale(200),
  },
  ctnBanner2: {
    paddingTop: 10,
    marginBottom: 10,
  },
});
