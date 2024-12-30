import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, Text, View} from 'react-native';
import {createAnimatableComponent} from 'react-native-animatable';
import Lottie from 'lottie-react-native';
import Input from '../../../components/input';
import styles from './styles';

const AnimatableView = createAnimatableComponent(View);

const nameMascot = require('../../../assets/lottie/name_mascot.json');
const circular = require('../../../assets/images/burst_name.gif');

export default function ContentStep1(props) {
  const {substep, keyboardShow} = props;
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    if (substep === 'b' && showName === false) {
      setTimeout(() => {
        setShowName(true);
      }, 1500);
    }
  }, [substep]);

  function renderInput() {
    return (
      <View style={styles.inputWrapper}>
        <View style={styles.ctnText}>
          <Text style={styles.txtInput}>What is your name?</Text>

          <View style={styles.ctnDesc}>
            <Text style={styles.txtDescTitle}>
              {
                'Using your real name creates \na better experience with McSmart.'
              }
            </Text>
          </View>
        </View>
        <Input autoFocus keepFocus placeholder="Your name" {...props} />
      </View>
    );
  }

  if (substep === 'b') {
    return (
      <View style={[styles.ctnRoot]}>
        <View style={styles.ctnImg}>
          <Lottie
            source={nameMascot}
            style={styles.animationStyle}
            autoPlay
            duration={1500}
            loop={false}
          />
        </View>
        {showName && (
          <ImageBackground source={circular} style={styles.ctnCircular}>
            <AnimatableView delay={0} animation="bounceIn" duration={900}>
              <Text style={styles.txtSuccessTitle}>
                {props.value ? `Hey ${props.value}!` : 'Hey!'}
              </Text>
              <Text style={[styles.txtDescTitle, styles.welcomeText]}>
                Welcome to McSmart!
              </Text>
            </AnimatableView>
          </ImageBackground>
        )}
      </View>
    );
  }

  return (
    <View style={styles.ctnRoot}>
      {/* {renderBanner()} */}
      {renderInput()}
    </View>
  );
}
