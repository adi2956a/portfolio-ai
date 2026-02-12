import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://portfolio-ai-u42u.onrender.com/api",
  timeout: 10000,
});

export function withAuth(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export default api;
