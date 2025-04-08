import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  register: async (email, password, role) => {
    console.log("Sending Registration Request from store:", {
      email,
      password,
      role,
    });

    try {
      set({ loading: true, error: null });

      const res = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
        role,
      });

      console.log("Registration Success:", res.data);
      set({ user: res.data, loading: false });
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
