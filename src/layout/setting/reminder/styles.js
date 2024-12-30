import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {isIphoneXorAbove} from '../../../shared/devices';
import {colors, fonts, sizing} from '../../../shared/styling';

export default StyleSheet.create({
  ctnRoot: {
    flex: 1,
  },
  ctnContent: {
    height: '100%',
    width: '100%',
    minHeight: sizing.getDimensionHeight(isIphoneXorAbove() ? 0.9 : 0.94),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    paddingBottom: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    marginTop: isIphoneXorAbove() ? moderateScale(38) : moderateScale(20),
  },
  ctnInput: {
    marginHorizontal: moderateScale(20),
    marginTop: moderateScale(20),
    height: moderateScale(48),
    backgroundColor: colors.yellow,
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
  ctnSelect: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(26 / 2),
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtDecrease: {
    fontFamily: fonts.InterSemiBold,
    color: colors.yellow,
    fontSize: moderateScale(18),
  },
  txtIncrease: {
    fontFamily: fonts.InterSemiBold,
    color: colors.yellow,
    fontSize: moderateScale(18),
    marginTop: moderateScale(-3),
  },
  ctnFlex: {
    flex: 1,
    justifyContent: 'center',
  },
  titleNoteReminder: {
    fontFamily: fonts.InterMedium,
    fontSize: moderateScale(18),
    color: colors.black,
    paddingHorizontal: moderateScale(20),
    textAlign: 'center',
    lineHeight: moderateScale(24),
  },
  ctnBanner: {
    position: 'relative',
    paddingBottom: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBanner: {
    width: moderateScale(177),
    height: moderateScale(161),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
