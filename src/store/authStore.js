import { create } from "zustand";
import { instance } from "../utils/axiosInstance";
import { API_ROUTES } from "../api/apiList";

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
    } catch (err) {
      set({
        error:
          err.response?.data?.message || err.message || "Registration failed",
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
    } catch (err) {
      console.error("Fetch user failed:", err.message);
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
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.error || "Something went wrong",
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
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.error || "Something went wrong",
      });
    }
  },

  // Clear error and message states
  clearMessages: () => set({ message: null, error: null }),

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
