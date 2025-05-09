import { useEffect, useState } from "react";
import { useTimesheetStore } from "../../store/timesheetStore.js";
import { useTimesheetForm } from "../../hooks/timesheet/useTimesheetForm.js";
import { TABS } from "../../constants/activeTab.js";
import { useProjectStore } from "../../store/projectStore";
import { useAuthStore } from "../../store/authStore.js";
import { ReusableSelectBox } from "../ui/ReusableSelectBox.jsx";
import { timesheetFilters } from "../../constants/timesheet/timesheetFilter.js";
import { TagInput } from "../ui/TagInput.jsx";

export const TimesheetForm = ({ editingTimesheet, setActiveTab }) => {
  const addTimesheet = useTimesheetStore((state) => state.addTimesheet);
  const updateTimesheet = useTimesheetStore((state) => state.updateTimesheet);
  const fetchTimesheets = useTimesheetStore((state) => state.fetchTimesheets);
  const projects = useProjectStore((state) => state.projects);
  const fetchUser = useAuthStore((state) => state.user);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);

  const { formData, resetForm, setFormData, handleChange } = useTimesheetForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descriptionTags, setDescriptionTags] = useState([]);

  const statusFilter = timesheetFilters.find((f) => f.key === "status");
  const employeeId = fetchUser._id;

  useEffect(() => {
    console.log("editingTimesheet:", editingTimesheet);

    if (editingTimesheet) {
      let existingTags = [];

      if (Array.isArray(editingTimesheet.description)) {
        existingTags = [...editingTimesheet.description];
        console.log("Using array directly:", existingTags);
      } else if (typeof editingTimesheet.description === "string") {
        const desc = editingTimesheet.description;
        if (desc.includes(",") && !desc.includes("[") && !desc.includes("{")) {
          try {
            JSON.parse(desc); // if valid JSON, skip to fallback
          } catch {
            existingTags = desc.split(",").map((t) => t.trim());
            console.log("Parsed as comma-separated string:", existingTags);
          }
        } else {
          try {
            const parsed = JSON.parse(desc);
            if (Array.isArray(parsed)) {
              existingTags = parsed.map((t) => String(t).trim());
              console.log("Parsed from JSON array string:", existingTags);
            }
          } catch {
            existingTags = desc.split(",").map((t) => t.trim());
            console.log("Fallback parsed from string:", existingTags);
          }
        }
      } else if (editingTimesheet.description) {
        existingTags = String(editingTimesheet.description)
          .split(",")
          .map((t) => t.trim());
        console.log("Converted to string then split:", existingTags);
      }

      existingTags = existingTags.filter((tag) => tag && tag.trim() !== "");
      console.log("Final existingTags:", existingTags);

      setFormData({
        project:
          editingTimesheet.project?._id || editingTimesheet.project || "",
        status: editingTimesheet.status?.toLowerCase() || "pending",
        hours: editingTimesheet.hoursWorked || "",
        date: editingTimesheet.date
          ? new Date(editingTimesheet.date).toISOString().split("T")[0]
          : "",
        description: "",
        employee: employeeId,
      });

      setTimeout(() => {
        setDescriptionTags(existingTags);
        console.log("Tags set to:", existingTags);
      }, 0);
    }
  }, [editingTimesheet, setFormData, employeeId]);

  useEffect(() => {
    console.log("descriptionTags updated:", descriptionTags);
  }, [descriptionTags]);

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
        description: descriptionTags, // Send as array directly to matched schema
        employee: employeeId,
      };

      console.log("Submitting data:", submissionData);

      if (editingTimesheet && editingTimesheet._id) {
        await updateTimesheet({ ...submissionData, _id: editingTimesheet._id });
      } else {
        await addTimesheet(submissionData);
      }

      await fetchTimesheets();
      setActiveTab(TABS.TIMESHEET);
    } catch (error) {
      console.error("Error submitting timesheet:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    { label: "Date", name: "date", type: "date" },
    { label: "Hours", name: "hours", type: "number" },
  ];

  console.log("STATUS: ", formData.status);

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
        {editingTimesheet ? "Update Timesheet" : "Add New Timesheet"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <ReusableSelectBox
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

        {/* Status */}
        {statusFilter && (
          <ReusableSelectBox
            label={statusFilter.label.replace("Filter by ", "")}
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusFilter.options
              .filter((s) => {
                if (fetchUser.role === "Admin") {
                  return true; // Admin
                } else {
                  return s === "pending"; // Employees
                }
              })
              .map((s) => ({ value: s, label: s }))}
            required
          />
        )}

        {/* Tag-style Description input */}
        <TagInput tags={descriptionTags} setTags={setDescriptionTags} />
        <span className="ml-1 text-xs text-gray-500 font-medium  -mt-4">
          Tap "enter" to save changes.
        </span>

        <div className="md:col-span-2 flex justify-end space-x-3">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-6 rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : editingTimesheet
              ? "Update Timesheet"
              : "Save Timesheet"}
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-6 rounded-lg"
            onClick={() => {
              resetForm();
              setDescriptionTags([]);
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
