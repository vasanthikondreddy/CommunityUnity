// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true, // so cookies/JWT tokens are sent automatically
});

export default api; // ✅ default export so "import api" works
