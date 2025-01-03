import {
  ActivityIndicator,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../../utils/api";
import Theme from "../../../constants/Theme";
import Header from "../../../components/Header";
import { Ionicons } from "@expo/vector-icons";

const { Colors, Typography, Shadows } = Theme;
const cleanSpeedData = [
  {
    color: Colors.accent,
    icon: "time-outline",
    speedName: "Slow",
    speedValue: 50.0,
  },
  {
    color: Colors.warning,
    icon: "car-outline",
    speedName: "Medium",
    speedValue: 100.0,
  },
  {
    color: Colors.error,
    icon: "rocket-outline",
    speedName: "Fast",
    speedValue: 150.0,
  },
];

const FishDetails = () => {
  const { fish_id } = useLocalSearchParams();
  const [fishData, setFishData] = useState({});
  const [fishForm, setFishForm] = useState({
    name: "",
    cleaning_speed: 0.0,
    cleaning_duration: 0,
  });
  const [loading, setLoading] = useState({
    fishData: true,
    update: false,
    delete: false,
  });
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const CleanSpeedItem = (data = []) => {
    return data.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.CleanSpeedItem,
          {
            backgroundColor: item.color,
            opacity:
              fishForm.cleaning_speed == item.speedValue ||
              fishForm.cleaning_speed == 0.0
                ? 1
                : 0.5,
          },
        ]}
        onPress={() =>
          setFishForm((prev) => ({ ...prev, cleaning_speed: item.speedValue }))
        }
        disabled={!editMode}
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

  const fetchFishData = async () => {
    try {
      const response = await api.get(`/fish-types/${fish_id}`);
      const data = response.data.data;
      setFishData(data);
      setFishForm({
        name: data.name,
        cleaning_speed: data.cleaning_speed,
        cleaning_duration: data.cleaning_duration,
      });
    } catch (error) {
      console.error("error fetchFishData", error);
    } finally {
      setLoading((prev) => ({ ...prev, fishData: false }));
    }
  };

  const updateFishData = async () => {
    setLoading((prev) => ({ ...prev, update: true }));
    try {
      await api.patch(`/fish-types/update/${fishData.id}`, fishForm);
    } catch (error) {
      console.error("error updateFishData", error);
      setFishForm({
        name: fishData.name,
        cleaning_speed: fishData.cleaning_speed,
        cleaning_duration: fishData.cleaning_duration,
      });
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
      setEditMode(false);
    }
  };

  const deleteFishData = async () => {
    setLoading((prev) => ({ ...prev, delete: true }));

    try {
      await api.delete(`/fish-types/delete/${fishData.id}`);
    } catch (error) {
      console.error("error deleteFishData: ", error);
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
      router.back();
    }
  };

  useEffect(() => {
    fetchFishData();
  }, []);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Header title="Fish Type" subtitle={"Details"} />
        {loading.fishData ? (
          <ActivityIndicator size={"large"} color={Colors.textSecondary} />
        ) : !loading.fishData && fishData ? (
          <>
            <View style={styles.fieldContainer}>
              <Text>Fish Type:</Text>
              <TextInput
                style={[
                  styles.textInput,
                  { backgroundColor: editMode ? Colors.background : "#0001" },
                ]}
                value={fishForm.name}
                onChangeText={(text) =>
                  setFishForm((prev) => ({ ...prev, name: text }))
                }
                editable={editMode}
              />
            </View>
            <View style={{ paddingHorizontal: 20, gap: 5 }}>
              <Text>Cleaning Speed:</Text>
              <View style={styles.cleanSpeedContainer}>
                {CleanSpeedItem(cleanSpeedData)}
              </View>
            </View>
            <View style={{ paddingHorizontal: 20, gap: 5 }}>
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
                      backgroundColor: editMode ? Colors.background : "#0001",
                    },
                  ]}
                  placeholder="0"
                  value={fishForm.cleaning_duration.toString()}
                  onChangeText={(text) =>
                    setFishForm((prev) => ({
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
                  editable={editMode}
                />
                <Text>Minute/s</Text>
              </View>
            </View>

            <View style={styles.actionBtnContainer}>
              {!editMode ? (
                <>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => setEditMode(true)}
                  >
                    <Ionicons
                      name="pencil"
                      color={Colors.background}
                      size={25}
                    />
                    <Text style={styles.text}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => setShowDeleteModal(true)}
                  >
                    <Ionicons
                      name="trash-bin"
                      color={Colors.background}
                      size={25}
                    />
                    <Text style={styles.text}>Delete</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={[
                      styles.editBtn,
                      { opacity: loading.update ? 0.5 : 1 },
                    ]}
                    onPress={() => updateFishData()}
                    disabled={loading.update}
                  >
                    {!loading.update ? (
                      <>
                        <Ionicons
                          name="checkmark"
                          color={Colors.background}
                          size={25}
                        />
                        <Text style={styles.text}>Save</Text>
                      </>
                    ) : (
                      <>
                        <ActivityIndicator
                          size={"large"}
                          color={Colors.background}
                        />
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.deleteBtn,
                      { opacity: loading.update ? 0.5 : 1 },
                    ]}
                    onPress={() => {
                      setEditMode(false);
                      setFishForm({
                        name: fishData.name,
                        cleaning_duration: fishData.cleaning_duration,
                        cleaning_speed: fishData.cleaning_speed,
                      });
                    }}
                    disabled={loading.update}
                  >
                    <Ionicons
                      name="close"
                      color={Colors.background}
                      size={25}
                    />
                    <Text style={styles.text}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        ) : (
          <Text>Error when trying get fish data</Text>
        )}

        {showDeleteModal && (
          <Modal transparent statusBarTranslucent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Confirmation</Text>
                <Text style={styles.modalText}>
                  are you sure want to delete this fish type data?
                </Text>
                <Text style={styles.modalSubText}>
                  (this action cannot be canceled once processed)
                </Text>
                <View
                  style={[
                    styles.actionBtnContainer,
                    { paddingBottom: 10, paddingTop: 20, paddingHorizontal: 0 },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.modalBtn,
                      {
                        backgroundColor: Colors.error,
                        opacity: loading.delete ? 0.5 : 1,
                      },
                    ]}
                    onPress={() => deleteFishData()}
                    disabled={loading.delete}
                  >
                    {!loading.delete ? (
                      <Text style={styles.text}>Delete</Text>
                    ) : (
                      <ActivityIndicator
                        size={"small"}
                        color={Colors.background}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalBtn,
                      {
                        backgroundColor: Colors.textSecondary,
                        opacity: loading.delete ? 0.5 : 1,
                      },
                    ]}
                    onPress={() => setShowDeleteModal(false)}
                    disabled={loading.delete}
                  >
                    <Text style={styles.text}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default FishDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
    backgroundColor: Colors.background,
  },
  fieldContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    gap: 5,
  },
  textInput: {
    width: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.textSecondary,
    borderRadius: 10,
    fontSize: Typography.fontSizes.medium,
    backgroundColor: Colors.background,

    padding: 10,
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
  actionBtnContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
  },
  deleteBtn: {
    width: 60,
    backgroundColor: Colors.error,
    padding: 10,
    borderRadius: 15,

    justifyContent: "center",
    alignItems: "center",
  },
  editBtn: {
    width: 60,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 15,

    justifyContent: "center",
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#0004",

    padding: 40,

    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: Colors.background,
    padding: 20,
    borderRadius: 20,
  },
  modalTitle: {
    color: Colors.primary,
    fontSize: Typography.fontSizes.large,
    fontWeight: Typography.fontWeights.bold,
  },
  modalText: {
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.medium,
  },
  modalSubText: {
    color: Colors.error,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.small,
  },
  modalBtn: {
    paddingHorizontal: 15,
    paddingVertical: 10,

    borderRadius: 15,
  },
});
