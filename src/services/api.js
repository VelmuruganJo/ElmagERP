import axios from "axios";

const API = axios.create({
  baseURL:
    window.location.hostname === "localhost"
      ? "http://localhost:8082/api"
      : "https://YOUR-BACKEND-URL/api", // ngrok or deployed backend
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;