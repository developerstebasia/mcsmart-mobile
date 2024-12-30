import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {isIphone14Pro, isIphoneXorAbove} from '../../../shared/devices';
import {colors, fonts, sizing} from '../../../shared/styling';

export default StyleSheet.create({
  ctnRoot: {
    flex: 1,
    paddingTop: isIphoneXorAbove()
      ? moderateScale(isIphone14Pro ? 40 : 10)
      : moderateScale(30),
  },
  ctnContent: {
    height: '100%',
    width: '100%',
    minHeight: sizing.getDimensionHeight(0.9),
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
  rowContentWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: moderateScale(20),
    paddingHorizontal: moderateScale(20),
    borderBottomColor: colors.gray,
    borderBottomWidth: moderateScale(0.7),
    backgroundColor: colors.white,
    height: moderateScale(70),
  },
  rightWrap: {
    flex: 1,
    position: 'relative',
  },
  ctnTitle: {
    fontFamily: fonts.InterBold,
    fontSize: moderateScale(16),
    color: colors.black,
  },
  stnsubTittle: {
    fontFamily: fonts.InterRegular,
    fontSize: moderateScale(14),
    color: colors.black,
  },
  ctnIcon: {
    width: moderateScale(18),
    height: moderateScale(15),
    resizeMode: 'contain',
  },
  ctnLike: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctnBgLike: {
    backgroundColor: colors.black,
    paddingHorizontal: moderateScale(40),
    borderRadius: moderateScale(20 / 2),
    paddingVertical: moderateScale(10),
  },
  iconLikeWrap: {
    width: moderateScale(30),
    height: moderateScale(30),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  txtLike: {
    fontFamily: fonts.InterMedium,
    fontSize: moderateScale(10),
    color: colors.white,
    textAlign: 'center',
  },
  ctnWrapper: {
    flex: 1,
    paddingBottom: isIphoneXorAbove() ? moderateScale(0) : moderateScale(0),
  },
  hiddenWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  ctnHidden: {
    backgroundColor: colors.maroon,
    height: moderateScale(70),
    width: moderateScale(70),
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctnAction: {
    width: moderateScale(26),
    height: moderateScale(26),
  },
  bgBlue: {
    backgroundColor: colors.black,
  },
});
