// Priority Options
export const taskPriorityOptions = ["urgent", "high", "normal", "low"];

// Status Options
export const taskStatusOptions = [
  "todo",
  "in progress",
  "internal review",
  "client review",
  "revision",
  "completed",
];

// Priority Styles
export const taskPriorityStyles = {
  urgent: "bg-red-100 text-red-800",
  high: "bg-yellow-100 text-yellow-800",
  normal: "bg-blue-100 text-blue-800",
  low: "bg-gray-200 text-gray-700",
};

// Status Styles
export const taskStatusStyles = {
  todo: "bg-gray-200 text-gray-700",
  "in progress": "bg-blue-100 text-blue-700",
  "internal review": "bg-yellow-100 text-yellow-700",
  "client review": "bg-yellow-100 text-yellow-700",
  revision: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
};
