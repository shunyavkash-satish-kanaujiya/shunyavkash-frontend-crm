import { useEffect, useState } from "react";
import { ProjectTable } from "../components/tables/ProjectTable";
import { ProjectDetails } from "../components/project/ProjectDetails";
import { useProjectStore } from "../store/projectStore";

export const Project = ({ setActiveTab, setEditingProject }) => {
  const { projects, fetchProjects, loading } = useProjectStore();
  const [viewingProjectId, setViewingProjectId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const activeProjects = projects.filter((project) => !project.isArchived);

  return (
    <div className="bg-gray-50 min-h-screen text-textPrimary">
      <div className="table-wrap">
        {loading ? (
          <div className="text-center py-6 text-indigo-600 font-medium">
            Loading projects...
          </div>
        ) : viewingProjectId ? (
          <ProjectDetails
            projectId={viewingProjectId}
            goBack={() => setViewingProjectId(null)}
          />
        ) : (
          <ProjectTable
            projects={activeProjects}
            setActiveTab={setActiveTab}
            setEditingProject={setEditingProject}
            setViewingProjectId={setViewingProjectId}
          />
        )}
      </div>
    </div>
  );
};
