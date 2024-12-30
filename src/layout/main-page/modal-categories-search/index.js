import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {Modal, Portal} from 'react-native-paper';
import {connect} from 'react-redux';
import Search from '../../../components/search';
import styles from './styles';
import {getListCategory, updateCategory} from '../../../shared/request';
import useDebounce from '../../../helpers/useDebounce';
import {
  handleBasicPaywallPress,
  isUserPremium,
  reloadUserProfile,
} from '../../../helpers/user';
import LoadingIndicator from '../../../components/loading-indicator';
import states from './states';
import CategoryItem from '../../../components/category-item';

const iconClose = require('../../../assets/icons/close.png');

const emptyImage = require('../../../assets/icons/not_found.png');

function ModalCategoriesSearch({
  isVisible,
  onClose,
  selectedCategory,
  categories,
}) {
  const [listCategories, setCategories] = useState([]);
  const [isAutoFocus, setAutoFocus] = useState(false);
  const [categoryValue, setCategoryValue] = useState([]);
  const [alternativeCategory, setAlternativeCategory] = useState([]);
  const debounceReloadCategory = useDebounce(categoryValue, 1000);

  const [isLoading, setLoader] = useState(false);
  const [searchText, setSearchText] = useState(null);
  const debounceSearch = useDebounce(searchText, 500);

  useState(() => {
    setTimeout(() => {
      setAutoFocus(true);
      setCategoryValue(selectedCategory);
    }, 1000);
  }, []);

  useEffect(() => {
    // reloadUserProfile();
  }, [debounceReloadCategory]);

  useEffect(() => {
    if (debounceSearch) {
      const handleSearch = async () => {
        const params = {
          search: debounceSearch,
        };
        const res = await getListCategory(params);
        setCategories(res.data?.category || []);
        setAlternativeCategory(res.data?.alternative || []);
        setLoader(false);
      };
      handleSearch();
    }
    if (debounceSearch === '') {
      setCategories([]);
      setLoader(false);
    }
  }, [debounceSearch]);

  const handleClose = () => {
    setAutoFocus(false);
    if (typeof onClose === 'function') onClose();
  };

  function renderIconClose() {
    return (
      <TouchableOpacity style={styles.btnStyle} onPress={handleClose}>
        <Image source={iconClose} style={styles.btnClose} />
      </TouchableOpacity>
    );
  }

  function renderHeader() {
    return (
      <View style={styles.ctnHeader}>
        <View style={styles.rowHeaderText}>
          {renderIconClose()}
          <Search
            value={searchText}
            onChangeText={value => {
              setLoader(true);
              setSearchText(value);
            }}
            placeholder="Search"
            ctnRootStyle={styles.ctnSearch}
            autoFocus
          />
          {!isUserPremium() && (
            <TouchableOpacity
              style={styles.ctnJustifyEnd}
              onPress={handleBasicPaywallPress}>
              <Text style={styles.txtHeaderBtn}>Unlock all</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  const isDataSelected = value => {
    const findItem = categoryValue.find(item => item === value);
    if (findItem) return true;
    return false;
  };

  const handleSelectCategory = async (id, isHasSelect) => {
    let curentCategory = [...categoryValue];
    if (isHasSelect) {
      curentCategory = curentCategory.filter(cat => cat !== id);
    } else {
      curentCategory.push(id);
    }
    if (curentCategory?.length > 0 && curentCategory[0] != null) {
      setCategoryValue(curentCategory);
      updateCategory({
        categories: curentCategory,
        _method: 'PATCH',
      });
    }
  };

  const renderListCategory = ({item, index}) => {
    const isSelected = isDataSelected(item.id);
    return (
      <CategoryItem
        onPress={() => {
          handleSelectCategory(item.id, isSelected);
        }}
        isSelected={isSelected}
        item={item}
      />
    );
  };

  function renderListEmpty() {
    if (!isLoading && !!searchText === true) {
      return (
        <View style={styles.ctnEmpty}>
          <Image source={emptyImage} style={styles.emptyBanner} />
          <View style={styles.ctnTextDream}>
            <Text style={styles.txtDream}>
              {`No categories found for that\nsearch term.`}
            </Text>
          </View>
          <View style={styles.ctnAlt}>
            <Text style={styles.txtAlt}>
              Try one of our other categories now:
            </Text>
          </View>
          {alternativeCategory &&
            alternativeCategory?.length > 0 &&
            alternativeCategory.map((item, index) => (
              <Fragment key={item.id}>{renderListCategory({item})}</Fragment>
            ))}
        </View>
      );
    }
    return null;
  }

  return (
    <Portal>
      <Modal
        visible={isVisible}
        animationType="fade"
        transparent
        contentContainerStyle={{flex: 1}}
        onDismiss={handleClose}>
        <View style={styles.ctnRoot}>
          <View style={styles.ctnContent}>
            <FlatList
              style={styles.ctnRoot}
              contentContainerStyle={styles.ctnScroll}
              data={listCategories || []}
              ListHeaderComponent={renderHeader()}
              renderItem={renderListCategory}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderListEmpty()}
              ListFooterComponent={isLoading ? <LoadingIndicator /> : null}
            />
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

ModalCategoriesSearch.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

ModalCategoriesSearch.defaultProps = {};

export default connect(states)(ModalCategoriesSearch);
