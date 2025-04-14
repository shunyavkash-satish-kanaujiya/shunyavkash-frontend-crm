import { useState, useEffect } from "react";
import { useClientStore } from "../../../store/clientStore";
import { useProjectStore } from "../../../store/projectStore";
import { TABS } from "../../../constants/activeTab";
import {
  priorityOptions,
  statusOptions,
} from "../../../constants/project/projectOptions";

export const useProjectForm = (
  editingProject,
  setEditingProject,
  setActiveTab
) => {
  const { clients, fetchClients } = useClientStore();
  const { addProject, updateProject, fetchProjects } = useProjectStore();

  const [formData, setFormData] = useState({
    title: "",
    client: "",
    description: "",
    startDate: "",
    endDate: "",
    priority: "Normal",
    status: "pending",
  });

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || "",
        client: editingProject.client?._id || editingProject.client || "",
        description: editingProject.description || "",
        startDate: editingProject.startDate?.substring(0, 10) || "",
        endDate: editingProject.endDate?.substring(0, 10) || "",
        priority: editingProject.priority || "Normal",
        status: editingProject.status || "pending",
      });
    }
  }, [editingProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      client: "",
      description: "",
      startDate: "",
      endDate: "",
      priority: "Normal",
      status: "pending",
    });
    setEditingProject(null);
    setActiveTab(TABS.PROJECTS);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateProject(editingProject._id, formData);
      } else {
        await addProject(formData);
      }

      await fetchProjects();
      resetForm();
    } catch (error) {
      console.error("Failed to submit project:", error);
    }
  };

  return {
    clients,
    formData,
    priorityOptions,
    statusOptions,
    handleChange,
    handleSubmit,
    resetForm,
  };
};
