/* eslint-disable prettier/prettier */
import {StyleSheet} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { isIphoneXorAbove } from '../../shared/devices';
import { colors, fonts, sizing } from '../../shared/styling';

export default StyleSheet.create({
  ctnBackgroundImage: {
    resizeMode: 'cover',
    width: sizing.getWindowWidth(1),
    height: sizing.getDimensionHeight(1),
  },
  ctnIcon: {
    flex: 1,
    // backgroundColor: 'red',
    marginBottom: isIphoneXorAbove() ? moderateScale(10) : moderateScale(0)
  },
  quotesWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  ctnQuotesIcon: {
    width: moderateScale(80),
    height: moderateScale(80),
    alignSelf: 'center',
    marginBottom: moderateScale(30)
  },
  txtQuotesWrapper: {
    paddingHorizontal: moderateScale(30),
    position:'relative',
 
  },
  ctnQuotes: {
    fontSize: moderateScale(18),
    color: colors.black,
    textAlign: 'center',
    fontFamily: fonts.QuotesText,
    lineHeight: moderateScale(24),
    padding: moderateScale(4),
    
    
  },
  ctnRowButton:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: isIphoneXorAbove() ? moderateScale(80) : moderateScale(40),
    marginBottom: moderateScale(15),
    marginTop: moderateScale(40)
  },
  ctnRowButton2:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: isIphoneXorAbove() ? moderateScale(80) : moderateScale(40),
    marginBottom: moderateScale(15),
    marginTop: moderateScale(20)
  },
  ctnBtn:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(12),
    height: moderateScale(44),
    borderRadius: moderateScale(44 / 2),
    backgroundColor: 'rgba(0,0,0,0.8)',
    width: moderateScale(130)
  },
  imgBtn: {
    width: moderateScale(22),
    height: moderateScale(22),
    resizeMode: 'contain',
    marginRight: moderateScale(8)
  },
  txtButton:{
    color: colors.white,
    fontFamily: fonts.InterMedium,
  },
  mgLeft:{
    marginLeft: moderateScale(16)
  },
  ctnAbsolute:{
    position: 'absolute'
  },
  bgYellow:{
    backgroundColor: colors.yellow,
    borderColor: '#515151',
    borderWidth: 1
  },
  txtBlack:{
    color: colors.black
  },
  traceBg:{
    width: moderateScale(50),
    height: moderateScale(50),
    resizeMode: 'contain',
  },
  ctnBgWatermark:{
    position: 'absolute',
    top: moderateScale(60),
    left: moderateScale(20),
    tintColor: 'red'
    // backgroundColor: 'gray',
    // opacity: 0.4,
    // padding: 5
  },
  ctnBgTrace:{

    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  ctnWatermark: {
    position: 'absolute',
    top: isIphoneXorAbove() ? moderateScale(130) : moderateScale(100),
    alignSelf: 'center'
  },
  txtWatermark: {
    fontFamily: fonts.InterMedium,
    color: colors.watermark,
    fontSize: moderateScale(16),
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
    marginBottom: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctnPopupShare:{
    position: 'absolute',
    bottom: moderateScale(-65),
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
});
