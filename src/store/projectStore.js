import { create } from "zustand";
import axios from "axios";

export const useProjectStore = create((set) => ({
  // Separate states
  projects: [],
  archivedProjects: [],
  loading: false,
  error: null,

  // Fetch Active Projects
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

  // Fetch Archived Projects
  fetchArchivedProjects: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get("http://localhost:5000/api/project/archived");
      set({ archivedProjects: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error("Failed to fetch archived projects:", err);
    }
  },

  // Archive single project
  archiveProject: async (projectId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/project/${projectId}/archive`
      );
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== projectId),
      }));
    } catch (error) {
      console.error("Failed to archive project:", error);
    }
  },

  // Restore a single project
  restoreProject: async (projectId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/project/${projectId}/archive`,
        {
          isArchived: false,
        }
      );

      set((state) => {
        const restoredProject = state.archivedProjects.find(
          (p) => p._id === projectId
        );
        return {
          archivedProjects: state.archivedProjects.filter(
            (p) => p._id !== projectId
          ),
          projects: [
            ...state.projects,
            { ...restoredProject, isArchived: false },
          ],
        };
      });
    } catch (error) {
      console.error("Failed to restore project:", error);
    }
  },
}));
