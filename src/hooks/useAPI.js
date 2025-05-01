// src/hooks/useApi.js
import { useState, useCallback } from "react";
import { instance } from "../utils/axiosInstance";
import { useAuth } from "../hooks/dashboard/useAuth";

export default function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAuth(); // Only token needed

  const apiCall = useCallback(
    async (
      config = { url: "", method: "GET", headers: {}, params: {}, data: {} }
    ) => {
      setIsLoading(true);

      try {
        // Setup interceptor (only once per call for safety)
        instance.interceptors.request.use(
          (reqConfig) => {
            if (accessToken && !reqConfig.headers.Authorization) {
              reqConfig.headers.Authorization = `Bearer ${accessToken}`;
            }
            if (config.headers && !reqConfig.headers["Content-Type"]) {
              reqConfig.headers["Content-Type"] = config.headers;
            }
            return reqConfig;
          },
          (error) => Promise.reject(error)
        );

        instance.interceptors.response.use(
          (response) => response,
          async (error) => {
            const prevRequest = error?.config;

            if (
              (error?.response?.status === 401 ||
                error?.response?.status === 403) &&
              !prevRequest?.sent
            ) {
              prevRequest.sent = true;
              return instance(prevRequest); // Retry once
            }

            throw error; // Other errors
          }
        );

        // Perform the API request
        const response = await instance(config);
        return response.data; // Only return useful data
      } catch (error) {
        console.error(
          "API Error:",
          error.response?.data?.message || error.message
        );
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  return {
    isLoading,
    apiCall,
    setIsLoading, // Exposing in case you manually need to control loading
  };
}
