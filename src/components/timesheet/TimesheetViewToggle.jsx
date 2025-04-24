// TimesheetViewToggle.jsx
import React from "react";

export const TimesheetViewToggle = ({ currentView, onToggleView }) => {
  return (
    <div className="flex justify-between mb-4">
      <button
        className={`px-4 py-2 rounded-md ${
          currentView === "daily" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => onToggleView("daily")}
      >
        Daily View
      </button>
      <button
        className={`px-4 py-2 rounded-md ${
          currentView === "weekly" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => onToggleView("weekly")}
      >
        Weekly View
      </button>
    </div>
  );
};
