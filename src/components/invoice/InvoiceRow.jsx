import React from "react";
import {
  ArrowDownTrayIcon,
  TrashIcon,
  ArrowPathIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ArrowRightCircleIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
export const InvoiceRow = ({
  invoice,
  expandedInvoiceId,
  toggleExpand,
  handleUpdateStatus,
  handleDelete,
  handleRegeneratePdf,
  handleDownloadPDF,
  sendInvoice,
  regenerating,
  regeneratingId,
}) => {
  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4">
          <button
            onClick={() => toggleExpand(invoice._id)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <ArrowRightCircleIcon
              className={`w-5 h-5 inline text-indigo-600 transform transition-transform duration-300 ${
                expandedInvoiceId === invoice._id ? "rotate-90" : "rotate-0"
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
            className={`inline-flex items-center px-3 py-2 rounded-md text-xs font-medium ${
              invoice.status === "Paid"
                ? "bg-green-100 text-green-800"
                : invoice.status === "Unpaid"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
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
        {/* Actions */}
        <td className="px-6 py-4 text-sm flex space-x-2">
          <button
            onClick={() => handleUpdateStatus(invoice._id, invoice.status)}
            className={`text-indigo-600 hover:text-indigo-900 flex items-center ${
              invoice.status === "Paid" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title={
              invoice.status === "Paid"
                ? "Paid invoices cannot be changed"
                : "Mark Paid/Unpaid"
            }
            disabled={invoice.status === "Paid"}
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
            <div className="flex justify-between items-start">
              <div className="max-w-md">
                <h4 className="text-sm font-medium text-gray-900">
                  Invoice Details
                </h4>
                <p className="text-sm text-gray-500">
                  Invoice ID: {invoice._id}
                </p>
                {invoice.createdAt && (
                  <p className="text-sm text-gray-500">
                    Created: {new Date(invoice.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div>
                <h4 className="text-sm text-end font-medium text-gray-900">
                  Actions
                </h4>
                <div className="flex space-x-2 mt-2">
                  {/* {invoice.status === "Paid" && ( */}
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await sendInvoice(invoice._id);
                        alert("Invoice sent successfully!");
                      } catch (err) {
                        alert(err.message || "Failed to send invoice");
                      }
                    }}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded-md text-sm text-white flex items-center"
                  >
                    <PaperAirplaneIcon className="w-4 h-4 mr-1" />
                    Send to Client
                  </button>
                  {/* )} */}
                  {invoice.pdfUrl && invoice.pdfExists ? (
                    <button
                      onClick={() => handleDownloadPDF(invoice.pdfUrl)}
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
    </>
  );
};
