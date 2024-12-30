import React, {useEffect, useRef, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
  Modal as RNModal,
  Alert,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import Share from 'react-native-share';

import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Clipboard from '@react-native-clipboard/clipboard';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import RNFS from 'react-native-fs';
import SlidingUpPanel from 'rn-sliding-up-panel';
import styles from './styles';
import IconClose from '../../../assets/svg/icon_close.svg';
import Card from '../../../components/card';
import IconMessage from '../../../assets/svg/ic_whatsapp.svg';
import IconStoryIg from '../../../assets/svg/icon_story_ig.svg';
import IconIg from '../../../assets/svg/icon_ig.svg';
import IconStoryFb from '../../../assets/svg/icon_story_fb.svg';
import IconFb from '../../../assets/svg/icon_fb.svg';
import IconCollection from '../../../assets/svg/icon_add_collection.svg';
import IconCollectionYellow from '../../../assets/svg/icon_add_collection_yellow.svg';
import IconSave from '../../../assets/svg/icon_save.svg';
import IconCopy from '../../../assets/svg/icon_copy.svg';
import IconDislike from '../../../assets/svg/icon_dislike.svg';
import IconDislikeYellow from '../../../assets/svg/icon_dislike_yellow.svg';
import IconMore from '../../../assets/svg/icon_more.svg';
import IconDislikeColor from '../../../assets/svg/icon_dislike_color_red.svg';
import IconChecklistColor from '../../../assets/svg/icon_checklist_color_tosca.svg';
import ModalCollection from '../modal-collection';
import states from './states';
import ModalAddCollection from '../modal-add-collection';
import {
  handleBasicPaywall,
  handlePayment,
  isUserPremium,
} from '../../../helpers/user';
import {eventTracking, QUOTE_SHARED} from '../../../helpers/eventTracking';
import {downloadText} from '../../../shared/static';
import LineGestureSlide from '../../../components/line-gesture-slide';
import {sizing} from '../../../shared/styling';
import {isIphone} from '../../../shared/devices';
import { dislikeQuotes } from '../../../shared/request';

function ModalShare(props) {
  const {
    contentRef,
    onClose,
    captureUri,
    idQuote,
    quoteText,
    collections,
    onPremium,
  } = props;
  const [showModalDislike, setShowModalDislike] = useState(false);
  const [showModalSave, setShowModalSave] = useState(false);
  const [showModalCopy, setShowModalCopy] = useState(false);
  const [showModalCollection, setShowModalCollection] = useState(false);
  const [showModalAddCollection, setShowModalAddCollection] = useState(false);
  const [labelDislike, setLabelDislike] = useState('Dislike')
  const [labelAdd, setLabelAdd] = useState('Add to collection')
  const [idLike, setIdLike] = useState([])
  const [idAdd, setIdAdd] = useState([])
  const base64CaptureImage = useRef(null);

  useEffect(() => {
    if (captureUri) {
      RNFS.readFile(captureUri, 'base64').then(res => {
        const base64File = `data:image/png;base64,${res}`;
        base64CaptureImage.current = base64File;
      });
    }
  }, [captureUri]);

  const handleShareStorage = async submitObj => {
    const stringStorage = JSON.stringify(submitObj);
    await AsyncStorage.setItem('freeShareDaily', stringStorage);
  };

  const eventShare = () => {
    eventTracking(QUOTE_SHARED);
  };

  const handleShowFreePremiumDaily = async () => {
    if (!isUserPremium()) {
      const premiumStatus = await AsyncStorage.getItem('freeShareDaily');
      if (premiumStatus) {
        const objStatus = JSON.parse(premiumStatus);
        if (objStatus.activeStatus === 3) {
          await handlePayment('one_month_free');
          if (typeof onPremium === 'function') onPremium();
          onClose();
          const submitObj = {
            activeDate: moment().format('YYYY-MM-DD'),
            activeStatus: 1,
          };
          handleShareStorage(submitObj);
        } else {
          const submitObj = {
            activeDate: moment().format('YYYY-MM-DD'),
            activeStatus: objStatus.activeStatus + 1,
          };
          handleShareStorage(submitObj);
        }
      } else {
        const submitObj = {
          activeDate: moment().format('YYYY-MM-DD'),
          activeStatus: 2,
        };
        handleShareStorage(submitObj);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const contains = idLike.includes(idQuote);

      if(contains){
        const filteredArray = idLike.filter(item => item !== idQuote);
        setIdLike(filteredArray)
        const payload = {
          type: '1',
        };
        await dislikeQuotes(payload, idQuote);
      }else{
        setShowModalDislike(true);
        setIdLike(idLike.concat(idQuote))
       // console.log(idLike)
        const payload = {
          type: '2',
        };
        await dislikeQuotes(payload, idQuote);
       
        setTimeout(() => {
          setShowModalDislike(false);
        }, 1000);
      }
     
    } catch (err) {
     // console.log('Error dislike:', err);
    }
  };

  const shareOptions = {
    url: base64CaptureImage.current,
    message: downloadText,
    // message: downloadText,
    social: Share.Social.WHATSAPP,
    filename: 'Shared-McSmart-Fact' , 
    title: 'Shared-McSmart-Fact' , 
  }
  const handleWAShare = async () => {
    Share.shareSingle(shareOptions);
    handleShowFreePremiumDaily();
    eventShare();
  };

  const handleIGStoryShare = async () => {
    try {
      const contentURL = isIphone ? base64CaptureImage.current : captureUri;
      await Share.shareSingle({
        backgroundImage: contentURL, // url or an base64 string
        social: Share.Social.INSTAGRAM_STORIES,
        appId: '637815961525510', // facebook appId
      });
      handleShowFreePremiumDaily();
      eventShare();
    } catch (err) {
      //console.log('Error share ig story:', err);
    }
  };

  const handleShareInstagramDefault = async () => {
    try {
      handleShowFreePremiumDaily();
      const contentURL = isIphone ? base64CaptureImage.current : captureUri;
      await Share.shareSingle({
        title: 'Share image to instagram',
        type: 'image/jpeg',
        url: contentURL,
        social: Share.Social.INSTAGRAM,
      });
    } catch (err) {
     // console.log('Err share default ig:', err);
    }
  };

  const handleSharetoFBStory = async () => {
    try {
      const contentURL = isIphone ? base64CaptureImage.current : captureUri;
      handleShowFreePremiumDaily();
      await Share.shareSingle({
        backgroundImage: contentURL,
        appId: '637815961525510', // facebook appId
        social: Share.Social.FACEBOOK_STORIES,
      });
      eventShare();
    } catch (err) {
     // console.log('Error post to story:', err);
    }
  };

  const handleShareFBDefault = async () => {
    try {
      handleShowFreePremiumDaily();
      const contentURL = isIphone ? base64CaptureImage.current : captureUri;
      await Share.shareSingle({
        url: contentURL,
        appId: '637815961525510', // facebook appId
        backgroundBottomColor: '#fff',
        backgroundTopColor: '#fff',
        type: 'image/*',
        social: Share.Social.FACEBOOK,
      });
      eventShare();
    } catch (err) {
      //console.log('Err fb default:', err);
    }
  };

  // console.log('Check captureUri:', captureUri);

  const moreShare = async () => {
    await Share.open({
      url: captureUri,
      message: downloadText,
    });
    eventShare();
  };

  const handleCopyText = () => {
    if (quoteText) {
      Clipboard.setString(`“${quoteText}”\n\n${downloadText}\n`);
    }
  };

  const copyToClipboard = () => {
    setShowModalCopy(true);
    handleCopyText();
    setTimeout(() => {
      setShowModalCopy(false);
    }, 1000);
  };
  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const handleSaveImage = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version?.toString() < 30) {
        AsyncStorage.setItem('interstial', 'yes');
        if (await hasAndroidPermission()) {
          await CameraRoll.save(captureUri);
          setShowModalSave(true);
          setTimeout(() => {
            AsyncStorage.removeItem('interstial');
            setShowModalSave(false);
          }, 1000);
        } else {
          return;
        }
      } else {
        await CameraRoll.save(captureUri);
        setShowModalSave(true);
        setTimeout(() => {
          setShowModalSave(false);
        }, 1000);
      }
    } catch (err) {
      //console.log('Err save:', err);
    }
  };

  function renderIconClose() {
    return (
      <View style={styles.btnStyle}>
        <TouchableOpacity onPress={onClose}>
          <View style={styles.btnClose}>
            <IconClose width="100%" height="100%" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  function renderCard() {
    return (
      <View style={[styles.rowCard, styles.ctnBgDark]}>
        <Card
          label="WhatsApp"
          icon={<IconMessage width="100%" height="100%" />}
          onPress={handleWAShare}
        />
        <Card
          label="Instagram Stories"
          icon={<IconStoryIg width="100%" height="100%" />}
          onPress={() => {
            Alert.alert('Don’t forget to tag us!\n@mcsmart_app', '', [
              {text: 'OK', onPress: handleIGStoryShare},
            ]);
          }}
        />
        <Card
          label="Instagram"
          icon={<IconIg width="100%" height="100%" />}
          onPress={() => {
            handleCopyText();
            Alert.alert(
              'Copied to your pasteboard',
              'Text and hastags ready to be pasted in\nyour caption.\n\nDon’t forget to tag us!\n@mcsmart_app',
              [{text: 'OK', onPress: handleShareInstagramDefault}],
            );
          }}
        />
        <Card
          label="Facebook Stories"
          icon={<IconStoryFb width="100%" height="100%" />}
          onPress={() => {
            Alert.alert('“McSmart”\nWould Like to open “Facebook”', '', [
              {text: 'Cancel', onPress: () => {}},
              {text: 'OK', onPress: handleSharetoFBStory},
            ]);
          }}
        />
        <Card
          label="Facebook"
          icon={<IconFb width="100%" height="100%" />}
          onPress={() => {
            Alert.alert('“McSmart”\nWould Like to open “Facebook”', '', [
              {text: 'Cancel', onPress: () => {}},
              {text: 'OK', onPress: handleShareFBDefault},
            ]);
          }}
        />
      </View>
    );
  }

  function renderOnPressCollection() {
    if (collections?.length > 0) {
      setShowModalAddCollection(true);
    } else {
      setShowModalCollection(true);
    }
  }

  function renderFooter() {
    return (
      <View style={styles.rowCard}>
        <Card
          label={idAdd.includes(idQuote) ? 'Added to collection' : labelAdd}
          icon={idAdd.includes(idQuote)   ? <IconCollectionYellow width="100%" height="100%" /> : <IconCollection width="100%" height="100%" />}
          onPress={() => {
            renderOnPressCollection();
          }}
        />
        <Card
          label="Save image"
          icon={<IconSave width="100%" height="100%" />}
          onPress={handleSaveImage}
        />
        <Card
          label="Copy text"
          icon={<IconCopy width="100%" height="100%" />}
          onPress={copyToClipboard}
        />
        <Card
          label={idLike.includes(idQuote) ? 'Disliked' : labelDislike}
          icon={idLike.includes(idQuote) ? <IconDislikeYellow width="100%" height="100%" /> : <IconDislike width="100%" height="100%" />}
          onPress={() => {
            handleSubmit();
          }}
        />
        <Card
          label="More"
          icon={<IconMore width="100%" height="100%" />}
          onPress={moreShare}
        />
      </View>
    );
  }

  function renderModalDislike() {
    if (showModalDislike === true) {
      return (
        <RNModal
          visible={showModalDislike}
          animationType="fade"
          transparent
          onDismiss={() => {
            setShowModalDislike(false);
          }}>
          <View style={styles.ctnDislike}>
            <View style={styles.ctnBgDislike}>
              <View style={styles.iconDislikeWrap}>
                <IconDislikeColor width="100%" height="100%" />
              </View>
              <Text style={styles.txtDislike}>Disliked</Text>
            </View>
          </View>
        </RNModal>
      );
    }
    return null;
  }

  function renderModalSave() {
    if (showModalSave === true) {
      return (
        <RNModal
          visible={showModalSave}
          animationType="fade"
          transparent
          onDismiss={() => {
            setShowModalSave(false);
          }}>
          <View style={styles.ctnDislike}>
            <View style={styles.ctnBgDislike}>
              <View style={styles.iconDislikeWrap}>
                <IconChecklistColor width="100%" height="100%" />
              </View>
              <Text style={styles.txtDislike}>Image Saved</Text>
            </View>
          </View>
        </RNModal>
      );
    }
    return null;
  }

  function renderModalCopy() {
    if (showModalCopy === true) {
      return (
        <RNModal
          visible={showModalCopy}
          animationType="fade"
          transparent
          onDismiss={() => {
            setShowModalCopy(false);
          }}>
          <View style={styles.ctnDislike}>
            <View style={styles.ctnBgDislike}>
              <View style={styles.iconDislikeWrap}>
                <IconChecklistColor width="100%" height="100%" />
              </View>
              <Text style={styles.txtDislike}>Text copied</Text>
            </View>
          </View>
        </RNModal>
      );
    }
    return null;
  }

  return (
    <SlidingUpPanel
      ref={contentRef}
      animatedValue={new Animated.Value(0)}
      height={sizing.getDimensionHeight(1)}
      snappingPoints={[0, 0]}
      draggableRange={{
        top: sizing.getDimensionHeight(1),
        bottom: 0,
      }}>
      {dragHandler => (
        <View style={styles.ctnRoot}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.ctnClose} />
          </TouchableWithoutFeedback>
          <View style={styles.ctnContent}>
            <LineGestureSlide />
            {renderCard()}
            <View style={styles.ctnFooter}>{renderFooter()}</View>
            {renderIconClose()}
          </View>
          {renderModalDislike()}
          {renderModalSave()}
          {renderModalCopy()}

          <ModalAddCollection
            showAddNew
            isVisible={showModalAddCollection}
            onClose={() => {
              setShowModalAddCollection(false);
            }}
            idQuote={idQuote}
            update={(value) =>  {
              setIdAdd(idAdd.concat(idQuote))
            }
            }
          />

          <ModalCollection
            isVisible={showModalCollection}
            onClose={() => {
              setShowModalCollection(false);
            }}
            onFinish={() => {
              setShowModalCollection(false);
              setTimeout(() => {
                setShowModalAddCollection(true);
              }, 1000);
            }}
          />
        </View>
      )}
    </SlidingUpPanel>
  );
}

ModalShare.propTypes = {
  collections: PropTypes.array,
};

ModalShare.defaultProps = {
  collections: [],
};

export default connect(states)(ModalShare);
