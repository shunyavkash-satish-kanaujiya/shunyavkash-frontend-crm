import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import toast from "react-hot-toast";
import { useTimesheetStore } from "../../store/timesheetStore";
import { TABS } from "../../constants/activeTab";

export const TimesheetRow = ({
  timesheet,
  setActiveTab,
  setEditingTimesheet,
}) => {
  const {
    employee,
    project,
    description,
    date,
    hoursWorked,
    isFinalized,
    _id,
  } = timesheet;

  const deleteTimesheet = useTimesheetStore((state) => state.deleteTimesheet);
  const setActiveTimesheet = useTimesheetStore(
    (state) => state.setActiveTimesheet
  );

  const handleEdit = () => {
    // Update both local and global state
    setEditingTimesheet(timesheet);
    setActiveTimesheet(timesheet);
    setActiveTab(TABS.ADD_TIMESHEET);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this timesheet?")) {
      try {
        await deleteTimesheet(_id);
        toast.success("Timesheet deleted successfully!");
      } catch (error) {
        console.error("Failed to delete timesheet:", error);
        toast.error("Failed to delete timesheet.");
      }
    }
  };

  return (
    <tr className="hover:bg-indigo-50 transition cursor-pointer">
      <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold uppercase">
            {employee?.email?.split("@")[0].charAt(0).toUpperCase()}
          </div>
          <span className="capitalize">
            {employee?.email
              ?.split("@")[0]
              .replace(/\./g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase()) || "User"}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
        {project?.title}
      </td>
      <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
        {description}
      </td>
      <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
        {date ? new Date(date).toLocaleDateString() : "-"}
      </td>
      <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
        {hoursWorked}
      </td>
      <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
        {isFinalized ? "Finalized" : "Pending"}
      </td>
      <td className="px-6 py-4 text-gray-800 whitespace-nowrap space-x-2">
        <button
          onClick={handleEdit}
          className="text-indigo-600 hover:text-indigo-800"
          title="Edit"
        >
          <PencilSquareIcon className="w-5 h-5 inline" />
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800"
          title="Delete"
        >
          <XMarkIcon className="w-5 h-5 inline" />
        </button>
      </td>
    </tr>
  );
};
