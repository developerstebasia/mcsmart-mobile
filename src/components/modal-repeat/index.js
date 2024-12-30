import React from 'react';
import {Image, Modal, Text, View} from 'react-native';
import styles from './styles';

const repeatIcon = require('../../assets/icons/lightbulb_yellow.png');

const ModalRepeat = ({isVisible, onClose}) => (
  <Modal
    animationType="fade"
    visible={isVisible}
    // visible
    transparent
    onDismiss={onClose}>
    <View style={styles.ctnRoot}>
      <View style={styles.ctnItem}>
        <Image source={repeatIcon} style={styles.iconStyle} />
        <Text style={styles.txtRepeat}>
          {'This Fact will show\nagain in 24 hours.'}
        </Text>
      </View>
    </View>
  </Modal>
);

export default ModalRepeat;
