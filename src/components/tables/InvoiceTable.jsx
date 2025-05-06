import React, { useEffect, useState } from "react";
import { useInvoiceStore } from "../../store/invoiceStore";
import { BarsArrowDownIcon } from "@heroicons/react/24/outline";
import { InvoiceRow } from "../invoice/InvoiceRow";

export const InvoiceListPage = ({
  searchTerm,
  filters,
  handleDownloadPDF,
  handleRegeneratePDF,
  updateInvoiceStatus,
}) => {
  const {
    invoices,
    fetchInvoices,
    deleteInvoice,
    sendInvoice,
    loading,
    error,
  } = useInvoiceStore();
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

  const handleLocalRegeneratePdf = async (invoiceId) => {
    try {
      setRegenerating(true);
      setRegeneratingId(invoiceId);
      await handleRegeneratePDF(invoiceId);
      await fetchInvoices();
    } catch (err) {
      console.error("Failed to regenerate PDF:", err);
    } finally {
      setRegenerating(false);
      setRegeneratingId(null);
    }
  };

  const handleLocalUpdateStatus = async (invoiceId, currentStatus) => {
    try {
      const result = await updateInvoiceStatus(invoiceId, currentStatus);
      if (result?.error) {
        alert(result.error);
        return;
      }
      if (result?.cancelled) {
        return;
      }
      await fetchInvoices();
    } catch (err) {
      console.error("Failed to update status:", err);
      if (!err.message.includes("Cannot change status")) {
        alert("Error updating invoice status. Please try again.");
      }
    }
  };

  const toggleExpand = (invoiceId) => {
    setExpandedInvoiceId(expandedInvoiceId === invoiceId ? null : invoiceId);
  };

  const filteredInvoices = Array.isArray(invoices)
    ? invoices.filter((invoice) => {
        const clientMatch = invoice.client?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const statusMatch =
          !filters.status ||
          filters.status === "All" ||
          invoice.status === filters.status;
        return clientMatch && statusMatch;
      })
    : []; // fallback

  if (loading)
    return (
      <div className="flex justify-center items-center flex-col h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-6 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-2 text-gray-500">Loading invoices...</p>
      </div>
    );

  if (error)
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        {console.log("ERROR:", error)}
        <span className="block sm:inline">{error}</span>
      </div>
    );

  if (filteredInvoices.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No invoices available.
      </div>
    );
  }

  return (
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
          {filteredInvoices.map((invoice) => (
            <InvoiceRow
              key={invoice._id}
              invoice={invoice}
              expandedInvoiceId={expandedInvoiceId}
              toggleExpand={toggleExpand}
              handleUpdateStatus={handleLocalUpdateStatus}
              handleDelete={handleDelete}
              handleRegeneratePdf={handleLocalRegeneratePdf}
              handleDownloadPDF={handleDownloadPDF}
              sendInvoice={sendInvoice}
              regenerating={regenerating}
              regeneratingId={regeneratingId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
