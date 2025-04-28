import React from "react";
import { useTimesheetStore } from "../../store/timesheetStore";
import { TimesheetRow } from "../timesheet/TimesheetRow";

export const TimesheetTable = ({
  timesheets,
  setActiveTab,
  setEditingTimesheet,
  viewMode,
}) => {
  const { updateStatus } = useTimesheetStore((state) => state);

  if (timesheets.length === 0) {
    return <div>No timesheets available.</div>;
  }

  // Function to handle status change
  const handleStatusChange = (id, status) => {
    updateStatus(id, status); // Calls the updateStatus method from store
  };

  return (
    <div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Project</th>
            <th>Date</th>
            <th>Hours</th>
            <th>Status</th>
            {viewMode === "daily" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {timesheets.map((timesheet) => (
            <TimesheetRow
              key={timesheet._id}
              timesheet={timesheet}
              setActiveTab={setActiveTab}
              setEditingTimesheet={setEditingTimesheet}
              onStatusChange={handleStatusChange} // Pass the status change handler to each row
              onEdit={() => {
                setEditingTimesheet(timesheet); // Set the current timesheet to be edited
                setActiveTab("timesheetForm"); // Switch to form tab
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
