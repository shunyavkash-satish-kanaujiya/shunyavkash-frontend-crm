import { create } from "zustand";
import axios from "axios";

export const useEmployeeStore = create((set) => ({
  employees: [],
  editingEmployee: null,
  loading: false,
  error: null,

  // Fetch Employees
  fetchEmployees: async () => {
    try {
      set({ loading: true });

      const response = await axios.get("http://localhost:5000/api/employee");

      set({ employees: response.data, loading: false });
      console.log("Fetched employees:", response.data); // all employees
    } catch (error) {
      set({ loading: false, error: error.message });
      console.error("Failed to fetch employees:", error);
    }
  },

  // Add Employee
  addEmployee: async (employeeData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/employee",
        employeeData
      );
      set((state) => ({
        employees: [...state.employees, response.data],
      }));
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  },

  // Update Employee
  updateEmployee: async (employeeId, updatedData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/employee/${employeeId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      set((state) => ({
        employees: state.employees.map((emp) =>
          emp._id === employeeId ? response.data : emp
        ),
      }));
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  },

  // Delete Employee
  // deleteEmployee: async (employeeId, avatarPublicId, documents) => {
  //   try {
  //     // development only
  //     console.log("Deleting employee with ID:", employeeId);
  //     console.log("Avatar Public ID:", avatarPublicId);
  //     console.log("Documents:", documents);

  //     await axios.delete(`http://localhost:5000/api/employee/${employeeId}`, {
  //       data: { avatarPublicId, documents },
  //     });

  //     set((state) => ({
  //       employees: state.employees.filter((emp) => emp._id !== employeeId),
  //     }));
  //   } catch (error) {
  //     console.error("Error deleting employee:", error);
  //   }
  // },
  // Delete Employee
  deleteEmployee: async (employeeId, avatarPublicId, documents) => {
    try {
      console.log("Deleting employee with ID:", employeeId);
      console.log("Avatar Public ID:", avatarPublicId);
      console.log("Documents:", documents);

      await axios.delete(`http://localhost:5000/api/employee/${employeeId}`, {
        data: { avatarPublicId, documents },
      });

      set((state) => ({
        employees: state.employees.filter((emp) => emp._id !== employeeId),
      }));
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "Something went wrong while deleting employee";

      alert(errorMessage);

      console.error("Error deleting employee:", error);
    }
  },

  // Set editing employee
  setEditingEmployee: (employee) => set({ editingEmployee: employee }),
}));
