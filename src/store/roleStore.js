// store/roleStore.js
import { create } from "zustand";

export const useRoleStore = create((set) => ({
  role: "Admin",
  setRole: (newRole) => set({ role: newRole }),
}));
