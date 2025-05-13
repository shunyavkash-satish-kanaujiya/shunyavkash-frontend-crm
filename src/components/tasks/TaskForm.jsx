import React, { useState, useEffect } from "react";
import { useTaskStore } from "../../store/taskStore";
import { useEmployeeStore } from "../../store/hr/employeesStore.js";
import { useProjectStore } from "../../store/projectStore";
import { TaskFields } from "./TaskFields.jsx";

export const TaskForm = ({ onClose, projectId, refetchTasks }) => {
  const { addTask } = useTaskStore();
  const { employees, fetchEmployees } = useEmployeeStore();
  const { projects, fetchProjects } = useProjectStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "normal",
    status: "todo",
    startDate: "",
    endDate: "",
    billableHours: 0,
    assignedEmployees: [],
  });
  const [projectEmployees, setProjectEmployees] = useState([]);

  useEffect(() => {
    // Fetch all employees and projects
    fetchEmployees();
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Find the current project from projects list
    if (projects.length > 0 && projectId) {
      // Find the project using projectId (assuming projects is an array of project objects)
      const currentProject = projects.find(
        (project) => project._id === projectId
      );

      if (
        currentProject &&
        currentProject.assignedEmployees &&
        currentProject.assignedEmployees.length > 0
      ) {
        // Get the IDs of employees assigned to the project
        const assignedEmployeeIds = currentProject.assignedEmployees.map(
          (assignment) => assignment.employee
        );

        // Filter the employees array to only include those assigned to the project
        const filteredEmployees = employees.filter((employee) =>
          assignedEmployeeIds.includes(employee._id)
        );

        setProjectEmployees(filteredEmployees);
      }
    }
  }, [projects, employees, projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTask({ ...formData, project: projectId });
    if (refetchTasks) refetchTasks();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TaskFields
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        employees={projectEmployees}
      />
      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
        >
          Save Task
        </button>
      </div>
    </form>
  );
};
