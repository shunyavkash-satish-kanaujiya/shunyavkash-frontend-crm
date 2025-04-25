import React from "react";

export const TimesheetRow = ({
  timesheet,
  setActiveTab,
  setEditingTimesheet,
}) => {
  const { employee, project, date, hours, status, _id } = timesheet;

  const handleEdit = () => {
    setEditingTimesheet(timesheet);
    setActiveTab("ADD_TIMESHEET"); // Switch to form view to edit
  };

  return (
    <tr>
      <td>{employee?.name}</td>
      <td>{project?.name}</td>
      <td>{new Date(date).toLocaleDateString()}</td>
      <td>{hours}</td>
      <td>{status}</td>
      <td>
        <button onClick={handleEdit}>Edit</button>
        {/* You can add more actions like Delete/Approve here */}
      </td>
    </tr>
  );
};
