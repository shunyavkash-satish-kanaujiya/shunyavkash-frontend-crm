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

  fetchTimesheets: async () => {
    set({ loading: true, error: null });
    try {
      const authState = useAuthStore.getState();
      const role = authState.user?.role;
      const { data } = await instance.get(API_ROUTES.TIMESHEET.BASE);

      const timesheetArray = Array.isArray(data?.data?.timesheets)
        ? data?.data?.timesheets
        : data?.data?.timesheets || [];

      let processed;

      if (role === "Admin") {
        processed = timesheetArray.map((t) => ({
          ...t,
          employee: t.user || null,
          project: t.project || null,
        }));
      } else {
        const userId = authState.user?._id;
        processed = timesheetArray
          .filter((t) => t.user?._id === userId)
          .map((t) => ({
            ...t,
            employee: t.user || null,
            project: t.project || null,
          }));
      }

      console.log("Timesheets:", timesheetArray);
      set({ timesheets: processed, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch timesheets",
        loading: false,
      });
      toast.error(error.response?.data?.message);
      throw error;
    }
  },

  // Add Timesheet
  addTimesheet: async (formData) => {
    try {
      console.log("data", formData);

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

      toast.success("Timesheet added");
      return data;
    } catch (error) {
      console.error("Failed to add timesheet:", error);
      toast.error(error.response?.data?.message);
      throw error;
    }
  },

  // Update Timesheet
  updateTimesheet: async (timesheet) => {
    try {
      let payload = {
        date: timesheet?.date,
        description: timesheet?.description,
        employee: timesheet?.employee,
        hoursWorked: timesheet?.hoursWorked,
        project: timesheet?.project,
        status: timesheet?.status,
      };
      const { data } = await instance.put(
        API_ROUTES.TIMESHEET.UPDATE(timesheet._id),
        payload,
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

      toast.success("Timesheet updated");
      return data;
    } catch (error) {
      console.error("Failed to update timesheet:", error);
      toast.error(error.response?.data?.message);
      throw error;
    }
  },

  // Delete Timesheet
  deleteTimesheet: async (id) => {
    try {
      await instance.delete(API_ROUTES.TIMESHEET.DELETE(id));

      set((state) => ({
        timesheets: state.timesheets.filter((ts) => ts._id !== id),
      }));
      toast.success("Timesheet deleted");
    } catch (error) {
      console.error("Failed to delete timesheet:", error);
      toast.error(error.response?.data?.message);
      throw error;
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
    } catch (error) {
      console.error("Failed to update status:", error);
      throw error;
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

      toast.success("Timesheet finalized");
      return data;
    } catch (error) {
      console.error("Failed to finalize timesheet:", error);
      toast.error(error.response?.data?.message);
      throw error;
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

      toast.success("Timesheet description updated");
      return data;
    } catch (error) {
      console.error("Failed to update description:", error.message);
      toast.error(error.message);
      throw error;
    }
  },
}));
