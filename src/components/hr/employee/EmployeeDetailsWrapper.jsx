// pages/hr/EmployeeDetailsWrapper.jsx
import { useParams } from "react-router-dom";
import { EmployeeDetails } from "./EmployeeDetails.jsx";

export const EmployeeDetailsWrapper = () => {
  const { employeeId } = useParams();

  return <EmployeeDetails employeeId={employeeId} />;
};
