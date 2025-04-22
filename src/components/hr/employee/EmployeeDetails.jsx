import { useEffect, useState, useCallback } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEmployeeStore } from "../../../store/hr/employeesStore.js";
import { getStatusColor } from "../../../constants/hr/employees/statusColors.js";

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
            <h2 className="text-2xl font-semibold capitalize">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="text-gray-600 bg-indigo-50 rounded-lg p-3 first-letter:capitalize">
              {employee.designation || "No designation provided."}
            </p>
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
            <strong>Date of Birth:</strong>{" "}
            {employee.dateOfBirth
              ? new Date(employee.dateOfBirth).toLocaleDateString()
              : "—"}
          </p>
          <p>
            <strong>Joining Date:</strong>{" "}
            {employee.joiningDate
              ? new Date(employee.joiningDate).toLocaleDateString()
              : "—"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className="px-2 py-1 rounded-full text-xs"
              style={{
                backgroundColor: employee.status
                  ? getStatusColor(employee.status).bgColor
                  : "#e5e7eb", // Default color if status is not provided
                color: employee.status
                  ? getStatusColor(employee.status).textColor
                  : "#374151", // Default text color if status is not provided
              }}
            >
              {employee.status || "—"}
            </span>
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(employee.createdAt).toLocaleDateString()}
          </p>
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
        <p>
          <strong>Emergency Contact:</strong> {employee.emergencyContact || "—"}
        </p>
        <p>
          <strong>Blood Group:</strong> {employee.bloodGroup || "—"}
        </p>
      </div>

      {/* Departments - Similar to Assigned Employees in ProjectDetails */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Departments</h3>
        </div>
        {employee.departments?.length > 0 ? (
          <ul className="space-y-2">
            {employee.departments.map((dept, index) => (
              <li
                key={index}
                className="border p-3 rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold capitalize">{dept}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No departments assigned yet.</p>
        )}
      </div>
    </div>
  );
};
