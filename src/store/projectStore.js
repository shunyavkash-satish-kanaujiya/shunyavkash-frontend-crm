import { create } from "zustand";
import { instance } from "../utils/axiosInstance";
import { API_ROUTES } from "../api/apiList";
import toast from "react-hot-toast";

export const useProjectStore = create((set) => ({
  projects: [],
  archivedProjects: [],
  editingProject: null,
  setEditingProject: (project) => set({ editingProject: project }),
  loading: false,
  projectLoading: false, // Loading state for single project
  error: null,

  // Fetch a single project by ID
  fetchProjectById: async (projectId) => {
    try {
      set({ projectLoading: true, error: null });
      const res = await instance.get(API_ROUTES.PROJECTS.GET_ONE(projectId));
      set({ editingProject: res.data, projectLoading: false });
      return res.data;
    } catch (error) {
      set({ error: error.message, projectLoading: false });
      console.error("Failed to fetch project details:", error);
      toast.error(error.message);
      return null;
    }
  },

  // Fetch all Active Projects
  fetchProjects: async () => {
    try {
      set({ loading: true, error: null });
      const res = await instance.get(API_ROUTES.PROJECTS.BASE);
      set({ projects: res.data, loading: false });
      console.log("Projects:", res.data);
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Failed to fetch projects:", error);
      toast.error(error.message);
    }
  },

  // Create New Project
  addProject: async (projectData) => {
    try {
      set({ loading: true, error: null });
      const res = await instance.post(API_ROUTES.PROJECTS.CREATE, projectData);
      set((state) => ({
        projects: [...state.projects, res.data],
        loading: false,
      }));
      toast.success("Project created");
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message);
      throw error;
    }
  },

  // Remove Project
  deleteProject: async (projectId) => {
    try {
      set({ loading: true, error: null });
      await instance.delete(API_ROUTES.PROJECTS.DELETE(projectId));
      set((state) => ({
        projects: state.projects.filter((project) => project._id !== projectId),
        loading: false,
      }));
      toast.success("Project deleted");
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Failed to delete project:", error);
      toast.error(error.message);
    }
  },

  // Update Project
  updateProject: async (projectId, updatedData) => {
    try {
      set({ loading: true, error: null });
      const res = await instance.put(
        API_ROUTES.PROJECTS.UPDATE(projectId),
        updatedData
      );
      set((state) => ({
        projects: state.projects.map((project) =>
          project._id === projectId ? res.data : project
        ),
        loading: false,
      }));
      toast.success("Project updated");
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message);
      throw error;
    }
  },

  // Update Project Priority
  updateProjectPriority: async (projectId, priority) => {
    try {
      await instance.put(
        API_ROUTES.PROJECTS.UPDATE_PROJECT_PRIORITY(projectId),
        { priority }
      );
      set((state) => ({
        projects: state.projects.map((project) =>
          project._id === projectId ? { ...project, priority } : project
        ),
      }));
      toast.success("Project priority updated");
    } catch (error) {
      console.error("Failed to update project priority", error);
      toast.error(error.message);
    }
  },

  // Fetch Archived Projects
  fetchArchivedProjects: async () => {
    try {
      set({ loading: true, error: null });
      const res = await instance.get(
        API_ROUTES.PROJECTS.FETCH_ARCHIVED_PROJECTS
      );
      console.log("Archived Projects:", res.data);
      set({ archivedProjects: res.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Failed to fetch archived projects:", error);
      toast.error(error.message);
    }
  },

  // Archive Project
  archiveProject: async (projectId) => {
    try {
      await instance.patch(API_ROUTES.PROJECTS.ARCHIVE_PROJECT(projectId));
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== projectId),
      }));
      toast.success("Project archived");
    } catch (error) {
      console.error("Failed to archive project:", error);
      toast.error(error.message);
    }
  },

  // Restore Project
  restoreProject: async (projectId) => {
    try {
      await instance.patch(
        API_ROUTES.PROJECTS.RESTORE_ARCHIVED_PROJECT(projectId),
        {
          isArchived: false,
        }
      );
      set((state) => {
        const restoredProject = state.archivedProjects.find(
          (p) => p._id === projectId
        );
        toast.success("Project restored");
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
      toast.error(error.message);
    }
  },

  // Assign Employees
  assignEmployees: async (projectId, employeesWithRoles) => {
    try {
      console.log("Employees with roles to assign:", employeesWithRoles);

      const res = await instance.put(
        API_ROUTES.PROJECTS.ASSIGN_EMPLOYEE(projectId),
        {
          employees: employeesWithRoles,
        }
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
      toast.success("Employees assigned.");
    } catch (error) {
      console.error(
        "Failed to assign employees:",
        error.response ? error.response.data : error
      );
      toast.error(error.message);
      throw error;
    }
  },

  // Remove Assigned Employee
  removeAssignedEmployee: async (projectId, employeeId) => {
    try {
      const res = await instance.put(
        API_ROUTES.PROJECTS.REMOVE_ASSIGNED_EMPLOYEE(projectId),
        {
          employeeId,
        }
      );

      set((state) => ({
        projects: state.projects.map((p) =>
          p._id === projectId ? res.data : p
        ),
      }));

      toast.success("Employee removed from project");
      return true;
    } catch (error) {
      console.error("Failed to remove assigned employee:", error);
      toast.error(error.message);
      return false;
    }
  },
}));
