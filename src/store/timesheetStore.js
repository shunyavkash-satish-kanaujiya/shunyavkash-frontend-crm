import { create } from "zustand";
import axios from "axios";

export const useTimesheetStore = create((set, get) => ({
  timesheets: [],
  loading: false,
  error: null,
  filters: { status: "All", view: "daily", date: new Date(), project: null },
  activeTimesheet: null,

  // Fetch Timesheets
  fetchTimesheets: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/timesheet", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ensure we have valid data structure
      const processed = data.map((t) => ({
        ...t,
        employee: t.employee || null,
        project: t.project || null,
      }));

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

      console.log("Timesheet added:", data);

      // Optimistically add new timesheet to top
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

      console.log("Timesheet updated:", data);

      // Optimistically update the specific timesheet locally
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

  // Refresh Timesheets
  refreshTimesheets: async () => {
    await get().fetchTimesheets();
  },

  // Update Filters
  updateFilters: (updatedFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...updatedFilters },
    })),

  setActiveTimesheet: (entry) => set({ activeTimesheet: entry }),

  // Optional: Approve/Reject logic
  updateStatus: async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/timesheet/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optimistically update status locally
      set((state) => ({
        timesheets: state.timesheets.map((ts) =>
          ts._id === id ? { ...ts, status } : ts
        ),
      }));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  },

  // Finalize Timesheet
  finalizeTimesheet: async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/timesheet/${id}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optimistically set status to 'Finalized'
      set((state) => ({
        timesheets: state.timesheets.map((ts) =>
          ts._id === id ? { ...ts, status: "Finalized" } : ts
        ),
      }));
    } catch (err) {
      console.error("Failed to finalize timesheet:", err);
    }
  },
}));
