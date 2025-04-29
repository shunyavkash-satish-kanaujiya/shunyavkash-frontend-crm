import React, { useEffect } from "react";
import { useInvoiceStore } from "../../store/invoiceStore";

const InvoiceListPage = ({
  handleDownloadPDF,
  handleRegeneratePDF,
  updateInvoiceStatus,
}) => {
  const {
    invoices,
    fetchInvoices,
    deleteInvoice,
    loading,
    error,
  } = useInvoiceStore();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleDelete = async (invoiceId) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      await deleteInvoice(invoiceId);
    }
  };

  if (loading) return <div>Loading invoices...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 border-b text-left">ID</th>
            <th className="px-6 py-3 border-b text-left">Client</th>
            <th className="px-6 py-3 border-b text-left">Amount</th>
            <th className="px-6 py-3 border-b text-left">Status</th>
            <th className="px-6 py-3 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 border-b">{inv._id}</td>
              <td className="px-6 py-4 border-b">{inv.client?.name}</td>
              <td className="px-6 py-4 border-b">₹{inv.totalAmount}</td>
              <td className="px-6 py-4 border-b">{inv.status}</td>
              <td className="px-6 py-4 border-b space-x-3">
                {/* Download or regenerate PDF */}
                {inv.pdfUrl ? (
                  <button
                    onClick={() => handleDownloadPDF(inv._id, inv.pdfUrl)}
                    className="text-green-600 hover:underline"
                  >
                    Download
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegeneratePDF(inv._id)}
                    className="text-indigo-600 hover:underline"
                  >
                    Regenerate PDF
                  </button>
                )}

                {/* Status dropdown */}
                <select
                  value={inv.status}
                  onChange={(e) => updateInvoiceStatus(inv._id, e.target.value)}
                  className="border rounded px-1"
                >
                  <option value="Draft">Draft</option>
                  <option value="Finalized">Finalized</option>
                  <option value="Paid">Paid</option>
                </select>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(inv._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceListPage;
