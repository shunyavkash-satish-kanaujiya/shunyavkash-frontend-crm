import { useEmployeeStore } from "../../store/hr/employeesStore.js";
import { useEffect, useState } from "react";
import { TABS } from "../../constants/activeTab.js";
import { EmployeeCard } from "../tables/EmployeeCard.jsx";
import { ReusableSearch } from "../ui/ReusableSearch.jsx";
import { ReusableFilter } from "../ui/ReusableFilter.jsx";

export const Employees = ({ setEmployeeTab }) => {
  const employees = useEmployeeStore((state) => state.employees);
  const fetchEmployees = useEmployeeStore((state) => state.fetchEmployees);
  const setEditingEmployee = useEmployeeStore(
    (state) => state.setEditingEmployee
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ designation: "", status: "" });
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    let updated = [...employees];

    // Search by full name
    if (searchTerm) {
      updated = updated.filter((emp) =>
        `${emp.firstName} ${emp.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by designation
    if (filters.designation) {
      updated = updated.filter(
        (emp) => emp.designation === filters.designation
      );
    }

    // Filter by status
    if (filters.status) {
      updated = updated.filter((emp) => emp.status === filters.status);
    }

    setFilteredEmployees(updated);
  }, [searchTerm, filters, employees]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 w-full flex-wrap">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 w-full flex-wrap">
          <ReusableSearch
            searchPlaceholder="Search employee by name..."
            onSearchChange={setSearchTerm}
          />

          <ReusableFilter
            filters={[
              {
                label: "Designation",
                key: "designation",
                options: ["Admin", "HR", "Developer"],
              },
              {
                label: "Status",
                key: "status",
                options: ["Active", "Inactive", "On Leave", "Terminated"],
              },
            ]}
            onFilterChange={setFilters}
          />
        </div>

        <button
          onClick={() => {
            setEditingEmployee(null);
            setEmployeeTab(TABS.ADD_EMPLOYEE);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 whitespace-nowrap mr-0 ml-auto"
        >
          Add New Employee
        </button>
      </div>

      {/* Grid container for employee cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => (
            <EmployeeCard
              key={emp._id}
              employee={emp}
              setEmployeeTab={setEmployeeTab}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No employees found.
          </p>
        )}
      </div>
    </div>
  );
};
