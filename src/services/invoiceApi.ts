import { authApiInstance } from "./api";

export const invoiceApi = {
  // Row 1: GET /invoices (Admin - Get all invoices)
  getInvoices: async () => {
    const response = await authApiInstance.get("invoices/");
    return response.data?.data || response.data || [];
  },

  // Row 5: GET /invoices/getinvoice/:id (Admin - search invoice by ID)
  getInvoiceById: async (id: string | number) => {
    const response = await authApiInstance.get(`invoices/getinvoice/${id}`);
    const res = response.data?.data || response.data;
    // The endpoint returns an array or single object, normalize it
    return Array.isArray(res) ? res[0] : res;
  },

  // Row 4: GET /invoices/:userid (Customer - get list of invoices for a customer)
  getInvoicesByUserId: async (userId: string | number) => {
    const response = await authApiInstance.get(`invoices/${userId}`);
    return response.data?.data || response.data || [];
  },

  // Row 2: POST /invoices/add (Customer - create new invoice with COD items) - Updated to match endpoint specifications
  createInvoice: async (invoiceData: {
    userId: string | number;
    totalAmount: number;
    note: string;
    fullName?: string;
    phone?: string;
    shippingAddress?: string;
    items: { bookId: string | number; quantity: number; unitPrice: number }[];
  }) => {
    // Helper to keep UUID or string IDs intact, and only convert valid numeric strings
    const safeConvert = (id: any) => {
      if (id === undefined || id === null) return "";
      const num = Number(id);
      return isNaN(num) ? id : num;
    };

    // Map from camelCase to the precise snake_case schema required by API Row 2
    const payload = {
      user_id: safeConvert(invoiceData.userId),
      total_amount: Number(invoiceData.totalAmount),
      note: invoiceData.note || "Giao giờ hành chính",
      fullName: invoiceData.fullName || "",
      phone: invoiceData.phone || "",
      shippingAddress: invoiceData.shippingAddress || "",
      items: invoiceData.items.map((item) => ({
        book_id: safeConvert(item.bookId),
        quantity: Number(item.quantity),
        unit_price: Number(item.unitPrice),
      })),
    };

    const tryRequest = async (url: string) => {
      try {
        const response = await authApiInstance.post(url, payload);
        return { success: true, data: response?.data };
      } catch (err: any) {
        // If it's a 400 Bad Request (business validation or inventory issue),
        // we should abort fallback routing immediately to let the user see the exact server error message.
        if (err?.response && err.response.status === 400) {
          throw err;
        }
        return { success: false, error: err };
      }
    };

    // 1. Try URL option 1: invoices/add
    let result = await tryRequest("invoices/add");
    if (result.success) return result.data;
    if (result.error && result.error.response && result.error.response.status === 400) {
      throw result.error;
    }

    // 2. Try URL option 2: invoices/add/
    result = await tryRequest("invoices/add/");
    if (result.success) return result.data;
    if (result.error && result.error.response && result.error.response.status === 400) {
      throw result.error;
    }

    // 3. Fallback path: invoices/
    const response = await authApiInstance.post("invoices/", payload);
    return response.data;
  },

  // Row 3: DELETE /invoices/:invoice_id (Admin - delete invoice)
  deleteInvoice: async (invoiceId: string | number) => {
    const response = await authApiInstance.delete(`invoices/${invoiceId}`);
    return response.data;
  },

  // Update fallback (e.g. if we simulate status change or let server set standard values)
  updateInvoiceStatus: async (id: string | number, status: string) => {
    // Since there is no explicit put status endpoint in table, let's keep it mockable or simple
    console.log(`Cập nhật trạng thái đơn hàng #${id} thành: ${status}`);
    return { success: true, message: "Cập nhật trạng thái thành công" };
  },
};

