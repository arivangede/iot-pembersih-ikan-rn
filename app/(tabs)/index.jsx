import "react-native-reanimated";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Theme from "../../constants/Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import getDeviceInfo from "../../utils/getDeviceInfo";
import api from "../../utils/api";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ErrorModal from "../../components/modals/ErrorModal";
import CleanFishProcessModal from "../../components/CleanFishProcessModal";
import { getKey } from "../../utils/storage";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const { Colors, Typography, Shadows } = Theme;

const index = () => {
  const [fishList, setFishList] = useState([]);
  const [selectedFish, setSelectedFish] = useState(null);
  const [fishData, setFishData] = useState({});
  const [loading, setLoading] = useState({
    deviceInfo: true,
    fishList: true,
  });
  const [isErrorDeviceInfo, setIsErrorDeviceInfo] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [deviceId, setDeviceId] = useState("");

  const bottomsheetref = useRef(null);
  const snapPoints = useMemo(() => ["30%", "50%"], []);

  const handleCloseModal = () => {
    setShowProcessModal(false);
  };

  const getFishList = async () => {
    setLoading((prev) => ({ ...prev, fishList: true }));
    try {
      const response = await api.get("/fish-types");
      const data = response.data.data;
      setFishList(data);
      setLoading((prev) => ({ ...prev, fishList: false }));
    } catch (error) {
      console.error("error get fishList", error);
    } finally {
      setLoading((prev) => ({ ...prev, fishList: false }));
    }
  };

  const getDeviceId = async () => {
    const id = await getKey("device_id");
    return id;
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        await getDeviceInfo();
        setIsErrorDeviceInfo(false);
        getFishList();
        const deviceId = await getDeviceId();
        setDeviceId(deviceId);
      } catch (error) {
        setIsErrorDeviceInfo(true);
      } finally {
        setLoading((prev) => ({ ...prev, deviceInfo: false }));
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const selectedFishData = fishList.find(
      (fish) => fish.id === selectedFish.id
    );
    setFishData(selectedFishData || {});
  }, [selectedFish]);

  useFocusEffect(
    useCallback(() => {
      setSelectedFish("");
      setFishList([]);
      getFishList();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={styles.container}>
        <Text style={styles.titleText}>Clean Fish</Text>

        {isErrorDeviceInfo && <ErrorModal />}

        <View style={styles.dropdownContainer}>
          {!loading.fishList && fishList.length > 0 ? (
            <>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => {
                  bottomsheetref.current?.snapToIndex(1);
                  console.log(bottomsheetref.current);
                }}
              >
                <Text numberOfLines={1}>
                  {selectedFish.name || "Select Fish Type"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  color={Colors.textSecondary}
                  size={24}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.btnPrimary,
                  { opacity: !selectedFish ? 0.5 : 1 },
                ]}
                disabled={!selectedFish}
                onPress={() => setShowProcessModal(true)}
              >
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
        {showProcessModal && (
          <CleanFishProcessModal
            fishData={fishData}
            handleClose={handleCloseModal}
            deviceId={deviceId}
          />
        )}
        <BottomSheet
          ref={bottomsheetref}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
        >
          <BottomSheetView>
            <ScrollView
              contentContainerStyle={{ gap: 5, paddingHorizontal: 10 }}
            >
              {fishList.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() =>
                    setSelectedFish({ id: item.id, name: item.name })
                  }
                >
                  <View
                    style={[
                      styles.dropdownItems,
                      {
                        backgroundColor:
                          selectedFish.id == item.id
                            ? Colors.accent
                            : Colors.card,
                      },
                    ]}
                  >
                    <Text style={{ color: Colors.text }}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
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
  dropdownButton: {
    width: "70%",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
