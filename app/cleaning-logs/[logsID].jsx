import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Theme from "../../constants/Theme";
import Header from "../../components/Header";

const { Colors, Typography } = Theme;

const LogDetails = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Cleaning Log" showDateData={true} />
    </SafeAreaView>
  );
};

export default LogDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  titleText: {
    color: Colors.text,
    fontSize: Typography.fontSizes.title,
    letterSpacing: 4,
  },
});
