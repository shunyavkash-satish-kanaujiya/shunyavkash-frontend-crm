import { useEffect } from "react";
import { ProjectTable } from "../components/tables/ProjectTable";
import { useProjectStore } from "../store/projectStore";

export const Project = ({ setActiveTab, setEditingProject }) => {
  const { projects, fetchProjects, loading } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    console.log(projects); // Log projects to check if data is loaded properly
  }, [projects]);

  const activeProjects = projects.filter((project) => !project.isArchived);

  return (
    <div className="bg-gray-50 min-h-screen text-textPrimary">
      <div className="table-wrap">
        {loading ? (
          <div className="text-center py-6 text-indigo-600 font-medium">
            Loading projects...
          </div>
        ) : (
          <ProjectTable
            projects={activeProjects}
            setActiveTab={setActiveTab}
            setEditingProject={setEditingProject}
          />
        )}
      </div>
    </div>
  );
};
