import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "./authStore";
import { instance } from "../utils/axiosInstance";
import { API_ROUTES } from "../api/apiList";

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
      const authState = useAuthStore.getState();
      const role = authState.user?.role;
      const { data } = await instance.get(API_ROUTES.TIMESHEET.BASE);

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
      const { data } = await instance.post(
        API_ROUTES.TIMESHEET.CREATE,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
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
      const { data } = await instance.put(
        API_ROUTES.TIMESHEET.UPDATE(timesheet._id),
        timesheet,
        {
          headers: {
            "Content-Type": "application/json",
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
      await instance.delete(API_ROUTES.TIMESHEET.DELETE(id));

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
      const { data } = await instance.put(
        API_ROUTES.TIMESHEET.UPDATE_STATUS(id),
        { status },
        {
          headers: {
            "Content-Type": "application/json",
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
      const { data } = await instance.put(
        API_ROUTES.TIMESHEET.FINALIZE_TIMESHEET(id),
        { isFinalized: true },
        {
          headers: {
            "Content-Type": "application/json",
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

  // Update Description
  updateDescription: async (id, description) => {
    try {
      const { data } = await instance.put(
        API_ROUTES.TIMESHEET.UPDATE_DESCRIPTION(id),
        { description },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      set((state) => ({
        timesheets: state.timesheets.map((timesheet) =>
          timesheet._id === id ? { ...timesheet, description } : timesheet
        ),
      }));

      return data;
    } catch (error) {
      console.error("Failed to update description:", error.message);
      toast.error("Failed to update description.");
      throw error;
    }
  },
}));
