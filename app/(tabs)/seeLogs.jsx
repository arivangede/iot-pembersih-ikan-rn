import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Theme from "../../constants/Theme";
import LogsCard from "../../components/LogsCard";

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
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Cleaning Logs</Text>
      <View style={{ marginTop: 30 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          data={dummy}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <LogsCard
              logId={item.id}
              fishName={item.fish}
              status={item.status}
              datetime={item.dateTime}
            />
          )}
        />
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
