import axios from "axios";

// Create an Axios instance
export const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL, // Backend URL
  timeout: 10000, // 10 seconds timeout
  // withCredentials: true, // Uncomment if using cookies
});

// Set up Axios interceptors globally
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;

    // Retry the request once if it's a 401 or 403 error
    if (
      (error?.response?.status === 401 || error?.response?.status === 403) &&
      !prevRequest?.sent
    ) {
      prevRequest.sent = true;
      return instance(prevRequest); // Retry once
    }

    throw error; // Handle other errors
  }
);
