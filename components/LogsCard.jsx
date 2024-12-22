import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Theme from "../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import capitalize from "../utils/capitalize";

const { Colors, Typography, Shadows } = Theme;

const LogsCard = ({ logId, fishName, status, datetime }) => {
  const getBadge = (status) => {
    const formattedStatus = status.toLowerCase();
    switch (formattedStatus) {
      case "done":
        return { icon: "checkmark-circle-outline", backgroundColor: "#4ade80" };

      case "processing":
        return { icon: "timer-outline", backgroundColor: "#38bdf8" };

      case "force stopped":
        return { icon: "close-circle-outline", backgroundColor: "#f87171" };

      default:
        return { icon: "close-circle-outline", backgroundColor: "#f87171" };
    }
  };

  const toLogDetails = (log_id) => {
    router.push(`/cleaning-logs/${log_id}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.fishTypeText}>{fishName}</Text>
        <Text style={styles.text}>{datetime}</Text>
      </View>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.badge,
            { backgroundColor: getBadge(status).backgroundColor },
          ]}
        >
          <Ionicons
            name={getBadge(status).icon}
            size={20}
            color={Colors.background}
          />
          <Text style={styles.badgeText}>{capitalize(status)}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.btnCircle}
        onPress={() => toLogDetails(logId)}
      >
        <Ionicons
          name="chevron-forward-outline"
          size={28}
          color={Colors.background}
        />
      </TouchableOpacity>
    </View>
  );
};

export default LogsCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginVertical: 10,
    overflow: "hidden",

    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderRadius: 10,
    backgroundColor: Colors.card,

    ...Shadows.small,
  },
  badge: {
    margin: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  badgeText: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.background,
  },
  fishTypeText: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.large,
    fontWeight: Typography.fontWeights.bold,
    letterSpacing: 2,
  },
  text: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.medium,
    fontWeight: Typography.fontWeights.regular,
  },
  content: {
    flexDirection: "column",
    gap: 5,
    padding: 20,
  },
  statusContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnCircle: {
    height: "100%",
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
});
