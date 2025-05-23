// import { useEffect, useState } from "react";
// import { useEmployeeStore } from "../../store/hr/employeesStore.js";
// import { EmployeeCard } from "../tables/EmployeeCard.jsx";
// import { TABS } from "../../constants/activeTab";
// import { ReusableContainer } from "../ui/ReusableContainer.jsx";
// import { employeeTableFilters } from "../../constants/hr/employee/employeeTableFilter.js";
// import { safeLowerCase } from "../../utils/safeLowerCase.js";

// export const Employees = ({ setEmployeeTab, setSelectedEmployee }) => {
//   const employees = useEmployeeStore((state) => state.employees);
//   const fetchEmployees = useEmployeeStore((state) => state.fetchEmployees);
//   const setEditingEmployee = useEmployeeStore(
//     (state) => state.setEditingEmployee
//   );

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filters, setFilters] = useState({});
//   const [filteredEmployees, setFilteredEmployees] = useState([]);

//   useEffect(() => {
//     fetchEmployees();
//   }, [fetchEmployees]);

//   useEffect(() => {
//     let updated = [...employees];

//     if (searchTerm) {
//       updated = updated.filter((emp) =>
//         `${emp.firstName} ${emp.lastName}`
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       );
//     }

//     if (filters.department) {
//       updated = updated.filter((emp) => {
//         const departments = Array.isArray(emp.department)
//           ? emp.department
//           : [emp.department];
//         return departments.some(
//           (dep) => safeLowerCase(dep) === safeLowerCase(filters.department)
//         );
//       });
//     }

//     if (filters.status) {
//       updated = updated.filter(
//         (emp) => safeLowerCase(emp.status) === safeLowerCase(filters.status)
//       );
//     }

//     setFilteredEmployees(updated);
//   }, [searchTerm, filters, employees]);

//   return (
//     <ReusableContainer
//       searchPlaceholder="Search employee by name..."
//       onSearchChange={setSearchTerm}
//       filters={employeeTableFilters}
//       onFilterChange={setFilters}
//       onAddClick={() => {
//         setEditingEmployee(null);
//         setEmployeeTab(TABS.ADD_EMPLOYEE);
//       }}
//       addButtonLabel="Add Employee"
//       showWhiteBox={false}
//     >
//       <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-6">
//         {filteredEmployees.length > 0 ? (
//           filteredEmployees.map((emp, index) => (
//             <EmployeeCard
//               key={emp._id || index}
//               employee={emp}
//               setEmployeeTab={setEmployeeTab}
//               setSelectedEmployee={setSelectedEmployee}
//             />
//           ))
//         ) : (
//           <p className="text-gray-500 text-center col-span-full">
//             No employees found.
//           </p>
//         )}
//       </div>
//     </ReusableContainer>
//   );
// };
import { useEffect, useState } from "react";
import { useEmployeeStore } from "../../store/hr/employeesStore.js";
import { EmployeeCard } from "../tables/EmployeeCard.jsx";
import { TABS } from "../../constants/activeTab";
import { ReusableContainer } from "../ui/ReusableContainer.jsx";
import { employeeTableFilters } from "../../constants/hr/employee/employeeTableFilter.js";
import { safeLowerCase } from "../../utils/safeLowerCase.js";
import { useAuthStore } from "../../store/authStore"; // Add this import

export const Employees = ({ setEmployeeTab, setSelectedEmployee }) => {
  const employees = useEmployeeStore((state) => state.employees);
  const fetchEmployees = useEmployeeStore((state) => state.fetchEmployees);
  const setEditingEmployee = useEmployeeStore(
    (state) => state.setEditingEmployee
  );
  const { user } = useAuthStore(); // Get current user

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

    if (filters.department) {
      updated = updated.filter((emp) => {
        const departments = Array.isArray(emp.department)
          ? emp.department
          : [emp.department];
        return departments.some(
          (dep) => safeLowerCase(dep) === safeLowerCase(filters.department)
        );
      });
    }

    if (filters.status) {
      updated = updated.filter(
        (emp) => safeLowerCase(emp.status) === safeLowerCase(filters.status)
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
      {!["Admin", "HR"].includes(user?.role) && (
        <div className="mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          Note: You can only edit your own profile. Other profiles are
          view-only.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-6">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp, index) => (
            <EmployeeCard
              key={emp._id || index}
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
