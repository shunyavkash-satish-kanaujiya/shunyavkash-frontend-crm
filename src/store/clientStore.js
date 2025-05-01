import { create } from "zustand";
import axios from "axios";

export const useClientStore = create((set) => ({
  clients: [],
  loading: false,
  error: null,

  //   Get Clients
  fetchClients: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get("http://localhost:5000/api/client/");
      console.log("Clients: ", res.data);

      set({ clients: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error("Failed to fetch clients:", err);
    }
  },

  //   Create New Client
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

  // Remove Client
  deleteClient: async (clientId) => {
    try {
      set({ loading: true, error: null });

      await axios.delete(`http://localhost:5000/api/client/${clientId}`);

      set((state) => ({
        clients: state.clients.filter((client) => client._id !== clientId),
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      const backendError =
        err.response?.data?.error || err.message || "Something went wrong";

      set({ error: backendError, loading: false });
      console.error("Failed to delete client:", backendError);

      return { success: false, error: backendError };
    }
  },

  // Update Client
  updateClient: async (clientId, updatedData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(
        `http://localhost:5000/api/client/${clientId}`,
        updatedData
      );
      set((state) => ({
        clients: state.clients.map((client) =>
          client._id === clientId ? res.data : client
        ),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));
