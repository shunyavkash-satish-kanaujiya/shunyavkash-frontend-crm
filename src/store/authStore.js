import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  register: async (email, password) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

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

  fetchUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data;
      set({ user });
      console.log("Uers:", user);
    } catch (err) {
      console.error("Fetch user failed:", err.message);
      set({ error: "Failed to fetch user", user: null, token: null });
      localStorage.removeItem("token");
    }
  },
  forgotPassword: async (email) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      set({ loading: false, message: res.data.message });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.error || "Something went wrong",
      });
    }
  },

  resetPassword: async (token, password) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );
      set({ loading: false, message: res.data.message });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.error || "Something went wrong",
      });
    }
  },

  clearMessages: () => set({ message: null, error: null }),

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
