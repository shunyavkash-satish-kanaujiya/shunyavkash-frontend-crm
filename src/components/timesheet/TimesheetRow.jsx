import {
  ArrowRightCircleIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { useTimesheetStore } from "../../store/timesheetStore";
import { TABS } from "../../constants/activeTab";
import {
  statusStyles,
  statusOptions,
} from "../../constants/timesheet/timesheetOptions";
import { TagInput } from "../ui/TagInput";
import { useAuthStore } from "../../store/authStore";

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
  const userRole = useAuthStore((state) => state.user?.role);

  const [loading, setLoading] = useState(false);
  const [localTags, setLocalTags] = useState(description || []);

  const handleFinalize = async () => {
    try {
      setLoading(true);
      await finalizeTimesheet(_id);
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
      } catch (error) {
        console.error("Failed to delete timesheet:", error);
      }
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await updateStatus(_id, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleRowClick = () => {
    if (isFinalized) {
      return;
    }
    setOpenTimesheetId(openTimesheetId === _id ? null : _id);
    setLocalTags(description || []);
  };

  const handleTagsChange = async (newTags) => {
    try {
      setLocalTags(newTags);
      await updateDescription(_id, newTags);
    } catch (error) {
      console.error("Failed to update description:", error);
    }
  };

  return (
    <>
      <tr className="hover:bg-indigo-50 transition cursor-pointer">
        {/* Toggle Arrow */}
        <td className="px-6 py-4">
          <button
            onClick={() => handleRowClick(_id)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <ArrowRightCircleIcon
              className={`w-5 h-5 transform transition-transform ${
                openTimesheetId === _id ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>
        </td>

        {/* Employee Info */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold uppercase">
              {employee?.email?.charAt(0).toUpperCase()}
            </div>
            <span className="capitalize">
              {employee?.email?.split("@")[0]?.replace(/\./g, " ") || "User"}
            </span>
          </div>
        </td>

        {/* Project Title */}
        <td className="px-6 py-4">{project?.title || "-"}</td>

        {/* Description */}
        <td className="px-6 py-4 max-w-3xs overflow-hidden text-ellipsis">
          {description?.join(", ")}
        </td>

        {/* Date */}
        <td className="px-6 py-4">
          {date ? new Date(date).toLocaleDateString() : "-"}
        </td>

        {/* Hours Worked */}
        <td className="px-6 py-4">{hoursWorked}</td>

        {/* Status */}
        <td className="px-6 py-4">
          <select
            value={status}
            onChange={handleStatusChange}
            disabled={isFinalized}
            className={`text-xs font-medium capitalize rounded-md px-2 py-2 ${
              statusStyles[status?.toLowerCase()] || "bg-gray-100 text-gray-800"
            } ${
              isFinalized ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""
            }`}
          >
            {statusOptions
              .filter((option) => {
                if (userRole === "Admin") return true;
                return option === "pending" || option === status;
              })
              .map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
          </select>
        </td>

        {/* Action Buttons */}
        <td className="px-6 py-4 space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            disabled={isFinalized}
            title="Edit"
            className={`${
              isFinalized
                ? "text-gray-400 cursor-not-allowed"
                : "text-indigo-600 hover:text-indigo-800"
            }`}
          >
            <PencilSquareIcon className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            title="Delete"
            className="text-red-600 hover:text-red-800"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </td>

        {/* Finalize Checkbox */}
        <td className="px-6 py-4 text-center">
          <input
            type="checkbox"
            checked={isFinalized}
            disabled={status !== "approved" || loading}
            onChange={(e) => {
              e.stopPropagation();
              handleFinalize();
            }}
            className={`h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${
              status !== "approved"
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          />
        </td>
      </tr>

      {/* Expanded Row (TagInput) */}
      {openTimesheetId === _id && !isFinalized && (
        <tr className="w-full">
          <td colSpan="12" className="p-4 bg-indigo-50">
            <div className="w-full">
              <TagInput
                tags={localTags}
                setTags={handleTagsChange}
                placeholder="Add description tags..."
              />
              <span className="text-xs text-gray-500 ml-1">
                Tap "enter" to save changes.
              </span>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
