import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useEmployeeStore } from "../../../store/hr/employeesStore.js";
import { getStatusColor } from "../../../constants/hr/employee/statusColors.js";
import { useAuthStore } from "../../../store/authStore.js";

export const EmployeeDetails = ({ employeeId, goBack }) => {
  const [employee, setEmployee] = useState(null);
  const [showSalary, setShowSalary] = useState(false);
  const [showJoiningDate, setShowJoiningDate] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldToShow, setFieldToShow] = useState(null); // 'salary' or 'joiningDate'
  const { fetchEmployee, removeTag } = useEmployeeStore();
  const { verifyPassword } = useAuthStore();

  useEffect(() => {
    const loadEmployeeData = async () => {
      const data = await fetchEmployee(employeeId);
      setEmployee(data);
    };

    loadEmployeeData();
  }, [employeeId, fetchEmployee]);

  const handleVerifyPassword = async () => {
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const isValid = await verifyPassword(password);
      if (isValid) {
        if (fieldToShow === "salary") {
          setShowSalary(true);
        } else if (fieldToShow === "joiningDate") {
          setShowJoiningDate(true);
        }
        setPassword("");
        setFieldToShow(null);
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowField = (field) => {
    setFieldToShow(field);
  };

  const handleHideField = (field) => {
    if (field === "salary") {
      setShowSalary(false);
    } else if (field === "joiningDate") {
      setShowJoiningDate(false);
    }
  };

  const handleCancelVerification = () => {
    setFieldToShow(null);
    setPassword("");
    setError("");
  };

  const handleRemoveTag = async (type, value) => {
    const updatedEmployee = await removeTag(employeeId, type, value);
    if (updatedEmployee) {
      setEmployee(updatedEmployee);
    }
  };

  const handleGoBack = (e) => {
    e.preventDefault();
    if (typeof goBack === "function") {
      goBack();
    }
  };

  if (!employee) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="flex items-center text-indigo-600 hover:text-indigo-800 hover:underline"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-1" />
        Back to Employees
      </button>

      {/* Employee Info */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <img
            src={employee.avatar || "/default-avatar.png"}
            alt={`${employee.firstName} ${employee.lastName}`}
            onError={(e) => (e.target.src = "/default-avatar.png")}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-sm"
          />
          <div className="flex-1">
            <h2 className="font-bold text-2xl capitalize mb-2">
              {employee.firstName} {employee.lastName}
            </h2>
            {Array.isArray(employee.designation) &&
            employee.designation.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {employee.designation.map((desig, index) => (
                  <span
                    key={index}
                    className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {desig}
                    <button
                      onClick={() => handleRemoveTag("designation", desig)}
                      className="ml-2 text-indigo-600 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No designations assigned</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span>{" "}
              {employee.email || "—"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Personal Email:</span>{" "}
              {employee.personalEmail || "—"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Phone:</span>{" "}
              {employee.phone || "—"}
            </p>
          </div>

          <div className="space-y-4">
            {/* Secure Salary Field */}
            <div className="flex items-start">
              <div className="flex-1">
                <span className="font-semibold">Payable:</span>{" "}
                {showSalary ? (
                  <span className="text-gray-800">
                    {employee.salary || "—"}
                    <span className="text-gray-500">/- per annum</span>
                  </span>
                ) : (
                  <span className="text-gray-500">••••••</span>
                )}
              </div>
              {!showSalary ? (
                <button
                  onClick={() => handleShowField("salary")}
                  className="ml-2 text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                >
                  <EyeIcon className="w-4 h-4 mr-1" />
                  View
                </button>
              ) : (
                <button
                  onClick={() => handleHideField("salary")}
                  className="ml-2 text-gray-600 hover:text-gray-800 flex items-center text-sm"
                >
                  <EyeSlashIcon className="w-4 h-4 mr-1" />
                  Hide
                </button>
              )}
            </div>

            {/* Secure Joining Date Field */}
            <div className="flex items-start">
              <div className="flex-1">
                <span className="font-semibold">Joining Date:</span>{" "}
                {showJoiningDate ? (
                  <span className="text-gray-800">
                    {employee.dateOfJoining
                      ? new Date(employee.dateOfJoining).toLocaleDateString()
                      : "—"}
                  </span>
                ) : (
                  <span className="text-gray-500">••/••/••••</span>
                )}
              </div>
              {!showJoiningDate ? (
                <button
                  onClick={() => handleShowField("joiningDate")}
                  className="ml-2 text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                >
                  <EyeIcon className="w-4 h-4 mr-1" />
                  View
                </button>
              ) : (
                <button
                  onClick={() => handleHideField("joiningDate")}
                  className="ml-2 text-gray-600 hover:text-gray-800 flex items-center text-sm"
                >
                  <EyeSlashIcon className="w-4 h-4 mr-1" />
                  Hide
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4">
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${
              getStatusColor(employee.status).bg
            } ${getStatusColor(employee.status).text}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                getStatusColor(employee.status).dot
              }`}
            ></span>
            {employee.status || "N/A"}
          </span>
        </div>

        {/* Password Verification Modal */}
        {fieldToShow && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="mb-4">
              <h4 className="font-medium text-gray-800">
                <EyeIcon className="w-5 h-5 inline mr-2" />
                View{" "}
                {fieldToShow === "salary"
                  ? "Salary Information"
                  : "Joining Date"}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                For security reasons, please verify your identity.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Enter your password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your account password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  autoComplete="current-password"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={handleCancelVerification}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyPassword}
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    "Verify"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Personal Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-700">
              <span className="font-semibold">Address:</span>{" "}
              {employee.address || "—"}
            </p>
          </div>
          {/* Add more personal details as needed */}
        </div>
      </div>

      {/* Departments */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Departments
        </h3>
        {Array.isArray(employee.department) &&
        employee.department.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {employee.department.map((dept, index) => (
              <span
                key={index}
                className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium"
              >
                {dept}
                <button
                  onClick={() => handleRemoveTag("department", dept)}
                  className="ml-2 text-indigo-600 hover:text-red-600"
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
