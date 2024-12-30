import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {colors, fonts} from '../../shared/styling';

export default StyleSheet.create({
  ctnItemCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.yellow,
    marginBottom: moderateScale(20),
    borderRadius: moderateScale(12),
    marginHorizontal: moderateScale(20),
    paddingHorizontal: moderateScale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    paddingVertical: moderateScale(12),
  },
  checklistContainer: {
    width: moderateScale(100),
  },
  ctnIconCategory: {
    width: moderateScale(80),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  ctnIconItem: {
    height: moderateScale(15),
    width: moderateScale(15),
    resizeMode: 'contain',
  },
  ctnIconIndicator: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(15),
    height: moderateScale(25),
    width: moderateScale(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctnText: {
    flex: 1,
  },
  txtCategory: {
    color: colors.black,
    fontSize: moderateScale(16),
    fontFamily: fonts.InterMedium,
    textAlign: 'center',
  },
  imgIconStyle: {
    width: moderateScale(35),
    height: moderateScale(35),
    resizeMode: 'contain',
  },
  bgGray: {
    backgroundColor: colors.gray,
  },
  ctnAdsIcon: {
    height: moderateScale(22),
    borderRadius: moderateScale(22 / 2),
    paddingHorizontal: moderateScale(6),
    marginRight: moderateScale(6),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ED5267',
    marginLeft: moderateScale(6),
  },
  iconAds: {
    width: moderateScale(12),
    height: moderateScale(12),
    resizeMode: 'contain',
    marginRight: moderateScale(4),
  },
  txtAds: {
    color: colors.white,
    fontFamily: fonts.InterMedium,
    fontSize: moderateScale(12),
  },
  ctnSelectPremium: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
