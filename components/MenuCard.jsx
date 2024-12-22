import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Theme from "../constants/Theme";
import { router } from "expo-router";

const { Colors, Typography, Shadows } = Theme;

const MenuCard = ({ title, secondaryText, iconName, href }) => {
  const toRoute = (route) => {
    router.push(route);
  };
  return (
    <TouchableOpacity style={styles.card} onPress={() => toRoute(href)}>
      <Ionicons name={iconName} color={Colors.background} size={40} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitleText}>{title}</Text>
        <Text style={styles.cardSecondaryText}>{secondaryText}</Text>
      </View>
      <TouchableOpacity onPress={() => toRoute(href)}>
        <Ionicons name="chevron-forward" color={Colors.background} size={30} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default MenuCard;

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,

    backgroundColor: Colors.primary,
    borderRadius: 15,

    ...Shadows.small,
  },
  cardContent: {
    paddingHorizontal: 20,
    flex: 1,
  },
  cardTitleText: {
    color: Colors.background,
    fontSize: Typography.fontSizes.large,
    fontWeight: Typography.fontWeights.bold,
  },
  cardSecondaryText: {
    color: Colors.background,
    fontSize: Typography.fontSizes.medium,
  },
});
