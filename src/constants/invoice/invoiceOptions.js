export const invoiceStatusOptions = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

export const statusStyles = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-purple-100 text-purple-800",
};

export const invoiceTableFilters = [
  {
    name: "status",
    label: "Status",
    options: [{ value: "", label: "All" }, ...invoiceStatusOptions],
  },
];
