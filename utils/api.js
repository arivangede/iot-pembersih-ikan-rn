import axios from "axios";

const IPAddress = "103.129.149.50";
const PORT = "3001";

const api = axios.create({
  baseURL: `http://${IPAddress}:${PORT}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default api;
