import { create } from "zustand";
import { instance } from "../utils/axiosInstance";
import { API_ROUTES } from "../api/apiList";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  // Register method
  register: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const res = await instance.post(API_ROUTES.AUTH.LOGIN, {
        email,
        password,
      });

      const token = res.data.token || null;
      localStorage.setItem("token", token);

      set({ token, loading: false });

      await useAuthStore.getState().fetchUser();
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
        loading: false,
      });
    }
  },

  // Fetch user data
  fetchUser: async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    set({ loading: true });

    try {
      const res = await instance.get(API_ROUTES.AUTH.FETCH_USER);

      const user = res.data;
      set({ user });
    } catch (error) {
      console.error("Fetch user failed:", error.message);
      set({ error: "Failed to fetch user", user: null, token: null });
      localStorage.removeItem("token");
    } finally {
      set({ loading: false });
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    set({ loading: true, error: null });

    try {
      const res = await instance.post(API_ROUTES.AUTH.FORGET_PASSWORD, {
        email,
      });

      set({ loading: false, message: res.data.message });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.error || "Something went wrong",
      });
    }
  },

  // Reset password
  resetPassword: async (token, password) => {
    set({ loading: true, error: null });

    try {
      const res = await instance.put(API_ROUTES.AUTH.RESET_PASSWORD(token), {
        password,
      });

      set({ loading: false, message: res.data.message });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.error || "Something went wrong",
      });
    }
  },

  // Clear error and message states
  clearMessages: () => set({ message: null, error: null }),

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    toast.success("Logged-out!");
    set({ user: null, token: null });
    localStorage.clear();
  },
}));
