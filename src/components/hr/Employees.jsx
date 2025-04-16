import { useEmployeeStore } from "../../store/hr/employeesStore.js";
import { useEffect } from "react";
import { TABS } from "../../constants/activeTab.js";

export const Employees = ({ setEmployeeTab }) => {
  const employees = useEmployeeStore((state) => state.employees);
  const fetchEmployees = useEmployeeStore((state) => state.fetchEmployees);
  const setEditingEmployee = useEmployeeStore(
    (state) => state.setEditingEmployee
  );

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setEmployeeTab(TABS.ADD_EMPLOYEE);
  };

  // Is employee an array
  const renderEmployees = Array.isArray(employees) ? (
    employees.map((emp) => (
      <div key={emp._id} className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          {emp.avatar && (
            <img
              src={emp.avatar}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold">
              {emp.firstName} {emp.lastName}
            </h3>
            <p className="text-sm text-gray-500">{emp.designation}</p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-700">
          <p>
            <strong>Email:</strong> {emp.email}
          </p>
          <p>
            <strong>Phone:</strong> {emp.phone}
          </p>
          <p>
            <strong>Status:</strong> {emp.status}
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleEdit(emp)}
            className="text-indigo-600 hover:underline text-sm"
          >
            Edit
          </button>
        </div>
      </div>
    ))
  ) : (
    <p>No employees available.</p>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Employees</h2>
        <button
          onClick={() => {
            setEditingEmployee(null);
            setEmployeeTab(TABS.ADD_EMPLOYEE);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
        >
          Add New Employee
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderEmployees}
      </div>
    </div>
  );
};
