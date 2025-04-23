import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { employeeRoles } from "../../constants/hr/employee/employeeRoles";
import { useEmployeeStore } from "../../store/hr/employeesStore";
import { useProjectStore } from "../../store/projectStore";

export const AssignEmployeeModel = ({ project, projectId, closeModal }) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const { employees, fetchEmployees } = useEmployeeStore();
  const { assignEmployees } = useProjectStore();

  useEffect(() => {
    fetchEmployees();
    // fade-in after mounting
    setTimeout(() => setIsVisible(true), 10);
  }, [fetchEmployees]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => closeModal(), 100); // transition duration
  };

  const handleAssign = async () => {
    if (!selectedEmployee || !selectedRole) {
      setError("Both employee and role are required.");
      return;
    }

    if (!project?.assignedEmployees) {
      setError("Project data not loaded.");
      return;
    }

    const isAlreadyAssigned = project.assignedEmployees.some(
      (e) => e.employeeId === selectedEmployee || e._id === selectedEmployee
    );

    if (isAlreadyAssigned) {
      setError("This employee is already assigned to the project.");
      return;
    }

    const emp = employees.find((e) => e._id === selectedEmployee);
    if (!emp) {
      setError("Selected employee not found.");
      return;
    }

    const employeeToAssign = {
      employeeId: emp._id,
      firstname: emp.firstName,
      lastname: emp.lastName,
      role: selectedRole,
    };

    try {
      await assignEmployees(projectId, [employeeToAssign]);
      handleClose(); // Use transition close
    } catch (err) {
      setError("Failed to assign employee.");
      console.error(err);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4 relative transform transition-all duration-300 scale-100">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold">Assign Employee</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="space-y-2">
          <label className="block text-sm font-medium">Employee</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full border px-3 py-2 rounded capitalize tracking-wide"
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id} className="tracking-wide">
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium mt-3">Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Select Role --</option>
            {employeeRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleAssign}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};
