import { create } from "zustand";
import { instance } from "../utils/axiosInstance";
import { API_ROUTES } from "../api/apiList";
import toast from "react-hot-toast";

export const useClientStore = create((set) => ({
  clients: [],
  loading: false,
  error: null,

  // Fetch clients
  fetchClients: async () => {
    set({ loading: true, error: null });

    try {
      const res = await instance.get(API_ROUTES.CLIENT.BASE);
      set({ clients: res.data?.data?.clients, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Failed to fetch clients:", error);
      toast.error(error.message);
    }
  },

  // Fetch single client
  fetchSingleClient: async (clientId) => {
    set({ loading: true, error: null });

    try {
      const res = await instance.get(API_ROUTES.CLIENT.GET_ONE(clientId));
      set({ loading: false });
      return res.data?.data?.client;
    } catch (error) {
      const backendError =
        error.response?.data?.error || error.message || "Something went wrong";

      set({ error: backendError, loading: false });
      console.error("Failed to fetch single client:", backendError);
      toast.error(backendError);
      throw error;
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
      toast.success("Client added");
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message);
      throw error;
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
      toast.success("Client deleted");

      return { success: true };
    } catch (error) {
      const backendError =
        error.response?.data?.error || error.message || "Something went wrong";

      set({ error: backendError, loading: false });
      console.error("Failed to delete client:", backendError);
      toast.error(backendError);

      return { success: false, error: backendError };
    }
  },

  // Update client
  updateClient: async (clientId, updatedData) => {
    set({ loading: true, error: null });
    delete updatedData._id;
    delete updatedData.createdAt;
    delete updatedData.__v;
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
      toast.success("Client updated");
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message);
      throw error;
    }
  },
}));
