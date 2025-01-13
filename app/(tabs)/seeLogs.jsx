import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Theme from "../../constants/Theme";
import LogsCard from "../../components/LogsCard";
import api from "../../utils/api";
import { useFocusEffect } from "expo-router";

const { Colors, Typography } = Theme;

const dummy = [
  {
    id: 1,
    fish: "fish1",
    status: "processing",
    dateTime: new Date().toDateString(),
  },
  {
    id: 2,
    fish: "fish2",
    status: "force stopped",
    dateTime: new Date().toDateString(),
  },
  {
    id: 3,
    fish: "fish3",
    status: "Done",
    dateTime: new Date().toDateString(),
  },
];

const seeLogs = () => {
  const [logList, setLogList] = useState([]);
  const [loading, setLoading] = useState({
    logs: true,
  });

  const fetchLogs = async () => {
    setLoading((prev) => ({ ...prev, logs: true }));
    try {
      const response = await api.get("/operations");
      const data = response.data.data;
      setLogList(data);
    } catch (error) {
      console.error("error fetchLogs", error);
    } finally {
      setLoading((prev) => ({ ...prev, logs: false }));
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading((prev) => ({ ...prev, logs: true }));
      setLogList([]);
      fetchLogs();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Cleaning Logs</Text>
      <View style={{ marginTop: 30, flex: 1 }}>
        {!loading.logs && logList.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            data={logList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <LogsCard
                logId={item.id}
                fishName={item.CleaningOperation.FishType.name}
                status={item.CleaningOperation.status}
                datetime={item.CleaningOperation.start_time}
                isRead={item.isRead}
              />
            )}
          />
        ) : !loading.logs ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ textAlign: "center", color: Colors.textSecondary }}>
              No logs found. Please clean a fish to see the logs.
            </Text>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size={"large"} color={Colors.primary} />
            <Text style={{ color: Colors.textSecondary }}>
              Loading Cleaning Logs, Please Wait...
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default seeLogs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 20,

    backgroundColor: Colors.background,
  },
  titleText: {
    fontSize: Typography.fontSizes.title,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.text,
    letterSpacing: 4,
  },
  list: {
    paddingHorizontal: 5,
  },
});
