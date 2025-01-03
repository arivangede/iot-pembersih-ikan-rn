import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import Theme from "../../constants/Theme";
import { FontAwesome6 } from "@expo/vector-icons";
import { getKey } from "../../utils/storage";
import api from "../../utils/api";
import formatDate from "../../utils/formatDate";

const { Colors } = Theme;

const index = () => {
  const [deviceData, setDeviceData] = useState(null);

  const getDeviceId = async () => {
    const id = await getKey("device_id");
    return id;
  };

  const fetchDeviceData = async (id) => {
    try {
      const response = await api.get(`/devices/by-id/${id}`);
      setDeviceData(response.data.data);
    } catch (error) {
      console.error("error fetchDeviceData:", error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const id = await getDeviceId();
      await fetchDeviceData(id);
    };

    fetch();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" subtitle={"Device Information"} />
      <View style={styles.content}>
        <View style={styles.iconFrame}>
          <FontAwesome6 name="react" size={100} color={Colors.background} />
        </View>
        {deviceData && (
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceText}>Device ID: {deviceData.id}</Text>
            <Text style={styles.deviceText}>
              Device Brand: {deviceData.brand}
            </Text>
            <Text style={styles.deviceText}>
              Device Model: {deviceData.model}
            </Text>
            <Text style={styles.deviceText}>
              Operating System: {deviceData.os}
            </Text>
            <Text style={styles.deviceText}>
              OS Version: {deviceData.os_version}
            </Text>
            <Text style={styles.deviceText}>
              Device Memory (RAM): {deviceData.ram} GB
            </Text>
            <Text style={styles.deviceText}>
              Created At: {formatDate(deviceData.created_at)}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  content: {
    marginTop: 40,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  deviceInfo: {
    marginTop: 20,
    padding: 20,
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  deviceText: {
    color: Colors.background,
  },
  iconFrame: {
    padding: 20,
    backgroundColor: Colors.primary,
    borderRadius: "50%",
  },
});
