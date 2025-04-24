import { create } from "zustand";
import axios from "axios";

export const useTimesheetStore = create((set) => ({
  timesheets: [],
  filters: { status: "All", view: "daily", date: new Date(), project: null },
  activeTimesheet: null,

  // Fetch Timesheets
  fetchTimesheets: async () => {
    try {
      const { data } = await axios.get("/api/timesheets");
      set({ timesheets: data });
    } catch (err) {
      console.error(err);
    }
  },

  // Add Timesheet
  addTimesheet: async (formData) => {
    try {
      const { data } = await axios.post("/api/timesheets", formData);
      set((state) => ({ timesheets: [data, ...state.timesheets] }));
    } catch (err) {
      console.error(err);
    }
  },

  // Update Filters
  updateFilters: (updatedFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...updatedFilters },
    })),

  setActiveTimesheet: (entry) => set({ activeTimesheet: entry }),

  // Optional: approve/reject logic
  updateStatus: async (id, status) => {
    try {
      await axios.patch(`/api/timesheets/${id}/status`, { status });
      set((state) => ({
        timesheets: state.timesheets.map((ts) =>
          ts._id === id ? { ...ts, status } : ts
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  // Finalize Timesheet
  finalizeTimesheet: async (id) => {
    try {
      await axios.patch(`/api/timesheet/${id}/finalize`);
      set((state) => ({
        timesheets: state.timesheets.map((ts) =>
          ts._id === id ? { ...ts, status: "Finalized" } : ts
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  },
}));
