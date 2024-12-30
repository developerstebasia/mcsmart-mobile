import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { connect } from "react-redux";
import Share from "react-native-share";
import { Modal, Portal } from "react-native-paper";
import HeaderButton from "../../../components/header-button";
import Search from "../../../components/search";
import styles from "./styles";
import IconSort from "../../../assets/svg/icon_sort.svg";
import CardMyCollection from "../../../components/card-my-collection";
import ImgNoLike from "../../../assets/svg/img_no_like.svg";
import states from "./states";
import ModalAddCollection from "../../main-page/modal-add-collection";
import {
  dislikeQuotes,
  getListRepeat,
  removeRepeat,
} from "../../../shared/request";
import dispatcher from "./dispatcher";
import PopupDelete from "../../../components/popup-delete";
import useDebounce from "../../../helpers/useDebounce";
import IconDislike from "../../../assets/svg/icon_dislike.svg";
import LoadingIndicator from "../../../components/loading-indicator";
import { downloadText } from "../../../shared/static";
import IconBack from "../../../assets/svg/icon_back.svg";
import store from "../../../store/configure-store";
import { SUCCESS_FETCH_QUOTE } from "../../../store/defaultState/types";
function RepeatQuotes({ contentRef, onClose, isVisible, quotes }) {
  const [showModalAddCollection, setShowModalAddCollection] = useState(false);
  const [activeQuote, setActiveQuote] = useState();
  const [isLoading, setLoading] = useState(false); // utk button
  const [showDelete, setShowDelete] = useState(false);
  const [dataActive, setDataActive] = useState({});
  const [instruksi, setInstruksi] = useState(false);
  const [moreData, setMoreData] = useState(false);
  const [textQuote, setTextQuote] = useState("");
  const [showModalLike, setShowModalLike] = useState(false);
  const [searchText, setSearchText] = useState(null);
  const debounceSearch = useDebounce(searchText, 500);
  const [likeData, setLikeData] = useState({
    listLike: [],
    activePage: 1,
    isloading: true,
    dir: "",
    column: "",
    total: 0,
  });
  

  const resetList = () => {
    setLikeData({
      listLike: [],
      activePage: 1,
      isloading: true,
      dir: "",
      column: "",
      total: 0,
    });
  };

  const getListLikeData = async () => {
    setLikeData({
      listLike: [],
      activePage: 1,
      isloading: true,
      dir: "",
      column: "",
      total: 0,
    });
    const params = {
      length: 10,
      page: 1,
    };
    const res = await getListRepeat(params);
    setLikeData({
      ...likeData,
      listLike: res.data.data,
      total: res.data.total,
      isloading: false,
    });
  };

  useEffect(() => {
    if (isVisible) {
      getListLikeData();
    } else {
      resetList();
    }
  }, [isVisible]);

  useEffect(() => {
    if (debounceSearch || debounceSearch === "") {
      const handleSearch = async () => {
        resetList();
        const params = {
          length: 10,
          search: debounceSearch,
          page: 1,
        };
        const res = await getListRepeat(params);
        setLikeData({
          ...likeData,
          listLike: res.data.data,
          total: res.data.total,
          isloading: false,
        });
      };
      handleSearch();
    }
  }, [debounceSearch]);

  const handleLoadMore = async () => {
    if (!likeData.loading) {
      if (likeData.listLike?.length > 0) {
        if (likeData.listLike?.length < likeData.total) {
          setLikeData({ ...likeData, isloading: true });
          const listLiked = await getListRepeat({
            length: 10,
            page: likeData.activePage + 1,
            dir: likeData.dir,
            column: likeData.column,
          });
          setLikeData({
            ...likeData,
            listLike: [...likeData.listLike, ...listLiked.data.data],
            activePage: likeData.activePage + 1,
            isloading: false,
            dir: likeData.dir,
            column: likeData.column,
          });
        }
      }
    }
  };

  const handleShare = async (quoteText) => {
    await Share.open({
      message: `“${quoteText}”\n\n${downloadText}\n`,
    });
  };

  const handleDelete = async (idQuote) => {
    try {
      removeRepeat(idQuote);

      setLikeData({
        ...likeData,
        listLike: likeData.listLike.filter((item) => item.id !== idQuote),
        total: likeData.total - 1,
      });
      quotes?.listData?.filter((item) => item.id !== idQuote),
      store.dispatch({
        type: SUCCESS_FETCH_QUOTE,
        payload: quotes,
        arrData:  quotes?.listData,
      })
    } catch (err) {
    //  console.log("Error new collection:", err);
    }
  };

  const onShowHide = () => {
    setInstruksi((prevState) => !prevState);
  };

  const onMoreShowHide = (idActive) => {
    setDataActive(idActive || null);
    setMoreData((prevState) => !prevState);
  };

  const onPressSelect = (value) => {
    if (moreData === true) {
      onMoreShowHide(value);
    } else {
      onMoreShowHide(value);
    }
  };

  const handleSortTitleAsc = async () => {
    resetList();
    const params = {
      length: 10,
      dir: "asc",
      column: "title",
      page: 1,
    };
    const res = await getListRepeat(params);
    setLikeData({
      ...likeData,
      listLike: res.data.data,
      isloading: false,
      dir: "asc",
      column: "title",
    });
  };

  const handleSortTitleDesc = async () => {
    resetList();
    const params = {
      length: 10,
      dir: "desc",
      column: "title",
      page: 1,
    };
    const res = await getListRepeat(params);
    setLikeData({
      ...likeData,
      listLike: res.data.data,
      isloading: false,
      dir: "desc",
      column: "title",
    });
  };

  const handleSortDesc = async () => {
    resetList();
    const params = {
      length: 10,
      dir: "desc",
      column: "id",
      page: 1,
    };
    const res = await getListRepeat(params);
    setLikeData({
      ...likeData,
      listLike: res.data.data,
      isloading: false,
      dir: "desc",
      column: "id",
    });
  };

  const handleSortAsc = async () => {
    resetList();
    const params = {
      length: 10,
      dir: "asc",
      column: "id",
      page: 1,
    };
    const res = await getListRepeat(params);
   // console.log(res.data);
    setLikeData({
      ...likeData,
      listLike: res.data.data,
      isloading: false,
      dir: "asc",
      column: "id",
    });
  };

  const handleLike = async (idQuote, status) => {
    try {
      if (!status) {
        setShowModalLike(true);
      }
      const payload = {
        type: status ? "2" : "1",
      };
      await dislikeQuotes(payload, idQuote);

      if (!status) {
        setTimeout(() => {
          setShowModalLike(false);
        }, 200);
      }
    } catch (err) {
     // console.log("Error dislike:", err);
    }
  };

  function renderSort() {
    if (instruksi) {
      return (
        <View style={styles.ctnSortWrap}>
          <TouchableWithoutFeedback
            onPress={() => {
              handleSortTitleAsc();
              onShowHide();
            }}
          >
            <View style={styles.ctnRowSort}>
              <Text style={styles.label}>Sort by title A-Z</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.separator} />
          <TouchableWithoutFeedback
            onPress={() => {
              handleSortTitleDesc();
              onShowHide();
            }}
          >
            <View style={styles.ctnRowSort}>
              <Text style={styles.label}>Sort by title Z-A</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.separator} />
          <TouchableWithoutFeedback
            onPress={() => {
              handleSortDesc();
              onShowHide();
            }}
          >
            <View style={styles.ctnRowSort}>
              <Text style={styles.label}>Sort by newest</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.separator} />
          <TouchableWithoutFeedback
            onPress={() => {
              handleSortAsc();
              onShowHide();
            }}
          >
            <View style={styles.ctnRowSort}>
              <Text style={styles.label}>Sort by oldest</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    }
    return null;
  }

  function renderSearch() {
    return (
      <View style={styles.ctnRow}>
        <Search
          ctnRootStyle={styles.searchStyle}
          placeholder="Search"
          value={searchText}
          onChangeText={(value) => {
            setSearchText(value);
          }}
        />
        <TouchableWithoutFeedback onPress={onShowHide}>
          <View style={styles.iconSort}>
            <IconSort width="100%" height="100%" />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  function renderModalMore(id) {}

  function renderContent(item, index) {
    return (
      <View style={styles.cardWrap}>
        <CardMyCollection
          item={item}
          quote={item.title}
          author={item.author}
          labelRemove="Stop repeat"
          onPresShare={() => {
            handleShare(item.title);
          }}
          onPresLiked={(status) => {
            handleLike(item.id, status);
          }}
          onPressAddCollection={() => {
            setActiveQuote(item.id);
            setShowModalAddCollection(true);
          }}
          onPressDelete={() => {
            Alert.alert(
              "Are you sure you want to stop repeating this Fact?",
              "",
              [
                {
                  text: "Yes",
                  onPress: () => {
                    handleDelete(item.id);
                  },
                },
                { text: "Cancel", onPress: () => {} },
              ]
            );
          }}
          onPressMore={() => {
            onPressSelect(item.id);
            setTextQuote(item.title);
          }}
          popoverContent={renderModalMore(item.id)}
        />
      </View>
    );
  }

  function renderNoData() {
    if (likeData.listLike?.length === 0 && !likeData.isloading) {
      return (
        <View style={styles.flexOne}>
          <View style={styles.imgStyle}>
            <ImgNoLike width="100%" height="100%" />
          </View>
          <Text style={styles.ctnText}>
            {"You don’t have any\nrepeated Facts yet"}
          </Text>
        </View>
      );
    }
    return null;
  }

  function renderAddCollection() {
    if (showModalAddCollection === true) {
      return (
        <ModalAddCollection
          isVisible={showModalAddCollection}
          onClose={() => {
            setShowModalAddCollection(false);
          }}
          idQuote={activeQuote}
        />
      );
    }
    return null;
  }

  function renderPopuPDelete() {
    if (showDelete === true) {
      return (
        <PopupDelete
          isVisible={showDelete}
          onClose={() => {
            setShowDelete(false);
          }}
          isLoading={isLoading}
          onPress={() => {
            handleDelete(activeQuote);
          }}
        />
      );
    }
    return null;
  }

  function renderModalDislike() {
    if (showModalLike === true) {
      return (
        <Modal
          visible={showModalLike}
          animationType="fade"
          transparent
          contentContainerStyle={{ flex: 1 }}
          onDismiss={() => {
            setShowModalLike(false);
          }}
        >
          <View style={styles.ctnDislike}>
            <View style={styles.ctnBgDislike}>
              <View style={styles.iconDislikeWrap}>
                <IconDislike width="100%" height="100%" />
              </View>
              <Text style={styles.txtDislike}>Disliked</Text>
            </View>
          </View>
        </Modal>
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
          
              <View style={[styles.rowWrap]}>
                <TouchableOpacity onPress={onClose}>
                  <View style={styles.iconWrap}>
                    <IconBack width="100%" height="100%" />
                  </View>
                </TouchableOpacity>
                <View style={{ flex: 1}}>
                  <Text ellipsizeMode="tail" style={styles.ctnTitle}>
                    Deep Learning (Repeated Facts)
                  </Text>
                </View>
              </View>
            <View style={styles.ctnWrap}>
              {renderSearch()}
              <FlatList
                style={{ flex: 1 }}
                contentContainerStyle={styles.ctnScroll}
                showsVerticalScrollIndicator={false}
                data={likeData.listLike}
                renderItem={({ item, index }) => renderContent(item, index)}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={renderNoData()}
                ListFooterComponent={() => {
                  if (
                    likeData.isloading ||
                    likeData.listLike?.length < likeData.total
                  ) {
                    return <LoadingIndicator />;
                  }
                  return null;
                }}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.01}
              />
            </View>
            {renderAddCollection()}
            {renderPopuPDelete()}
            {/* {renderModalDislike()} */}

            {renderSort()}
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

export default connect(states, dispatcher)(RepeatQuotes);
