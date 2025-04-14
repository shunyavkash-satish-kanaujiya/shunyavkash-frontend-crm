import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  register: async (email, password, role) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { email, password, role },
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
    } catch (err) {
      console.error("Fetch user failed:", err.message);
      set({ error: "Failed to fetch user", user: null, token: null });
      localStorage.removeItem("token");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
