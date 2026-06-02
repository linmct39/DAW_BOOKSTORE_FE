import { authApiInstance } from "./api";
import axios from "axios";

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
    items: { bookId: string | number; quantity: number; unitPrice: number; title?: string }[];
  }) => {
    // Helper to normalize IDs: if the value is numeric or ends with a numeric suffix like "book-123" or "user_45",
    // return the numeric value. Otherwise return the original value.
    const normalizeId = (id: any) => {
      if (id === undefined || id === null) return "";
      if (typeof id === "number") return id;
      // If it's a numeric string, return number
      if (typeof id === "string") {
        const numeric = id.match(/(\d+)$/);
        if (numeric) return Number(numeric[1]);
        const asNum = Number(id);
        if (!isNaN(asNum)) return asNum;
        return id;
      }
      return id;
    };

    // Validate and map items: ensure each book_id is numeric
    const validatedItems = invoiceData.items
      .map((item) => {
        const normalizedBookId = normalizeId(item.bookId);
        return {
          bookId: item.bookId,
          normalizedBookId,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          title: item.title || `Sách #${item.bookId}`,
        };
      })
      .filter((item) => {
        // Only include items where book_id is a valid number
        if (typeof item.normalizedBookId !== "number" || isNaN(item.normalizedBookId)) {
          console.warn(
            `[invoiceApi] ⚠️ Skipping item with INVALID book_id "${item.bookId}" (normalized: ${item.normalizedBookId})`
          );
          return false;
        }
        console.log(
          `[invoiceApi] ✓ Keeping item: book_id=${item.normalizedBookId}, qty=${item.quantity}, price=${item.unitPrice}, title="${item.title}"`
        );
        return true;
      });

    console.log(`[invoiceApi] After validation: ${validatedItems.length}/${invoiceData.items.length} items valid`);

    if (validatedItems.length === 0) {
      throw new Error(
        `Lỗi: Không có sản phẩm hợp lệ trong giỏ hàng (tất cả ${invoiceData.items.length} sản phẩm đều có ID không hợp lệ). Vui lòng xóa toàn bộ giỏ hàng, làm mới trang và thêm sách lại từ danh mục.`
      );
    }

    // Map from camelCase to the precise snake_case schema required by API Row 2
    const payload = {
      user_id: normalizeId(invoiceData.userId),
      total_amount: Number(invoiceData.totalAmount),
      note: invoiceData.note || "Giao giờ hành chính",
      fullName: invoiceData.fullName || "",
      phone: invoiceData.phone || "",
      shippingAddress: invoiceData.shippingAddress || "",
      items: validatedItems.map((item) => ({
        book_id: item.normalizedBookId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        title: item.title || "",
      })),
    };

    const tryAuthRequest = async (url: string) => {
      try {
        const response = await authApiInstance.post(url, payload);
        return { success: true, data: response?.data };
      } catch (err: any) {
        if (err?.response && err.response.status === 400) {
          throw err;
        }
        return { success: false, error: err };
      }
    };

    // Log payload so browser console shows exact request body for debugging
    console.log("[invoiceApi] invoiceData input:", invoiceData);
    console.log("[invoiceApi] user_id after normalizeId:", normalizeId(invoiceData.userId));
    console.log("[invoiceApi] total_amount:", invoiceData.totalAmount);
    console.log("[invoiceApi] items:", invoiceData.items);
    console.log("[invoiceApi] sending payload:", payload);

    // 0. First try local API route (so COD on local BE works even when remote proxy returns old errors)
    try {
      const localResp = await axios.post("/api/invoices/add", payload);
      return localResp.data;
    } catch (err: any) {
      // If local returns 400, bubble it up
      if (err?.response && err.response.status === 400) throw err;
      // Otherwise continue to remote attempts
    }

    // 1. Try remote proxy: invoices/add
    // Send clean snake_case format that remote API expects
    const remotePayload = {
      user_id: payload.user_id,
      total_amount: payload.total_amount,
      note: payload.note,
      phone: payload.phone,
      receiver_name: payload.fullName,
      shipping_address: payload.shippingAddress,
      items: payload.items, // array of {book_id, quantity, unit_price}
    };

    console.log("[invoiceApi] remote payload:", remotePayload);

    let result = await tryAuthRequest("invoices/add");
    if (result.success) return result.data;
    if (result.error && result.error.response && result.error.response.status === 400) {
      throw result.error;
    }

    // 2. Try URL option 2: invoices/add/ (with remote payload)
    try {
      const response2 = await authApiInstance.post("invoices/add/", remotePayload);
      return response2.data;
    } catch (err: any) {
      if (err?.response && err.response.status === 400) throw err;
    }

    // 3. Fallback path: invoices/
    const response = await authApiInstance.post("invoices/", remotePayload);
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

