import {
  departmentOptions,
  designationOptions,
  statusOptions,
} from "./positionOptions";

export const employeeFields = [
  { label: "First Name", name: "firstName", type: "text", required: true },
  { label: "Last Name", name: "lastName", type: "text", required: true },
  { label: "Email", name: "email", type: "email", required: true },
  { label: "Phone", name: "phone", type: "number", required: true },
  {
    label: "Department",
    name: "department",
    type: "select",
    options: departmentOptions,
    required: true,
  },
  {
    label: "Designation",
    name: "designation",
    type: "select",
    options: designationOptions,
    required: true,
  },
  {
    label: "Date of Joining",
    name: "dateOfJoining",
    type: "date",
    required: true,
  },
  { label: "Salary", name: "salary", type: "number", required: true },
  {
    label: "Status",
    name: "status",
    type: "select",
    options: statusOptions,
    required: true,
  },
  { label: "Address", name: "address", type: "text", required: true },
];
