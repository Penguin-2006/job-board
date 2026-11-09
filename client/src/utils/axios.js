import axios from "axios";
import store from "../redux/store";
import { logout } from "../redux/authSlice";

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://job-board-server-my5v.onrender.com/api"
    : "http://localhost:5000/api");

const instance = axios.create({
  baseURL: API_URL,
  timeout: 60000,
});

instance.interceptors.request.use((config) => {
  const { user } = store.getState().auth;
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && store.getState().auth.user) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default instance;