import { useEffect, useState } from "react";
import { ProjectTable } from "../components/tables/ProjectTable";
import { ProjectForm } from "../components/form/ProjectForm.jsx";
import { useProjectStore } from "../store/projectStore";
import { PlusIcon } from "@heroicons/react/24/outline";

export const Project = () => {
  const [activeTab, setActiveTab] = useState("All Projects");
  const [editingProject, setEditingProject] = useState(null);
  const { projects, fetchProjects, loading } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="bg-gray-50 min-h-screen text-textPrimary p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Projects</h1>
        <button
          onClick={() => {
            setEditingProject(null);
            setActiveTab("Add New Project");
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition"
        >
          <PlusIcon className="h-5 w-5" />
          Add New Project
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        {activeTab === "All Projects" ? (
          loading ? (
            <div className="text-center py-6 text-indigo-600 font-medium">
              Loading projects...
            </div>
          ) : (
            <ProjectTable
              projects={projects}
              setActiveTab={setActiveTab}
              setEditingProject={setEditingProject}
            />
          )
        ) : (
          <ProjectForm
            editingProject={editingProject}
            setEditingProject={setEditingProject}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    </div>
  );
};
