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

  const renderEmployees =
    Array.isArray(employees) && employees.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {employees.map((emp) => (
          <EmployeeCard
            key={emp._id}
            employee={emp}
            setEmployeeTab={setEmployeeTab}
          />
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-center">No employees available.</p>
    );

  return (
    <div>
      <div className="flex justify-end items-center mb-6">
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

      {/* Grid container for employee cards */}
      <div className="render-employee">{renderEmployees}</div>
    </div>
  );
};
