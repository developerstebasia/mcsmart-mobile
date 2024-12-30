import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {isIphone14Pro, isIphoneXorAbove} from '../../../shared/devices';
import {colors, fonts} from '../../../shared/styling';

export default StyleSheet.create({
  ctnRoot: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingBottom: isIphoneXorAbove() ? moderateScale(0) : moderateScale(20),
  },
  ctnContent: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    paddingBottom: isIphoneXorAbove() ? moderateScale(50) : moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    marginTop: isIphoneXorAbove() ? moderateScale(40) : moderateScale(25),
  },
  ctnButtton: {
    paddingBottom: isIphoneXorAbove()
      ? moderateScale(isIphone14Pro ? 20 : 0)
      : moderateScale(10),
  },
  ctnWrapper: {
    position: 'relative',
    paddingHorizontal: moderateScale(30),
    paddingTop: moderateScale(30),
    flex: 1,
  },
  ctnTxtDone: {
    fontFamily: fonts.InterMedium,
    fontSize: moderateScale(16),
    color: colors.black,
  },
  ctnIcon: {
    width: moderateScale(17),
    height: moderateScale(17),
    resizeMode: 'contain',
  },
  rowWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtBtnAdd: {
    fontSize: moderateScale(16),
    fontFamily: fonts.InterMedium,
    color: colors.black,
  },
  rowContentWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: moderateScale(20),
    borderBottomColor: colors.gray,
    borderBottomWidth: moderateScale(0.7),
  },
  rightWrap: {
    position: 'relative',
    flex: 1,
    paddingRight: moderateScale(20),
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
  ctnEmpty: {
    paddingHorizontal: 0,
  },
  outlineYellow: {
    borderRadius: moderateScale(17 / 2),
    borderWidth: 1,
    borderColor: colors.yellow,
  },
  btnClose: {
    height: moderateScale(24),
    width: moderateScale(24),
    resizeMode: 'contain',
    marginHorizontal: moderateScale(10),
    marginVertical: moderateScale(5),
  },
  btnStyle: {
   alignItems: 'flex-end',
    left: moderateScale(20),
    marginTop: moderateScale(-20),
  },
});
