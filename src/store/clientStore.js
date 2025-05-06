import { create } from "zustand";
import { instance } from "../utils/axiosInstance";
import { API_ROUTES } from "../api/apiList";

export const useClientStore = create((set) => ({
  clients: [],
  loading: false,
  error: null,

  // Fetch clients
  fetchClients: async () => {
    set({ loading: true, error: null });

    try {
      const res = await instance.get(API_ROUTES.CLIENT.BASE);
      set({ clients: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error("Failed to fetch clients:", err);
    }
  },

  // Create new client
  addClient: async (clientData) => {
    set({ loading: true, error: null });

    try {
      const res = await instance.post(API_ROUTES.CLIENT.CREATE, clientData);

      set((state) => ({
        clients: [...state.clients, res.data],
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Delete client
  deleteClient: async (clientId) => {
    set({ loading: true, error: null });

    try {
      await instance.delete(API_ROUTES.CLIENT.DELETE(clientId));

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

  // Update client
  updateClient: async (clientId, updatedData) => {
    set({ loading: true, error: null });

    try {
      const res = await instance.put(
        API_ROUTES.CLIENT.UPDATE(clientId),
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
