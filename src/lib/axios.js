import axios from "axios";

const api = axios.create({
  baseURL: "https://pemira-backend-production-8322.up.railway.app/api/v1",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    window.dispatchEvent(new CustomEvent("setLoading", { detail: false }));
    return res;
  },
  (err) => {
    window.dispatchEvent(new CustomEvent("setLoading", { detail: false }));
    return Promise.reject(err);
  },
);

export default api;
