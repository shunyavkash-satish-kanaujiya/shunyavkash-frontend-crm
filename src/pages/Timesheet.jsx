import { useState } from "react";
import { TimesheetTable } from "../components/tables/TimesheetTable";
import { TimesheetForm } from "../components/forms/TimesheetForm";
import { TimesheetViewToggle } from "../components/timesheet/TimesheetViewToggle";
import { ReusableContainer } from "../components/ui/ReusableContainer";
import { TABS } from "../constants/activeTab";
import { useTimesheetStore } from "../store/timesheetStore";
import { useTimesheetForm } from "../hooks/timesheet/useTimesheetForm";
import { timesheetFilters } from "../constants/timesheet/timesheetFilter.js";

export const Timesheet = () => {
  const [activeTab, setActiveTab] = useState(TABS.TIMESHEET);
  const { filteredTimesheets, loading, searchTerm, setSearchTerm, error } =
    useTimesheetForm();
  const setActiveTimesheet = useTimesheetStore(
    (state) => state.setActiveTimesheet
  );

  return (
    <>
      {/* Timesheet List View */}
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
          <TimesheetViewToggle />

          {loading ? (
            <div className="p-6 text-center text-indigo-600 font-medium">
              Loading timesheets...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600 font-medium">
              Failed to load timesheets. Please try again later.
            </div>
          ) : (
            <TimesheetTable
              timesheets={filteredTimesheets}
              setActiveTab={setActiveTab}
              setEditingTimesheet={setActiveTimesheet}
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
