import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Theme from "../constants/Theme";

const { Colors, Typography } = Theme;

const Header = ({
  title = "Header",
  showDateData = false,
  subtitle = null,
}) => {
  const handleBack = () => {
    router.back();
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleBack()}>
        <Ionicons name="chevron-back" size={30} color={Colors.text} />
      </TouchableOpacity>
      <View>
        <Text style={styles.titleText}>{title}</Text>
        {showDateData && (
          <Text style={styles.dateText}>{new Date().toDateString()}</Text>
        )}
        {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  titleText: {
    color: Colors.text,
    fontSize: Typography.fontSizes.title,
    fontWeight: Typography.fontWeights.bold,
  },
  subtitleText: {
    paddingLeft: 0,
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.small,
    fontWeight: Typography.fontWeights.bold,
  },
  dateText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.small,
  },
});
