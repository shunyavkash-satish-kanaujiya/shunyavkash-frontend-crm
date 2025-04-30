import { useState } from "react";
import { TimesheetTable } from "../components/tables/TimesheetTable";
import { ReusableContainer } from "../components/ui/ReusableContainer";
import { TABS } from "../constants/activeTab";
import { useTimesheetStore } from "../store/timesheetStore";
import { useTimesheetForm } from "../hooks/timesheet/useTimesheetForm";
import { timesheetFilters } from "../constants/timesheet/timesheetFilter.js";

export const Timesheet = ({ setActiveTab, setEditingTimesheet }) => {
  const { filteredTimesheets, loading, searchTerm, setSearchTerm, error } =
    useTimesheetForm();

  const [filters, setFilters] = useState({ status: "" });

  // Get setActiveTimesheet from the store
  const setActiveTimesheet = useTimesheetStore(
    (state) => state.setActiveTimesheet
  );

  const handleTimesheetSelect = (timesheet) => {
    // Update both local and global state
    setEditingTimesheet(timesheet);
    setActiveTimesheet(timesheet);
    setActiveTab(TABS.ADD_TIMESHEET);
  };

  const finalFilteredTimesheets = filteredTimesheets.filter((timesheet) => {
    const matchesStatus = filters.status
      ? timesheet.status === filters.status
      : true;
    return matchesStatus;
  });

  return (
    <>
      <ReusableContainer
        searchPlaceholder="Search by project name"
        onSearchChange={setSearchTerm}
        searchValue={searchTerm}
        filters={timesheetFilters}
        onFilterChange={setFilters}
        onAddClick={() => {
          setEditingTimesheet(null);
          setActiveTimesheet(null);
          setActiveTab(TABS.ADD_TIMESHEET);
        }}
        addButtonLabel="Add Timesheet"
      >
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
            // timesheets={filteredTimesheets}
            timesheets={finalFilteredTimesheets}
            setActiveTab={setActiveTab}
            setEditingTimesheet={handleTimesheetSelect}
          />
        )}
      </ReusableContainer>
    </>
  );
};
