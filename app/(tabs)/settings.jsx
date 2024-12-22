import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Theme from "../../constants/Theme";
import MenuCard from "../../components/MenuCard";

const { Colors, Typography } = Theme;

const settings = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Settings</Text>

      <View style={styles.content}>
        <MenuCard
          title={"Fish Type"}
          secondaryText={"search, create, edit, and delete fish types"}
          iconName={"fish-outline"}
          href={"/fish-type"}
        />
        <MenuCard
          title={"Information"}
          secondaryText={"information about current device and app framework"}
          iconName={"phone-portrait-outline"}
          href={"/device-information"}
        />
      </View>
    </SafeAreaView>
  );
};

export default settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.background,

    padding: 20,
  },
  titleText: {
    fontSize: Typography.fontSizes.title,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.text,
    letterSpacing: 4,
  },
  content: {
    marginTop: 40,
    flex: 1,
    flexDirection: "column",
  },
});
