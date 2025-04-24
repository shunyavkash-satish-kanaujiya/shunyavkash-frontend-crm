import { useEffect } from "react";
import { useTimesheetStore } from "../../store/timesheetStore.js";
import { useTimesheetForm } from "../../hooks/timesheet/useTimesheetForm.js";
import { TABS } from "../../constants/activeTab.js";

export const TimesheetForm = ({ setActiveTab }) => {
  const activeTimesheet = useTimesheetStore((state) => state.activeTimesheet);
  const { formData, handleChange, resetForm } = useTimesheetForm();
  const { addTimesheet, updateTimesheet } = useTimesheetStore((state) => state);

  useEffect(() => {
    if (activeTimesheet) {
      resetForm(activeTimesheet);
    } else {
      resetForm(); // Reset to initial empty state if no activeTimesheet
    }
  }, [activeTimesheet, resetForm]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTimesheet) {
      updateTimesheet(formData);
    } else {
      addTimesheet(formData);
    }

    setActiveTab(TABS.TIMESHEET);
  };

  return (
    <div>
      <h3>{activeTimesheet ? "Edit Timesheet" : "Add Timesheet"}</h3>
      <form onSubmit={handleSubmit}>
        {/* Project field */}
        <div>
          <label>Project</label>
          <input
            type="text"
            name="project"
            value={formData?.project || ""} // Ensure it's always defined
            onChange={handleChange}
            required
          />
        </div>

        {/* Hours field */}
        <div>
          <label>Hours</label>
          <input
            type="number"
            name="hours"
            value={formData?.hours || ""} // Ensure it's always defined
            onChange={handleChange}
            required
          />
        </div>

        {/* Date field */}
        <div>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData?.date || ""} // Ensure it's always defined
            onChange={handleChange}
            required
          />
        </div>

        {/* Description field */}
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData?.description || ""} // Ensure it's always defined
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">{activeTimesheet ? "Update" : "Submit"}</button>
      </form>
    </div>
  );
};
