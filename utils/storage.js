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
    await AsyncStorage.getItem(key);
  } catch (error) {
    console.error("error whe get key from storage", error);
  }
};

export { storeKey, getKey };
