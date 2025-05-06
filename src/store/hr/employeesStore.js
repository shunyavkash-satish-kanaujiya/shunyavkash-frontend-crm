import { create } from "zustand";
import { instance } from "../../utils/axiosInstance";
import { API_ROUTES } from "../../api/apiList";

export const useEmployeeStore = create((set) => ({
  employees: [],
  editingEmployee: null,
  loading: false,
  error: null,

  // Fetch Employees
  fetchEmployees: async () => {
    try {
      set({ loading: true });
      const res = await instance.get(API_ROUTES.EMPLOYEES.BASE);
      set({ employees: res.data, loading: false });
      console.log("Employees:", res.data);
    } catch (error) {
      set({ loading: false, error: error.message });
      console.error("Failed to fetch employees:", error);
    }
  },

  // Fetch Single Employee
  fetchEmployee: async (employeeId) => {
    try {
      set({ loading: true });
      const res = await instance.get(API_ROUTES.EMPLOYEES.GET_ONE(employeeId));
      set({ editingEmployee: res.data, loading: false });
      return res.data;
    } catch (err) {
      set({ loading: false, error: err.message });
      console.error("Failed to fetch employee details:", err);
      return null;
    }
  },

  // Remove tag from employee
  removeTag: async (employeeId, type, value) => {
    try {
      const currentEmployee = await useEmployeeStore
        .getState()
        .fetchEmployee(employeeId);
      if (!currentEmployee || !Array.isArray(currentEmployee[type]))
        return null;

      const updated = currentEmployee[type].filter((item) => item !== value);

      await instance.put(API_ROUTES.EMPLOYEES.REMOVE_TAG(employeeId), {
        [type]: updated,
      });

      const updatedEmployee = { ...currentEmployee, [type]: updated };

      set({ editingEmployee: updatedEmployee });

      set((state) => ({
        employees: state.employees.map((emp) =>
          emp._id === employeeId ? updatedEmployee : emp
        ),
      }));

      return updatedEmployee;
    } catch (err) {
      console.error(`Failed to remove ${type}:`, err);
      return null;
    }
  },

  // Add Employee
  addEmployee: async (employeeData) => {
    try {
      const res = await instance.post(
        API_ROUTES.EMPLOYEES.CREATE,
        employeeData
      );
      set((state) => ({
        employees: [...state.employees, res.data],
      }));
    } catch (error) {
      console.error("Error adding employee:", error);
      throw error;
    }
  },

  // Update Employee
  updateEmployee: async (employeeId, updatedData) => {
    try {
      const res = await instance.put(
        API_ROUTES.EMPLOYEES.UPDATE(employeeId),
        updatedData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      set((state) => ({
        employees: state.employees.map((emp) =>
          emp._id === employeeId ? res.data : emp
        ),
      }));
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  },

  // Delete Employee
  deleteEmployee: async (employeeId, avatarPublicId, documents) => {
    try {
      console.log("Deleting employee with ID:", employeeId);
      console.log("Avatar Public ID:", avatarPublicId);
      console.log("Documents:", documents);

      await instance.delete(API_ROUTES.EMPLOYEES.DELETE(employeeId), {
        data: { avatarPublicId, documents },
      });

      set((state) => ({
        employees: state.employees.filter((emp) => emp._id !== employeeId),
      }));
    } catch (error) {
      const errorMessage =
        error?.res?.data?.message ||
        "Something went wrong while deleting employee";

      alert(errorMessage);

      console.error("Error deleting employee:", error);
    }
  },

  // Set editing employee
  setEditingEmployee: (employee) => set({ editingEmployee: employee }),
}));
