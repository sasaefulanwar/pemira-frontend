import axios from "axios";

const api = axios.create({
  baseURL: "https://pemira-backend-production-8322.up.railway.app/api/v1",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // Fungsi buat ambil cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const csrfToken = getCookie("csrf_token");
  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }

  window.dispatchEvent(new CustomEvent("setLoading", { detail: true }));
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
