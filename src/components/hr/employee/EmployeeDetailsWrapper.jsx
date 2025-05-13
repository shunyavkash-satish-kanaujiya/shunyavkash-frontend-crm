// Fixed EmployeeDetailsWrapper.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { EmployeeDetails } from "./EmployeeDetails.jsx"; // Adjust the path based on your structure

export const EmployeeDetailsWrapper = () => {
  const { employeeId } = useParams();

  // Debug
  console.log("EmployeeDetailsWrapper rendered with ID:", employeeId);

  return <EmployeeDetails employeeId={employeeId} />;
};
