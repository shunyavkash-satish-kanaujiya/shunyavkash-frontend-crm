import { useState, useCallback } from "react";
import { instance } from "../utils/axiosInstance";

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);

  const apiCall = useCallback(
    async (
      config = { url: "", method: "GET", headers: {}, params: {}, data: {} }
    ) => {
      setIsLoading(true);

      try {
        const response = await instance(config);
        return response.data;
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
    [] // No dependency needed
  );

  return {
    isLoading,
    apiCall,
    setIsLoading,
  };
};
