import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true, // WAJIB ada buat kirim/terima cookie
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
    config.headers["X-CSRF-Token"] = csrfToken; // Ini yang dibaca backend!
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
