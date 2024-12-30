/* eslint-disable prettier/prettier */
import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {colors, fonts} from '../../shared/styling';

export default StyleSheet.create({
  mainWrapper: {
    position: 'relative',
  },
  ctnInput: {
    height: moderateScale(48),
    backgroundColor: colors.gray,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    color: colors.black
  },
  ctnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: moderateScale(48),
  },
  inputStyle: {
    flex: 1,
    fontFamily: fonts.InterMedium,
    color: colors.black,
    fontSize: moderateScale(13),
  },
  searchIcon: {
    width: moderateScale(20),
    resizeMode: 'contain',
    padding: moderateScale(10),
  },
});
