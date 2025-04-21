import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { employeeRoles } from "../../constants/hr/employees/employeeRoles";
import { useEmployeeStore } from "../../store/hr/employeesStore";
import { useProjectStore } from "../../store/projectStore";

// Last Updated
export const AssignEmployeeModel = ({ projectId, closeModal }) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");

  // Using Zustand store
  const { employees, fetchEmployees, loading } = useEmployeeStore();
  const { assignEmployees } = useProjectStore();

  useEffect(() => {
    fetchEmployees(); // Fetch employees when the component mounts
  }, [fetchEmployees]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployee || !selectedRole) {
      setError("Please select both employee and role.");
      return;
    }

    try {
      // Sending an array of objects with employeeId and role
      await assignEmployees(projectId, [
        { employeeId: selectedEmployee, role: selectedRole },
      ]);
      closeModal();
    } catch (err) {
      console.error("Failed to assign employee:", err);
      setError("Failed to assign employee. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Assign Employee to Project</h3>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center py-4">Loading employees...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Select Employee</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">-- Select Employee --</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.firstName} {emp.lastName}{" "}
                    {/* Concatenate first and last name */}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Assign Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">-- Select Role --</option>
                {employeeRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Assign
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
