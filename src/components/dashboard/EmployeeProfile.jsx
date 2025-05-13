import { useEffect, useState } from "react";
import { useEmployeeStore } from "../../store/hr/employeesStore.js";
import { useAuth } from "../../hooks/dashboard/useAuth.js";
import { getStatusColor } from "../../constants/hr/employee/statusColors.js";

export const EmployeeProfile = () => {
  const { user } = useAuth();
  const { fetchEmployeeByEmail } = useEmployeeStore();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEmployeeData = async () => {
      if (user?.email) {
        try {
          setLoading(true);
          const employeeData = await fetchEmployeeByEmail(user.email);

          if (employeeData) {
            setEmployee(employeeData);
            setError(null);
          } else {
            setError("No employee details found");
          }
        } catch (err) {
          console.error("Failed to fetch employee details", err);
          setError("Failed to load employee details");
          setEmployee(null);
        } finally {
          setLoading(false);
        }
      }
    };

    loadEmployeeData();
  }, [user?.email]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600 text-center">
          No employee details available
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
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
              <span className="font-semibold">Work Email:</span>{" "}
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
            <p className="text-gray-700">
              <span className="font-semibold">Joining Date:</span>{" "}
              {employee.dateOfJoining
                ? new Date(employee.dateOfJoining).toLocaleDateString()
                : "—"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Department:</span>{" "}
              {Array.isArray(employee.department) &&
              employee.department.length > 0
                ? employee.department.join(", ")
                : "—"}
            </p>
            <div className="flex items-center">
              <span className="font-semibold mr-2">Status:</span>
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
          </div>
        </div>
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
        </div>
      </div>
    </div>
  );
};
