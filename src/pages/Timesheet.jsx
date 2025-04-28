import { useState } from "react";
import { TimesheetTable } from "../components/tables/TimesheetTable";
import { TimesheetCalendar } from "../components/timesheet/TimesheetCalendar";
import { ReusableContainer } from "../components/ui/ReusableContainer";
import { TABS } from "../constants/activeTab";
import { useTimesheetStore } from "../store/timesheetStore";
import { useTimesheetForm } from "../hooks/timesheet/useTimesheetForm";
import { timesheetFilters } from "../constants/timesheet/timesheetFilter.js";

const VIEW_TYPES = {
  LIST: "list",
  CALENDAR: "calendar",
};

export const Timesheet = ({ setActiveTab, setEditingTimesheet }) => {
  const [viewType, setViewType] = useState(VIEW_TYPES.LIST);
  const {
    timesheets,
    filteredTimesheets,
    loading,
    searchTerm,
    setSearchTerm,
    error,
  } = useTimesheetForm();

  // Get setActiveTimesheet from the store
  const setActiveTimesheet = useTimesheetStore(
    (state) => state.setActiveTimesheet
  );

  const handleTimesheetSelect = (timesheet) => {
    // Update both local and global state
    setEditingTimesheet(timesheet);
    setActiveTimesheet(timesheet); // Keep global state in sync
    setActiveTab(TABS.ADD_TIMESHEET);
  };

  const handleTimeRangeSelect = (timeRange) => {
    const newTimesheet = {
      startTime: timeRange.startTime,
      endTime: timeRange.endTime,
      projectName: "",
      taskDescription: "",
    };

    setEditingTimesheet(newTimesheet);
    setActiveTimesheet(newTimesheet); // Keep global state in sync
    setActiveTab(TABS.ADD_TIMESHEET);
  };

  const toggleView = () => {
    setViewType(
      viewType === VIEW_TYPES.LIST ? VIEW_TYPES.CALENDAR : VIEW_TYPES.LIST
    );
  };

  return (
    <>
      <ReusableContainer
        searchPlaceholder="Search by project name"
        onSearchChange={setSearchTerm}
        searchValue={searchTerm}
        filters={timesheetFilters}
        onAddClick={() => {
          setEditingTimesheet(null);
          setActiveTimesheet(null); // Reset global state too
          setActiveTab(TABS.ADD_TIMESHEET);
        }}
        addButtonLabel="Add Timesheet"
      >
        <div className="mb-4 flex justify-end items-center pt-3 pr-3">
          <button
            onClick={toggleView}
            className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            {viewType === VIEW_TYPES.LIST
              ? "Switch to Calendar"
              : "Switch to List"}
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-indigo-600 font-medium">
            Loading timesheets...
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600 font-medium">
            Failed to load timesheets. Please try again later.
          </div>
        ) : viewType === VIEW_TYPES.LIST ? (
          <TimesheetTable
            timesheets={filteredTimesheets}
            setActiveTab={setActiveTab}
            setEditingTimesheet={handleTimesheetSelect} // Using handleTimesheetSelect to update both states
          />
        ) : (
          <TimesheetCalendar
            timesheets={timesheets}
            onTimesheetSelect={handleTimesheetSelect}
            onTimeRangeSelect={handleTimeRangeSelect}
            loading={loading}
            error={error}
          />
        )}
      </ReusableContainer>
    </>
  );
};
