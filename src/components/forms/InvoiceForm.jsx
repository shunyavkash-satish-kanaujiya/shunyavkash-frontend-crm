import { useEffect, useState } from "react";
import { useClientStore } from "../../store/clientStore";
import { useTimesheetStore } from "../../store/timesheetStore";
import { useInvoiceStore } from "../../store/invoiceStore";
import { ReusableSelectBox } from "../ui/ReusableSelectBox.jsx";

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
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchTimesheets();
  }, [fetchClients, fetchTimesheets]);

  const filteredTimesheets = timesheets.filter((ts) => {
    const projectClientId =
      typeof ts.project?.client === "string"
        ? ts.project.client
        : ts.project?.client?._id;

    return (
      ts.isFinalized && !ts.isInvoiced && projectClientId === formData.client
    );
  });

  const selectedTimesheets = filteredTimesheets.filter((ts) =>
    formData.timesheetIds.includes(ts._id)
  );

  const totalHours = selectedTimesheets.reduce(
    (sum, ts) => sum + (ts.hoursWorked || 0),
    0
  );

  const totalAmount = totalHours * parseFloat(formData.ratePerHour || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "client") {
      // Clear selected timesheets if client changes
      setFormData((prev) => ({ ...prev, timesheetIds: [] }));
    }
  };

  const handleTimesheetToggle = (id) => {
    setFormData((prev) => ({
      ...prev,
      timesheetIds: prev.timesheetIds.includes(id)
        ? prev.timesheetIds.filter((tid) => tid !== id)
        : [...prev.timesheetIds, id],
    }));
  };

  const resetForm = () => {
    setFormData({
      client: "",
      timesheetIds: [],
      ratePerHour: "",
      issuedDate: "",
      dueDate: "",
    });
    setFormErrors({});
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormErrors({});
    setSubmitError("");
    setIsSubmitting(true);

    const errors = {};
    if (!formData.client) errors.client = "Client is required.";
    if (!formData.timesheetIds.length)
      errors.timesheetIds = "Select at least one timesheet.";
    if (!formData.ratePerHour)
      errors.ratePerHour = "Rate per hour is required.";
    if (!formData.issuedDate) errors.issuedDate = "Issued date is required.";
    if (!formData.dueDate) errors.dueDate = "Due date is required.";

    if (Object.keys(errors).length) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      await createInvoice({
        clientId: formData.client,
        timesheetIds: formData.timesheetIds,
        ratePerHour: formData.ratePerHour,
        dueDate: formData.dueDate,
      });

      setActiveTab("Invoice");
      resetForm();
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || "Failed to create invoice."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    { label: "Issued Date", name: "issuedDate", type: "date" },
    { label: "Due Date", name: "dueDate", type: "date" },
    {
      label: "Rate per Hour (₹)",
      name: "ratePerHour",
      type: "number",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
        Create Invoice
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Select Client */}
        <ReusableSelectBox
          label="Client"
          name="client"
          value={formData.client}
          onChange={handleChange}
          options={clients.map((client) => ({
            value: client._id,
            label: client.name,
          }))}
          required
        />
        {formErrors.client && (
          <p className="text-red-500 text-sm -mt-5">{formErrors.client}</p>
        )}

        {/* Select Timesheets */}
        {formData.client && (
          <div className="relative z-0 w-full group">
            <label
              className="absolute text-md text-gray-500 bg-white px-1 transition-all duration-250 transform scale-75 -translate-y-4 top-3 left-2.5 origin-[0] 
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
            >
              Timesheets
            </label>
            <div className="mt-2 grid gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {filteredTimesheets.length > 0 ? (
                <div className="space-y-3">
                  {filteredTimesheets.map((ts) => (
                    <label
                      key={ts._id}
                      className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 p-4 border rounded-lg cursor-pointer hover:bg-indigo-50 transition-all ease-in duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          className="mt-1 text-indigo-600 rounded focus:ring-indigo-500"
                          checked={formData.timesheetIds.includes(ts._id)}
                          onChange={() => handleTimesheetToggle(ts._id)}
                        />
                        <div className="text-sm leading-5">
                          <p>
                            <strong>Project:</strong>{" "}
                            {ts.project?.title || "Unnamed Project"}
                          </p>
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(ts.date).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Hours:</strong> {ts.hoursWorked} hrs
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 col-span-2">
                  No eligible timesheets available — only finalized and not yet
                  invoiced timesheets are shown.
                </p>
              )}
            </div>
            {formErrors.timesheetIds && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.timesheetIds}
              </p>
            )}
          </div>
        )}

        {/* Form Fields */}
        {fields.map((field) => (
          <div className="relative z-0 w-full group" key={field.name}>
            <input
              type={field.type}
              name={field.name}
              value={formData?.[field.name] || ""}
              onChange={handleChange}
              required={field.required}
              autoComplete="off"
              className="block w-full px-2.5 pt-5 pb-2.5 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
            />
            <label
              htmlFor={field.name}
              className="absolute text-md text-gray-500 bg-white px-1 transition-all duration-250 transform scale-75 -translate-y-4 top-1 left-2.5 origin-[0] 
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 
              peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-600"
            >
              {field.label}
            </label>
            {formErrors[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors[field.name]}
              </p>
            )}
          </div>
        ))}

        {/* Summary */}
        <div className="mt-6 bg-indigo-50 rounded-lg p-4 border border-indigo-100">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-indigo-700">Invoice Summary</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Total Hours</p>
              <p className="text-xl font-semibold text-gray-800">
                {totalHours.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Amount</p>
              <p className="text-xl font-semibold text-indigo-700">
                ₹{totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {submitError && (
          <p className="text-red-600 text-sm font-medium">{submitError}</p>
        )}

        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-6 rounded-lg"
            onClick={() => {
              resetForm();
              setActiveTab("Invoice");
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-6 rounded-lg"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
};
