import { useTasksStore } from "../../store/tasksStore";

export const useTasks = () => {
  const { tasks, fetchTasks, addTask, updateTask, deleteTask } =
    useTasksStore();
  return { tasks, fetchTasks, addTask, updateTask, deleteTask };
};
