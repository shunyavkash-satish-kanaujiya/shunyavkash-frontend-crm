import React from "react";
import { TaskCard } from "./TaskCard";

export const TaskList = ({ tasks }) => {
  if (!tasks.length) {
    return <p className="text-center text-gray-500 mt-10">No tasks found.</p>;
  }

  console.log("TASKS:", tasks);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
};
