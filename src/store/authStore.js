import { create } from "zustand";
import axios from "axios";
import hashPassword from "../utils/hashPassword.js";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  register: async (email, password, role) => {
    try {
      set({ loading: true, error: null });

      // Pasword Hashing
      const hashedPassword = await hashPassword(password);

      console.log("Sending Registration Request from store:", {
        email,
        hashedPassword,
        role,
      });

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          email,
          password: hashedPassword,
          role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration Success:", res.data);

      set({
        user: res.data.user || res.data,
        token: res.data.token || null,
        loading: false,
      });
    } catch (err) {
      console.error("Registration Error:", err);
      set({
        error:
          err.response?.data?.message || err.message || "Registration failed",
        loading: false,
      });
    }
  },
}));

export default useAuthStore;
