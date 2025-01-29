import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import Theme from "../../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";
import FishCard from "../../components/FishCard";
import { useFocusEffect } from "expo-router";

const { Colors, Typography } = Theme;

const cleanSpeedData = [
  {
    color: Colors.accent,
    icon: "time-outline",
    speedName: "Slow",
    speedValue: 100.0,
  },
  {
    color: Colors.warning,
    icon: "car-outline",
    speedName: "Medium",
    speedValue: 200.0,
  },
  {
    color: Colors.error,
    icon: "rocket-outline",
    speedName: "Fast",
    speedValue: 400.0,
  },
];

const index = () => {
  const [fishList, setFishList] = useState([]);
  const [showAddFishModal, setShowAddFishModal] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [loading, setLoading] = useState({
    fishList: true,
    submit: false,
  });
  const [fishData, setFishData] = useState({
    name: "",
    cleaning_speed: 0.0,
    cleaning_duration: 0,
  });

  const handleAdd = () => {
    Keyboard.dismiss();
    setShowAddFishModal(true);
  };

  const handleSearch = async () => {
    Keyboard.dismiss();
    setLoading((prev) => ({ ...prev, fishList: true }));
    try {
      const response = await api.get(`/fish-types?search=${searchParam}`);
      const data = response.data.data;
      setFishList(data);
    } catch (error) {
      console.error("error handleSearch", error);
    } finally {
      setLoading((prev) => ({ ...prev, fishList: false }));
    }
  };

  const fetchFishList = async () => {
    try {
      const response = await api.get("/fish-types");
      const data = response.data.data;
      setFishList(data);
    } catch (error) {
      console.error("error get fishList", error);
    } finally {
      setLoading((prev) => ({ ...prev, fishList: false }));
    }
  };

  const handleSubmit = async () => {
    setLoading((prev) => ({ ...prev, submit: true }));
    if (
      !fishData.name ||
      !fishData.cleaning_speed ||
      !fishData.cleaning_duration
    ) {
      return;
    }
    try {
      await api.post("/fish-types/register", fishData);
    } catch (error) {
      console.error("error submit new fish type", error);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
      setShowAddFishModal(false);
      setFishData({
        name: "",
        cleaning_speed: 0.0,
        cleaning_duration: 0,
      });
      fetchFishList();
    }
  };

  const CleanSpeedItem = (data = []) => {
    return data.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.CleanSpeedItem,
          {
            backgroundColor: item.color,
            opacity:
              fishData.cleaning_speed == item.speedValue ||
              fishData.cleaning_speed == 0.0
                ? 1
                : 0.5,
          },
        ]}
        onPress={() =>
          setFishData((prev) => ({ ...prev, cleaning_speed: item.speedValue }))
        }
      >
        <Ionicons name={item.icon} size={30} color={Colors.background} />
        <Text
          style={[
            styles.text,
            {
              fontWeight: Typography.fontWeights.bold,
            },
          ]}
        >
          {item.speedName}
        </Text>
        <Text style={styles.text}>
          {Math.floor(item.speedValue).toFixed(0)}rpm
        </Text>
      </TouchableOpacity>
    ));
  };

  useFocusEffect(
    useCallback(() => {
      fetchFishList();
    }, [])
  );
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Header title={"Settings"} subtitle={"Fish Types"} />
        <View style={styles.actionContainer}>
          <View style={styles.addContainer}>
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.btnText}>Add +</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Fish Type..."
              value={searchParam}
              onChangeText={(text) => setSearchParam(text)}
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
              <Ionicons name="search" size={25} color={Colors.background} />
            </TouchableOpacity>
          </View>
        </View>
        {!loading.fishList && fishList.length > 0 ? (
          <FlatList
            data={fishList}
            showsVerticalScrollIndicator={false}
            style={{ height: "100%" }}
            contentContainerStyle={{
              gap: 10,
              paddingBottom: 20,
              paddingHorizontal: 20,
            }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <FishCard
                key={item.id}
                fish_id={item.id}
                fish_name={item.name}
                cleaning_duration={item.cleaning_duration}
                cleaning_speed={item.cleaning_speed}
              />
            )}
          />
        ) : !loading.fishList && fishList.length == 0 ? (
          <>
            <View style={styles.notFoundContainer}>
              <Text style={styles.notFoundText}>
                {searchParam
                  ? "There's no fish types data found for this fish name, please add this fish."
                  : "There's no fish types data found, please add fish types."}
              </Text>
            </View>
          </>
        ) : (
          <ActivityIndicator size={"large"} color={Colors.primary} />
        )}

        {showAddFishModal && (
          <Modal statusBarTranslucent transparent animationType="fade">
            <TouchableWithoutFeedback
              disabled={loading.submit}
              onPress={() => setShowAddFishModal(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modal}>
                  <View style={styles.modaltitleContainer}>
                    <Text style={styles.modaltitle}>Add Fish Type +</Text>
                  </View>
                  <View style={styles.modalContentContainer}>
                    <View style={styles.fishNameContainer}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter Fish Name Here..."
                        value={fishData.name}
                        onChangeText={(text) =>
                          setFishData((prev) => ({ ...prev, name: text }))
                        }
                      />
                    </View>
                    <View style={styles.cleanSpeedContainer}>
                      {CleanSpeedItem(cleanSpeedData)}
                    </View>
                    <View style={styles.cleanDurationContainer}>
                      <Text>Cleaning Duration: </Text>
                      <TextInput
                        style={[
                          styles.textInput,
                          {
                            width: 50,
                            height: 50,
                            textAlignVertical: "center",
                            textAlign: "center",
                          },
                        ]}
                        placeholder="0"
                        value={fishData.cleaning_duration.toString()}
                        onChangeText={(text) =>
                          setFishData((prev) => ({
                            ...prev,
                            cleaning_duration: isNaN(
                              parseFloat(text.replace(/^0+/, ""))
                            )
                              ? 0
                              : parseFloat(text.replace(/^0+/, "")),
                          }))
                        }
                        keyboardType="number-pad"
                        maxLength={2}
                      />
                      <Text>Minute/s</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.submitBtn,
                        {
                          opacity:
                            !fishData.name ||
                            !fishData.cleaning_speed ||
                            !fishData.cleaning_duration ||
                            loading.submit
                              ? 0.6
                              : 1,
                        },
                      ]}
                      disabled={
                        !fishData.name ||
                        !fishData.cleaning_speed ||
                        !fishData.cleaning_duration ||
                        loading.submit
                      }
                      onPress={handleSubmit}
                    >
                      {!loading.submit ? (
                        <Text style={styles.btnText}>Submit</Text>
                      ) : (
                        <ActivityIndicator
                          size={"large"}
                          color={Colors.background}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
    backgroundColor: Colors.background,
  },
  actionContainer: {
    padding: 20,
    gap: 5,
  },
  addContainer: {
    padding: 5,
  },
  addBtn: {
    width: 100,
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: Colors.success,
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 15,
  },
  btnText: {
    color: Colors.background,
    fontSize: Typography.fontSizes.large,
    fontWeight: Typography.fontWeights.bold,
  },
  searchContainer: {
    width: "100%",
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  searchInput: {
    width: "82%",
    padding: 10,
    backgroundColor: Colors.background,

    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.textSecondary,
    borderRadius: 15,

    fontSize: Typography.fontSizes.larger,
  },
  searchBtn: {
    backgroundColor: Colors.primary,
    padding: 10,

    borderRadius: 15,
  },
  notFoundContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.medium,
    textAlign: "center",
  },
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
    gap: 10,
  },
  modaltitleContainer: {
    padding: 5,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modaltitle: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.title,
    fontWeight: Typography.fontWeights.bold,
  },
  modalContentContainer: {
    gap: 10,
  },
  textInput: {
    width: "100%",
    padding: 10,
    backgroundColor: Colors.background,

    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.textSecondary,
    borderRadius: 15,

    fontSize: Typography.fontSizes.medium,
  },
  cleanSpeedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  CleanSpeedItem: {
    width: 80,
    padding: 15,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: Colors.background,
  },
  cleanDurationContainer: {
    width: "100%",
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  submitBtn: {
    width: "100%",
    padding: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  fishListContainer: {
    gap: 10,
  },
});
