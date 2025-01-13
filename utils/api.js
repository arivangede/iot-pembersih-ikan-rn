import axios from "axios";

// const IPAddress = "192.168.66.253";
const IPAddress = "192.168.1.23";

const api = axios.create({
  baseURL: `http://${IPAddress}:3000/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default api;
