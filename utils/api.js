import axios from "axios";

// const IPAddress = "192.168.66.253"; // hotspot
const IPAddress = "192.168.1.10"; // rumah tuedi
// const IPAddress = "192.168.1.9"; // rumah

const api = axios.create({
  baseURL: `http://${IPAddress}:3000/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default api;
