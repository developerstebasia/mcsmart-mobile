import React, { createRef, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Text,
  View,
  PanResponder,
} from "react-native";
import { connect } from "react-redux";
import ButtonOutline from "../../../components/button-outline";
import { sizing } from "../../../shared/styling";
import styles from "./styles";
import states from "./states";

const bgQuote = require("../../../assets/images/yellow_round.png");
const lamp = require("../../../assets/images/lamp.png");
const economyIcon = require("../../../assets/images/category/economy_business.png");
const celebrityIcon = require("../../../assets/images/category/celebrities.png");
const foodDrinkCategory = require("../../../assets/images/category/food_drink.png");
const sportCategory = require("../../../assets/images/category/sport.png");

function ContentStep7({
  onPressGoals,
  specific_goal,
  name,
  substep,
  listFactRegister,
}) {
  const flatListRef = useRef();
  const currentIndex = useRef(0);
  const [isTextAnimated, setIsTextAnimated] = useState(false);
  const [activeIndexTutorial, setActiveIndexTutorial] = useState(0);
  const slideAnimation = useRef(new Animated.Value(0)).current;

  function getDataQuote() {
    switch (substep) {
      case "b":
        return listFactRegister.filter((item) => item.category_id === 4);
      case "c":
        return listFactRegister.filter((item) => item.category_id === 5);
      case "d":
        return listFactRegister.filter((item) => item.category_id === 11);
      default:
        return listFactRegister.filter((item) => item.category_id === 3);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Panggil fungsi di sini
      currentIndex.current =
        currentIndex.current + 1 > 4 ? 0 : currentIndex.current + 1;
      setActiveIndexTutorial(currentIndex.current);
      flatListRef.current.scrollToIndex({
        animated: true,
        index: currentIndex.current,
      });
    }, 3000);

    return () => {
      // Membersihkan interval saat komponen dibongkar
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Panggil fungsi di sini

      setActiveIndexTutorial(currentIndex.current);
      flatListRef.current.scrollToIndex({
        animated: true,
        index: currentIndex.current,
      });
    }, 6000);

    return () => {
      // Membersihkan interval saat komponen dibongkar
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    currentIndex.current = 0;
    setActiveIndexTutorial(0);
  }, [substep]);

  const onMomentoumScrollEnd = (e) => {
    const width = sizing.getDimensionWidth(1);
    const pageNumber = Math.min(
      Math.max(Math.floor(e.nativeEvent.contentOffset.x / width + 0.5) + 1, 0),
      getDataQuote().length
    );

    currentIndex.current = pageNumber - 1;
    setActiveIndexTutorial(pageNumber - 1);
  };

  const startAnimation = () => {
    Animated.timing(slideAnimation, {
      toValue: 200, // Sesuaikan jarak swipe yang diinginkan
      duration: 500, // Sesuaikan durasi animasi yang diinginkan
      useNativeDriver: true,
    }).start(() => {
      // Setelah animasi selesai, atur kembali nilai slideAnimation ke 0
      slideAnimation.setValue(0);
    });
  };
  useEffect(() => {
    if (isTextAnimated) {
      startAnimation();
    }
  }, [isTextAnimated]);

  function getTextInput() {
    switch (substep) {
      case "b":
        return "Would you like to make an\nimpression in professional\nsituations with your co-workers,\nbusiness partners or your boss?";
      case "c":
        return "Would you like to impress\nyour children or other young\nrelatives with your\nknowledge?";
      case "d":
        return "Would you like to impress\nyour common members in\nyour sports club using your\nknowledge?";
      default:
        return "Would you like to impress\nyour friends or partner with your\nknowledge?";
    }
  }

  function getIconCategory(categoryId) {
    switch (categoryId) {
      case 4:
        return economyIcon;
      case 3:
        return celebrityIcon;
      case 5:
        return foodDrinkCategory;
      case 11:
        return sportCategory;
      default:
        return null;
    }
  }

  function renderInput() {
    return (
      <View style={[styles.inputWrapper, styles.ctnInputWrapper]}>
        <Animated.Text
        numberOfLines={4}
        style={[
          styles.txtInput,
          {
            transform: [{ translateX: slideAnimation }],
            opacity: isTextAnimated ? 0 : 1,
          },
        ]}
      >
        {getTextInput()}
      </Animated.Text>

        <View style={styles.ctnGoalsInput}>
          {["Yes", "No"].map((item) => (
            <ButtonOutline
              // btnStyle={styles.btnStyle}
              isSelected={item === specific_goal}
              onPress={() => {
                onPressGoals(item.toLowerCase());
                setIsTextAnimated(true);
                setTimeout(() => {
                  setIsTextAnimated(false);
                }, 500);
                flatListRef.current.scrollToIndex({ animated: true, index: 0 });
              }}
              btnStyle={[
                styles.btnOption,
                {
                  transform: [{ translateX: slideAnimation }],
                  opacity: isTextAnimated ? 0 : 1,
                },
              ]}
              theme="blue"
              label={item}
              key={item}
            />
          ))}
        </View>
      </View>
    );
  }

  const renderListQuote = ({ item }) => (
    <View style={styles.ctnTextQuote}>
      <Text style={styles.txtQuote} numberOfLines={5} ellipsizeMode="tail">
        {item.title}
      </Text>
    </View>
  );

  function renderQuote() {
    return <Image style={styles.ctnQuotes} source={bgQuote} />;
  }

  return (
    <View style={styles.ctnRoot}>
      {renderQuote()}
      <View style={styles.ctnFlatlist}>
        <View style={styles.ctnWelcome}>
          <Text style={styles.txtWelcome}>{`${
            name ? `Hey ${name}` : "Hey"
          }, let’s personalize the topics that you will learn about with McSmart according to the situations that you will use them in!`}</Text>
        </View>
        {renderInput()}
      </View>
      <View style={styles.ctnItem}>
        <View style={styles.ctnImg}>
          <Image
            source={getIconCategory(getDataQuote()[0].category_id)}
            style={styles.imgQuote}
          />
        </View>
        
        <FlatList
          data={getDataQuote()}
          extraData={activeIndexTutorial}
          pagingEnabled
          style={styles.ctnList}
          horizontal
          ref={flatListRef}
          onMomentumScrollEnd={onMomentoumScrollEnd}
          showsHorizontalScrollIndicator={false}
          renderItem={renderListQuote}
          keyExtractor={(item) => item.id}
        />
        
        
        <View style={styles.dotWrapper}>
          {getDataQuote().map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.ctnDot,
                index === activeIndexTutorial && styles.blackDot,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

export default connect(states)(ContentStep7);
