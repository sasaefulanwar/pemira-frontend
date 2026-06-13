import axios from "axios";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Pasang Satpam Interceptor sebelum request berangkat ke Backend
api.interceptors.request.use(
  (config) => {
    // Ambil token CSRF dari cookie (kalau ada)
    const csrfToken = getCookie("csrf_token");

    // Kalau tokennya ketemu dan metode request-nya bukan GET (POST/PUT/DELETE)
    // Langsung tempelin di Header!
    if (csrfToken && config.method !== "get") {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
