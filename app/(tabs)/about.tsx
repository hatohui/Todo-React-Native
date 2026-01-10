import { styles } from "@/common/styles";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About Screen</Text>
      <Link href="/" style={styles.button}>
        Go to Home
      </Link>
    </View>
  );
};

export default AboutScreen;
