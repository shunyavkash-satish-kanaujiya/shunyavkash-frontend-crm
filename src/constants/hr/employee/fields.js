// export const employeeFields = [
//   { label: "First Name", name: "firstName", type: "text", required: true },
//   { label: "Last Name", name: "lastName", type: "text", required: true },
//   { label: "Email", name: "email", type: "email", required: true },
//   { label: "Phone", name: "phone", type: "text" },
//   { label: "Department", name: "department", type: "text" },
//   { label: "Designation", name: "designation", type: "text" },
//   { label: "Date of Joining", name: "dateOfJoining", type: "date" },
//   { label: "Salary", name: "salary", type: "number" },
//   { label: "Status", name: "status", type: "text" },
//   { label: "Address", name: "address", type: "text" },
// ];

import {
  departmentOptions,
  designationOptions,
  statusOptions,
} from "./positionOptions";

export const employeeFields = [
  { label: "First Name", name: "firstName", type: "text", required: true },
  { label: "Last Name", name: "lastName", type: "text", required: true },
  { label: "Email", name: "email", type: "email", required: true },
  { label: "Phone", name: "phone", type: "text" },
  {
    label: "Department",
    name: "department",
    type: "select",
    options: departmentOptions,
  },
  {
    label: "Designation",
    name: "designation",
    type: "select",
    options: designationOptions,
  },
  { label: "Date of Joining", name: "dateOfJoining", type: "date" },
  { label: "Salary", name: "salary", type: "number" },
  {
    label: "Status",
    name: "status",
    type: "select",
    options: statusOptions,
  },
  { label: "Address", name: "address", type: "text" },
];
