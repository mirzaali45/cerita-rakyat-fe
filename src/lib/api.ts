import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract error message
    let message = "Terjadi kesalahan";

    if (error.response?.data) {
      const data = error.response.data;

      // Jika ada array errors (validation errors)
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        // Gabungkan semua pesan error
        message = data.errors.map((err: any) => err.message).join(", ");
      } else if (data.message) {
        message = data.message;
      }
    }

    // Update error message
    error.response = {
      ...error.response,
      data: {
        ...error.response?.data,
        message,
      },
    };

    // Auto logout if 401
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

export default api;