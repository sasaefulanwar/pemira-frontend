import axios from "axios";

const api = axios.create({
  baseURL: "https://pemira-backend-production-8322.up.railway.app/api/v1",
});

// Interceptor: Nempel token setiap kali request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Ambil token dari localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // TEMPEL KE HEADER
  }

  // Hapus pengecekan CSRF Cookie di sini karena backend udah gak butuh itu lagi!
  window.dispatchEvent(new CustomEvent("setLoading", { detail: true }));
  return config;
});

// Interceptor Response
api.interceptors.response.use(
  (res) => {
    window.dispatchEvent(new CustomEvent("setLoading", { detail: false }));
    return res;
  },
  (err) => {
    window.dispatchEvent(new CustomEvent("setLoading", { detail: false }));
    // Kalau 401, berarti token expired/nggak valid
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect ke login kalau sesi abis
    }
    return Promise.reject(err);
  },
);

export default api;
