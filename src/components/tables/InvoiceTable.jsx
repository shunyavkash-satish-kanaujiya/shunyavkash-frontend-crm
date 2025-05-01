import React, { useEffect, useState } from "react";
import { useInvoiceStore } from "../../store/invoiceStore";
import {
  ArrowDownTrayIcon,
  TrashIcon,
  ArrowPathIcon,
  BarsArrowDownIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";

const InvoiceListPage = ({ handleDownloadPDF }) => {
  const {
    invoices,
    fetchInvoices,
    deleteInvoice,
    loading,
    error,
    regeneratePdf,
    updateInvoiceStatus,
  } = useInvoiceStore();

  // Local state
  const [regenerating, setRegenerating] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState(null);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleDelete = async (invoiceId) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      await deleteInvoice(invoiceId);
    }
  };

  const handleRegeneratePdf = async (invoiceId) => {
    try {
      setRegenerating(true);
      setRegeneratingId(invoiceId);
      await regeneratePdf(invoiceId);
      await fetchInvoices(); // Refresh the list after regeneration
    } catch (err) {
      console.error("Failed to regenerate PDF:", err);
    } finally {
      setRegenerating(false);
      setRegeneratingId(null);
    }
  };

  const handleUpdateStatus = async (invoiceId, currentStatus) => {
    try {
      // Toggle between Paid and Unpaid
      const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";
      await updateInvoiceStatus(invoiceId, newStatus);
      await fetchInvoices(); // Refresh invoices to show updated status
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating invoice status. Please try again.");
    }
  };

  const toggleExpand = (invoiceId) => {
    setExpandedInvoiceId(expandedInvoiceId === invoiceId ? null : invoiceId);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (error)
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );

  if (invoices.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No invoices available.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
        {/* You can add an "Add Invoice" button here if needed */}
      </div>

      <div className="overflow-x-auto space-y-4 shadow-md rounded-md p-2">
        <table className="min-w-full divide-y divide-gray-200 text-sm overflow-hidden rounded-lg">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                <BarsArrowDownIcon className="w-6 h-6 inline" />
              </th>
              <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                Client
              </th>
              <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                Total Hours
              </th>
              <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                PDF
              </th>
              <th className="px-6 py-3 text-left font-medium text-indigo-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {invoices.map((invoice) => (
              <React.Fragment key={invoice._id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleExpand(invoice._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <ArrowRightCircleIcon
                        className={`w-5 h-5 inline text-indigo-600 transform transition-transform duration-300 ${
                          expandedInvoiceId === invoice._id
                            ? "rotate-90"
                            : "rotate-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4">{invoice.client?.name || "N/A"}</td>
                  <td className="px-6 py-4">{invoice.totalHours}</td>
                  <td className="px-6 py-4 font-medium">
                    ₹{invoice.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {regenerating && regeneratingId === invoice._id ? (
                      <span className="text-gray-500 flex items-center">
                        <ArrowPathIcon className="w-5 h-5 mr-1 animate-spin" />
                        Regenerating...
                      </span>
                    ) : invoice.pdfUrl && invoice.pdfExists ? (
                      <button
                        onClick={() => handleDownloadPDF(invoice.pdfUrl)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <ArrowDownTrayIcon className="w-5 h-5 mr-1" />
                        Download
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegeneratePdf(invoice._id)}
                        className="text-yellow-600 hover:text-yellow-800 flex items-center"
                      >
                        <DocumentTextIcon className="w-5 h-5 mr-1" />
                        Generate
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm flex space-x-2">
                    <button
                      onClick={() =>
                        handleUpdateStatus(invoice._id, invoice.status)
                      }
                      className="text-indigo-600 hover:text-indigo-900 flex items-center"
                      title={
                        invoice.status === "Paid" ? "Mark Unpaid" : "Mark Paid"
                      }
                    >
                      <BanknotesIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(invoice._id)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                      title="Delete Invoice"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
                {expandedInvoiceId === invoice._id && (
                  <tr className="bg-gray-50">
                    <td colSpan="7" className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Invoice Details
                          </h4>
                          <p className="text-sm text-gray-500">
                            Invoice ID: {invoice._id}
                          </p>
                          {invoice.createdAt && (
                            <p className="text-sm text-gray-500">
                              Created:{" "}
                              {new Date(invoice.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Actions
                          </h4>
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() =>
                                handleUpdateStatus(invoice._id, invoice.status)
                              }
                              className={`px-3 py-1 rounded-md text-sm text-white ${
                                invoice.status === "Paid"
                                  ? "bg-yellow-500 hover:bg-yellow-600"
                                  : "bg-green-500 hover:bg-green-600"
                              }`}
                            >
                              {invoice.status === "Paid"
                                ? "Mark Unpaid"
                                : "Mark Paid"}
                            </button>
                            {invoice.pdfUrl && invoice.pdfExists ? (
                              <button
                                onClick={() =>
                                  handleDownloadPDF(invoice.pdfUrl)
                                }
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-md text-sm text-white"
                              >
                                Download PDF
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRegeneratePdf(invoice._id)}
                                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded-md text-sm text-white"
                              >
                                Generate PDF
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceListPage;
