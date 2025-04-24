import { create } from "zustand";
import axios from "axios";

export const useProjectStore = create((set) => ({
  projects: [],
  archivedProjects: [],
  editingProject: null,
  setEditingProject: (project) => set({ editingProject: project }),
  loading: false,
  error: null,

  // Fetch Active Projects
  fetchProjects: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get("http://localhost:5000/api/project");
      set({ projects: res.data, loading: false });
      console.log("Fetched projects:", res.data);
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

  // Archive Project
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

  // Restore Project
  restoreProject: async (projectId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/project/${projectId}/archive`,
        { isArchived: false }
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

  // Assign Employees
  assignEmployees: async (projectId, employeesWithRoles) => {
    try {
      console.log("Employees with roles to assign:", employeesWithRoles);

      // Send request to backend to assign employees to project
      const res = await axios.put(
        `http://localhost:5000/api/project/${projectId}/assign`,
        { employees: employeesWithRoles }
      );

      console.log("Assigned employees response:", res.data);

      // Alert if any employees were already assigned (skipped)
      if (res.data.skippedEmployees && res.data.skippedEmployees.length > 0) {
        const skippedNames = employeesWithRoles
          .filter((emp) => res.data.skippedEmployees.includes(emp.employeeId))
          .map((emp) => emp.name)
          .join(", ");

        alert(`These employees are already assigned: ${skippedNames}`);
      } else {
        alert("Employees assigned successfully!");
      }

      // Update the project data in the store with updated project info
      set((state) => ({
        projects: state.projects.map((p) =>
          p._id === projectId ? res.data : p
        ),
      }));
    } catch (error) {
      console.error(
        "Failed to assign employees:",
        error.response ? error.response.data : error
      );
      throw error;
    }
  },
}));
