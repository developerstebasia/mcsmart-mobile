import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {isIphoneXorAbove} from '../../../shared/devices';
import {colors, fonts, sizing} from '../../../shared/styling';

export default StyleSheet.create({
  ctnRoot: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  ctnContent: {
    height: '100%',
    width: '100%',
    // minHeight: sizing.getDimensionHeight(0.9),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    paddingBottom: 0,
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    marginTop: isIphoneXorAbove() ? moderateScale(80) : moderateScale(30),
  },
  inputWrapper: {
    marginBottom: moderateScale(20),
    marginTop: moderateScale(16),
  },
  txtInput: {
    marginHorizontal: moderateScale(20),
    marginBottom: moderateScale(20),
    fontFamily: fonts.InterMedium,
    color: colors.black,
    fontSize: moderateScale(16),
  },
  ctnRowIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: moderateScale(20),
  },
  iconWrapper: {
    width: '24%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(4),
    aspectRatio: 1 / 1,
    borderRadius: moderateScale(12),
    borderColor: 'transparent',
    borderWidth: moderateScale(1),
  },
  activeIcon: {
    borderColor: colors.yellow,
    borderWidth: moderateScale(1),
  },
  ctnIconApp: {
    width: '100%',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderRadius: moderateScale(12),
    backgroundColor: '#fff',
  },
  ctnIconStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    position: 'relative',
  },
  bgBlack: {
    backgroundColor: colors.black,
  },
  ctnSelectPremium: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  ctnIconIndicator: {
    backgroundColor: colors.black,
    borderRadius: moderateScale(15 / 2),
    height: moderateScale(15),
    width: moderateScale(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctnIconItem: {
    height: moderateScale(8),
    width: moderateScale(8),
    resizeMode: 'contain',
  },
  ctnAdsIcon: {
    height: moderateScale(15),
    borderRadius: moderateScale(22 / 2),
    paddingHorizontal: moderateScale(4),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.black,
    marginLeft: moderateScale(2),
  },
  iconAds: {
    width: moderateScale(10),
    height: moderateScale(10),
    resizeMode: 'contain',
    marginRight: moderateScale(4),
  },
  txtAds: {
    color: colors.yellow,
    fontFamily: fonts.InterMedium,
    fontSize: moderateScale(10),
  },
  loadingStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});
