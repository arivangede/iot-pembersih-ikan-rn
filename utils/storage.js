import AsyncStorage from "@react-native-async-storage/async-storage";

const storeKey = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log("key stored successfully:", value);
  } catch (error) {
    console.error("error when saving key to storage", error);
  }
};

const getKey = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error("error when getting key from storage", error);
  }
};

export { storeKey, getKey };
