import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Portal } from "react-native-paper";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import SlidingUpPanel from "rn-sliding-up-panel";
import Search from "../../../components/search";
import styles from "./styles";
import states from "./states";
import {
  handleBasicPaywallPress,
  isUserPremium,
  reloadUserProfile,
} from "../../../helpers/user";
import { sizing } from "../../../shared/styling";
import Button from "../../../components/button";
import PremiumRocket from "../../../assets/svg/RocketPremiumBlack.svg";
import { getListQuotes, updateCategory } from "../../../shared/request";
import CategoryItem from "../../../components/category-item";
import ModalCategoriesSearch from "../modal-categories-search";
import useDebounce from "../../../helpers/useDebounce";
import { showModalPremium } from "../../../shared/globalContent";
import dispatcher from "./dispatcher";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SUCCESS_FETCH_QUOTE } from "../../../store/defaultState/types";
import store from "../../../store/configure-store";
const iconClose = require("../../../assets/icons/close.png");

function ModalCategories({
  onClose,
  categories,
  userProfile,
  contentRef,
  fullSize,
  onCustomSelectCategory,
  fetchListQuote,
  dataQuoteLength,
  updateList
}) {
  const [categoryValue, setCategoryValue] = useState([]);
  const [dataQuote, setQuoteList] = useState([])
  const [showModalSearch, setModalSearch] = useState(false);
  const debounceReloadCategory = useDebounce(categoryValue, 5000);
  const draggableRange = {
    top: fullSize
      ? sizing.getDimensionHeight(1)
      : sizing.getDimensionHeight(1) - StatusBar.currentHeight,
    bottom: 0,
  };
  const [panelPositionVal] = useState(
    new Animated.Value(draggableRange.bottom)
  );
  const snappingPoints = [draggableRange.top, draggableRange.bottom];

  useEffect(() => {
    const data = isUserPremium();
    const getInitialCategory = async () => {

      if (userProfile.data.categories?.length > 0 && data) {
        setCategoryValue(userProfile.data.categories.map((item) => item.id));
        // fetchList(categoryValue)
        // if(isUserPremium()){
          fetchList(categoryValue)
        // }else{
        //   const stringifyDate = new Date();
        //   let strTanggalSekarang = stringifyDate.toISOString().slice(0,10);
        //   const value = await AsyncStorage.getItem('setToday');
        //   console.log('tanggal sama', value+"===="+strTanggalSekarang)
        //   if(value != strTanggalSekarang){
        //     fetchList(categoryValue)
        //   }else{
        //     console.log('tanggal sama', value+"===="+strTanggalSekarang)
        //   }
         
        // }
      } else if (userProfile.data.categories?.length > 0) {
        
        let result;
        if (categoryValue.includes(2)) {
          result = [2, categoryValue[categoryValue.length - 1]];

          if(categoryValue.length > 1 &&  categoryValue[categoryValue.length - 1] != 2){
          
            setCategoryValue(result);
            if(isUserPremium()){
             // console.log('ini user premium', isUserPremium)
              fetchList(result)
            }else{
              const stringifyDate = new Date();
              let strTanggalSekarang = stringifyDate.getDate().toString();
              const value = await AsyncStorage.getItem('setToday');
            //  console.log('tanggal sama modal', value+"===="+strTanggalSekarang)
              if(value != strTanggalSekarang){
                fetchList(result)
               // console.log('tanggal sama modal new', value+"===="+strTanggalSekarang)
                // AsyncStorage.setItem('setToday', strTanggalSekarang);
              }else{
                // fetchList(result)
                //console.log('tanggal sama NIH', value+"===="+strTanggalSekarang)
              }
             
            }
           
          }else{
          
            setCategoryValue(categoryValue);
            if(isUserPremium()){
              fetchList(categoryValue)
            }else{
              const stringifyDate = new Date();
              let strTanggalSekarang = stringifyDate.getDate().toString();
              const value = await AsyncStorage.getItem('setToday');
           //   console.log('tanggal sama', value+"===="+strTanggalSekarang)
              if(value != strTanggalSekarang){
                fetchList(categoryValue)
              
              }else{
              //  console.log('tanggal sama', value+"===="+strTanggalSekarang)
              }
             
            }
          }
         
        } else {
          result = [categoryValue[categoryValue.length - 1]];
          
          setCategoryValue(result);
          if(categoryValue[categoryValue.length - 1] != undefined){
            if(isUserPremium()){
              fetchList(result)
            }else{
              const stringifyDate = new Date();
              let strTanggalSekarang = stringifyDate.getDate().toString();
              const value = await AsyncStorage.getItem('setToday');
            //  console.log('tanggal sama', value+"===="+strTanggalSekarang)
              if(value != strTanggalSekarang){
                fetchList(result)
                // AsyncStorage.setItem('setToday', strTanggalSekarang);
              }else{
             //   console.log('tanggal sama', value+"===="+strTanggalSekarang)
              }
             
            }
          }
        }
      } else if (userProfile.data.categories?.length === 0){
      
       
        if(isUserPremium()){
          fetchList([2])
        }else{
          const stringifyDate = new Date();
          let strTanggalSekarang = stringifyDate.getDate().toString();
          const value = await AsyncStorage.getItem('setToday');
          if(value != strTanggalSekarang){
            fetchList([2])
          }else{
           // console.log('tanggal sama', value+"===="+strTanggalSekarang)
          }
         
        }
      }
    };
    getInitialCategory();
  }, [userProfile.data.categories]);

  const fetchList = async (value) => {
    if (value.length > 0 && value[0] != null) {
      await updateCategory({
        categories: value,
        _method: "PATCH",
      });
    //  console.log("ini current update quote" + value);
      updateList()
     
    }
   
  }

  useEffect(() => {
    if (userProfile.data.categories?.length > 0 ) {
      setCategoryValue(userProfile.data.categories.map((item) => item.id));
    }
  }, []);

  const isDataSelected = (value) => {
    const findItem = categoryValue.find((item) => item === value);
    if (findItem) return true;
    return false;
  };

  const handleSelectCategory = async (id, isHasSelect) => {
    let curentCategory = [...categoryValue];
    if (isHasSelect) {
      curentCategory = curentCategory.filter((cat) => cat !== id);
      if (curentCategory?.length === 0) {
        curentCategory = [1];
      }
    } else {
      curentCategory.push(id);
    }
    setCategoryValue(curentCategory);
    fetchList(curentCategory);
  };

  function renderSubscription() {
    if (isUserPremium()) {
      return null;
    }
    return (
      <View style={styles.ctnBgWrap}>
        <TouchableWithoutFeedback onPress={handleBasicPaywallPress}>
          <View style={styles.ctnRow}>
            <View style={styles.ctnRowLeft}>
              <Text style={styles.titleStyle}>Go Premium</Text>
              <Text style={styles.subTitleStyle}>
                Access unlimited categories, Facts, themes and remove ads!
              </Text>
            </View>
            <View style={styles.ctnIcon}>
              <PremiumRocket width="100%" height="100%" />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  function renderLabel() {
    return (
      <View style={styles.ctnLabel}>
        <Text style={styles.txtMix}>Make your own mix</Text>
      </View>
    );
  }

  function renderHeader(dragHandler = {}) {
    return (
      <View style={styles.ctnHeader} {...dragHandler}>
        <View style={styles.ctnTextHeader}>
          <Text style={styles.boldHeader}>Categories</Text>
          <Text style={styles.txtDesc}>
            {"Choose the topics that you\nwant to learn more about."}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setModalSearch(true);
          }}
        >
          <Search isSelect placeholder="Search" />
        </TouchableOpacity>
      </View>
    );
  }

  function renderIconClose() {
    if (onCustomSelectCategory) {
      return (
        <Button
          btnStyle={styles.ctnStyle}
          label="Save"
          onPress={() => {
            onCustomSelectCategory(categoryValue);
            setCategoryValue([]);
            onClose();
          }}
        />
      );
    }
    return (
      <TouchableOpacity style={styles.btnStyle} onPress={onClose}>
        <Image source={iconClose} style={styles.btnClose} />
      </TouchableOpacity>
    );
  }

  const renderListCategory = ({ item, index }) => {
    const isSelected = isDataSelected(item.id);
    return (
      <CategoryItem
        onPress={() => {
          handleSelectCategory(item.id, isSelected);
        }}
        isSelected={isSelected}
        selectedCategory={categoryValue}
        item={item}
      />
    );
  };

  return (
    <Portal>
      <SlidingUpPanel
        ref={contentRef}
        animatedValue={panelPositionVal}
        draggableRange={draggableRange}
        snappingPoints={snappingPoints}
        backdropOpacity={0}
        showBackdrop={false}
        height={draggableRange.top}
        allowDragging
        // allowDragging={allowDragging}
        // onMomentumDragEnd={onMomentumDragEnd}
        // onDragStart={onDragStart}
      >
        {(dragHandler) => (
          <View style={styles.ctnRoot}>
            <TouchableWithoutFeedback onPress={onClose}>
              <View style={styles.ctnClose} />
            </TouchableWithoutFeedback>
            <View style={styles.ctnContent}>
              {/* <LineGestureSlide dragHandler={dragHandler} /> */}
              {renderHeader(dragHandler)}
              <FlatList
                contentContainerStyle={styles.ctnScroll}
                data={categories?.category || []}
                ListHeaderComponent={() => (
                  <>
                    {renderSubscription()}
                    {renderLabel()}
                  </>
                )}
                renderItem={renderListCategory}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />

              {renderIconClose()}
            </View>

            {showModalSearch && (
              <ModalCategoriesSearch
                onClose={() => {
                  setModalSearch(false);
                }}
                selectedCategory={categoryValue}
                isVisible={showModalSearch}
              />
            )}
          </View>
        )}
      </SlidingUpPanel>
    </Portal>
  );
}

ModalCategories.propTypes = {
  categories: PropTypes.object,
  userProfile: PropTypes.object.isRequired,
  fetchListQuote: PropTypes.func.isRequired,
};

ModalCategories.defaultProps = {
  categories: {
    popular: [],
    category: [],
  },
};

export default connect(states, dispatcher)(ModalCategories);

