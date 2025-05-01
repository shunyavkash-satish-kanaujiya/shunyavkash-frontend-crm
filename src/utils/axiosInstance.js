import axios from "axios";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL, // Backend URL
  timeout: 10000, // 10 seconds timeout
  //   withCredentials: true, // If you are using cookies, auth sessions
});
