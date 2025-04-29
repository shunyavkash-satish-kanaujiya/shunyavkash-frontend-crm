import { useEffect, useState } from "react";
import { useTimesheetStore } from "../../store/timesheetStore.js";
import { useTimesheetForm } from "../../hooks/timesheet/useTimesheetForm.js";
import { TABS } from "../../constants/activeTab.js";
import { useProjectStore } from "../../store/projectStore";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore.js";
import { SelectBox } from "../ui/ReusableSelectBox.jsx";
import { timesheetFilters } from "../../constants/timesheet/timesheetFilter.js";

export const TimesheetForm = ({ editingTimesheet, setActiveTab }) => {
  const addTimesheet = useTimesheetStore((state) => state.addTimesheet);
  const updateTimesheet = useTimesheetStore((state) => state.updateTimesheet);
  const fetchTimesheets = useTimesheetStore((state) => state.fetchTimesheets);
  const projects = useProjectStore((state) => state.projects);
  const fetchUser = useAuthStore((state) => state.user);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);

  // Import form state and methods from useTimesheetForm hook
  const { formData, resetForm, setFormData, handleChange } = useTimesheetForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusFilter = timesheetFilters.find(
    (filter) => filter.key === "status"
  );

  const employeeId = fetchUser._id;

  // Pre-fill the form if there's an editing timesheet
  useEffect(() => {
    if (editingTimesheet) {
      setFormData({
        project: editingTimesheet.project?._id || "",
        status: editingTimesheet.status?.toLowerCase() || "pending",
        hours: editingTimesheet.hoursWorked || "",
        date: editingTimesheet.date
          ? new Date(editingTimesheet.date).toISOString().split("T")[0]
          : "",
        description: editingTimesheet.description || "",
        employee: employeeId,
      });
    }
  }, [editingTimesheet, setFormData, employeeId]);

  // Fetch projects on mount
  useEffect(() => {
    if (!projects.length) {
      fetchProjects();
    }
  }, [projects.length, fetchProjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const submissionData = {
        project: formData.project,
        date: new Date(formData.date).toISOString(),
        status: formData.status,
        hoursWorked: Number(formData.hours),
        description: formData.description,
        employee: employeeId, // critical
      };

      if (editingTimesheet && editingTimesheet._id) {
        await updateTimesheet({
          ...submissionData,
          _id: editingTimesheet._id,
        });
        toast.success("Timesheet updated!");
      } else {
        await addTimesheet(submissionData);
        toast.success("Timesheet added!");
      }

      await fetchTimesheets();
      setActiveTab(TABS.TIMESHEET);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit timesheet");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    { label: "Date", name: "date", type: "date", required: true },
    { label: "Hours", name: "hours", type: "number", required: true },
  ];

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
        {editingTimesheet && editingTimesheet._id
          ? "Update Timesheet"
          : "Add New Timesheet"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Project Select Box */}
        <SelectBox
          label="Project"
          name="project"
          value={formData.project}
          onChange={handleChange}
          options={projects.map((p) => ({ value: p._id, label: p.title }))}
          required
        />

        {fields.map((field) => (
          <div className="relative z-0 w-full group" key={field.name}>
            <input
              type={field.type}
              name={field.name}
              value={formData?.[field.name] || ""}
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

        {/* Status Select Box */}
        {statusFilter && (
          <SelectBox
            label={statusFilter.label.replace("Filter by ", "")}
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusFilter.options.map((status) => ({
              value: status,
              label: status,
            }))}
            required
          />
        )}

        {/* Description field - spans 2 columns */}
        <div className="relative z-0 w-full group md:col-span-2">
          <textarea
            name="description"
            value={formData?.description || ""}
            onChange={handleChange}
            required
            rows="4"
            className="block w-full px-2.5 pt-5 pb-2.5 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
          ></textarea>
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
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : editingTimesheet && editingTimesheet._id
              ? "Update Timesheet"
              : "Save Timesheet"}
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-6 rounded-lg"
            onClick={() => {
              resetForm();
              setActiveTab(TABS.TIMESHEET);
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
