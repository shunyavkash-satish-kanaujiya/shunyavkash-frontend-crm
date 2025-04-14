import { useState } from "react";
import {
  EyeIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useProjectStore } from "../../store/projectStore.js";
import { TABS } from "../../constants/activeTab.js";

const statusStyles = {
  pending: "bg-blue-100 text-blue-800",
  ongoing: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
};

export const ProjectTable = ({ projects, setActiveTab, setEditingProject }) => {
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

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

    const matchesStatus = filterStatus ? project.status === filterStatus : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="overflow-x-auto space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search by project or client"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-64"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <table className="min-w-full divide-y divide-gray-200 text-sm">
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
                <td className="px-6 py-4 whitespace-nowrap">{project.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusStyles[project.status]
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2 cursor-pointer">
                  <button
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    title="View"
                  >
                    <EyeIcon className="w-5 h-5 inline" />
                  </button>
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    title="Edit"
                  >
                    <PencilSquareIcon className="w-5 h-5 inline" />
                  </button>
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
  );
};
