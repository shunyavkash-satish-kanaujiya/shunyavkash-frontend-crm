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
      <div className="flex justify-end items-center mb-4 w-full">
        <button
          onClick={() => {
            setEditingProject(null); // Clear editing state
            setActiveTab(TABS.ADD_PROJECT); // Set active tab in Dashboard
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition"
        >
          <PlusIcon className="h-5 w-5" />
          Add New Project
        </button>
      </div>

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
