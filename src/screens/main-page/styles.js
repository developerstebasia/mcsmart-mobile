import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {isIphoneXorAbove} from '../../shared/devices';
import {colors, fonts, sizing} from '../../shared/styling';

export default StyleSheet.create({
  ctnRoot: {
    flex: 1,
    backgroundColor: '#fff',
  },
  ctnFreeBadge: {
    position: 'absolute',
    top: isIphoneXorAbove() ? moderateScale(60) : moderateScale(30),
    right: moderateScale(20),
    height: moderateScale(40),
    backgroundColor: 'rgba(0, 0, 0,0.8)',
    borderRadius: moderateScale(8),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
  },
  txtFreeBadge: {
    color: colors.white,
    fontFamily: fonts.InterMedium,
    fontSize: moderateScale(14),
  },
  ctnIconCrown: {
    width: moderateScale(26),
    height: moderateScale(26),
    marginRight: moderateScale(6),
    resizeMode: 'contain',
  },
  btnWrapper: {
    paddingBottom: isIphoneXorAbove() ? moderateScale(10) : 0,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  subBottomWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctnRounded: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(50 / 2),
    padding: moderateScale(12),
    marginHorizontal: moderateScale(12),
    marginBottom: moderateScale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
  },
  rowLef: {
    width: moderateScale(110),
  },
  btnCategories: {
    paddingHorizontal: moderateScale(8),
    marginLeft: moderateScale(0),
    marginRight: moderateScale(0),
    width: '100%',
  },
  ctnIconCategories: {
    width: moderateScale(18),
    height: moderateScale(18),
    marginRight: moderateScale(8),
  },
  txtCategory: {
    fontSize: moderateScale(13),
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    width: moderateScale(113),
    flex: 1,
    justifyContent: 'flex-end',
  },
  btnRight: {
    width: moderateScale(48),
    height: moderateScale(48),
    marginRight: 0,
    borderRadius: moderateScale(10),
    marginLeft: 0,
  },
  mgLeft: {
    marginLeft: moderateScale(12),
  },
  ctnTutorial: {
    position: 'absolute',
    width: '100%',
    height: '100%',

    justifyContent: 'center',
    alignItems: 'center',
  },
  ctnRound: {
    width: moderateScale(300),
    height: moderateScale(300),
    borderRadius: moderateScale(300 / 2),
    backgroundColor: 'rgba(0,0,0,0.96)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctnIconTutorial: {
    width: moderateScale(110),
    height: moderateScale(110),
  },
  txtTutorial: {
    fontFamily: fonts.InterMedium,
    color: colors.white,
    textAlign: 'center',
    fontSize: moderateScale(18),
    marginTop: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    lineHeight: moderateScale(24),
  },
  txtDescTutorial: {
    fontFamily: fonts.InterMedium,
    color: colors.white,
    textAlign: 'center',
    fontSize: moderateScale(14),
    marginTop: moderateScale(12),
    lineHeight: moderateScale(22),
  },
  ctnCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctnLike: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  iconLikeWrap: {
    width: moderateScale(60),
    height: moderateScale(60),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  ctnViewShot: {
    position: 'absolute',
    width: '100%',
    height: sizing.getWindowHeight(1),
    top: sizing.getDimensionHeight(-100),
  },
  ctnSwipe: {
    position: 'absolute',
    width: '100%',
    bottom: isIphoneXorAbove() ? moderateScale(120) : moderateScale(110),
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustBtmPremiumSwipe: {
    bottom: moderateScale(70),
  },
  icnSwipe: {
    width: moderateScale(22),
    height: moderateScale(22),
    resizeMode: 'contain',
  },
  txtSwipe: {
    fontFamily: fonts.InterMedium,
    color: '#B4B4B4',
    fontSize: moderateScale(14),
    marginBottom: moderateScale(6),
  },
  ctnSlideUp: {
    position: 'absolute',
    width: '100%',
    // backgroundColor: 'red',
    bottom: moderateScale(0),
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctnSlideDown: {
    position: 'absolute',
    width: '100%',
    // backgroundColor: 'red',
    bottom: moderateScale(0),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTutorialStyle: {
    width: moderateScale(70),
    height: moderateScale(84),
    // backgroundColor: 'red',
    alignSelf: 'center',
  },
  btnTutorialImageStyle: {
    width: moderateScale(70),
    height: moderateScale(124),
    marginTop: -80,
    marginBottom: moderateScale(20),
    // backgroundColor: 'red',
    alignSelf: 'center',
  },
  btnLottie: {
    width: moderateScale(70),
    height: moderateScale(94),
    // backgroundColor: 'red',
    alignSelf: 'center',
  },
  btnImgMore: {
    width: moderateScale(200),
    height: moderateScale(200),
    // backgroundColor: 'red',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  ctnBtnTutorial: {
    width: 400,
    height: 200,
    bottom: moderateScale(-40),
    position: 'absolute',
    alignSelf: 'center',
  },
  lottieClickTutorial: {
    // backgroundColor: 'red',
    width: 400,
    height: 400,
  },
  ctnTutorialWrapper: {
    position: 'relative',
  },
  ctnHeightTutorial: {
    height: moderateScale(80),
  },
  ctnPdAds: {
    paddingBottom: isIphoneXorAbove() ? moderateScale(70) : moderateScale(60),
  },
  ctnPopupShare:{
    position: 'absolute',
    bottom: moderateScale(58),
    right: moderateScale(-63),
    aspectRatio: 249 / 93,
    width: moderateScale(170),
    overflow: 'visible'
  },
  ctnUnion:{
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  txtPopupMedium:{
    fontFamily: fonts.InterMedium,
    color: colors.black,
    fontSize: moderateScale(12),
    textAlign: 'center',
    marginTop: moderateScale(6)
  },
  txtPopupBold:{
    fontFamily: fonts.InterBold,
    color: colors.black,
    fontSize: moderateScale(12),
    textAlign: 'center',
  },
  ctnBannerAds: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: isIphoneXorAbove() ? moderateScale(14) : 0,
    bottom: 0,
  },
  ctnWatermark: {
    position: 'absolute',
    top: isIphoneXorAbove() ? moderateScale(110) : moderateScale(90),
    right: moderateScale(20),
  },
  txtWatermark: {
    fontFamily: fonts.InterMedium,
    color: colors.watermark,
    fontSize: moderateScale(16),
  },
});
