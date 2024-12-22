import * as Device from "expo-device";
import api from "./api";
import { storeKey } from "./storage";

const getOsType = () => {
  const osName = Device.osName.toLowerCase();
  const androidRegex =
    /android|poco|xiaomi|redmi|oppo|vivo|realme|samsung|oneplus/i;
  const iosRegex = /ios|iphone|ipad|iPod/i;

  if (androidRegex.test(osName)) {
    return "Android";
  } else if (iosRegex.test(osName)) {
    return "iOS";
  } else {
    return osName;
  }
};

const getDeviceInfo = async () => {
  const brand = Device.manufacturer;
  const model = isNaN(parseInt(Device.modelName))
    ? Device.modelName
    : Device.deviceName;
  const os = getOsType();
  const os_version = Device.osVersion;
  const ram = (Device.totalMemory / (1024 * 1024 * 1024)).toFixed(2);

  const deviceInfo = { brand, model, os, os_version, ram };

  try {
    await fetchDeviceInfo(deviceInfo);
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
};

const fetchDeviceInfo = async (deviceInfo) => {
  try {
    const response = await api.post("/devices/register", deviceInfo);
    const deviceId = response.data.data.id;
    await storeKey("device_id", deviceId);
  } catch (error) {
    throw error;
  }
};

export default getDeviceInfo;
