import axios from "axios";

const IPAddress = "192.168.244.253";

const api = axios.create({
  baseURL: `http://${IPAddress}:3000/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default api;
