import React from "react";
import { useNavigate } from "react-router-dom";
import { useEmployeeStore } from "../../store/hr/employeesStore";
import { deleteEmployee } from "../../hooks/hr/employees/useEmployeeActions";

export const EmployeeCard = ({ employee }) => {
  const { setEditingEmployee } = useEmployeeStore();
  const navigate = useNavigate();

  const handleDelete = async (employeeId, avatarPublicId, documents) => {
    try {
      await deleteEmployee(employeeId, avatarPublicId, documents);
      alert("Employee deleted successfully");
    } catch (error) {
      alert("Error deleting employee");
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    navigate("/hr/employee-form");
  };

  return (
    <div className="max-w-xs rounded-lg shadow-lg bg-white p-4">
      <img
        src={employee.avatar || "default-avatar.png"}
        alt="Employee Avatar"
        className="w-24 h-24 rounded-full mx-auto"
      />
      <div className="text-center mt-4">
        <h3 className="font-semibold text-xl">{`${employee.firstName} ${employee.lastName}`}</h3>
        <p className="text-gray-500">{employee.designation}</p>
        <p
          className={`mt-2 px-3 py-1 rounded-full text-sm ${
            employee.status === "Active"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {employee.status}
        </p>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => handleEdit(employee)}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Edit
        </button>
        <button
          onClick={() =>
            handleDelete(
              employee._id,
              employee.avatarPublicId,
              employee.documents
            )
          }
          className="bg-red-500 text-white p-2 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
