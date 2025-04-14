import { create } from "zustand";
import axios from "axios";

export const useProjectStore = create((set) => ({
  projects: [],
  loading: false,
  error: null,

  // Get Projects
  fetchProjects: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get("http://localhost:5000/api/project");
      set({ projects: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error("Failed to fetch projects:", err);
    }
  },

  // Create New Project
  addProject: async (projectData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(
        "http://localhost:5000/api/project",
        projectData
      );
      set((state) => ({
        projects: [...state.projects, res.data],
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Remove Project
  deleteProject: async (projectId) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`http://localhost:5000/api/project/${projectId}`);
      set((state) => ({
        projects: state.projects.filter((project) => project._id !== projectId),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error("Failed to delete project:", err);
    }
  },

  // Update Project
  updateProject: async (projectId, updatedData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(
        `http://localhost:5000/api/project/${projectId}`,
        updatedData
      );
      set((state) => ({
        projects: state.projects.map((project) =>
          project._id === projectId ? res.data : project
        ),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Update Priority
  updateProjectPriority: async (projectId, priority) => {
    try {
      await axios.put(`http://localhost:5000/api/project/${projectId}`, {
        priority,
      });

      // Dynamically update the priority
      set((state) => ({
        projects: state.projects.map((project) =>
          project._id === projectId ? { ...project, priority } : project
        ),
      }));
    } catch (error) {
      console.error("Failed to update project priority", error);
    }
  },
}));
