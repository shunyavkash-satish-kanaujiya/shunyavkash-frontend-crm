import { useState } from "react";
import {
  EyeIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useProjectStore } from "../../store/projectStore.js";
import { TABS } from "../../constants/activeTab.js";

const priorityStyles = {
  urgent: "bg-red-100 text-red-800",
  high: "bg-yellow-100 text-yellow-800",
  normal: "bg-blue-100 text-blue-800",
  low: "bg-gray-200 text-gray-700",
  none: "bg-gray-100 text-gray-500",
};

const priorityOptions = ["urgent", "high", "normal", "low", "none"];

const statusStyles = {
  pending: "bg-blue-100 text-blue-800",
  ongoing: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
};

export const ProjectTable = ({ projects, setActiveTab, setEditingProject }) => {
  const updateProjectPriority = useProjectStore(
    (state) => state.updateProjectPriority
  );
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setActiveTab(TABS.ADD_PROJECT);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const matchesStatus = filterStatus ? project.status === filterStatus : true;
    // Filter by priority
    const matchesPriority = filterPriority
      ? project.priority?.toLowerCase() === filterPriority
      : true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto space-y-4 shadow-md rounded-md p-2">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search bar */}
            <input
              type="text"
              placeholder="Search by project or client"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 w-64"
            />

            {/* Filter by priority */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2"
            >
              <option value="">Set Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>

            {/* Filter by status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2"
            >
              <option value="">Set Status</option>
              <option value="pending">Pending</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {/* Table */}
          <table className="min-w-full divide-y divide-gray-200 text-sm overflow-hidden rounded-lg">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                  #
                </th>
                <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                  Client
                </th>
                <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                  End Date
                </th>
                <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                  Priority
                </th>
                <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No projects found.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project, index) => (
                  <tr
                    key={project._id}
                    className="hover:bg-indigo-50 transition cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      {project.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      {project.client?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs">
                      {project.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.startDate
                        ? new Date(project.startDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={
                          priorityOptions.includes(project.priority)
                            ? project.priority
                            : "None"
                        }
                        onChange={async (e) => {
                          const newPriority = e.target.value;
                          console.log(newPriority);
                          await updateProjectPriority(project._id, newPriority);
                        }}
                        className={`text-xs font-medium rounded px-2 py-1 outline-none ${
                          priorityStyles[
                            project.priority?.toLowerCase() || "none"
                          ]
                        }`}
                      >
                        {priorityOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusStyles[project.status]
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2 cursor-pointer">
                      {/* View */}
                      <button
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        title="View"
                      >
                        <EyeIcon className="w-5 h-5 inline" />
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        title="Edit"
                      >
                        <PencilSquareIcon className="w-5 h-5 inline" />
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        title="Delete"
                      >
                        <XMarkIcon className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
