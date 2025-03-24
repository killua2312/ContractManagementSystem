import axios from "axios";

const api = axios.create({
  baseURL:
    `${process.env.NEXT_PUBLIC_API_URL}/api` || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
