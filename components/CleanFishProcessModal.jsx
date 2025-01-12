import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Theme from "../constants/Theme";
import speedName from "../utils/speedName";
import { Ionicons } from "@expo/vector-icons";
import api from "../utils/api";
import NetInfo from "@react-native-community/netinfo";

const { Colors, Typography } = Theme;

const CleanFishProcessModal = ({ fishData, handleClose, deviceId }) => {
  const speed_name = speedName(fishData.cleaning_speed);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isForceStopped, setIsForceStopped] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [loading, setLoading] = useState({
    start: false,
    stop: false,
  });
  const [processPayloadData, setProcessPayloadData] = useState({
    framework: "React Native",
    connection_type: "",
  });
  const [cleaningOperation, setCleaningOperation] = useState(null);

  const [remainingTime, setRemainingTime] = useState(
    fishData.cleaning_duration * 60
  );
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isProcessing) {
      setTimeout(() => {
        intervalRef.current = setInterval(() => {
          setRemainingTime((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(intervalRef.current);
              setIsProcessing(false);
              setIsDone(true);
              Vibration.vibrate([200, 100, 200]);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);

        Vibration.cancel();

        return () => clearInterval(intervalRef.current);
      }, 2000);
    }
  }, [isProcessing]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleStartProcess = async () => {
    if (!deviceId || !fishData.id) {
      console.error("Device ID or Fish Data ID is missing");
      return;
    }

    const payload = {
      start_time: new Date().toISOString(),
      ...processPayloadData,
    };

    setLoading((prev) => ({ ...prev, start: true }));
    try {
      const response = await api.post(
        `/operations/${deviceId}/${fishData.id}`,
        payload
      );

      setCleaningOperation(response.data.data);
      console.log(response.data.data);

      setIsProcessing(true);
    } catch (error) {
      console.error("error handleStartProcess:", error);
    } finally {
      setLoading((prev) => ({ ...prev, start: false }));
    }
  };

  const handleForceStop = async () => {
    setIsProcessing(false);
    setIsForceStopped(true);
    console.log(cleaningOperation.id);
    try {
      const response = await api.get(
        `/operations/force-stop/${cleaningOperation.id}`
      );
      console.log("handleForceStop:", response.data);
      Vibration.vibrate();
    } catch (error) {
      console.error("error handleForceStop:", error);
    }
  };

  useEffect(() => {
    const getNetInfo = NetInfo.addEventListener((state) => {
      const netType = state.type;
      if (netType == "cellular") {
        setProcessPayloadData((prev) => ({
          ...prev,
          connection_type: netType,
          cellular_generation: state.details.cellularGeneration,
        }));
      } else {
        setProcessPayloadData((prev) => ({
          ...prev,
          connection_type: netType,
        }));
      }
    });

    return () => getNetInfo();
  }, []);

  return (
    <Modal transparent statusBarTranslucent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          {!isProcessing && !isForceStopped && !isDone ? (
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
                    {
                      backgroundColor: Colors.primary,
                      opacity: loading.start ? 0.5 : 1,
                    },
                  ]}
                  onPress={handleStartProcess}
                  disabled={loading.start}
                >
                  {loading.start ? (
                    <ActivityIndicator size="small" color={Colors.background} />
                  ) : (
                    <Ionicons name="play" size={15} color={Colors.background} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: Colors.textSecondary,
                      opacity: loading.start ? 0.5 : 1,
                    },
                  ]}
                  onPress={handleClose}
                  disabled={loading.start}
                >
                  <Text style={styles.text}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : isProcessing && !isForceStopped && !isDone ? (
            <View style={styles.forceStoppedContent}>
              <ActivityIndicator size={"large"} color={Colors.primary} />
              <Text
                style={{
                  fontSize: Typography.fontSizes.larger,
                  fontWeight: Typography.fontWeights.bold,
                  color: Colors.primary,
                }}
              >
                Cleaning On Process
              </Text>
              <Text>Remaining Time: {formatTime(remainingTime)}</Text>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { backgroundColor: Colors.error, width: "100%" },
                ]}
                onPress={handleForceStop}
              >
                <Text style={styles.text}>Force Stop</Text>
              </TouchableOpacity>
            </View>
          ) : !isDone && isForceStopped ? (
            <View style={styles.forceStoppedContent}>
              <Ionicons name="warning" size={60} color={Colors.textSecondary} />
              <Text>Cleaning Process is Force Stopped</Text>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { backgroundColor: Colors.textSecondary, width: "100%" },
                ]}
                onPress={handleClose}
              >
                <Text style={styles.text}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.forceStoppedContent}>
              <Ionicons
                name="checkmark"
                size={60}
                color={Colors.textSecondary}
              />
              <Text>Cleaning Process is Finished</Text>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { backgroundColor: Colors.textSecondary, width: "100%" },
                ]}
                onPress={handleClose}
              >
                <Text style={styles.text}>Close</Text>
              </TouchableOpacity>
            </View>
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
  forceStoppedContent: {
    width: "100%",
    padding: 0.1,
    gap: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
