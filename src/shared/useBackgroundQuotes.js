import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {getArrThemes} from './static-data/listTheme';

const listTheme = getArrThemes();

export const handleShuffleTheme = async () => {
  const getItems = listTheme[Math.floor(Math.random() * listTheme.length)];
  const updateObj = {
    ...getItems,
    set_date: moment().format('YYYY-MM-DD'),
  };
  return updateObj;
};

export const useBackgroundQuotes = userThemes => {
  const [themeUser, setThemeUser] = useState(userThemes);

  const shuffleThemes = async themeId => {
    const filterThemes = themeId
      ? listTheme.filter(item => item.id !== themeId)
      : listTheme;
    const getItems =
      filterThemes[Math.floor(Math.random() * filterThemes.length)];
    const updateObj = {
      ...getItems,
      set_date: moment().format('YYYY-MM-DD'),
    };
    const objString = JSON.stringify(updateObj);
    setThemeUser(getItems);
    await AsyncStorage.setItem('randomThemes', objString);
  };

  // console.log('User theme :', themeUser);
  // console.log('User userThemes :', userThemes);

  const getListTheme = () => {
    if (themeUser && themeUser.id) {
      const findTheme = listTheme.find(item => item.id === themeUser.id);
      if (findTheme) {
        return [findTheme];
      }
    }
    return [userThemes];
  };

  useEffect(() => {
    const getThemes = async () => {
      if (userThemes.id === 6) {
        const currentDate = moment().format('YYYY-MM-DD');
        const currentRandomThemes = await AsyncStorage.getItem('randomThemes');
        const objRandomThemes = JSON.parse(currentRandomThemes);
        if (objRandomThemes) {
          if (currentDate !== objRandomThemes.set_date) {
            shuffleThemes(currentRandomThemes.id);
          } else {
            setThemeUser(objRandomThemes);
          }
        } else {
          shuffleThemes();
        }
      }
      if (userThemes.id !== 6) {
        setThemeUser(userThemes);
      }
    };
    getThemes();
  }, [userThemes]);
  return getListTheme();
};
