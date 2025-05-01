import { useState } from "react";
import InvoiceListPage from "../components/tables/InvoiceTable";
import { CreateInvoice } from "../components/forms/InvoiceForm";
import { useInvoiceStore } from "../store/invoiceStore";

export const Invoice = () => {
  const [activeTab, setActiveTab] = useState("Invoice");
  const regeneratePdf = useInvoiceStore((s) => s.regeneratePdf);
  const updateStatus = useInvoiceStore((s) => s.updateInvoiceStatus);

  // Simple download by opening URL in new tab
  const handleDownloadPDF = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
  };

  const handleRegeneratePDF = async (invoiceId) => {
    await regeneratePdf(invoiceId);
  };

  const handleUpdateStatus = async (invoiceId, newStatus) => {
    await updateStatus(invoiceId, newStatus);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {activeTab === "Invoice" ? "Invoice List" : "Create Invoice"}
        </h1>
        {activeTab === "Invoice" ? (
          <button
            onClick={() => setActiveTab("Create")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            + Create Invoice
          </button>
        ) : (
          <button
            onClick={() => setActiveTab("Invoice")}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            ← Back to List
          </button>
        )}
      </div>

      {activeTab === "Invoice" ? (
        <InvoiceListPage
          handleDownloadPDF={handleDownloadPDF}
          handleRegeneratePDF={handleRegeneratePDF}
          updateInvoiceStatus={handleUpdateStatus}
        />
      ) : (
        <CreateInvoice setActiveTab={setActiveTab} />
      )}
    </div>
  );
};
