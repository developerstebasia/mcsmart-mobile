import React, { useEffect } from "react";
import { Image, Platform, Text, View } from "react-native";
import { connect } from "react-redux";
import { navigate } from "../../shared/navigationRef";
import styles from "./styles";
import states from "./states";
import Button from "../../components/button";
import { askTrackingPermission } from "../../helpers/eventTracking";
import { handlePayment } from "../../helpers/user";

const bgImage = require("../../assets/images/welcome_banner.png");

function WelcomePage() {
  useEffect(async () => {
    if (Platform.OS === "ios") {
      await askTrackingPermission()
    }
  }, []);
  return (
    <View style={styles.ctnRoot}>
      <View style={styles.ctnIcon}>
        <View style={styles.ctnLogoIcon}>
          <Image source={bgImage} style={styles.imgBanner} />
        </View>
        <View style={styles.ctnText}>
          <Text style={styles.txtTitle}>
            {"Daily knowledge to\nmake you smarter"}
          </Text>
        </View>
      </View>
      <View style={styles.btnWrapper}>
      
        <Button
          type="white-button"
          label="Get started"
          onPress={() => {
            navigate("Register");
            // handlePayment('onboarding');
          }}
        />
      </View>
    </View>
  );
}

export default connect(states)(WelcomePage);
