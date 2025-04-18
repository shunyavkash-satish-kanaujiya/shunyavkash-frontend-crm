import { useEffect } from "react";
import { ProjectTable } from "../components/tables/ProjectTable";
import { useProjectStore } from "../store/projectStore";
import { PlusIcon } from "@heroicons/react/24/outline";
import { TABS } from "../constants/activeTab";

export const Project = ({ setActiveTab, setEditingProject }) => {
  const { projects, fetchProjects, loading } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="bg-gray-50 min-h-screen text-textPrimary">
      <div className="table-wrap">
        {loading ? (
          <div className="text-center py-6 text-indigo-600 font-medium">
            Loading projects...
          </div>
        ) : (
          <ProjectTable
            projects={projects}
            setActiveTab={setActiveTab}
            setEditingProject={setEditingProject}
          />
        )}
      </div>
    </div>
  );
};
