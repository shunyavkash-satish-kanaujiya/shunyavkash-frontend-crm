import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import toast from "react-hot-toast";
import { useTimesheetStore } from "../../store/timesheetStore";
import { TABS } from "../../constants/activeTab";
import {
  statusStyles,
  statusOptions,
} from "../../constants/timesheet/timesheetOptions";

export const TimesheetRow = ({
  timesheet,
  setActiveTab,
  setEditingTimesheet,
}) => {
  const { employee, project, description, date, hoursWorked, _id, status } =
    timesheet;
  const updateStatus = useTimesheetStore((state) => state.updateStatus);

  const deleteTimesheet = useTimesheetStore((state) => state.deleteTimesheet);
  const setActiveTimesheet = useTimesheetStore(
    (state) => state.setActiveTimesheet
  );

  console.log("EDITING TIMESHEET:", timesheet);

  const handleEdit = () => {
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

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await updateStatus(_id, newStatus);
      toast.success("Status updated!");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status.");
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
      <td className="px-6 py-4 text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-3xs">
        {description?.join(", ")}
      </td>
      <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
        {date ? new Date(date).toLocaleDateString() : "-"}
      </td>
      <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
        {hoursWorked}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={status}
          onChange={handleStatusChange}
          className={`text-xs font-medium capitalize rounded-md px-2 py-2 focus:outline-none ${
            statusStyles[status?.toLowerCase()] || "bg-gray-100 text-gray-800"
          }`}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option} className="text-gray-800">
              {option}
            </option>
          ))}
        </select>
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
