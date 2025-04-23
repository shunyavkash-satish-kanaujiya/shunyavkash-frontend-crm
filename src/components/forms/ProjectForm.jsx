import { useEffect } from "react";
import { useProjectForm } from "../../hooks/project/projectForm/useProjectForm";
import { formatDate } from "../../utils/formatDate";

export const ProjectForm = ({
  editingProject,
  setEditingProject,
  setActiveTab,
}) => {
  const {
    clients,
    formData,
    priorityOptions,
    statusOptions,
    setFormData,
    handleChange,
    handleSubmit,
    resetForm,
  } = useProjectForm(editingProject, setEditingProject, setActiveTab);

  useEffect(() => {
    if (editingProject) {
      setFormData({
        ...editingProject,
        priority: editingProject.priority?.toLowerCase() || "normal",
        status: editingProject.status?.toLowerCase() || "pending",
        client: editingProject.client?._id || editingProject.client || "",
        startDate: formatDate(editingProject.startDate, "yyyy-MM-dd"),
        endDate: formatDate(editingProject.endDate, "yyyy-MM-dd"),
      });
    }
  }, [editingProject, setFormData]);

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

        {/* Priority Select */}
        <div className="relative z-0 w-full group">
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="block w-full pt-5 pb-2.5 px-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
          >
            {priorityOptions.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <label
            htmlFor="priority"
            className="absolute text-md text-gray-500 bg-white px-1 transition-all duration-250 transform scale-75 -translate-y-4 top-1 left-2.5 origin-[0] 
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
          >
            Priority
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
              <option key={opt} value={opt}>
                {opt}
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

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-end gap-4">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            {editingProject ? "Update" : "Add Project"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2 text-white bg-gray-400 rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
