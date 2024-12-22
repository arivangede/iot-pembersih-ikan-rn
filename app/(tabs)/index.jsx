import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Theme from "../../constants/Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import getDeviceInfo from "../../utils/getDeviceInfo";
import api from "../../utils/api";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ErrorModal from "../../components/modals/ErrorModal";

const listIkan = [
  { label: "megalodon" },
  { label: "paus biru" },
  { label: "spongebob" },
  { label: "tuan crab" },
  { label: "plankton" },
  { label: "squidward" },
];

const { Colors, Typography, Shadows } = Theme;

const index = () => {
  const [fishList, setFishList] = useState([]);
  const [selectedFish, setSelectedFish] = useState("");
  const [loading, setLoading] = useState({
    deviceInfo: true,
    fishList: true,
  });
  const [isErrorDeviceInfo, setIsErrorDeviceInfo] = useState(false);

  const renderFishList = (item) => {
    return (
      <View
        style={[
          styles.dropdownItems,
          {
            backgroundColor:
              selectedFish == item.label ? Colors.background : Colors.card,
          },
        ]}
      >
        <Text style={{ color: Colors.text }}>{item.label}</Text>
      </View>
    );
  };

  const getFishList = async () => {
    try {
      const response = await api.get("/fish-types");
      const data = response.data.data;
      setFishList(data);

      setLoading((prev) => ({ ...prev, fishList: false }));
    } catch (error) {
      console.error("error get fishList", error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        await getDeviceInfo();
        setIsErrorDeviceInfo(false);
        getFishList();
      } catch (error) {
        setIsErrorDeviceInfo(true);
      } finally {
        setLoading((prev) => ({ ...prev, deviceInfo: false }));
      }
    };
    fetch();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getFishList();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Clean Fish</Text>

      {isErrorDeviceInfo && <ErrorModal />}

      <View style={styles.dropdownContainer}>
        {!loading.fishList && fishList.length > 0 ? (
          <>
            <Dropdown
              data={fishList}
              labelField="name"
              valueField="id"
              style={styles.dropdown}
              placeholder="Select Fish Type"
              value={selectedFish}
              onChange={(e) => setSelectedFish(e.label)}
              selectedTextStyle={{ color: Colors.text }}
              placeholderStyle={{ color: Colors.text }}
              containerStyle={styles.dropdownItemContainer}
              itemTextStyle={{ color: Colors.text }}
              renderItem={renderFishList}
            />
            <TouchableOpacity style={styles.btnPrimary}>
              <Text
                style={{
                  fontSize: Typography.fontSizes.medium,
                  fontWeight: Typography.fontWeights.bold,
                  color: Colors.card,
                }}
              >
                Start Cleaning
              </Text>
            </TouchableOpacity>
          </>
        ) : !loading.fishList && fishList.length == 0 ? (
          <>
            <View style={styles.notFoundIconContainer}>
              <Ionicons
                name="fish-sharp"
                color={Colors.textSecondary}
                size={50}
              />
              <Text style={styles.notFoundIconText}>404 Fish Not Found</Text>
            </View>
            <Text style={styles.notFoundFishText}>
              Please register fish types first on "settings" menu to enable
              cleaning feature
            </Text>
          </>
        ) : (
          !isErrorDeviceInfo && (
            <>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size={"large"} color={Colors.primary} />
                <Text>loading fish list...</Text>
              </View>
            </>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 20,

    backgroundColor: Colors.background,
  },
  titleText: {
    color: Colors.text,
    fontSize: Typography.fontSizes.title,
    fontWeight: Typography.fontWeights.bold,
    letterSpacing: 3,
  },
  dropdownContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    gap: 10,
  },
  dropdown: {
    height: 50,
    width: "100%",
    borderWidth: 0,
    borderRadius: 8,
    paddingHorizontal: 20,
    backgroundColor: Colors.card,

    ...Shadows.small,
  },
  dropdownItemContainer: {
    marginTop: 5,
    borderWidth: 0,
    backgroundColor: Colors.background,
    borderRadius: 10,
  },
  dropdownSelected: {
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  dropdownItems: {
    backgroundColor: Colors.card,
    color: Colors.text,
    padding: 15,

    borderRadius: 10,
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    color: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,

    ...Shadows.medium,
  },
  notFoundIconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  notFoundIconText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSizes.title,
    fontWeight: Typography.fontWeights.bold,
  },
  notFoundFishText: {
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeights.bold,
    textAlign: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
