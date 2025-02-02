import axios from "axios";

const api = axios.create({
  baseURL: "http://103.129.149.50:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default api;
