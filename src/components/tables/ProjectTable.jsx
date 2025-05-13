import {
  ArchiveBoxArrowDownIcon,
  ArchiveBoxXMarkIcon,
  EyeIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useProjectStore } from "../../store/projectStore.js";
import { TABS } from "../../constants/activeTab.js";
import { ReusableContainer } from "../ui/ReusableContainer.jsx";
import {
  priorityOptions,
  priorityStyles,
  statusStyles,
} from "../../constants/project/projectOptions.js";
import { projectTableFilters } from "../../constants/project/projectTableFilter.js";
import { ProjectDetails } from "../project/ProjectDetails.jsx";

export const ProjectTable = ({
  projects,
  setActiveTab,
  setEditingProject,
  setViewingProjectId,
  viewingProjectId,
}) => {
  const updateProjectPriority = useProjectStore(
    (state) => state.updateProjectPriority
  );
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const archiveProject = useProjectStore((state) => state.archiveProject);
  const restoreProject = useProjectStore((state) => state.restoreProject);
  const fetchArchivedProjects = useProjectStore(
    (state) => state.fetchArchivedProjects
  );
  const archivedProjects = useProjectStore((state) => state.archivedProjects);
  const showArchived = useProjectStore((state) => state.showArchived);
  const setShowArchived = useProjectStore((state) => state.setShowArchived);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ status: "", priority: "" });
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    fetchArchivedProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setActiveTab(TABS.ADD_PROJECT);
  };

  const handleRestore = (projectId) => {
    setIsToggling(true);
    restoreProject(projectId).finally(() => {
      setIsToggling(false);
    });
  };

  const handleToggleArchive = async () => {
    const newShowArchived = !showArchived;
    setShowArchived(newShowArchived);

    setIsToggling(true);
    try {
      if (
        !newShowArchived &&
        (!archivedProjects || archivedProjects.length === 0)
      ) {
        await fetchArchivedProjects();
      }
    } catch (error) {
      console.error("Error toggling archive:", error);
      // Optionally revert on error
      setShowArchived((prev) => !prev);
    } finally {
      setIsToggling(false);
    }
  };

  const handleArchiveProject = async (projectId) => {
    setIsToggling(true);
    try {
      await archiveProject(projectId);
      await fetchArchivedProjects();
    } catch (error) {
      console.error("Failed to archive project:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const projectsToShow = showArchived ? archivedProjects || [] : projects || [];

  const filteredProjects = projectsToShow.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status
      ? project.status === filters.status
      : true;

    const matchesPriority = filters.priority
      ? project.priority?.toLowerCase() === filters.priority?.toLowerCase()
      : true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (viewingProjectId) {
    return (
      <ProjectDetails
        projectId={viewingProjectId}
        goBack={() => setViewingProjectId(null)}
      />
    );
  }

  return (
    <>
      {/* Toggle Active/Archived */}
      <div className="flex mb-4 bg-indigo-50 w-min p-3 rounded-md">
        <label className="inline-flex items-center cursor-pointer">
          <span
            className={`mr-3 text-sm transition-all ease-in-out duration-200 ${
              !showArchived
                ? "text-indigo-700 font-bold"
                : "text-gray-500 font-medium tracking-wide"
            }`}
          >
            Active
          </span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={!!showArchived}
              onChange={handleToggleArchive}
              disabled={isToggling}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </div>
          <span
            className={`ml-3 text-sm  transition-all ease-in-out duration-200 ${
              showArchived
                ? "text-indigo-700 font-bold"
                : "text-gray-500 font-medium tracking-wide"
            }`}
          >
            Archived
          </span>
        </label>
      </div>

      {/* Table */}
      <ReusableContainer
        searchPlaceholder="Search by project or client"
        onSearchChange={setSearchTerm}
        filters={projectTableFilters}
        onFilterChange={setFilters}
        onAddClick={
          !showArchived && !isToggling
            ? () => setActiveTab(TABS.ADD_PROJECT)
            : null
        }
        addButtonLabel={!showArchived ? "Add Project" : null}
        className={isToggling ? "opacity-70 pointer-events-none" : ""}
      >
        <div
          className={`overflow-x-auto shadow-md rounded-md p-2 ${
            isToggling ? "opacity-60" : ""
          }`}
        >
          <table className="min-w-full divide-y divide-gray-200 text-sm overflow-hidden rounded-lg">
            <thead className="bg-indigo-50">
              <tr>
                {!showArchived && (
                  <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                    View
                  </th>
                )}
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
                {!showArchived && (
                  <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                    Archive
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={showArchived ? "10" : "11"}
                    className="text-center py-4 text-gray-500"
                  >
                    {showArchived
                      ? "No archived projects found."
                      : "No projects found."}
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project, index) => (
                  <tr
                    key={project._id}
                    className="hover:bg-indigo-50 transition cursor-pointer"
                  >
                    {!showArchived && (
                      <td className="px-5 py-4 whitespace-nowrap space-x-2">
                        <button
                          className="text-gray-600 hover:text-blue-800"
                          title="View"
                          onClick={() => setViewingProjectId(project._id)}
                          disabled={isToggling}
                        >
                          <EyeIcon className="w-5 h-5 inline stroke-2" />
                        </button>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      {project.title || ""}
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
                    {/* Priority */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!showArchived ? (
                        <select
                          value={
                            priorityOptions.includes(project.priority)
                              ? project.priority
                              : "none"
                          }
                          onChange={async (e) =>
                            await updateProjectPriority(
                              project._id,
                              e.target.value
                            )
                          }
                          className={`text-xs font-medium capitalize rounded-md px-2 py-2 outline-none ${
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
                      ) : (
                        <span
                          className={`text-xs font-medium rounded-md px-4 py-2 ${
                            priorityStyles[
                              project.priority?.toLowerCase() || "none"
                            ]
                          }`}
                        >
                          {project.priority || "None"}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-2 capitalize rounded-full text-xs font-medium ${
                          statusStyles[project.status] || ""
                        }`}
                      >
                        {project.status || ""}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      {!showArchived ? (
                        <>
                          <button
                            onClick={() => handleEdit(project)}
                            className="text-indigo-600 hover:text-indigo-800"
                            title="Edit"
                          >
                            <PencilSquareIcon className="w-5 h-5 inline" />
                          </button>
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <XMarkIcon className="w-5 h-5 inline" />
                          </button>
                        </>
                      ) : (
                        <button
                          className="text-blue-600 hover:text-bule-800"
                          title="Restore"
                          onClick={() => handleRestore(project._id)}
                        >
                          <ArchiveBoxXMarkIcon className="w-5 h-5 inline" />
                        </button>
                      )}
                    </td>

                    {!showArchived && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          title="Archive"
                          onClick={() => handleArchiveProject(project._id)}
                        >
                          <ArchiveBoxArrowDownIcon className="w-5 h-5 inline" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ReusableContainer>
    </>
  );
};
