import { useEffect, useState } from "react";
import { useEmployeeStore } from "../../store/hr/employeesStore.js";
import { EmployeeCard } from "../tables/EmployeeCard.jsx";
import { TABS } from "../../constants/activeTab";
import { ReusableContainer } from "../ui/ReusableContainer.jsx";
import { employeeTableFilters } from "../../constants/hr/employee/employeeTableFilter.js";

export const Employees = ({ setEmployeeTab, setSelectedEmployee }) => {
  const employees = useEmployeeStore((state) => state.employees);
  const fetchEmployees = useEmployeeStore((state) => state.fetchEmployees);
  const setEditingEmployee = useEmployeeStore(
    (state) => state.setEditingEmployee
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    let updated = [...employees];

    if (searchTerm) {
      updated = updated.filter((emp) =>
        `${emp.firstName} ${emp.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (filters.designation) {
      updated = updated.filter(
        (emp) =>
          emp.designation?.toLowerCase() === filters.designation.toLowerCase()
      );
    }

    if (filters.status) {
      updated = updated.filter(
        (emp) => emp.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    setFilteredEmployees(updated);
  }, [searchTerm, filters, employees]);

  return (
    <ReusableContainer
      searchPlaceholder="Search employee by name..."
      onSearchChange={setSearchTerm}
      filters={employeeTableFilters}
      onFilterChange={setFilters}
      onAddClick={() => {
        setEditingEmployee(null);
        setEmployeeTab(TABS.ADD_EMPLOYEE);
      }}
      addButtonLabel="Add Employee"
      showWhiteBox={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => (
            <EmployeeCard
              key={emp._id}
              employee={emp}
              setEmployeeTab={setEmployeeTab}
              setSelectedEmployee={setSelectedEmployee}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No employees found.
          </p>
        )}
      </div>
    </ReusableContainer>
  );
};
