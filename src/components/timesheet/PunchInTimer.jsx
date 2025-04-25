import React, { useState } from "react";
import { useTimesheetStore } from "@/store/hr/timesheetStore";

export const PunchInTimer = () => {
  const [isPunchingIn, setIsPunchingIn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const { addTimesheet } = useTimesheetStore();

  const handlePunch = async () => {
    if (isPunchingIn) {
      const hoursWorked = Math.round((Date.now() - startTime) / 3600000); // Calculate hours
      await addTimesheet({
        date: new Date(),
        hours: hoursWorked,
        project: "Some Project", // You can update this dynamically
        employee: "Employee Name",
      });
    } else {
      setStartTime(Date.now());
    }
    setIsPunchingIn(!isPunchingIn);
  };

  return (
    <div>
      <button onClick={handlePunch}>
        {isPunchingIn ? "Punch Out" : "Punch In"}
      </button>
    </div>
  );
};
