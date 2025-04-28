import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useTimesheetStore } from "@/store/hr/timesheetStore";

export const TimeAnalysis = () => {
  const timesheets = useTimesheetStore((state) => state.timesheets);

  // Aggregate data by employee or project for the chart
  const aggregateData = () => {
    return timesheets.reduce((acc, ts) => {
      const key = ts.employee?.name || "Unknown";
      if (!acc[key]) acc[key] = { name: key, hours: 0 };
      acc[key].hours += ts.hours;
      return acc;
    }, {});
  };

  const data = Object.values(aggregateData());

  return (
    <div>
      <h3>Time Analysis</h3>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="hours" fill="#8884d8" />
      </BarChart>
    </div>
  );
};
