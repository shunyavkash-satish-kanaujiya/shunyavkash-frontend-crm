import React from "react";
import { formatDate } from "../../utils/formatDate";

export const TaskCard = ({ task }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg flex flex-col space-y-2 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-indigo-700">{task.title}</h3>
        <span
          className={`text-xs text-white px-2 py-1 rounded ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
      </div>
      <p className="text-gray-500 text-sm">{task.description}</p>
      <div className="text-sm text-gray-600">
        <p>Status: {capitalizeFirst(task.status)}</p>
        <p>
          Start:{" "}
          {task.startDate
            ? formatDate(new Date(task.startDate), "dd/MM/yyyy")
            : "N/A"}
        </p>
        <p>
          End:{" "}
          {task.endDate
            ? formatDate(new Date(task.endDate), "dd/MM/yyyy")
            : "N/A"}
        </p>
        <p>Billable Hours: {task.billableHours}</p>
        <p>
          Assigned To:{" "}
          {task.assignedEmployees && task.assignedEmployees.length > 0
            ? task.assignedEmployees
                .map((emp) => `${emp.firstName} ${emp.lastName}`)
                .join(", ")
            : "Unassigned"}
        </p>
      </div>
    </div>
  );
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "urgent":
      return "bg-red-500";
    case "high":
      return "bg-orange-400";
    case "normal":
      return "bg-blue-400";
    case "low":
      return "bg-green-400";
    default:
      return "bg-gray-400";
  }
};

const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
