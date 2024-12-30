import React, {useEffect, useState} from 'react';
import {FlatList, Image, ImageBackground, Text, View} from 'react-native';
import ButtonOutline from '../../../components/button-outline';
import {listTopic} from '../../../shared/staticData';
import {sizing} from '../../../shared/styling';
import styles from './styles';

const lamp = require('../../../assets/images/lamp.png');

export default function ContentTopic({onSelect}) {
  const [selectedCategory, setSelectedCategory] = useState([]);

  useEffect(() => {
    onSelect(selectedCategory);
  }, [selectedCategory]);

  const isDataSelected = value => {
    const findItem = selectedCategory.find(item => item === value);
    if (findItem) return true;
    return false;
  };

  const onPressSelect = value => {
    const isSelected = isDataSelected(value);
    if (isSelected) {
      setSelectedCategory(selectedCategory.filter(item => item !== value));
    } else {
      const listItem = [...selectedCategory];
      listItem.push(value);
      setSelectedCategory(listItem);
    }
  };

  return (
    <View style={styles.ctnRoot}>
      <View style={styles.ctnBanner}>
        <Image source={lamp} style={styles.iconBanner} />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.txtInput}>
          Choose your topics, get the Facts on the go and become the most
          interesting person!
        </Text>
        <View style={styles.ctnRowInput}>
          {listTopic.map(item => (
            <ButtonOutline
              btnStyle={styles.btnStyle}
              isSelected={isDataSelected(item.id)}
              onPress={() => {
                onPressSelect(item.id);
              }}
              theme="blue"
              label={item.name}
              key={item.name}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
