export const getStatusColor = (status) => {
  switch (status) {
    case "Active":
    case "active":
      return { bg: "bg-green-100 text-green-600", dot: "bg-green-600" };
    case "Inactive":
    case "inactive":
      return { bg: "bg-gray-100 text-gray-600", dot: "bg-gray-600" };
    case "Terminated":
    case "terminated":
      return { bg: "bg-red-100 text-red-600", dot: "bg-red-600" };
    case "On Leave":
    case "on leave":
      return { bg: "bg-yellow-100 text-yellow-600", dot: "bg-yellow-600" };
    default:
      return { bg: "bg-indigo-100 text-indigo-600", dot: "bg-indigo-600" };
  }
};
