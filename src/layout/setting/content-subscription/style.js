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
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    marginTop: isIphoneXorAbove() ? moderateScale(38) : moderateScale(20),
    paddingBottom: isIphoneXorAbove() ? 20 : 0,
  },
  wrapper: {
    paddingHorizontal: moderateScale(20),
    flex: 1,
  },
  cttnNote: {
    fontFamily: fonts.InterMedium,
    fontSize: moderateScale(14),
    color: colors.black,
  },
  titleListContent: {
    fontFamily: fonts.InterBold,
    fontSize: moderateScale(16),
  },
  listContentWrap: {
    paddingVertical: moderateScale(15),
  },
  relativeWrap: {
    position: 'relative',
  },
  rowWrap: {
    flexDirection: 'row',
    paddingVertical: moderateScale(5),
  },
  rowLeft: {
    flex: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueBold: {
    fontFamily: fonts.InterSemiBold,
    fontSize: moderateScale(14),
    color: colors.black,
  },
  iconWrap: {
    width: moderateScale(15),
    height: moderateScale(15),
    resizeMode: 'contain',
    marginRight: moderateScale(10),
  },
  ctnSeparator: {
    borderBottomColor: colors.gray,
    borderBottomWidth: moderateScale(1),
    marginVertical: moderateScale(25),
  },
  lineSeparator: {
    position: 'absolute',
    top: 21.5,
    bottom: 0,
    left: 7,
    right: 0,
    backgroundColor: colors.yellow,
    width: moderateScale(2),
    height: moderateScale(13),
  },
  bgYellow: {
    borderColor: colors.yellow,
    borderWidth: 1,
    borderRadius: moderateScale(15 / 2),
  },
});
