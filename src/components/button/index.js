/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {colors} from '../../shared/styling';
import styles from './styles';

export default function Button({
  label,
  onPress = () => {},
  type,
  isLoading,
  btnStyle,
  isDisable,
  disableWhite,
  prependIcon,
}) {
  function getBgColor() {
    switch (type) {
      case 'white-button':
        return {backgroundColor: colors.white};
      case 'dark':
        return {backgroundColor: colors.dark};
      case 'black':
        if (isDisable) {
          return {backgroundColor: colors.gray};
        }
        return {backgroundColor: colors.black};
      case 'green':
        return {backgroundColor: colors.green};
      case 'tosca':
        return {backgroundColor: colors.tosca};
      default:
        if (isDisable && disableWhite) {
          return {backgroundColor: colors.white};
        }
        if (isDisable) {
          return {backgroundColor: colors.gray};
        }
        return {};
    }
  }

  function getTextColor() {
    switch (type) {
      case 'green':
        return {color: colors.white};
      case 'white-button':
        return {color: colors.black};
      case 'black':
        return {color: colors.white};
      default:
        if (isDisable) {
          // return {backgroundColor: colors.white};
        }
        return {};
    }
  }

  return (
    <TouchableOpacity
      disabled={isLoading || isDisable}
      onPress={onPress}
      style={[styles.ctnRoot, btnStyle, getBgColor()]}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={type === 'white-button' ? colors.yellow : '#fff'}
        />
      ) : (
        <>
          {prependIcon}
          <Text style={[styles.txtButton, getTextColor()]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
