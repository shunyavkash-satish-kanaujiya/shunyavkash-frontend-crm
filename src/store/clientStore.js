// src/store/clientStore.js
import { create } from "zustand";
import axios from "axios";

export const useClientStore = create((set) => ({
  clients: [],
  loading: false,
  error: null,

  fetchClients: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get("http://localhost:5000/api/client/");
      set({ clients: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error("Failed to fetch clients:", err);
    }
  },

  addClient: async (clientData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(
        "http://localhost:5000/api/client/",
        clientData
      );
      set((state) => ({
        clients: [...state.clients, res.data],
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));
