import React, {createRef, useState} from 'react';
import {
  Animated,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import SlidingUpPanel from 'rn-sliding-up-panel';

import {Modal, Portal} from 'react-native-paper';

// import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import styles from './styles';
import ModalChangeIcon from '../../setting/change-icon';
import IconClose from '../../../assets/svg/icon_close.svg';
import ListContent from '../../../components/list-content';
import IconStart from '../../../assets/svg/icon_start.svg';
import IconUser from '../../../assets/svg/icon_user.svg';
import IconBell from '../../../assets/svg/icon_bell.svg';
import IconChangeAppIcon from '../../../assets/svg/change_icon.svg';
import PremiumRocket from '../../../assets/svg/RocketPremiumBlack.svg';
import IconBookMark from '../../../assets/svg/icon_bookmark_collection.svg';
import IconHourglass from '../../../assets/svg/icon_hourglass.svg';
import IconLoveBlack from '../../../assets/svg/love_black.svg';
import IconFbBlack from '../../../assets/svg/icon_fb_black.svg';
import IconIgBlack from '../../../assets/svg/icon_ig_outline_black.svg';
import RepeatIcon from '../../../assets/svg/lightbulb_black.svg';

import Subscription from '../../setting/content-subscription';
import Reminder from '../../setting/reminder';
import states from './states';
import ModalCollection from '../modal-collection';
import QuoteCollections from '../../your-quotes/collection';
import PastQuotes from '../../your-quotes/past-quotes';
import LikeQuotes from '../../your-quotes/liked-quotes';
import AccountPreference from '../../setting/account-preference';
import {
  handleBasicPaywallPress,
  isUserPremium,
  openPrivacyPolicy,
  openTermsofUse,
} from '../../../helpers/user';
import {sizing} from '../../../shared/styling';
import LineGestureSlide from '../../../components/line-gesture-slide';
import {showModalPremium} from '../../../shared/globalContent';
import RepeatQuotes from '../../your-quotes/repeat-quotes';
import {getAdaptiveBannerID} from '../../../shared/static/adsId';

const bannerIcon1 = require('../../../assets/icons/app_icon_1.png');

function ModalSetting({contentRef, onClose, collections}) {
  const [showModalSubscribe, setShowModalSubscribe] = useState(false);
  const [showModalAccount, setShowModalAccount] = useState(false);
  const [showModalReminder, setShowModalReminder] = useState(false);
  const [showModalCollection, setShowModalCollection] = useState(false);
  const [showModalQuotes, setShowModalQuotes] = useState(false);
  const [showModalLiked, setShowModalLiked] = useState(false);
  const [showModalNoCollection, setShowModalNoCollection] = useState(false);
  const [showChangeIcon, setShowChangeIcon] = useState(false);
  const [showModalChanged, setShowModalChanged] = useState(false);
  const [showReepatFact, setModalRepeatFact] = useState(false);

  const renderCollection = () => {
    if (collections.length > 0) {
      setShowModalCollection(true);
    } else {
      setShowModalNoCollection(true);
    }
    // setShowModalNoCollection(true);
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

  const checkIfFacebookAppIsInstalled = async () => {
    const isAppInstalled = await Linking.canOpenURL('fb://');
    if (isAppInstalled) {
      // Aplikasi Facebook terinstal, buka aplikasi
      Linking.openURL('fb://profile/111060891984207');
    }else{
      Linking.openURL('https://www.facebook.com/McSmartApp')
    }
  };

  function renderSubscription() {
    if (isUserPremium()) {
      return (
        <ListContent
          title="Manage subscription"
          icon={<IconStart width="100%" height="100%" />}
          onPress={() => {
            setShowModalSubscribe(true);
          }}
        />
      );
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

  function renderSetting() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.listCardWrap}>
          {/* {renderSubscription()} */}
          <ListContent
            title="Account & preferences"
            icon={<IconUser width="100%" height="100%" />}
            onPress={() => {
              setShowModalAccount(true);
            }}
          />
          <ListContent
            title="Edit reminders"
            icon={<IconBell width="100%" height="100%" />}
            onPress={() => {
              setShowModalReminder(true);
            }}
          />
          {Platform.OS === 'ios' && (
            <ListContent
              title="Change App Icon"
              icon={<IconChangeAppIcon width="100%" height="100%" />}
              onPress={() => {
                setShowChangeIcon(true);
              }}
            />
          )}
          {/* {Platform.OS === 'ios' && (
            <ListContent
              title="Home Screen Widgets"
              icon={<WidgetIcon width="90%" height="90%" />}
              onPress={() => {
                setModalHomeWidget(true);
              }}
            />
          )}
          {Platform.OS === 'ios' && (
            <ListContent
              title="Lock Screen Widgets"
              icon={<WidgetLockScreenIcon width="90%" height="90%" />}
              onPress={() => {
                setModalLockScreenWidget(true);
              }}
            />
          )} */}
        </View>
        <View style={styles.separator} />
      </View>
    );
  }

  function renderQuote() {
    return (
      <View style={styles.wrapper}>
        <View style={[styles.titleWrap, styles.mg20]}>
          <Text style={styles.ctnTittle}>Your Facts</Text>
        </View>
        <View style={styles.listCardWrap}>
          <ListContent
            title="Collections"
            icon={<IconBookMark width="100%" height="100%" />}
            onPress={() => {
              renderCollection();
            }}
          />
          <ListContent
            title="Past Facts"
            icon={<IconHourglass width="100%" height="100%" />}
            onPress={() => {
              setShowModalQuotes(true);
            }}
          />
          <ListContent
            title="Liked Facts"
            icon={<IconLoveBlack width="100%" height="100%" />}
            onPress={() => {
              // refLikedQuotes.current.show();
              setShowModalLiked(true);
            }}
          />
          <ListContent
            title="Deep Learning (Repeated Facts)"
            icon={<RepeatIcon width="100%" height="100%" />}
            onPress={() => {
              // refLikedQuotes.current.show();
              setModalRepeatFact(true);
            }}
          />
        </View>
        <View style={styles.separator} />
      </View>
    );
  }

  function renderFollow() {
    return (
      <View style={styles.wrapper}>
        <View style={[styles.titleWrap, styles.mg20]}>
          <Text style={styles.ctnTittle}>Follow us</Text>
        </View>
        <View style={styles.listCardWrap}>
          <ListContent
            title="Instagram"
            icon={<IconIgBlack width="100%" height="100%" />}
            onPress={() => {
              Linking.openURL('https://www.instagram.com/mcsmart_app');
            }}
          />
          <ListContent
            title="Facebook"
            icon={<IconFbBlack width="100%" height="100%" />}
            onPress={() => {
              checkIfFacebookAppIsInstalled()
            }}
          />
          <View style={styles.ctnFooter}>
            {/* <ListContent title="Imprint" styleList={styles.styleList} /> */}
            <ListContent
              title="Privacy Policy"
              styleList={styles.styleList}
              onPress={openPrivacyPolicy}
            />
            <ListContent
              title="Terms & Conditions"
              styleList={styles.styleList}
              onPress={openTermsofUse}
            />
          </View>
        </View>
      </View>
    );
  }

  function renderContent() {
    return (
      <View style={styles.wrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          contentContainerStyle={[
            styles.ctnScroll,
            !isUserPremium() && styles.ctnScrollFreeUser,
          ]}>
          <View style={styles.titleWrap}>
            <Text style={styles.ctnTittle}>Settings</Text>
          </View>
          {renderSetting()}
          {renderQuote()}
          {renderFollow()}
        </ScrollView>

        {!isUserPremium() && (
          <View style={styles.ctnBanner}>
            <BannerAd
              unitId={getAdaptiveBannerID()}
              size={BannerAdSize.BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
        )}
      </View>
    );
  }

  function renderModalSubscription() {
    if (showModalSubscribe === true) {
      return (
        <Subscription
          isVisible={showModalSubscribe}
          onClose={() => {
            setShowModalSubscribe(false);
          }}
        />
      );
    }
    return null;
  }

  function renderModalAccount() {
    if (showModalAccount === true) {
      return (
        <AccountPreference
          isVisible={showModalAccount}
          onClose={() => {
            setShowModalAccount(false);
          }}
        />
      );
    }
    return null;
  }

  function renderModalReminder() {
    if (showModalReminder === true) {
      return (
        <Reminder
          isVisible={showModalReminder}
          onClose={() => {
            setShowModalReminder(false);
          }}
        />
      );
    }
    return null;
  }

  function renderModalCollection() {
    if (showModalCollection === true) {
      return (
        <QuoteCollections
          isVisible={showModalCollection}
          onClose={() => {
            setShowModalCollection(false);
          }}
        />
      );
    }
    return null;
  }

  function renderModalNoCollection() {
    if (showModalNoCollection === true) {
      return (
        <ModalCollection
          isVisible={showModalNoCollection}
          onClose={() => {
            setShowModalNoCollection(false);
          }}
          onFinish={() => {
            setShowModalNoCollection(false);
            setTimeout(() => {
              setShowModalCollection(true);
            }, 200);
          }}
        />
      );
    }
    return null;
  }

  function renderModalPastQuotes() {
    if (showModalQuotes === true) {
      return (
        <PastQuotes
          isVisible={showModalQuotes}
          onClose={() => {
            setShowModalQuotes(false);
          }}
        />
      );
    }
    return null;
  }

  function renderModalIconChanged() {
    if (showModalChanged === true) {
      return (
        <Modal
          visible={showModalChanged}
          animationType="fade"
          transparent
          onDismiss={() => {
            setShowModalChanged(false);
          }}>
          <View style={styles.ctnChanged}>
            <View style={styles.ctnBgChanged}>
              <View style={styles.rowChanged}>
                <Image source={bannerIcon1} style={styles.iconChangedWrap} />
                <Text style={styles.txtChanged}>
                  You have changed the {'\n'} icon for McSmart
                </Text>
              </View>
              <TouchableOpacity
                style={styles.btnWrap}
                onPress={() => {
                  setShowModalChanged(false);
                }}>
                <Text style={styles.btnOke}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
    return null;
  }

  function renderChangeIcon() {
    if (showChangeIcon === true) {
      return (
        <ModalChangeIcon
          visible={showChangeIcon}
          onClose={() => {
            setShowChangeIcon(false);
          }}
          selectModal={() => {
            setShowModalChanged(true);
          }}
        />
      );
    }
    return null;
  }

  function renderRepeat() {
    if (showReepatFact) {
      return (
        <RepeatQuotes
          isVisible={showReepatFact}
          onClose={() => {
            setModalRepeatFact(false);
          }}
        />
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
            <LineGestureSlide dragHandler={dragHandler} />
            {renderContent()}
            {renderIconClose()}
            {renderModalSubscription()}
            {renderModalAccount()}
            {renderModalReminder()}
            {renderModalCollection()}
            {renderModalNoCollection()}
            {renderModalPastQuotes()}

            {renderChangeIcon()}
            {renderModalIconChanged()}
            {renderRepeat()}
            <LikeQuotes
              isVisible={showModalLiked}
              onClose={() => {
                setShowModalLiked(false);
              }}
            />
          </View>
        </View>
      )}
    </SlidingUpPanel>
  );
}

ModalSetting.propTypes = {
  collections: PropTypes.array.isRequired,
};

export default connect(states)(ModalSetting);
