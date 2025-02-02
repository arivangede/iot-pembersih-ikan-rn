import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Theme from "../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import speedName from "../utils/speedName";

const { Colors, Typography, Shadows } = Theme;

const FishCard = ({
  fish_id,
  fish_name,
  cleaning_speed,
  cleaning_duration,
}) => {
  const speed_name = speedName(cleaning_speed);

  const to_details = () => {
    router.push(`/fish-type/details/${fish_id}`);
  };
  return (
    <TouchableOpacity style={styles.card} onPress={() => to_details()}>
      <View style={{ width: "70%" }}>
        <Text style={styles.title_text} numberOfLines={2}>
          {fish_name}
        </Text>
        <Text style={styles.text}>
          <Text
            style={[styles.text, { fontWeight: Typography.fontWeights.light }]}
          >
            Cleaning Speed:
          </Text>{" "}
          {speed_name}
        </Text>
        <Text style={styles.text}>
          <Text
            style={[styles.text, { fontWeight: Typography.fontWeights.light }]}
          >
            Cleaning Duration:
          </Text>{" "}
          {cleaning_duration} minute/s
        </Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => to_details()}>
        <Ionicons name="chevron-forward" color={Colors.background} size={30} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default FishCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 20,
    backgroundColor: Colors.accent,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxHeight: 100, // tambahkan properti maxHeight
    ...Shadows.medium,
  },
  title_text: {
    color: Colors.background,
    fontSize: Typography.fontSizes.large,
    fontWeight: Typography.fontWeights.bold,
  },
  text: {
    color: Colors.background,
    fontWeight: Typography.fontWeights.bold,
  },
});
