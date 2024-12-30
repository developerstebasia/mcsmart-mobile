import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// import {Modal} from 'react-native-paper';
import { Modal, Portal } from "react-native-paper";
import styles from "./styles";
import Button from "../../../components/button";
import IconChecklist from "../../../assets/svg/icon_checklist_color_tosca.svg";
import IconAdd from "../../../assets/svg/icon_add.svg";
import IconClose from "../../../assets/svg/icon_close.svg";
import states from "./states";
import { addToCollection } from "../../../shared/request";
import dispatcher from "./dispatcher";
import LoadingIndicator from "../../../components/loading-indicator";
import ModalNewCollection from "../modal-new-collection";
import ContentNoCollection from "../modal-collection/ContentNoCollection";

function ModalAddCollection({
  isVisible,
  onClose,
  collections,
  idQuote,
  fetchCollection,
  showAddNew,
  update,
}) {
  const [selectedCard, setSelectedCard] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [showModalNewCollection, setShowModalNewCollection] = useState(false);
  const [isUpdate, setUpdate] = useState(false);

  const isDataSelected = (value) => {
    const findItem = selectedCard.find((item) => item === value);
    if (findItem) return true;
    return false;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await addToCollection({
        idCollection: selectedCard[0],
        idQuote,
      });
      update(true);
      await fetchCollection();
      onClose();
      setLoading(false);
    } catch (err) {
     // console.log("Error select:", err);
      setLoading(false);
    }
  };

  const onPressSelect = (value) => {
    setSelectedCard([value]); // hanya di pilih satu
  };

  function renderLogo(isSelected) {
    if (isSelected) {
      return <IconChecklist width="100%" height="100%" />;
    }
    return <View style={[styles.ctnIcon, styles.outlineYellow]} />;
  }

  function renderButton() {
    return (
      <View style={styles.ctnButtton}>
        <Button
          type="black"
          label="Add to collection"
          onPress={() => {
            handleSubmit();
          }}
          isLoading={isLoading}
        />
      </View>
    );
  }

  function renderHeader() {
    return (
      <View>
        <View style={styles.btnStyle}>
          <TouchableOpacity onPress={onClose}>
            <View style={styles.btnClose}>
              <IconClose width="100%" height="100%" />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => {
                setShowModalNewCollection(true);
              }} style={{ flexDirection: "row", marginLeft: -10 }}>
          <IconAdd width="10%" height="100%" />
          {showAddNew && (
            <TouchableOpacity
              onPress={() => {
                setShowModalNewCollection(true);
              }}
            >
              <Text style={styles.txtBtnAdd}>Create new collection</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  function renderContentCollection(item, index) {
    return (
      <TouchableOpacity
        onPress={() => {
          onPressSelect(item.id);
        }}
      >
        <View style={styles.rowContentWrap}>
          <View style={styles.rightWrap}>
            <Text
              style={styles.ctnTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>
            <Text style={styles.stnsubTittle}>{item.quotes_count} quotes</Text>
          </View>
          <View style={styles.ctnIcon}>
            {renderLogo(isDataSelected(item.id))}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function renderEmpty() {
    return <ContentNoCollection ctnRoot={styles.ctnEmpty} />;
  }

  function renderDataCollection() {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={collections}
        renderItem={({ item, index }) => renderContentCollection(item, index)}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty()}
        ListFooterComponent={() => {
          if (isLoading) {
            <LoadingIndicator />;
          }
        }}
      />
    );
  }

  function renderContent() {
    return (
      <View style={styles.ctnWrapper}>
        {renderHeader()}
        {renderDataCollection()}
      </View>
    );
  }

  function renderModalNewCollection() {
    if (showModalNewCollection) {
      return (
        <ModalNewCollection
          isVisible={showModalNewCollection}
          closeModal={() => {
            setShowModalNewCollection(false);
          }}
          onClose={() => {
            setShowModalNewCollection(false);
          }}
        />
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
        contentContainerStyle={{ flex: 1 }}
        onDismiss={onClose}
      >
        <View style={styles.ctnRoot}>
          <View style={styles.ctnContent}>
            {renderContent()}
            {renderButton()}
          </View>
        </View>
        {renderModalNewCollection()}
      </Modal>
    </Portal>
  );
}

ModalAddCollection.propTypes = {
  fetchCollection: PropTypes.func.isRequired,
  collections: PropTypes.array,
};

ModalAddCollection.defaultProps = {
  collections: [],
};

export default connect(states, dispatcher)(ModalAddCollection);
