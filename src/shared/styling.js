import {Dimensions} from 'react-native';

export const colors = {
  white: '#fff',
  black: '#000',
  purple: '#44417C',
  gray: '#CCCCCC', // unactive button
  lightBlue: '#D5EFF0', // input color
  blue: '#00C2CB',
  red: '#ED5267',
  tosca: '#00C2CB',
  green: '#009A37',
  ligthTosca: '#E2F9FA',
  defaultBorder: '#ccc',
  darkGray: '#262628',
  lightPurple: '#5B91F7',
  watermark: '#c1c6d4',
  freePremiumColor: '#8084ad',
  pink: '#FC095A',
  darkBlue: '#498FC9',
  grayBg: '#D1D3D4',
  placeholder: '#B8B8B8',
  yellow: '#FFD600',
  dark: 'rgba(0, 0, 0, 0.8)',
  lightYellow: '#FFF0BB',
  maroon: '#D32929',
};

export const fonts = {
  InterBlack: 'Inter-Black',
  InterBold: 'Inter-Bold',
  InterExtraBold: 'Inter-ExtraBold',
  InterExtraLight: 'Inter-ExtraLight',
  InterLight: 'Inter-Light',
  InterMedium: 'Inter-Medium',
  InterRegular: 'Inter-Regular',
  InterSemiBold: 'Inter-SemiBold',
  InterThin: 'Inter-Thin',
  KoulenRegular: 'Koulen-Regular',
  QuotesText: 'EBGaramond-Medium',
  YesevaOne: 'YesevaOne-Regular',
  Merriweather: 'Merriweather-Regular',
  MontSerrateSemiBold: 'Montserrat-SemiBold',
  MontSerratBold: 'Montserrat-Bold',
  MontSerratExtraBold: 'Montserrat-ExtraBold',
};

export const sizing = {
  getDimensionWidth: value => Dimensions.get('screen').width * value,
  getDimensionHeight: value => Dimensions.get('screen').height * value,
  getWindowWidth: value => Dimensions.get('window').width * value,
  getWindowHeight: value => Dimensions.get('window').height * value,
};
