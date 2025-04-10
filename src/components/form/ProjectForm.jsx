import { useEffect, useState } from "react";
import { useClientStore } from "../../store/clientStore";
import { useProjectStore } from "../../store/projectStore";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
];

export const ProjectForm = ({
  editingProject,
  setEditingProject,
  setActiveTab,
}) => {
  const { clients, fetchClients } = useClientStore();
  const { addProject, updateProject } = useProjectStore();

  const [formData, setFormData] = useState({
    title: "",
    client: "",
    description: "",
    startDate: "",
    endDate: "",
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
        status: editingProject.status || "pending",
      });
    }
  }, [editingProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateProject(editingProject._id, formData);
        setEditingProject(null);
      } else {
        await addProject(formData);
      }
      setFormData({
        title: "",
        client: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "pending",
      });
      setActiveTab("All Projects");
    } catch (error) {
      console.error("Failed to submit project:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Project Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Client
          </label>
          <select
            name="client"
            value={formData.client}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded-md px-3 py-2"
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md px-3 py-2"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-500 transition"
        >
          {editingProject ? "Update Project" : "Add Project"}
        </button>
      </div>
    </form>
  );
};
