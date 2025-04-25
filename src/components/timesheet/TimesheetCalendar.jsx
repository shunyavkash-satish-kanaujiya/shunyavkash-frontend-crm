import { useState } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";

export const TimesheetCalendar = ({
  timesheets = [],
  onTimesheetSelect,
  onTimeRangeSelect,
  loading,
  error,
}) => {
  const [calendarConfig, setCalendarConfig] = useState({
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: async (args) => {
      // Handle time range selection for new timesheet
      onTimeRangeSelect({
        startTime: args.start.value,
        endTime: args.end.value,
      });
    },
    onEventClick: (args) => {
      // Handle event click for editing
      onTimesheetSelect(args.e.data.timesheet);
    },
    eventDeleteHandling: "Update",
    onEventDelete: (args) => {
      // Optional: Handle deletion if you implement this feature
      console.log("Event deleted:", args.e.data.timesheet);
    },
  });

  console.log("Timesheets in calendar:", timesheets);

  // Convert timesheets to calendar events
  const events = (timesheets || []).map((timesheet) => {
    // Create a start date from the timesheet date
    const timeDate = new Date(timesheet.date);

    // Create an end date by adding the hours worked
    const endDate = new Date(timeDate);
    endDate.setHours(endDate.getHours() + Number(timesheet.hoursWorked || 0));

    // Get project title - handle potential missing references
    const projectName = timesheet.project?.title || "No Project";

    return {
      id: timesheet._id || Math.random().toString(),
      text: `${projectName}: ${timesheet.description || ""}`,
      start: new DayPilot.Date(timeDate),
      end: new DayPilot.Date(endDate),
      backColor: getColorForProject(projectName),
      timesheet: timesheet, // Store the original timesheet data
    };
  });

  console.log("Events created:", events); // Moved outside the map function

  // Function to generate consistent colors based on project name
  function getColorForProject(projectName) {
    // Simple hash function to generate color
    let hash = 0;
    for (let i = 0; i < projectName.length; i++) {
      hash = projectName.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate color based on hash
    const color = `hsl(${Math.abs(hash) % 360}, 70%, 70%)`;
    return color;
  }

  return (
    <div className="flex flex-col p-3">
      {/* Add loading and error states here */}
      {loading && (
        <div className="p-6 text-center text-indigo-600 font-medium">
          Loading calendar...
        </div>
      )}
      {error && (
        <div className="p-6 text-center text-red-600 font-medium">
          Failed to load calendar data.
        </div>
      )}
      {/* Only show calendar content when not loading and no error */}
      {!loading && !error && (
        <div className="mb-4 flex space-x-2 d-flex justify-end">
          <button
            className="px-2 py-1 text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded"
            onClick={() =>
              setCalendarConfig({ ...calendarConfig, viewType: "Day" })
            }
          >
            Day
          </button>
          <button
            className="px-2 py-1 text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded"
            onClick={() =>
              setCalendarConfig({ ...calendarConfig, viewType: "Week" })
            }
          >
            Week
          </button>
          <button
            className="px-2 py-1 text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded"
            onClick={() =>
              setCalendarConfig({ ...calendarConfig, viewType: "Month" })
            }
          >
            Month
          </button>
        </div>
      )}
      <div className="h-screen max-h-96">
        <DayPilotCalendar {...calendarConfig} events={events} />
      </div>
    </div>
  );
};
