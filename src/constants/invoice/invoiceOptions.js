export const invoiceStatusOptions = [
  { value: "paid", label: "Paid" },
  { value: "Unpaid", label: "Unpaid" },
];

export const statusStyles = {
  paid: "bg-green-100 text-green-800",
  unpaid: "bg-yellow-100 text-yellow-800",
};

export const invoiceTableFilters = [
  {
    name: "status",
    label: "Status",
    options: [{ value: "", label: "All" }, ...invoiceStatusOptions],
  },
];
