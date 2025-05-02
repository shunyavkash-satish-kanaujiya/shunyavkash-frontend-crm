import {
  ArrowRightCircleIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useTimesheetStore } from "../../store/timesheetStore";
import { TABS } from "../../constants/activeTab";
import {
  statusStyles,
  statusOptions,
} from "../../constants/timesheet/timesheetOptions";
import { TagInput } from "../ui/TagInput";

export const TimesheetRow = ({
  timesheet,
  setActiveTab,
  setEditingTimesheet,
  finalizeTimesheet,
  openTimesheetId,
  setOpenTimesheetId,
}) => {
  const {
    employee,
    project,
    description,
    date,
    hoursWorked,
    _id,
    status,
    isFinalized,
  } = timesheet;

  const updateStatus = useTimesheetStore((state) => state.updateStatus);
  const deleteTimesheet = useTimesheetStore((state) => state.deleteTimesheet);
  const updateDescription = useTimesheetStore(
    (state) => state.updateDescription
  );
  const setActiveTimesheet = useTimesheetStore(
    (state) => state.setActiveTimesheet
  );

  const [loading, setLoading] = useState(false);
  const [localTags, setLocalTags] = useState(description || []);

  console.log("EMPLOYEE: ", employee.role);

  const handleFinalize = async () => {
    try {
      setLoading(true);
      await finalizeTimesheet(timesheet._id);
    } catch (error) {
      console.error("Error finalizing timesheet", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleRowClick = () => {
    if (isFinalized) {
      toast.error("Cannot edit! Timesheet is finalized.");
      return;
    }

    // Toggle open state for timesheet
    if (openTimesheetId === _id) {
      setOpenTimesheetId(null);
    } else {
      setOpenTimesheetId(_id);
      setLocalTags(description || []);
    }
  };

  const handleTagsChange = async (newTags) => {
    try {
      setLocalTags(newTags);
      await updateDescription(_id, newTags);
      toast.success("Description updated!");
    } catch (error) {
      console.error("Failed to update description:", error);
      toast.error("Failed to update description.");
    }
  };

  return (
    <>
      <tr
        className="hover:bg-indigo-50 transition cursor-pointer"
        onClick={handleRowClick}
      >
        {/* Toggle Arrow with smooth rotation */}
        <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
          <ArrowRightCircleIcon
            className={`w-5 h-5 inline text-indigo-600 transform transition-transform duration-300 ${
              openTimesheetId === _id ? "rotate-90" : "rotate-0"
            }`}
          />
        </td>

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
        {/* Status */}
        <td className="px-6 py-4 whitespace-nowrap">
          <select
            value={status}
            onChange={handleStatusChange}
            disabled={isFinalized}
            className={`text-xs font-medium capitalize rounded-md px-2 py-2 focus:outline-none ${
              statusStyles[status?.toLowerCase()] || "bg-gray-100 text-gray-800"
            } ${
              isFinalized ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""
            }`}
          >
            {statusOptions
              .filter((option) => {
                if (employee.role === "Admin") {
                  return true; // Admin
                } else {
                  return option === "pending"; // Others
                }
              })
              .map((option) => (
                <option key={option} value={option} className="text-gray-800">
                  {option}
                </option>
              ))}
          </select>
        </td>
        <td className="px-6 py-4 text-gray-800 whitespace-nowrap space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            disabled={isFinalized}
            className={`${
              isFinalized
                ? "text-gray-400 cursor-not-allowed"
                : "text-indigo-600 hover:text-indigo-800"
            }`}
            title="Edit"
          >
            <PencilSquareIcon className="w-5 h-5 inline" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <XMarkIcon className="w-5 h-5 inline" />
          </button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center ml-0 my-auto">
          <input
            type="checkbox"
            checked={isFinalized}
            disabled={status !== "approved" || loading}
            onChange={(e) => {
              e.stopPropagation();
              handleFinalize();
            }}
            className={`h-5 w-5 rounded flex justify-center align-middle border-gray-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 ${
              status !== "approved"
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          />
        </td>
      </tr>

      {/* Toggled Description Box */}
      {openTimesheetId === _id && !isFinalized && (
        <tr className="w-full">
          <td colSpan="12" className="p-4 bg-indigo-50">
            <div className="w-full mx-auto">
              <TagInput
                tags={localTags}
                setTags={handleTagsChange}
                placeholder="Add description tags..."
              />
            </div>
            <span className="ml-1 text-xs text-gray-500 font-medium">
              Tap "enter" to save changes.
            </span>
          </td>
        </tr>
      )}
    </>
  );
};
