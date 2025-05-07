import { create } from "zustand";
import { instance } from "../utils/axiosInstance";
import { API_ROUTES } from "../api/apiList";
import toast from "react-hot-toast";

export const useInvoiceStore = create((set) => ({
  invoices: [],
  editingInvoice: null,
  setEditingInvoice: (invoice) => set({ editingInvoice: invoice }),
  loading: false,
  error: null,

  // Fetch All Invoices
  fetchInvoices: async () => {
    try {
      set({ loading: true, error: null });
      const res = await instance.get(API_ROUTES.INVOICE.BASE);
      set({ invoices: res.data, loading: false });
      console.log("Fetched invoices:", res.data);
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Failed to fetch invoices:", error);
      toast.error(error.message);
    }
  },

  // Get Invoice By ID (for details page)
  getInvoiceById: async (invoiceId) => {
    try {
      set({ loading: true, error: null });
      const res = await instance.get(API_ROUTES.INVOICE.GET_ONE(invoiceId));
      set({ editingInvoice: res.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Failed to fetch invoice:", error);
      toast.error(error.message);
    }
  },

  // Create New Invoice
  createInvoice: async (invoiceData) => {
    try {
      set({ loading: true, error: null });
      const res = await instance.post(API_ROUTES.INVOICE.CREATE, invoiceData);
      set((state) => ({
        invoices: [...state.invoices, res.data],
        loading: false,
      }));
      toast.success("Invoice created");
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message);
      throw error;
    }
  },

  // Delete Invoice
  deleteInvoice: async (invoiceId) => {
    try {
      set({ loading: true, error: null });
      await instance.delete(API_ROUTES.INVOICE.DELETE(invoiceId));
      set((state) => ({
        invoices: state.invoices.filter((inv) => inv._id !== invoiceId),
        loading: false,
      }));
      toast.success("Invoice deleted");
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Failed to delete invoice:", error);
      toast.error(error.message);
    }
  },

  updateInvoiceStatus: async (invoiceId, currentStatus) => {
    try {
      set({ loading: true, error: null });

      // Prevent changing status if already paid
      if (currentStatus === "Paid") {
        set({ loading: false });
        return { error: "Cannot change status of a paid invoice" };
      }

      // Show confirmation dialog for marking as paid
      if (currentStatus === "Unpaid") {
        const confirmChange = window.confirm(
          "Are you sure you want to mark this invoice as paid?"
        );
        if (!confirmChange) {
          set({ loading: false });
          return { cancelled: true };
        }
      }

      const newStatus = currentStatus === "Unpaid" ? "Paid" : "Unpaid";
      const response = await instance.put(
        API_ROUTES.INVOICE.UPDATE_INVOICE_STATUS(invoiceId),
        { status: newStatus }
      );

      set((state) => ({
        invoices: state.invoices.map((inv) =>
          inv._id === invoiceId ? { ...inv, status: newStatus } : inv
        ),
        loading: false,
      }));

      toast.success(`Invoice status updated to ${newStatus}`);
      return { data: response.data };
    } catch (error) {
      const errorMsg = error.message || "Failed to update invoice status";
      set({
        error: errorMsg,
        loading: false,
      });
      console.error("Failed to update invoice status:", error);
      toast.error(errorMsg);
      return { error: errorMsg };
    }
  },

  regeneratePdf: async (invoiceId) => {
    set({ loading: true, error: null });
    try {
      const response = await instance.post(
        API_ROUTES.INVOICE.REGENERATE_PDF(invoiceId)
      );

      // Update the specific invoice in the state
      set((state) => ({
        invoices: state.invoices.map((invoice) =>
          invoice._id === invoiceId
            ? {
                ...invoice,
                pdfUrl: response.data.invoice.pdfUrl,
                cloudinaryPublicId: response.data.invoice.cloudinaryPublicId,
                pdfExists: response.data.invoice.pdfExists,
              }
            : invoice
        ),
        loading: false,
      }));
      toast.success("Invoice PDF regenerated");

      return response.data.invoice;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to regenerate PDF",
        loading: false,
      });
      toast.error(error.response?.data?.message);
      throw error;
    }
  },

  // Add this to your store methods
  sendInvoice: async (invoiceId) => {
    try {
      set({ loading: true, error: null });
      const response = await instance.post(
        API_ROUTES.INVOICE.SEND_INVOICE(invoiceId)
      );
      set({ loading: false });
      toast.success("Invoice sent");
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to send invoice",
        loading: false,
      });
      toast.error(error.response?.data?.message);
      throw error;
    }
  },
}));
