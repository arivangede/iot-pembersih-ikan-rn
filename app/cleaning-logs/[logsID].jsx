import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Theme from "../../constants/Theme";
import Header from "../../components/Header";
import { router, useLocalSearchParams } from "expo-router";
import api from "../../utils/api";
import formatDate from "../../utils/formatDate";

const { Colors, Typography } = Theme;

const LogDetails = () => {
  const { logsID } = useLocalSearchParams();
  const [logData, setLogData] = useState({});
  const [loading, setLoading] = useState({
    fetch: true,
    action: false,
  });
  const [error, setError] = useState(null);

  const readedLog = async (logsID) => {
    try {
      const response = await api.get(`/operations/read/${logsID}`);
    } catch (error) {
      console.error("Error readedLog", error);
    }
  };

  const getActualDuration = (start_time, end_time) => {
    if (!end_time) {
      return "Not finished yet";
    }

    const startDate = new Date(start_time);
    const endDate = new Date(end_time);

    // Validasi tanggal
    if (isNaN(startDate) || isNaN(endDate)) {
      return "Invalid start_time or end_time";
    }

    const totalSeconds = Math.round((endDate - startDate) / 1000);

    if (totalSeconds < 0) {
      return "end_time must be after start_time";
    }

    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Format output dengan pluralization
    const formatUnit = (value, unit) =>
      value === 1 ? `${value} ${unit}` : `${value} ${unit}s`;

    const parts = [];
    if (minutes > 0) parts.push(formatUnit(minutes, "minute"));
    if (seconds > 0 || parts.length === 0)
      parts.push(formatUnit(seconds, "second"));

    return parts.join(" ");
  };

  const fetchLogData = async () => {
    try {
      const response = await api.get(`/operations/${logsID}`);
      const data = response.data.data;
      setLogData(data);
      return data;
    } catch (error) {
      console.error("Error fetchLogData", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const removeResult = async () => {
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      const response = await api.delete(`/operations/remove/${logsID}`);
      router.back();
    } catch (error) {
      console.error("Error removeResult", error);
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  useEffect(() => {
    const fetchQueue = async () => {
      const data = await fetchLogData();
      await readedLog(data.id);
    };

    fetchQueue();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Cleaning Log" showDateData={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            paddingTop: 20,
            padding: 10,
            gap: 10,
            paddingBottom: 100,
          }}
        >
          {!loading.fetch && !error ? (
            <>
              <Text style={styles.sectionTitle}>Process Details:</Text>
              <View style={styles.sectionWrapper}>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Start Date/Time:</Text>
                  <Text style={styles.fieldValue}>
                    {formatDate(logData.CleaningOperation.start_time, "date")}
                  </Text>
                </View>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>End Date/Time:</Text>
                  <Text style={styles.fieldValue}>
                    {formatDate(logData.CleaningOperation.end_time, "date")}
                  </Text>
                </View>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Actual Duration:</Text>
                  <Text style={styles.fieldValue}>
                    {logData.CleaningOperation &&
                      getActualDuration(
                        logData.CleaningOperation.start_time,
                        logData.CleaningOperation.end_time
                      )}
                  </Text>
                </View>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Process Status:</Text>
                  <Text style={styles.fieldValue}>
                    {logData.CleaningOperation.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.sectionTitle}>Fish Details:</Text>
              <View style={styles.sectionWrapper}>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Fish ID:</Text>
                  <Text style={styles.fieldValue}>
                    {logData.CleaningOperation.FishType.id}
                  </Text>
                </View>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Fish Name:</Text>
                  <Text style={styles.fieldValue}>
                    {logData.CleaningOperation.FishType.name}
                  </Text>
                </View>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Cleaning Speed:</Text>
                  <Text style={styles.fieldValue}>
                    {logData.CleaningOperation.FishType.cleaning_speed} rpm
                  </Text>
                </View>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Cleaning Duration:</Text>
                  <Text style={styles.fieldValue}>
                    {logData.CleaningOperation.FishType.cleaning_duration}{" "}
                    minutes
                  </Text>
                </View>
              </View>
              <Text style={styles.sectionTitle}>Device Details:</Text>
              <View style={styles.sectionWrapper}>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Device Brand:</Text>
                  <Text style={styles.fieldValue}>
                    {logData.PerformanceLog.Device.brand}
                  </Text>
                </View>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Device Model:</Text>
                  <Text style={styles.fieldValue}>
                    {logData.PerformanceLog.Device.model}
                  </Text>
                </View>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>
                    Operation System / Version:
                  </Text>
                  <Text style={styles.fieldValue}>
                    {logData.PerformanceLog.Device.os} /{" "}
                    {logData.PerformanceLog.Device.os_version}
                  </Text>
                </View>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Memory (RAM):</Text>
                  <Text style={styles.fieldValue}>
                    {logData.PerformanceLog.Device.ram} GB
                  </Text>
                </View>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>
                    Connection Type / Generation:
                  </Text>
                  <Text style={styles.fieldValue}>
                    {logData.PerformanceLog.connection_type}{" "}
                    {logData.PerformanceLog.cellular_generation
                      ? "/ " + logData.PerformanceLog.cellular_generation
                      : ""}
                  </Text>
                </View>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>App Framework:</Text>
                  <Text style={styles.fieldValue}>
                    {logData.PerformanceLog.framework}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={removeResult}
              >
                {loading.action ? (
                  <ActivityIndicator size="small" color={Colors.background} />
                ) : (
                  <Text>Remove This Result</Text>
                )}
              </TouchableOpacity>
            </>
          ) : !error ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <Text>
              Error occurred when fetching log details, please try again
            </Text>
          )}
        </View>
      </ScrollView>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.btnText}>Back To Logs</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LogDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    position: "relative",
  },
  titleText: {
    color: Colors.text,
    fontSize: Typography.fontSizes.title,
    letterSpacing: 4,
  },
  footerContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,

    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    padding: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  btnText: {
    textAlign: "center",
    fontSize: Typography.fontSizes.medium,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.background,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.text,
  },
  sectionWrapper: {
    backgroundColor: Colors.accent,
    padding: 10,
    borderRadius: 10,
  },
  fieldText: {
    fontSize: Typography.fontSizes.small,
    color: Colors.background,
  },
  fieldColumn: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: Typography.fontSizes.small,
    color: Colors.background,
  },
  fieldValue: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.background,
  },
  removeButton: {
    padding: 10,
    backgroundColor: Colors.error,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
