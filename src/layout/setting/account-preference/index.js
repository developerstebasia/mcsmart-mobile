import React, {useState, createRef} from 'react';
import {Image, Platform, Text, TouchableOpacity, View} from 'react-native';
import {Modal, Portal} from 'react-native-paper';
import HeaderButton from '../../../components/header-button';
import ListContent from '../../../components/list-content-border';
import styles from './styles';
import IconEdit from '../../../assets/svg/icon_edit.svg';
import IconCategoriesBlack from '../../../assets/svg/icon_categories_black.svg';
import IconGender from '../../../assets/svg/icon_gender.svg';
import ModalUpdateName from '../modal-update-name';
// import ModalCategories from '../../main-page/modal-categories';
import ModalGender from '../gender';
import ModalCategories from '../../main-page/modal-categories';
// import ModalChangeIcon from '../change-icon';

const bannerIcon1 = require('../../../assets/icons/app_icon_1.png');
const mainBannerIcon = require('../../../assets/icons/setting_banner.png');

export default function AccountPreference({isVisible, onClose}) {
  const [showChangeName, setShowChangeName] = useState(false);
  const [showChangeGender, setShowChangeGender] = useState(false);
  const [showModalChanged, setShowModalChanged] = useState(false);

  const refPrefCategory = createRef();

  function renderModalChangeName() {
    if (showChangeName === true) {
      return (
        <ModalUpdateName
          visible={showChangeName}
          onClose={() => {
            setShowChangeName(false);
          }}
        />
      );
    }
    return null;
  }

  function renderGender() {
    if (showChangeGender === true) {
      return (
        <ModalGender
          visible={showChangeGender}
          onClose={() => {
            setShowChangeGender(false);
          }}
        />
      );
    }
    return null;
  }

  function renderBanner() {
    return (
      <View style={styles.ctnBanner}>
        <Image source={mainBannerIcon} style={styles.iconBanner} />
      </View>
    );
  }

  return (
    <Portal>
      <Modal
        visible={isVisible}
        animationType="fade"
        transparent
        contentContainerStyle={{flex: 1}}
        onDismiss={onClose}>
        <View style={styles.ctnRoot}>
          <View style={styles.ctnContent}>
            <HeaderButton title="Account & preferences" onPress={onClose} />
            {renderBanner()}
            <View style={styles.ctnWrap}>
              <ListContent
                title="Change name"
                icon={
                  <View style={styles.ctnMoreIcon}>
                    <IconEdit width="140%" height="140%" />
                  </View>
                }
                onPress={() => {
                  setShowChangeName(true);
                }}
              />
              <ListContent
                title="Categories"
                icon={<IconCategoriesBlack width="100%" height="100%" />}
                onPress={() => {
                  refPrefCategory.current.show();
                }}
              />
              <ListContent
                title="Gender identity"
                icon={
                  <View style={styles.ctnMoreIcon}>
                    <IconGender width="140%" height="140%" />
                  </View>
                }
                onPress={() => {
                  setShowChangeGender(true);
                }}
              />
              {/* <ListContent
                title="Forbidden words"
                icon={<IconMute width="100%" height="100%" />}
              /> */}
              <ModalCategories
                fullSize={Platform.OS === 'android'}
                contentRef={c => (refPrefCategory.current = c)}
                onClose={() => {
                  refPrefCategory.current.hide();
                }}
              />
              {renderModalChangeName()}
              {renderGender()}
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}
