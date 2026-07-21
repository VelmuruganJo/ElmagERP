import axios from "axios";

const host = window.location.hostname;

const API = axios.create({
  baseURL:
    host === "localhost"
      ? "http://localhost:8082/api"
      : "http://192.168.1.100:8082/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;