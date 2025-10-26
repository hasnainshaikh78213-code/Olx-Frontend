import axios from "axios";
// import dotenv from "dotenv"
// dotenv.config()

// console.log("Base URL:", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:5000/api",
});

//  automatically token 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
