import { useEmployeeStore } from "../../store/hr/employeesStore.js";
import { useEffect } from "react";
import { TABS } from "../../constants/activeTab.js";
import { EmployeeCard } from "../tables/EmployeeCard.jsx";

export const Employees = ({ setEmployeeTab }) => {
  const employees = useEmployeeStore((state) => state.employees);
  const fetchEmployees = useEmployeeStore((state) => state.fetchEmployees);
  const setEditingEmployee = useEmployeeStore(
    (state) => state.setEditingEmployee
  );

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Pass setEmployeeTab as prop for edit handling
  const renderEmployees = Array.isArray(employees) ? (
    employees.map((emp) => (
      <EmployeeCard
        key={emp._id}
        employee={emp}
        setEmployeeTab={setEmployeeTab}
      />
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
