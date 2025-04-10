import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
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

      const user = res.data.user || res.data;
      const token = res.data.token || null;

      localStorage.setItem("token", token);

      set({ user, token, loading: false });
    } catch (err) {
      set({
        error:
          err.response?.data?.message || err.message || "Registration failed",
        loading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
