import React, { useState } from "react";
import { TimesheetRow } from "../timesheet/TimesheetRow";
import { useTimesheetStore } from "../../store/timesheetStore";
import { BarsArrowDownIcon } from "@heroicons/react/24/outline";

export const TimesheetTable = ({
  timesheets,
  setActiveTab,
  setEditingTimesheet,
  viewMode,
}) => {
  const [openTimesheetId, setOpenTimesheetId] = useState(null);

  if (timesheets.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No timesheets available.
      </div>
    );
  }

  const FinalizeTimesheet = useTimesheetStore.getState().finalizeTimesheet;

  return (
    <div className="overflow-x-auto space-y-4 shadow-md rounded-md p-2">
      <table className="min-w-full divide-y divide-gray-200 text-sm overflow-hidden rounded-lg">
        <thead className="bg-indigo-50">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
              <BarsArrowDownIcon className="w-6 h-6 inline" />
            </th>
            <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
              Employee
            </th>
            <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
              Project
            </th>
            <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
              Description
            </th>
            <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
              Date
            </th>
            <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
              Hours
            </th>
            <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
              Action
            </th>
            {viewMode === "daily" && (
              <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                Actions
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Finalized
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {timesheets.map((timesheet) => (
            <TimesheetRow
              key={timesheet._id}
              timesheet={timesheet}
              setActiveTab={setActiveTab}
              setEditingTimesheet={setEditingTimesheet}
              finalizeTimesheet={FinalizeTimesheet}
              openTimesheetId={openTimesheetId}
              setOpenTimesheetId={setOpenTimesheetId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
