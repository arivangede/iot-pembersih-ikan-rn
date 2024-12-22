import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Theme from "../../constants/Theme";
import { Ionicons } from "@expo/vector-icons";

const { Colors, Shadows, Typography } = Theme;

const ErrorModal = () => {
  return (
    <Modal transparent statusBarTranslucent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Error Device Info</Text>
            <Ionicons
              name="alert-circle-sharp"
              size={30}
              color={Colors.error}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              This app must get your device info for analitics purpose,
            </Text>
            <Text
              style={[
                styles.text,
                {
                  fontWeight: Typography.fontWeights.bold,
                  textAlign: "center",
                },
              ]}
            >
              please check your internet and reopen the app
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ErrorModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
    backgroundColor: "#0004",
  },
  modal: {
    width: "100%",
    padding: 20,
    backgroundColor: Colors.background,

    borderRadius: 20,
  },
  titleContainer: {
    padding: 5,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    color: Colors.error,
    fontSize: Typography.fontSizes.title,
    fontWeight: Typography.fontWeights.bold,
  },
  textContainer: {
    paddingHorizontal: 5,
    gap: 10,
  },
  text: {
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeights.regular,
  },
  btn: {
    marginTop: 30,
    width: "100%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  btnText: {
    color: Colors.background,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.medium,
  },
});
