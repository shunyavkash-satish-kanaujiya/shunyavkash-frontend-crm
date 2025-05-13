import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useProjectStore } from "../../store/projectStore";
import {
  activeTabProject,
  defaultProjectTab,
  localStorageKeyProject,
} from "../../constants/project/activeTabProject";
import { ProjectDetailsTab } from "./ProjectDetailsTab.jsx";
import { ProjectTasksTab } from "./ProjectTasksTab.jsx";

export const ProjectDetails = ({ projectId, goBack }) => {
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState(defaultProjectTab);
  const { fetchProjectById, projectLoading } = useProjectStore();

  useEffect(() => {
    const savedTab = localStorage.getItem(localStorageKeyProject);
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(localStorageKeyProject, activeTab);
  }, [activeTab]);

  useEffect(() => {
    const loadProject = async () => {
      const projectData = await fetchProjectById(projectId);
      if (projectData) {
        setProject(projectData);
      }
    };
    loadProject();
  }, [projectId, fetchProjectById]);

  if (projectLoading || !project)
    return <div className="p-4">Loading project details...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={goBack}
        className="flex items-center text-indigo-600 hover:underline"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-1" />
        Back
      </button>

      {/* Header Tabs */}
      <div className="flex gap-4 border-b">
        {activeTabProject.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === tab.value
                ? "text-indigo-700 border-indigo-700"
                : "text-gray-500 border-transparent hover:text-indigo-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="space-y-6 pt-4">
        {/* Details */}
        {activeTab === "details" && (
          <ProjectDetailsTab
            project={project}
            setProject={setProject}
            projectId={projectId}
          />
        )}

        {/* Tasks */}
        {activeTab === "task" && <ProjectTasksTab projectId={projectId} />}
      </div>
    </div>
  );
};
