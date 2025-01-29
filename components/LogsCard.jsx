import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Theme from "../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import capitalize from "../utils/capitalize";
import formatDate from "../utils/formatDate";

const { Colors, Typography, Shadows } = Theme;

const LogsCard = ({ logId, fishName, status, datetime, isRead }) => {
  const getBadge = (status) => {
    const formattedStatus = status.toLowerCase();
    switch (formattedStatus) {
      case "finished":
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
      {!isRead && <View style={styles.unreadLog}></View>}
      <View style={styles.content}>
        <Text
          style={styles.fishTypeText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {fishName}
        </Text>
        <Text style={styles.text}>{formatDate(datetime)}</Text>
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
    marginVertical: 10,
    overflow: "hidden",

    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,

    borderRadius: 10,
    backgroundColor: Colors.card,

    ...Shadows.small,
    position: "relative",
  },
  badge: {
    flex: 0.2,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  badgeText: {
    fontSize: Typography.fontSizes.small,
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
    flex: 1,
    flexDirection: "column",
    gap: 5,
    padding: 20,
  },
  statusContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  btnCircle: {
    flex: 0.4,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  unreadLog: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.error,
  },
});
