import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  XMarkIcon,
  ArrowPathIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useEmployeeStore } from "../../store/hr/employeesStore";
import { TABS } from "../../constants/activeTab";
import { DropdownMenu } from "../ui/DropdownMenu";
import { getStatusColor } from "../../constants/hr/employees/statusColors";

export const EmployeeCard = ({ employee, setEmployeeTab }) => {
  const { setEditingEmployee, deleteEmployee } = useEmployeeStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${employee.firstName} ${employee.lastName}?`))
      return;
    setIsDeleting(true);
    try {
      await deleteEmployee(
        employee._id,
        employee.avatarPublicId,
        employee.documents
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setEditingEmployee(employee);
    setEmployeeTab(TABS.ADD_EMPLOYEE);
    setDropdownOpen(false);
  };

  const handleView = () => {
    setEditingEmployee(employee);
    setEmployeeTab(TABS.VIEW_EMPLOYEE);
    setDropdownOpen(false);
  };

  return (
    <div className="relative w-full bg-white shadow-md rounded-xl p-4 flex flex-col gap-4 overflow-hidden">
      {/* Dropdown trigger */}
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
      >
        <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
      </button>

      {/* Dropdown Menu */}
      <DropdownMenu
        isOpen={dropdownOpen}
        onClose={() => setDropdownOpen(false)}
      >
        <button
          onClick={handleView}
          className="w-full flex items-center gap-2 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
        >
          <EyeIcon className="w-4 h-4" /> View
        </button>
        <button
          onClick={handleEdit}
          className="w-full flex items-center gap-2 px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
        >
          <PencilSquareIcon className="w-4 h-4" /> Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full flex items-center gap-2 px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
        >
          {isDeleting ? (
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
          ) : (
            <XMarkIcon className="w-4 h-4" />
          )}
          Delete
        </button>
      </DropdownMenu>

      {/* Card content */}
      <div className="flex items-center gap-4">
        <img
          src={employee.avatar || "/default-avatar.png"}
          alt="Avatar"
          onError={(e) => (e.target.src = "/default-avatar.png")}
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm shrink-0"
        />

        <div className="flex flex-col min-w-0">
          <h3 className="text-lg font-bold text-gray-800 capitalize break-words">
            {employee.firstName} {employee.lastName}
          </h3>
          <p className="text-sm text-gray-500 break-words capitalize">
            {employee.designation || "—"}
          </p>
        </div>
      </div>

      {/* Departments */}
      <div className="flex flex-wrap gap-2">
        {employee.departments?.map((dept, idx) => (
          <span
            key={idx}
            className="bg-indigo-100 text-indigo-600 text-xs font-medium px-2 py-1 rounded-full break-words"
          >
            {dept}
          </span>
        ))}
      </div>

      {/* Status */}
      <div className="text-sm text-gray-700">
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            getStatusColor(employee.status).bg
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              getStatusColor(employee.status).dot
            }`}
          ></span>
          {employee.status || "N/A"}
        </span>
      </div>
    </div>
  );
};
