import { create } from "zustand";
import axios from "axios";

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
      const res = await axios.get("http://localhost:5000/api/invoice");
      set({ invoices: res.data, loading: false });
      console.log("Fetched invoices:", res.data);
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error("Failed to fetch invoices:", err);
    }
  },

  // Get Invoice By ID (for details page)
  getInvoiceById: async (invoiceId) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(
        `http://localhost:5000/api/invoice/${invoiceId}`
      );
      set({ editingInvoice: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error("Failed to fetch invoice:", err);
    }
  },

  // Create New Invoice
  createInvoice: async (invoiceData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(
        "http://localhost:5000/api/invoice",
        invoiceData
      );
      set((state) => ({
        invoices: [...state.invoices, res.data],
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Delete Invoice
  deleteInvoice: async (invoiceId) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`http://localhost:5000/api/invoice/${invoiceId}`);
      set((state) => ({
        invoices: state.invoices.filter((inv) => inv._id !== invoiceId),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error("Failed to delete invoice:", err);
    }
  },

  // Update Invoice Status (e.g., from Unpaid → Paid)
  updateInvoiceStatus: async (invoiceId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/invoice/${invoiceId}/status`, {
        status: newStatus,
      });
      set((state) => ({
        invoices: state.invoices.map((inv) =>
          inv._id === invoiceId ? { ...inv, status: newStatus } : inv
        ),
      }));
    } catch (error) {
      console.error("Failed to update invoice status:", error);
    }
  },

  // Regenerate Invoice PDF
  regenerateInvoicePDF: async (invoiceId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/invoice/${invoiceId}/regenerate`
      );
      set((state) => ({
        invoices: state.invoices.map((inv) =>
          inv._id === invoiceId ? res.data : inv
        ),
      }));
    } catch (error) {
      console.error("Failed to regenerate PDF:", error);
    }
  },
}));
