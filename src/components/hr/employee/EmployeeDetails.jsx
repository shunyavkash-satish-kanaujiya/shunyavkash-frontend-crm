import { useEffect, useState, useCallback } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEmployeeStore } from "../../../store/hr/employeesStore.js";
import { getStatusColor } from "../../../constants/hr/employee/statusColors.js";

export const EmployeeDetails = ({ employeeId, goBack }) => {
  const [employee, setEmployee] = useState(null);
  const { setEditingEmployee } = useEmployeeStore();

  const fetchEmployee = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/employee/${employeeId}`
      );
      setEmployee(res.data);
      setEditingEmployee(res.data);
    } catch (err) {
      console.error("Failed to fetch employee details:", err);
    }
  }, [employeeId, setEditingEmployee]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const handleRemoveTag = async (type, value) => {
    if (!employee || !Array.isArray(employee[type])) return;

    const updated = employee[type].filter((item) => item !== value);
    const updatedEmployee = { ...employee, [type]: updated };

    try {
      await axios.put(`http://localhost:5000/api/employee/${employeeId}`, {
        [type]: updated,
      });
      setEmployee(updatedEmployee);
      setEditingEmployee(updatedEmployee);
    } catch (err) {
      console.error(`Failed to remove ${type}:`, err);
    }
  };

  // Fix for goBack function
  const handleGoBack = (e) => {
    e.preventDefault();
    if (typeof goBack === "function") {
      goBack();
    }
  };

  if (!employee) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Back Button with fixed handler */}
      <button
        onClick={handleGoBack}
        className="flex items-center text-indigo-600 hover:underline"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-1" />
        Back
      </button>

      {/* Employee Info */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex gap-6 items-center">
          <img
            src={employee.avatar || "/default-avatar.png"}
            alt="Avatar"
            onError={(e) => (e.target.src = "/default-avatar.png")}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="font-bold text-xl capitalize mb-2">
              {employee.firstName} {employee.lastName}
            </h2>
            {/* Designations */}
            {/* <div className="bg-white rounded-xl shadow p-4"> */}
            {/* <h3 className="text-lg font-semibold mb-3">Designations</h3> */}
            {Array.isArray(employee.designation) &&
            employee.designation.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {employee.designation.map((desig, index) => (
                  <span
                    key={index}
                    className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {desig}
                    <button
                      onClick={() => handleRemoveTag("designation", desig)}
                      className="ml-2 text-indigo-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No designations assigned yet.</p>
            )}
            {/* </div> */}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <p>
            <strong>Email:</strong> {employee.email || "—"}
          </p>
          <p>
            <strong>Phone:</strong> {employee.phone || "—"}
          </p>
          <p>
            <strong>Payable:</strong> {employee.salary || "—"}
            {"/- "}
            <span className="text-gray-500 font-semibold">per annum</span>
          </p>
          {/* <p>
            <strong>Date of Birth:</strong>{" "}
            {employee.dateOfBirth
              ? new Date(employee.dateOfBirth).toLocaleDateString()
              : "—"}
          </p> */}
          <p>
            <strong>Joining Date:</strong>{" "}
            {employee.dateOfJoining
              ? new Date(employee.dateOfJoining).toLocaleDateString()
              : "—"}
          </p>
          {console.log("EMPLOYEE JOINING DATE:", employee)}
          {/* Status */}
          <div className="text-sm text-gray-700">
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                getStatusColor(employee.status).bg
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  getStatusColor(employee.status).dot
                }`}
              ></span>
              {employee.status || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Personal Info - Similar to Client Info in ProjectDetails */}
      <div className="bg-indigo-50 rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-2 tracking-wide">
          Personal Details
        </h3>
        <p className="capitalize">
          <strong>Address:</strong> {employee.address || "—"}
        </p>
      </div>

      {/* Departments */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Departments</h3>
        {Array.isArray(employee.department) &&
        employee.department.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {employee.department.map((dept, index) => (
              <span
                key={index}
                className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {dept}
                <button
                  onClick={() => handleRemoveTag("department", dept)}
                  className="ml-2 text-indigo-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No departments assigned yet.</p>
        )}
      </div>
    </div>
  );
};
