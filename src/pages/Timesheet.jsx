import { useEffect, useState } from "react";
import { TimesheetTable } from "../components/tables/TimesheetTable";
import { TimesheetForm } from "../components/forms/TimesheetForm";
import { TimesheetViewToggle } from "../components/timesheet/TimesheetViewToggle";
import { TimesheetCalendar } from "../components/timesheet/TimesheetCalendar";
import { ReusableContainer } from "../components/ui/ReusableContainer";
import { TABS } from "../constants/activeTab";
import { useTimesheetStore } from "../store/timesheetStore";
import { useTimesheetForm } from "../hooks/timesheet/useTimesheetForm";
import { timesheetFilters } from "../constants/timesheet/timesheetFilter.js";

// Define view types
const VIEW_TYPES = {
  LIST: "list",
  CALENDAR: "calendar",
};

export const Timesheet = () => {
  const [activeTab, setActiveTab] = useState(TABS.TIMESHEET);
  const [viewType, setViewType] = useState(VIEW_TYPES.LIST);
  const {
    timesheets,
    filteredTimesheets,
    loading,
    searchTerm,
    setSearchTerm,
    error,
  } = useTimesheetForm();
  const setActiveTimesheet = useTimesheetStore(
    (state) => state.setActiveTimesheet
  );

  console.log("Timesheets", timesheets);
  console.log("Filtered Timesheet", filteredTimesheets);

  const handleTimesheetSelect = (timesheet) => {
    setActiveTimesheet(timesheet);
    setActiveTab(TABS.ADD_TIMESHEET);
  };

  const handleTimeRangeSelect = (timeRange) => {
    setActiveTimesheet({
      startTime: timeRange.startTime,
      endTime: timeRange.endTime,
      // Default values for new timesheet
      projectName: "",
      taskDescription: "",
      // Add other necessary default fields
    });
    setActiveTab(TABS.ADD_TIMESHEET);
  };

  const toggleView = () => {
    setViewType(
      viewType === VIEW_TYPES.LIST ? VIEW_TYPES.CALENDAR : VIEW_TYPES.LIST
    );
  };

  useEffect(() => {
    console.log("Raw timesheets:", timesheets);
    console.log("Filtered timesheets:", filteredTimesheets);
  }, [timesheets, filteredTimesheets]);

  return (
    <>
      {/* Timesheet List/Calendar View */}
      {activeTab === TABS.TIMESHEET && (
        <ReusableContainer
          searchPlaceholder="Search by project name"
          onSearchChange={setSearchTerm}
          searchValue={searchTerm}
          filters={timesheetFilters}
          onAddClick={() => {
            setActiveTimesheet(null);
            setActiveTab(TABS.ADD_TIMESHEET);
          }}
          addButtonLabel="Add Timesheet"
        >
          <div className="mb-4 flex justify-end items-center pt-3 pr-3">
            {/* <TimesheetViewToggle /> */}
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
              setEditingTimesheet={setActiveTimesheet}
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
      )}

      {/* Timesheet Form View */}
      {activeTab === TABS.ADD_TIMESHEET && (
        <TimesheetForm setActiveTab={setActiveTab} />
      )}
    </>
  );
};
