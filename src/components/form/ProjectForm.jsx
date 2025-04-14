import { useEffect, useState } from "react";
import { useClientStore } from "../../store/clientStore";
import { useProjectStore } from "../../store/projectStore";
import { TABS } from "../../constants/activeTab.js";

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
  const { addProject, updateProject, fetchProjects } = useProjectStore();

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

      await fetchProjects();
      setFormData({
        title: "",
        client: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "pending",
      });
      setActiveTab(TABS.PROJECTS);
    } catch (error) {
      console.error("Failed to submit project:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
        {editingProject ? "Update Project" : "Add New Project"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Floating Label Inputs */}
        {[
          {
            label: "Project Title",
            name: "title",
            type: "text",
            required: true,
          },
          { label: "Start Date", name: "startDate", type: "date" },
          { label: "End Date", name: "endDate", type: "date" },
        ].map((field) => (
          <div className="relative z-0 w-full group" key={field.name}>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
              autoComplete="off"
              className="block w-full px-2.5 pt-5 pb-2.5 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
            />
            <label
              htmlFor={field.name}
              className="absolute text-md text-gray-500 bg-white px-1 transition-all duration-250 transform scale-75 -translate-y-4 top-1 left-2.5 origin-[0] 
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
            >
              {field.label}
            </label>
          </div>
        ))}

        {/* Client Select */}
        <div className="relative z-0 w-full group">
          <select
            name="client"
            value={formData.client}
            onChange={handleChange}
            required
            className="block w-full pt-5 pb-2.5 px-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
          <label
            htmlFor="client"
            className="absolute text-md text-gray-500 bg-white px-1 transition-all duration-250 transform scale-75 -translate-y-4 top-1 left-2.5 origin-[0] 
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
          >
            Client
          </label>
        </div>

        {/* Status Select */}
        <div className="relative z-0 w-full group">
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="block w-full pt-5 pb-2.5 px-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <label
            htmlFor="status"
            className="absolute text-md text-gray-500 bg-white px-1 transition-all duration-250 transform scale-75 -translate-y-4 top-1 left-2.5 origin-[0] 
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
          >
            Status
          </label>
        </div>

        {/* Description */}
        <div className="md:col-span-2 relative z-0 w-full group">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="block w-full pt-5 pb-2.5 px-2.5 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-indigo-600 peer resize-none"
          />
          <label
            htmlFor="description"
            className="absolute text-md text-gray-500 bg-white px-1 transition-all duration-250 transform scale-75 -translate-y-4 top-1 left-2.5 origin-[0] 
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
          >
            Description
          </label>
        </div>

        <div className="md:col-span-2 flex justify-end space-x-3">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-6 rounded-lg"
          >
            {editingProject ? "Update Project" : "Save Project"}
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-6 rounded-lg"
            onClick={() => {
              setEditingProject(null);
              setActiveTab(TABS.PROJECTS);
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
