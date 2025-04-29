import { useEffect, useState } from "react";
import { useClientStore } from "../../store/clientStore";
import { useTimesheetStore } from "../../store/timesheetStore";
import { useInvoiceStore } from "../../store/invoiceStore";

export const CreateInvoice = ({ setActiveTab }) => {
  const { clients, fetchClients } = useClientStore();
  const { timesheets, fetchTimesheets } = useTimesheetStore();
  const { createInvoice, loading } = useInvoiceStore();

  const [formData, setFormData] = useState({
    client: "",
    timesheetIds: [],
    ratePerHour: "",
    issuedDate: "",
    dueDate: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchClients();
    fetchTimesheets();
  }, [fetchClients, fetchTimesheets]);

  useEffect(() => {
    console.log("Fetched Clients: ", clients);
    console.log("Fetched Timesheets: ", timesheets);
  }, [clients, timesheets]);

  const selectedTimesheets = timesheets.filter((ts) =>
    formData.timesheetIds.includes(ts._id)
  );

  const totalHours = selectedTimesheets.reduce(
    (sum, ts) => sum + (ts.hours || 0),
    0
  );

  const totalAmount = totalHours * parseFloat(formData.ratePerHour || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimesheetToggle = (id) => {
    setFormData((prev) => ({
      ...prev,
      timesheetIds: prev.timesheetIds.includes(id)
        ? prev.timesheetIds.filter((tid) => tid !== id)
        : [...prev.timesheetIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.client) errors.client = "Client is required.";
    if (!formData.timesheetIds.length)
      errors.timesheetIds = "Select at least one timesheet.";
    if (!formData.ratePerHour)
      errors.ratePerHour = "Rate per hour is required.";
    if (!formData.issuedDate) errors.issuedDate = "Issued date is required.";
    if (!formData.dueDate) errors.dueDate = "Due date is required.";

    if (Object.keys(errors).length) return setFormErrors(errors);

    await createInvoice({
      ...formData,
      totalHours,
      totalAmount,
    });

    setActiveTab("Invoice");
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Client */}
        <div>
          <label className="block text-sm font-medium">Client</label>
          <select
            name="client"
            value={formData.client}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
          >
            <option value="">-- Select Client --</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
          {formErrors.client && (
            <p className="text-red-500 text-sm">{formErrors.client}</p>
          )}
        </div>

        {/* Select Timesheets */}
        <div>
          <label className="block text-sm font-medium">Timesheets</label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
            {timesheets.map((ts) => (
              <label key={ts._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.timesheetIds.includes(ts._id)}
                  onChange={() => handleTimesheetToggle(ts._id)}
                />
                <span>
                  {ts.taskTitle} — {ts.hours} hrs
                </span>
              </label>
            ))}
          </div>
          {formErrors.timesheetIds && (
            <p className="text-red-500 text-sm">{formErrors.timesheetIds}</p>
          )}
        </div>

        {/* Rate per Hour */}
        <div>
          <label className="block text-sm font-medium">Rate per Hour (₹)</label>
          <input
            type="number"
            name="ratePerHour"
            value={formData.ratePerHour}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
          {formErrors.ratePerHour && (
            <p className="text-red-500 text-sm">{formErrors.ratePerHour}</p>
          )}
        </div>

        {/* Issued Date */}
        <div>
          <label className="block text-sm font-medium">Issued Date</label>
          <input
            type="date"
            name="issuedDate"
            value={formData.issuedDate}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
          {formErrors.issuedDate && (
            <p className="text-red-500 text-sm">{formErrors.issuedDate}</p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
          {formErrors.dueDate && (
            <p className="text-red-500 text-sm">{formErrors.dueDate}</p>
          )}
        </div>

        {/* Summary */}
        <div className="bg-gray-100 p-3 rounded">
          <p>
            Total Hours: <strong>{totalHours}</strong>
          </p>
          <p>
            Total Amount: <strong>₹{totalAmount.toFixed(2)}</strong>
          </p>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Invoice"}
        </button>
      </form>
    </div>
  );
};
