import React from "react";
import {
  taskPriorityOptions,
  taskStatusOptions,
} from "../../constants/tasks/taskOptions.js";
import { ReusableSelectBox } from "../ui/ReusableSelectBox.jsx";
import { ReusableCheckBox } from "../ui/ReusableCheckBox.jsx";

export const TaskFields = ({
  formData,
  setFormData,
  handleChange,
  employees,
}) => {
  return (
    <>
      {/* Title */}
      <div className="relative">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="block w-full px-2.5 pt-5 pb-2.5 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
          required
        />
        <label
          className="absolute text-md text-gray-500 bg-white px-1 transition-all duration-250 transform scale-75 -translate-y-4 top-1 left-2.5 origin-[0] 
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
        >
          Title
        </label>
      </div>

      {/* Description */}
      <div className="relative">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="peer w-full border rounded-lg border-gray-300 focus:border-indigo-500 outline-none pt-4 pb-1 px-2 placeholder-transparent"
        />
        <label
          className="absolute text-md text-gray-500 bg-white px-1 transition-all duration-250 transform scale-75 -translate-y-4 top-1 left-2.5 origin-[0] 
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
        >
          Description
        </label>
      </div>

      {/* Priority */}
      <ReusableSelectBox
        label="Priority"
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        options={taskPriorityOptions}
      />

      {/* Status */}
      <ReusableSelectBox
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        options={taskStatusOptions}
      />

      {/* Start Date */}
      <div className="relative">
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="block w-full px-2.5 pt-5 pb-2.5 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
        />
        <label
          className="absolute text-md text-gray-500 bg-white px-1 transition-all duration-250 transform scale-75 -translate-y-4 top-1 left-2.5 origin-[0] 
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
        >
          Start Date
        </label>
      </div>

      {/* End Date */}
      <div className="relative">
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="block w-full px-2.5 pt-5 pb-2.5 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
        />
        <label
          className="absolute text-md text-gray-500 bg-white px-1 transition-all duration-250 transform scale-75 -translate-y-4 top-1 left-2.5 origin-[0] 
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
        >
          End Date
        </label>
      </div>

      {/* Billable Hours */}
      <div className="relative">
        <input
          type="number"
          name="billableHours"
          value={formData.billableHours}
          onChange={handleChange}
          min="0"
          className="block w-full px-2.5 pt-5 pb-2.5 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
        />
        <label
          className="absolute text-md text-gray-500 bg-white px-1 transition-all duration-250 transform scale-75 -translate-y-4 top-1 left-2.5 origin-[0] 
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
        >
          Billable Hours
        </label>
      </div>

      {/* Assigned Employees */}
      <ReusableCheckBox
        label="Assigned Employees"
        name="assignedEmployees"
        options={employees.map((emp) => ({
          value: emp._id,
          label: `${emp.firstName} ${emp.lastName}`,
        }))}
        value={formData.assignedEmployees}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        required={false}
        noOptionsMessage="No Employee Assigned."
      />
    </>
  );
};
