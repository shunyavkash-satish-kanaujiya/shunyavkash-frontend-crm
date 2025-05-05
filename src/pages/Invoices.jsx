import { useState, useEffect } from "react";
import { InvoiceListPage } from "../components/tables/InvoiceTable";
import { CreateInvoice } from "../components/forms/InvoiceForm";
import { useInvoiceStore } from "../store/invoiceStore";
import { ReusableContainer } from "../components/ui/ReusableContainer";
import { invoiceFilters } from "../constants/invoice/invoiceFilter";
import { TABS } from "../constants/activeTab";

export const Invoice = () => {
  const [activeTab, setActiveTab] = useState(TABS.INVOICE);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ status: "" });

  const regeneratePdf = useInvoiceStore((s) => s.regeneratePdf);
  const updateStatus = useInvoiceStore((s) => s.updateInvoiceStatus);
  const { fetchInvoices } = useInvoiceStore();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

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
    <div>
      {activeTab === TABS.INVOICE && (
        <ReusableContainer
          searchPlaceholder="Search by client name"
          onSearchChange={setSearchTerm}
          searchValue={searchTerm}
          filters={invoiceFilters}
          onFilterChange={setFilters}
          onAddClick={() => setActiveTab(TABS.ADD_INVOICE)}
          addButtonLabel="Create Invoice"
        >
          <InvoiceListPage
            searchTerm={searchTerm}
            filters={filters}
            handleDownloadPDF={handleDownloadPDF}
            handleRegeneratePDF={handleRegeneratePDF}
            updateInvoiceStatus={handleUpdateStatus}
          />
        </ReusableContainer>
      )}

      {activeTab === TABS.ADD_INVOICE && (
        <CreateInvoice setActiveTab={setActiveTab} />
      )}
    </div>
  );
};
