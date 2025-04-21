import { ArchiveBoxXMarkIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useProjectStore } from "../../store/projectStore.js";
import { ReusableContainer } from "../ui/ReusableContainer.jsx";
import {
  priorityStyles,
  statusStyles,
} from "../../constants/project/projectOptions.js";
import { projectTableFilters } from "../../constants/project/projectTableFilter.js";

export const ArchivedProjectTable = ({ projects }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ status: "", priority: "" });

  const restoreProject = useProjectStore((state) => state.restoreProject); // <-- Hook into store

  const handleRestore = (projectId) => {
    restoreProject(projectId);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status
      ? project.status === filters.status
      : true;
    const matchesPriority = filters.priority
      ? project.priority?.toLowerCase() === filters.priority
      : true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <ReusableContainer
      searchPlaceholder="Search by project or client"
      onSearchChange={setSearchTerm}
      filters={projectTableFilters}
      onFilterChange={setFilters}
      addButtonLabel={null}
    >
      <div className="overflow-x-auto shadow-md rounded-md p-2">
        <table className="min-w-full divide-y divide-gray-200 text-sm overflow-hidden rounded-lg">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                View
              </th>
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
                <td colSpan="10" className="text-center py-4 text-gray-500">
                  No archived projects found.
                </td>
              </tr>
            ) : (
              filteredProjects.map((project, index) => (
                <tr
                  key={project._id}
                  className="hover:bg-indigo-50 transition cursor-pointer"
                >
                  <td className="px-5 py-4 whitespace-nowrap space-x-2">
                    <button
                      className="text-gray-600 hover:text-blue-800"
                      title="View"
                    >
                      <EyeIcon className="w-5 h-5 inline" />
                    </button>
                  </td>
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
                    <span
                      className={`text-xs font-medium rounded px-2 py-1 ${
                        priorityStyles[
                          project.priority?.toLowerCase() || "none"
                        ]
                      }`}
                    >
                      {project.priority || "None"}
                    </span>
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
                  <td className="px-5 py-4 whitespace-nowrap space-x-2">
                    <button
                      className="text-blue-600 hover:text-bule-800"
                      title="Restore"
                      onClick={() => handleRestore(project._id)}
                    >
                      <ArchiveBoxXMarkIcon className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </ReusableContainer>
  );
};
