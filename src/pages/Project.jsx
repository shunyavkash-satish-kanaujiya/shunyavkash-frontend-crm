import { useEffect, useMemo, useState } from "react";
import { ProjectTable } from "../components/tables/ProjectTable";
import { ProjectDetails } from "../components/project/ProjectDetails";
import { useProjectStore } from "../store/projectStore";

export const Project = ({ setActiveTab, setEditingProject }) => {
  const projects = useProjectStore((state) => state.projects);
  const archivedProjects = useProjectStore((state) => state.archivedProjects);
  const showArchived = useProjectStore((state) => state.showArchived);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const fetchArchivedProjects = useProjectStore(
    (state) => state.fetchArchivedProjects
  );
  const projectsLoading = useProjectStore((state) => state.projectsLoading);

  const [viewingProjectId, setViewingProjectId] = useState(null);

  useEffect(() => {
    fetchProjects();
    fetchArchivedProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeProjects = useMemo(
    () =>
      Array.isArray(projects)
        ? projects.filter((project) => !project.isArchived)
        : [],
    [projects]
  );

  const selectedProjects = showArchived ? archivedProjects : activeProjects;

  const renderContent = () => {
    if (projectsLoading && !viewingProjectId) {
      return (
        <div className="text-center py-6 text-indigo-600 font-medium">
          {showArchived
            ? "Loading archived projects..."
            : "Loading projects..."}
        </div>
      );
    }

    if (viewingProjectId) {
      return (
        <ProjectDetails
          projectId={viewingProjectId}
          goBack={() => setViewingProjectId(null)}
        />
      );
    }

    return (
      <ProjectTable
        projects={selectedProjects}
        setActiveTab={setActiveTab}
        setEditingProject={setEditingProject}
        setViewingProjectId={setViewingProjectId}
      />
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen text-textPrimary">
      <div className="table-wrap">{renderContent()}</div>
    </div>
  );
};
