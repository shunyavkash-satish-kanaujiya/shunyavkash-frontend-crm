import React from "react";
import { TimesheetRow } from "../timesheet/TimesheetRow";

export const TimesheetTable = ({
  timesheets,
  setActiveTab,
  setEditingTimesheet,
  viewMode,
}) => {
  if (timesheets.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No timesheets available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto space-y-4 shadow-md rounded-md p-2">
      <table className="min-w-full divide-y divide-gray-200 text-sm overflow-hidden rounded-lg">
        <thead className="bg-indigo-50">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
              Employee
            </th>
            <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
              Project
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
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {timesheets.map((timesheet) => (
            <TimesheetRow
              key={timesheet._id}
              timesheet={timesheet}
              setActiveTab={setActiveTab}
              setEditingTimesheet={setEditingTimesheet}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// import React from "react";
// import { useTimesheetStore } from "../../store/timesheetStore";
// import { TimesheetRow } from "../timesheet/TimesheetRow";

// export const TimesheetTable = ({
//   timesheets,
//   setActiveTab,
//   setEditingTimesheet,
//   viewMode,
// }) => {
//   const { updateStatus } = useTimesheetStore((state) => state);

//   console.log("TIMESHEET: ", timesheets);

//   if (timesheets.length === 0) {
//     return <div className="text-center">No timesheets available.</div>;
//   }

//   // Function to handle status change
//   const handleStatusChange = (id, status) => {
//     updateStatus(id, status); // Calls the updateStatus method from store
//   };

//   return (
//     <div>
//       <table className="min-w-full">
//         <thead>
//           <tr>
//             <th>Employee</th>
//             <th>Project</th>
//             <th>Date</th>
//             <th>Hours</th>
//             <th>Status</th>
//             <th>Action</th>
//             {viewMode === "daily" && <th>Actions</th>}
//           </tr>
//         </thead>
//         <tbody>
//           {timesheets.map((timesheet) => (
//             <TimesheetRow
//               key={timesheet._id}
//               timesheet={timesheet}
//               setActiveTab={setActiveTab}
//               setEditingTimesheet={setEditingTimesheet}
//               onStatusChange={handleStatusChange} // Pass the status change handler to each row
//               onEdit={() => {
//                 setEditingTimesheet(timesheet); // Set the current timesheet to be edited
//                 setActiveTab("timesheetForm"); // Switch to form tab
//               }}
//             />
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };
