import React, { useState } from "react";
import { useEmployeeStore } from "../../store/hr/employeesStore";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { TABS } from "../../constants/activeTab";
import { ArrowPathIcon } from "@heroicons/react/24/solid"; // Spinner icon

export const EmployeeCard = ({ employee, setEmployeeTab }) => {
  const { setEditingEmployee, deleteEmployee } = useEmployeeStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteEmployee(
        employee._id,
        employee.avatarPublicId,
        employee.documents
      );
      alert("Employee deleted successfully");
    } catch (error) {
      alert("Error deleting employee");
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setEditingEmployee(employee);
    setEmployeeTab(TABS.ADD_EMPLOYEE);
  };

  return (
    <div className="max-w-xs rounded-lg shadow-lg bg-white p-4">
      <img
        src={employee.avatar || "default-avatar.png"}
        alt="Employee Avatar"
        className="w-24 h-24 rounded-full mx-auto object-cover"
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
          onClick={handleEdit}
          disabled={isDeleting}
          className="bg-blue-500 text-white p-2 rounded-md flex items-center gap-2 disabled:opacity-50"
        >
          <PencilSquareIcon className="h-5 w-5" />
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 text-white p-2 rounded-md flex items-center gap-2 disabled:opacity-50"
        >
          {isDeleting ? (
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
          ) : (
            <XMarkIcon className="h-5 w-5" />
          )}
          Delete
        </button>
      </div>
    </div>
  );
};
