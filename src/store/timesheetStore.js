import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./authStore";

export const useTimesheetStore = create((set, get) => ({
  timesheets: [],
  loading: false,
  error: null,
  filters: { status: "All", project: null },
  activeTimesheet: null,

  // Fetch Timesheets
  fetchTimesheets: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const authState = useAuthStore.getState();
      const role = authState.user?.role;

      const { data } = await axios.get("http://localhost:5000/api/timesheet", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let processed;

      if (role === "Admin") {
        processed = data.map((t) => ({
          ...t,
          employee: t.user || null,
          project: t.project || null,
        }));
      } else {
        const userId = authState.user?._id;
        processed = data
          .filter((t) => t.user?._id === userId)
          .map((t) => ({
            ...t,
            employee: t.user || null,
            project: t.project || null,
          }));
      }

      console.log("Timesheets:", data);
      set({ timesheets: processed, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch timesheets",
        loading: false,
      });
      throw err;
    }
  },

  // Add Timesheet
  addTimesheet: async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:5000/api/timesheet",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set((state) => ({
        timesheets: [data, ...state.timesheets],
      }));

      return data;
    } catch (err) {
      console.error("Failed to add timesheet:", err);
      throw err;
    }
  },

  // Update Timesheet
  updateTimesheet: async (timesheet) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `http://localhost:5000/api/timesheet/${timesheet._id}`,
        timesheet,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set((state) => ({
        timesheets: state.timesheets.map((ts) =>
          ts._id === data._id ? data : ts
        ),
      }));

      return data;
    } catch (err) {
      console.error("Failed to update timesheet:", err);
      throw err;
    }
  },

  // Delete Timesheet
  deleteTimesheet: async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/timesheet/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        timesheets: state.timesheets.filter((ts) => ts._id !== id),
      }));
    } catch (err) {
      console.error("Failed to delete timesheet:", err);
      throw err;
    }
  },

  // Refresh Timesheets
  refreshTimesheets: async () => {
    await get().fetchTimesheets();
  },

  // Update Filters
  updateFilters: (updatedFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...updatedFilters },
    })),

  // Set active
  setActiveTimesheet: (entry) => set({ activeTimesheet: entry }),

  // Update Status
  updateStatus: async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `http://localhost:5000/api/timesheet/${id}`,
        { status }, // Only send status
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set((state) => ({
        timesheets: state.timesheets.map((ts) =>
          ts._id === id
            ? {
                ...data,
                employee: data.user || null,
                project: data.project || null,
              }
            : ts
        ),
      }));

      return data;
    } catch (err) {
      console.error("Failed to update status:", err);
      throw err;
    }
  },
  // Finalize Timesheet
  finalizeTimesheet: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `http://localhost:5000/api/timesheet/${id}`,
        { isFinalized: true },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set((state) => ({
        timesheets: state.timesheets.map((ts) =>
          ts._id === id
            ? {
                ...data,
                employee: data.user || null,
                project: data.project || null,
              }
            : ts
        ),
      }));

      return data;
    } catch (err) {
      console.error("Failed to finalize timesheet:", err);
      throw err;
    }
  },

  // other states and actions
  updateDescription: async (id, description) => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");

      // Check if the token exists
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      // Send the PUT request with Authorization header
      const response = await axios.put(
        `http://localhost:5000/api/timesheet/${id}`,
        { description },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the timesheet state with the new description
      set((state) => ({
        timesheets: state.timesheets.map((timesheet) =>
          timesheet._id === id ? { ...timesheet, description } : timesheet
        ),
      }));

      return response.data;
    } catch (error) {
      console.error("Failed to update description:", error.message);
      toast.error("Failed to update description.");
      throw error;
    }
  },
}));
