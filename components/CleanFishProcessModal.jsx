import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Theme from "../constants/Theme";
import speedName from "../utils/speedName";

const { Colors, Typography, Shadows } = Theme;

const CleanFishProcessModal = ({ fishData, handleClose }) => {
  const speed_name = speedName(fishData.cleaning_speed);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartProcess = () => {
    setIsProcessing(true);
  };

  const handleForceStop = () => {
    setIsProcessing(false);
  };

  return (
    <Modal transparent statusBarTranslucent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          {!isProcessing ? (
            <>
              <Text style={styles.modalTitle}>Details:</Text>
              <View style={styles.fishDetaisContainer}>
                <Text
                  style={[
                    styles.text,
                    {
                      fontWeight: Typography.fontWeights.bold,
                      fontSize: Typography.fontSizes.larger,
                    },
                  ]}
                >
                  {fishData.name}
                </Text>
                <Text style={styles.text}>
                  Cleaning Speed:{" "}
                  <Text
                    style={[
                      styles.text,
                      {
                        fontWeight: Typography.fontWeights.bold,
                        fontSize: Typography.fontSizes.medium,
                      },
                    ]}
                  >
                    {speed_name} ({fishData.cleaning_speed}rpm)
                  </Text>
                </Text>
                <Text style={styles.text}>
                  Cleaning Duration:{" "}
                  <Text
                    style={[
                      styles.text,
                      {
                        fontWeight: Typography.fontWeights.bold,
                        fontSize: Typography.fontSizes.medium,
                      },
                    ]}
                  >
                    {fishData.cleaning_duration} minute/s
                  </Text>
                </Text>
              </View>
              <View style={styles.actionBtnContainer}>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    { backgroundColor: Colors.primary },
                  ]}
                  onPress={handleStartProcess}
                >
                  <Text style={styles.text}>Start Process</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    { backgroundColor: Colors.textSecondary },
                  ]}
                  onPress={handleClose}
                >
                  <Text style={styles.text}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <ActivityIndicator size={"large"} color={Colors.primary} />
              <Text>Cleaning On Process</Text>
              <Text>about {fishData.cleaning_duration} minute/s</Text>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: Colors.error }]}
                onPress={handleForceStop}
              >
                <Text style={styles.text}>Force Stop</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CleanFishProcessModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    padding: 40,

    backgroundColor: "#0004",
  },
  modal: {
    width: "100%",
    backgroundColor: Colors.background,
    padding: 20,
    gap: 10,

    borderRadius: 20,
  },
  modalTitle: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.large,
    fontWeight: Typography.fontWeights.bold,
  },
  fishDetaisContainer: {
    backgroundColor: Colors.accent,
    padding: 15,
    borderRadius: 15,
  },
  text: {
    color: Colors.background,
  },
  actionBtnContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",

    gap: 10,
  },
  actionBtn: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 15,
  },
});
