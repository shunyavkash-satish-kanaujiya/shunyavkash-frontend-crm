import { create } from "zustand";
import { instance } from "../utils/axiosInstance";
import { API_ROUTES } from "../api/apiList";
import toast from "react-hot-toast";

export const useTaskStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,
  fetchTasksByProject: async (projectId) => {
    try {
      set({ loading: true, error: null });
      const res = await instance.get(
        API_ROUTES.TASKS.GET_BY_PROJECT(projectId)
      );
      // console.log(projectId);
      // console.log(res.data);
      set({ tasks: res.data.tasks, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message);
    }
  },

  addTask: async (taskData) => {
    try {
      set({ loading: true, error: null });
      const res = await instance.post(API_ROUTES.TASKS.CREATE, taskData);
      console.log("TASK DATA: ", taskData);
      set((state) => ({ tasks: [...state.tasks, res.data], loading: false }));
      toast.success("Task created");
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message);
      throw error;
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const res = await instance.put(API_ROUTES.TASKS.UPDATE(taskId), taskData);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? res.data : task
        ),
      }));
      toast.success("Task updated");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  },

  deleteTask: async (taskId) => {
    try {
      await instance.delete(API_ROUTES.TASKS.DELETE(taskId));
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== taskId),
      }));
      toast.success("Task deleted");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  },
}));
