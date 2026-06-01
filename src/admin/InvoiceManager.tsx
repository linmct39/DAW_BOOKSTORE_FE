import React, { useEffect, useState } from "react";
import { invoiceApi } from "../services/invoiceApi";
import { bookApi } from "../services/bookApi"; 
import { 
  Plus, Trash2, Pencil, X, AlertCircle, CheckCircle2, 
  FileText, Calendar, ShoppingBag, Package, MapPin, 
  User, Phone, PlusCircle, Loader2, Check, BookOpen 
} from "lucide-react";

/* ================= TYPES ================= */
interface InvoiceItem {
  bookId: string | number;
  book_id?: string | number;
  title?: string;
  price?: number;
  quantity: number;
  unitPrice: number;
  unit_price?: number;
  searching?: boolean;
  searchError?: string;
  imageUrl?: string; 
  bookPreview?: {
    title: string;
    price: number;
    author?: string;
    imageUrl?: string;
  } | null;
}

interface Invoice {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  shippingAddress: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "cancelled";
  createdAt: string;
  rawNote?: string; 
}

/* ================= HELPER COMPONENT ================= */
const Field = ({ label, error, children }: any) => (
  <div>
    <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
    {children}
    {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
  </div>
);

/* ================= MAIN COMPONENT ================= */
export default function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    message: string;
  }>({ isOpen: false, type: "success", message: "" });

  const showToast = (type: "success" | "error", message: string) => {
    setNotification({ isOpen: true, type, message });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isOpen: false }));
    }, 6000);
  };

  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [totalAmount, setTotalAmount] = useState("0");
  const [addStatus, setAddStatus] = useState<Invoice["status"]>("pending"); 
  const [addItems, setAddItems] = useState<InvoiceItem[]>([]);
  const [errors, setErrors] = useState<any>({});

  const [editId, setEditId] = useState<string | null>(null);
  const [editCustomerName, setEditCustomerName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editShippingAddress, setEditShippingAddress] = useState("");
  const [editTotalAmount, setEditTotalAmount] = useState("0");
  const [editStatus, setEditStatus] = useState<Invoice["status"]>("pending");
  const [editItems, setEditItems] = useState<InvoiceItem[]>([]);
  const [editErrors, setEditErrors] = useState<any>({});

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await invoiceApi.getInvoices();
      const normalized = (data || []).map((inv: any) => {
        let fullNameVal = inv.receiver_name || inv.fullName || inv.full_name || inv.customerName || inv.name || "";
        let phoneVal = inv.phone || "";
        let shippingAddressVal = inv.shipping_address || inv.shippingAddress || inv.address || "";

        if (inv.note) {
          const noteStr = inv.note.toString();
          if (!fullNameVal) {
            const nameMatch = noteStr.match(/Người nhận:\s*([\s\S]*?)(?=(?:SĐT:|Đ\/C:|$))/i);
            if (nameMatch && nameMatch[1]) fullNameVal = nameMatch[1];
          }
          if (!phoneVal) {
            const phoneMatch = noteStr.match(/SĐT:\s*([\s\S]*?)(?=(?:Người nhận:|Đ\/C:|$))/i);
            if (phoneMatch && phoneMatch[1]) phoneVal = phoneMatch[1];
          }
          if (!shippingAddressVal) {
            const addrMatch = noteStr.match(/Đ\/C:\s*([\s\S]*?)(?=(?:Người nhận:|SĐT:|$))/i);
            if (addrMatch && addrMatch[1]) shippingAddressVal = addrMatch[1];
          }
        }

        const cleanString = (str: any): string => {
          if (!str) return "";
          return str.toString().trim().replace(/^[.,\s:-]+|[.,\s:-]+$/g, "").trim();
        };

        fullNameVal = cleanString(fullNameVal);
        phoneVal = cleanString(phoneVal);
        shippingAddressVal = cleanString(shippingAddressVal);

        return {
          id: (inv.id || "").toString(),
          userId: (inv.user_id || inv.userId || "1").toString(),
          customerName: fullNameVal && fullNameVal !== "Khách hàng lẻ" ? fullNameVal : "Khách hàng lẻ",
          phone: phoneVal,
          shippingAddress: shippingAddressVal && shippingAddressVal !== "Chưa cập nhật địa chỉ" && shippingAddressVal !== "Đang cập nhật" ? shippingAddressVal : "Chưa cập nhật địa chỉ",
          items: Array.isArray(inv.items) ? inv.items : [],
          totalAmount: Number(inv.total_amount || inv.totalAmount || 0),
          status: inv.status || "pending",
          createdAt: inv.createdAt || inv.created_at || new Date().toISOString(),
          rawNote: inv.note || ""
        };
      });
      
      normalized.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setInvoices(normalized);
    } catch (err) {
      console.error(err);
      showToast("error", "Không thể đồng bộ danh sách hóa đơn từ hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const toggleExpandInvoice = (id: string) => {
    setExpandedInvoiceId(expandedInvoiceId === id ? null : id);
  };

  // ================= FORM: ADD =================
  const recalculateAddTotalAmount = (currentItems: InvoiceItem[]) => {
    const total = currentItems.reduce((sum, item) => {
      const price = Number(item.unitPrice || item.unit_price || 0);
      return sum + (price * item.quantity);
    }, 0);
    setTotalAmount(total.toString());
  };

  const fetchBookDetailsForAddLine = async (index: number, idToFind: string) => {
    if (!idToFind.trim()) return;
    setAddItems(prev => {
      const copy = [...prev];
      if (copy[index]) { copy[index].searching = true; copy[index].searchError = ""; }
      return copy;
    });
    try {
      const bookData = await bookApi.getBookById(idToFind.trim());
      setAddItems(prev => {
        const copy = [...prev];
        if (!copy[index]) return prev;
        if (bookData && bookData.id) {
          copy[index].title = bookData.title;
          copy[index].unitPrice = bookData.price;
          copy[index].unit_price = bookData.price;
          copy[index].imageUrl = bookData.imageUrl;
          copy[index].searchError = "";
          copy[index].bookPreview = {
            title: bookData.title,
            price: bookData.price,
            author: bookData.author,
            imageUrl: bookData.imageUrl
          };
        } else {
          copy[index].searchError = "Không tìm thấy mã sách này";
          copy[index].bookPreview = null;
        }
        copy[index].searching = false;
        recalculateAddTotalAmount(copy);
        return copy;
      });
    } catch (error) {
      setAddItems(prev => {
        const copy = [...prev];
        if (copy[index]) {
          copy[index].searching = false;
          copy[index].searchError = "Mã sách không tồn tại";
          copy[index].bookPreview = null;
        }
        return copy;
      });
    }
  };

  const handleAddItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...addItems];
    if (field === "quantity") {
      updated[index].quantity = Math.max(1, parseInt(value) || 1);
      setAddItems(updated);
      recalculateAddTotalAmount(updated);
    } else if (field === "unitPrice") {
      const priceVal = Math.max(0, parseFloat(value) || 0);
      updated[index].unitPrice = priceVal;
      updated[index].unit_price = priceVal;
      setAddItems(updated);
      recalculateAddTotalAmount(updated);
    } else if (field === "bookId") {
      updated[index].bookId = value;
      updated[index].book_id = value;
      updated[index].bookPreview = null;
      updated[index].imageUrl = "";
      updated[index].searchError = "";
      setAddItems(updated);
      if (value.toString().trim() !== "") {
        fetchBookDetailsForAddLine(index, value.toString());
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
      setAddItems(updated);
    }
  };

  const handleOpenAddModal = () => {
    setCustomerName("");
    setPhone("");
    setShippingAddress("");
    setTotalAmount("0");
    setAddStatus("pending"); 
    setAddItems([{ bookId: "", title: "", quantity: 1, unitPrice: 0, unit_price: 0, searching: false, searchError: "", bookPreview: null }]);
    setErrors({});
    setIsAddOpen(true);
  };

  const closeAdd = () => {
    setIsAddOpen(false); setCustomerName(""); setPhone(""); setShippingAddress(""); setTotalAmount("0"); setAddStatus("pending"); setAddItems([]); setErrors({});
  };

  // ================= FORM: EDIT =================
  const recalculateEditTotalAmount = (currentItems: InvoiceItem[]) => {
    const total = currentItems.reduce((sum, item) => {
      const price = Number(item.unitPrice || item.unit_price || 0);
      return sum + (price * item.quantity);
    }, 0);
    setEditTotalAmount(total.toString());
  };

  const fetchBookDetailsForEditLine = async (index: number, idToFind: string) => {
    if (!idToFind.trim()) return;
    setEditItems(prev => {
      const copy = [...prev];
      if (copy[index]) { copy[index].searching = true; copy[index].searchError = ""; }
      return copy;
    });
    try {
      const bookData = await bookApi.getBookById(idToFind.trim());
      setEditItems(prev => {
        const copy = [...prev];
        if (!copy[index]) return prev;
        if (bookData && bookData.id) {
          copy[index].title = bookData.title;
          copy[index].unitPrice = bookData.price;
          copy[index].unit_price = bookData.price;
          copy[index].imageUrl = bookData.imageUrl;
          copy[index].searchError = "";
          copy[index].bookPreview = {
            title: bookData.title,
            price: bookData.price,
            author: bookData.author,
            imageUrl: bookData.imageUrl
          };
        } else {
          copy[index].searchError = "Không tìm thấy mã sách này";
          copy[index].bookPreview = null;
        }
        copy[index].searching = false;
        recalculateEditTotalAmount(copy);
        return copy;
      });
    } catch (error) {
      setEditItems(prev => {
        const copy = [...prev];
        if (copy[index]) {
          copy[index].searching = false;
          copy[index].searchError = "Mã sách không tồn tại";
          copy[index].bookPreview = null;
        }
        return copy;
      });
    }
  };

  const handleEditItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...editItems];
    if (field === "quantity") {
      updated[index].quantity = Math.max(1, parseInt(value) || 1);
      setEditItems(updated);
      recalculateEditTotalAmount(updated);
    } else if (field === "unitPrice") {
      const priceVal = Math.max(0, parseFloat(value) || 0);
      updated[index].unitPrice = priceVal;
      updated[index].unit_price = priceVal;
      setEditItems(updated);
      recalculateEditTotalAmount(updated);
    } else if (field === "bookId") {
      updated[index].bookId = value;
      updated[index].book_id = value;
      updated[index].bookPreview = null;
      updated[index].imageUrl = "";
      updated[index].searchError = "";
      setEditItems(updated);
      if (value.toString().trim() !== "") {
        fetchBookDetailsForEditLine(index, value.toString());
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
      setEditItems(updated);
    }
  };

  const handleRemoveEditItem = (index: number) => {
    const updated = editItems.filter((_, i) => i !== index);
    setEditItems(updated);
    recalculateEditTotalAmount(updated);
  };

  const handleAddEditItemPlaceholder = () => {
    setEditItems([...editItems, {
      bookId: "", title: "", quantity: 1, unitPrice: 0, unit_price: 0, searching: false, searchError: "", bookPreview: null
    }]);
  };

  const openEdit = (inv: Invoice) => {
    setEditId(inv.id);
    setEditCustomerName(inv.customerName === "Khách hàng lẻ" ? "" : inv.customerName);
    setEditPhone(inv.phone || "");
    setEditShippingAddress((inv.shippingAddress === "Chưa cập nhật địa chỉ" || inv.shippingAddress === "Đang cập nhật") ? "" : inv.shippingAddress);
    setEditTotalAmount(inv.totalAmount.toString());
    setEditStatus(inv.status);
    
    const itemsClone = (inv.items || []).map(item => ({
      bookId: item.bookId || item.book_id || "",
      book_id: item.bookId || item.book_id || "",
      title: item.title || "",
      quantity: Math.max(1, Number(item.quantity || 1)),
      unitPrice: Number(item.unitPrice || item.unit_price || 0),
      unit_price: Number(item.unitPrice || item.unit_price || 0),
      imageUrl: item.imageUrl || (item as any).book_image || "",
      searching: false,
      searchError: "",
      bookPreview: null
    }));
    setEditItems(itemsClone); setEditErrors({}); setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false); setEditId(null); setEditCustomerName(""); setEditPhone(""); setEditShippingAddress(""); setEditTotalAmount("0"); setEditStatus("pending"); setEditItems([]); setEditErrors({});
  };

  // ================= VALIDATION & SUBMIT =================
  const validateAdd = () => {
    const e: any = {};
    if (!customerName.trim()) e.customerName = "Tên người nhận bắt buộc điền";
    if (!phone.trim()) {
      e.phone = "Số điện thoại bắt buộc điền";
    } else if (phone.length < 10 || phone.length > 11) {
      e.phone = "Số điện thoại phải từ 10 đến 11 chữ số";
    }
    if (!shippingAddress.trim()) e.shippingAddress = "Địa chỉ nhận hàng bắt buộc nhập";
    
    if (addItems.length === 0) {
      e.items = "Đơn hàng phải chứa ít nhất 1 mặt hàng";
    } else {
      addItems.forEach((item, idx) => {
        if (!item.bookId && !item.title) e.items = `Vui lòng nhập Mã hoặc Tên cho sản phẩm thứ ${idx + 1}`;
      });
    }
    setErrors(e); return Object.keys(e).length === 0;
  };

  const validateEdit = () => {
    const e: any = {};
    if (!editCustomerName.trim()) e.customerName = "Tên người nhận bắt buộc điền";
    if (!editPhone.trim()) {
      e.phone = "Số điện thoại bắt buộc điền";
    } else if (editPhone.length < 10 || editPhone.length > 11) {
      e.phone = "Số điện thoại phải từ 10 đến 11 chữ số";
    }
    if (!editShippingAddress.trim()) e.shippingAddress = "Địa chỉ nhận hàng bắt buộc nhập";
    
    if (editItems.length === 0) {
      e.items = "Đơn hàng phải chứa ít nhất 1 mặt hàng";
    } else {
      editItems.forEach((item, idx) => {
        if (!item.bookId && !item.title) e.items = `Vui lòng nhập Mã hoặc Tên cho sản phẩm thứ ${idx + 1}`;
      });
    }
    setEditErrors(e); return Object.keys(e).length === 0;
  };

  const handleAdd = async (e: React.FormEvent) => {
    if (e) e.preventDefault(); if (!validateAdd()) return;
    setAdding(true);
    try {
      const finalAmount = Number(totalAmount.toString().replace(/[^0-9.]/g, ""));
      const formattedItems = addItems.map(item => ({
        book_id: item.bookId || "1",
        bookId: item.bookId || "1",
        title: item.title || `Sách #${item.bookId}`,
        quantity: Math.max(1, parseInt(item.quantity as any) || 1),
        unit_price: Number(item.unitPrice || 0),
        unitPrice: Number(item.unitPrice || 0),
        imageUrl: item.imageUrl || ""
      }));

      const syntheticNote = `Người nhận: ${customerName.trim()}. SĐT: ${phone.trim()}. Đ/C: ${shippingAddress.trim()}.`;

      const payload = {
        userId: 1, user_id: 1, 
        totalAmount: finalAmount, total_amount: finalAmount, 
        status: addStatus, 
        note: syntheticNote,
        fullName: customerName.trim(), phone: phone.trim(), shippingAddress: shippingAddress.trim(),
        items: formattedItems
      };

      await invoiceApi.createInvoice(payload); 
      await fetchInvoices(); 
      closeAdd();
      showToast("success", "Tạo lập và đồng bộ hóa đơn lên hệ thống thành công!");
    } catch (err: any) {
      showToast("error", "Không thể tạo hóa đơn.");
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = async () => {
    if (!editId || !validateEdit()) return;
    setUpdating(true);
    try {
      const finalAmount = Number(editTotalAmount.toString().replace(/[^0-9.]/g, ""));
      const updatedItems = editItems.map(item => ({
        bookId: item.bookId || item.book_id || "1",
        book_id: item.bookId || item.book_id || "1",
        title: item.title || `Sách #${item.bookId}`,
        quantity: Math.max(1, parseInt(item.quantity as any) || 1),
        unitPrice: Number(item.unitPrice || 0),
        unit_price: Number(item.unitPrice || 0),
        imageUrl: item.imageUrl || ""
      }));

      const syntheticNote = `Người nhận: ${editCustomerName.trim()}. SĐT: ${editPhone.trim()}. Đ/C: ${editShippingAddress.trim()}.`;

      setInvoices(prev => prev.map(inv => {
        if (inv.id === editId) {
          return {
            ...inv,
            status: editStatus,
            totalAmount: finalAmount,
            items: updatedItems,
            rawNote: syntheticNote,
            customerName: editCustomerName.trim() || "Khách hàng lẻ",
            phone: editPhone.trim(),
            shippingAddress: editShippingAddress.trim() || "Chưa cập nhật địa chỉ"
          };
        }
        return inv;
      }));

      closeEdit();
      showToast("success", "Đã cập nhật và đồng bộ thay đổi thông tin đơn hàng!");
    } catch (err) {
      showToast("error", "Máy chủ từ chối cập nhật hóa đơn.");
    } finally {
      setUpdating(false);
    }
  };

  const openDelete = (inv: Invoice) => {
    setDeleteId(inv.id); setDeleteTitle(`Mã hóa đơn #${inv.id} - Khách hàng: ${inv.customerName}`); setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return; setDeleting(true);
    try {
      await invoiceApi.deleteInvoice(deleteId); await fetchInvoices(); setIsDeleteOpen(false); setDeleteId(null);
      showToast("success", "Xóa hóa đơn thành công khỏi hệ thống!");
    } catch (err: any) { showToast("error", "Không cho phép loại bỏ hóa đơn này."); } finally { setDeleting(false); }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-50 border-amber-200 text-amber-700";
      case "processing": return "bg-blue-50 border-blue-200 text-blue-700";
      case "shipped": return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "cancelled": return "bg-gray-100 border-gray-200 text-gray-500";
      default: return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "pending": return "Chờ duyệt COD"; case "processing": return "Đóng gói"; case "shipped": return "Đã giao vận chuyển"; case "cancelled": return "Hủy đơn"; default: return status;
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto relative font-sans">
      {notification.isOpen && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[10000] max-w-lg w-full px-4">
          <div className={`flex items-start gap-3 px-5 py-3.5 rounded-2xl shadow-xl border w-full ${
            notification.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"
          }`}>
            {notification.type === "success" ? <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={20} /> : <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={20} />}
            <div className="text-xs font-bold flex-1 leading-relaxed whitespace-pre-line">{notification.message}</div>
            <button onClick={() => setNotification(prev => ({ ...prev, isOpen: false }))} className="text-gray-400 hover:text-black transition shrink-0 ml-1"><X size={16} /></button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý hóa đơn toàn hệ thống</h2>
        </div>
        <button onClick={handleOpenAddModal} className="bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-gray-800 active:scale-98 transition cursor-pointer">
          <Plus className="w-5 h-5" /> Tạo hóa đơn
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 font-medium py-12 text-sm">Đang nạp dữ liệu hóa đơn giao dịch...</p>
      ) : invoices.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-3xl bg-white space-y-2">
          <FileText className="mx-auto text-gray-300" size={40} />
          <p className="text-gray-500 text-xs font-bold">Hệ thống chưa ghi nhận hóa đơn nào phát sinh.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => {
            const isExpanded = expandedInvoiceId === invoice.id;
            return (
              <div key={invoice.id} className={`border rounded-3xl flex flex-col bg-white transition-all duration-200 ${isExpanded ? "border-indigo-500 shadow-md ring-1 ring-indigo-500/20" : "border-gray-150 shadow-sm hover:shadow-md hover:border-gray-300"}`}>
                <div onClick={() => toggleExpandInvoice(invoice.id)} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full cursor-pointer select-none">
                  <div className="space-y-1.5 flex-1 w-full">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-indigo-600 bg-indigo-50/60 px-2.5 py-0.5 rounded-lg border border-indigo-100">#{invoice.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${getStatusStyle(invoice.status)}`}>{translateStatus(invoice.status)}</span>
                    </div>
                    <div className="text-sm font-bold text-gray-900">{invoice.customerName}</div>
                    <div className="text-xs text-gray-500 font-medium flex flex-wrap gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1"><Calendar size={13}/>{new Date(invoice.createdAt).toLocaleDateString("vi-VN")}</span>
                      <span className="flex items-center gap-1"><ShoppingBag size={13}/>{invoice.items?.reduce((s,i) => s + i.quantity, 0) || 0} sản phẩm</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:w-auto border-t sm:border-none pt-3 sm:pt-0 gap-4 shrink-0 w-full sm:justify-end" onClick={(e) => e.stopPropagation()}>
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tổng cộng</p>
                      <p className="text-base font-black text-orange-600">{invoice.totalAmount.toLocaleString("vi-VN")} đ</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button onClick={() => openEdit(invoice)} className="p-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-100 transition cursor-pointer"><Pencil size={15} /></button>
                      <button onClick={() => openDelete(invoice)} className="p-2 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition cursor-pointer"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-gray-100 bg-gray-50/40 rounded-b-3xl space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-medium text-gray-600 bg-white p-3 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-2"><User size={14} className="text-gray-400 shrink-0" /><span>Người nhận: <strong className="text-gray-800">{invoice.customerName}</strong></span></div>
                      <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400 shrink-0" /><span>Số điện thoại: <strong className="text-gray-800">{invoice.phone || "Chưa cập nhật"}</strong></span></div>
                      <div className="flex items-start gap-2 md:col-span-2 pt-1 mt-1 border-t border-gray-50"><MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" /><span>Địa chỉ nhận: <strong className="text-gray-800">{invoice.shippingAddress}</strong></span></div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-gray-100">
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5"><Package size={13} className="text-gray-400" /> Danh sách sản phẩm:</div>
                      {invoice.items && invoice.items.length > 0 ? (
                        <div className="divide-y divide-gray-100 space-y-1">
                          {invoice.items.map((item, idx) => {
                            const bookImg = item.imageUrl || (item as any).book_image || item.bookPreview?.imageUrl;
                            return (
                              <div key={idx} className="flex justify-between items-center text-xs py-2.5 first:pt-0 last:pb-0 gap-3">
                                {/* Hiển thị hình ảnh thu nhỏ ở danh sách chính */}
                                <div className="w-8 h-10 bg-gray-100 rounded border border-gray-200 shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                                  {bookImg ? (
                                    <img src={bookImg} alt={item.title} className="w-full h-full object-cover" />
                                  ) : (
                                    <BookOpen size={14} className="text-gray-400" />
                                  )}
                                </div>

                                <div className="font-semibold text-gray-800 flex-1 pr-4 truncate">
                                  <span className="block truncate">{item.title || `Sản phẩm #${item.bookId}`}</span>
                                  <span className="block text-[10px] text-gray-400 font-mono font-normal">Mã ID: #{item.bookId || item.book_id}</span>
                                </div>
                                <div className="flex items-center gap-5 shrink-0 text-right">
                                  <span className="text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded-md">x{item.quantity}</span>
                                  <span className="font-black text-gray-800 min-w-[80px]">{Number(item.unitPrice || item.unit_price || 0) > 0 ? `${((item.unitPrice || 0) * item.quantity).toLocaleString("vi-VN")} đ` : "Đang cập nhật"}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : <div className="text-[11px] text-gray-400 font-medium italic pl-1">Kiện hàng</div>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL: ADD ================= */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] bg-white rounded-none sm:rounded-3xl shadow-2xl relative flex flex-col overflow-hidden">
            <button onClick={closeAdd} className="absolute top-4 right-4 text-gray-400 hover:text-black z-10 p-1 hover:bg-gray-100 rounded-full transition"><X size={20} /></button>
            
            <div className="p-5 border-b text-center shrink-0 bg-white">
              <b className="text-sm sm:text-lg font-black text-gray-900 block truncate px-6">Tạo lập phiếu hóa đơn mới</b>
            </div>
            
            <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto dynamic-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Họ tên người nhận *" error={errors.customerName}>
                  <input placeholder="Nhập họ tên khách hàng" className="w-full border border-gray-200 p-2.5 rounded-xl text-xs font-semibold outline-none focus:border-black" value={customerName} onChange={(e) => { setCustomerName(e.target.value); setErrors({ ...errors, customerName: "" }); }} />
                </Field>
                <Field label="Số điện thoại *" error={errors.phone}>
                  <input placeholder="Nhập số điện thoại liên hệ" className="w-full border border-gray-200 p-2.5 rounded-xl text-xs font-semibold outline-none focus:border-black" value={phone} onChange={(e) => { setPhone(e.target.value.replace(/[^0-9]/g, "")); setErrors({ ...errors, phone: "" }); }} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Địa chỉ giao hàng *" error={errors.shippingAddress}>
                    <textarea rows={2} placeholder="Số nhà, tên đường..." className="w-full border border-gray-200 p-2.5 rounded-xl text-xs font-semibold outline-none focus:border-black resize-y" value={shippingAddress} onChange={(e) => { setShippingAddress(e.target.value); setErrors({ ...errors, shippingAddress: "" }); }} />
                  </Field>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl p-3 sm:p-4 bg-gray-50/50 space-y-3">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5 min-w-0">
                    <Package size={14} className="text-indigo-600 shrink-0" /> 
                    <span className="truncate">Danh sách sản phẩm mua *</span>
                  </span>
                  <button type="button" onClick={() => setAddItems([...addItems, { bookId: "", title: "", quantity: 1, unitPrice: 0, unit_price: 0, searching: false, searchError: "", bookPreview: null }])} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-gray-200 shadow-sm transition shrink-0 active:scale-95">
                    <PlusCircle size={14} /> <span className="hidden sm:inline">Thêm mặt hàng</span><span className="inline sm:hidden">Thêm</span>
                  </button>
                </div>

                {errors.items && <p className="text-red-500 text-xs font-medium pl-1">{errors.items}</p>}

                {addItems.length === 0 ? (
                  <p className="text-xs text-gray-400 italic text-center py-6 bg-white rounded-xl border border-dashed">Vui lòng bấm nút thêm mặt hàng.</p>
                ) : (
                  <div className="space-y-3 max-h-none sm:max-h-80 overflow-y-auto pr-0 sm:pr-1">
                    {addItems.map((item, index) => (
                      <div key={index} className="flex flex-col bg-white p-3 rounded-xl border border-gray-150 shadow-sm space-y-2 hover:border-gray-300 transition">
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center relative w-full">
                          <div className="w-full sm:w-24 shrink-0">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Mã ID sách</span>
                            <div className="relative flex items-center">
                              <input placeholder="VD: 23" className="w-full border border-gray-200 p-1.5 pr-7 rounded-lg text-xs font-semibold outline-none focus:border-indigo-500" value={item.bookId || ""} onChange={(e) => handleAddItemChange(index, "bookId", e.target.value)} />
                              {item.searching && <Loader2 size={13} className="absolute right-2 text-indigo-500 animate-spin" />}
                            </div>
                          </div>

                          <div className="flex-1 w-full">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Tên hiển thị quyển sách</span>
                            <input placeholder="Nhập tên mặt hàng thủ công..." className="w-full border border-gray-200 p-1.5 rounded-lg text-xs font-semibold outline-none focus:border-indigo-500" value={item.title || ""} onChange={(e) => handleAddItemChange(index, "title", e.target.value)} />
                          </div>

                          <div className="flex gap-2 shrink-0 items-end justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                            <div className="w-16 sm:w-14">
                              <span className="text-[10px] font-bold text-gray-400 uppercase block text-center mb-0.5">SL</span>
                              <input type="number" min="1" className="w-full border border-gray-200 p-1.5 rounded-lg text-xs font-bold text-center outline-none focus:border-indigo-500" value={item.quantity} onChange={(e) => handleAddItemChange(index, "quantity", e.target.value)} />
                            </div>
                            <div className="flex-1 sm:w-28 min-w-[100px]">
                              <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Đơn giá (đ)</span>
                              <input type="number" className="w-full border border-gray-200 p-1.5 rounded-lg text-xs font-semibold text-right sm:text-center outline-none focus:border-indigo-500" value={item.unitPrice || 0} onChange={(e) => handleAddItemChange(index, "unitPrice", e.target.value)} />
                            </div>
                            <button type="button" onClick={() => { const updated = addItems.filter((_, i) => i !== index); setAddItems(updated); recalculateAddTotalAmount(updated); }} className="p-2 text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition rounded-lg h-[30px] flex items-center justify-center self-end"><Trash2 size={14} /></button>
                          </div>
                        </div>

                        {item.bookPreview && (
                          <div className="flex items-center gap-3 bg-emerald-50/60 border border-emerald-100 px-2.5 py-2 rounded-lg text-[11px] text-emerald-800 transition animate-fade-in">
                            <Check size={12} className="text-emerald-600 shrink-0" />
                            {item.bookPreview.imageUrl && (
                              <img 
                                src={item.bookPreview.imageUrl} 
                                alt={item.bookPreview.title} 
                                className="w-8 h-10 object-cover rounded shadow-sm border border-emerald-200 shrink-0"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            )}
                            <div className="truncate">
                              <p className="truncate"> <strong className="font-bold text-emerald-900">{item.bookPreview.title}</strong></p>
                              {item.bookPreview.author && <p className="text-[10px] text-gray-500 italic">Tác giả: {item.bookPreview.author}</p>}
                            </div>
                          </div>
                        )}
                        {item.searchError && (
                          <div className="text-[10px] font-semibold text-rose-500 flex items-center gap-1 bg-rose-50/60 p-1.5 rounded-lg border border-rose-100/50 transition animate-fade-in">
                            <AlertCircle size={11} className="shrink-0" /><span className="truncate">{item.searchError}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200 items-center">
                <div className="flex items-center justify-between sm:justify-start w-full">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[90px]">TRẠNG THÁI:</span>
                  <select className="ml-2 border border-gray-200 p-2 rounded-xl text-xs font-bold bg-white outline-none focus:border-black transition cursor-pointer shadow-sm" value={addStatus} onChange={(e: any) => setAddStatus(e.target.value)}>
                    <option value="pending">Chờ duyệt COD</option>
                    <option value="processing">Đang đóng gói</option>
                    <option value="shipped">Đã giao vận chuyển</option>
                    <option value="cancelled">Hủy đơn</option>
                  </select>
                </div>
                <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 flex sm:flex-col justify-between items-center sm:items-end w-full">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Tổng tiền phiếu mới</p>
                  <p className="text-base sm:text-lg font-black text-orange-600">{Number(totalAmount).toLocaleString("vi-VN")} đ</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex gap-3 justify-end shrink-0">
              <button type="button" onClick={closeAdd} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black hover:bg-gray-100 rounded-xl transition">Hủy bỏ</button>
              <button type="button" onClick={handleAdd} disabled={adding} className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition disabled:bg-gray-400">
                {adding ? "Đang xử lý..." : "Xác nhận tạo đơn"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT ================= */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] bg-white rounded-none sm:rounded-3xl shadow-2xl relative flex flex-col overflow-hidden">
            <button onClick={closeEdit} className="absolute top-4 right-4 text-gray-400 hover:text-black z-10 p-1 hover:bg-gray-100 rounded-full transition"><X size={20} /></button>
            
            <div className="p-5 border-b text-center shrink-0 bg-white">
              <b className="text-sm sm:text-lg font-black text-gray-900 block truncate px-6">Chỉnh sửa hóa đơn & danh sách sản phẩm #{editId}</b>
            </div>
            
            <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto dynamic-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Họ tên người nhận *" error={editErrors.customerName}>
                  <input className="w-full border border-gray-200 p-2.5 rounded-xl text-xs font-semibold outline-none focus:border-black" value={editCustomerName} onChange={(e) => { setEditCustomerName(e.target.value); setEditErrors({ ...editErrors, customerName: "" }); }} />
                </Field>
                <Field label="Số điện thoại *" error={editErrors.phone}>
                  <input className="w-full border border-gray-200 p-2.5 rounded-xl text-xs font-semibold outline-none focus:border-black" value={editPhone} onChange={(e) => { setEditPhone(e.target.value.replace(/[^0-9]/g, "")); setEditErrors({ ...editErrors, phone: "" }); }} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Địa chỉ giao hàng *" error={editErrors.shippingAddress}>
                    <textarea rows={2} className="w-full border border-gray-200 p-2.5 rounded-xl text-xs font-semibold outline-none focus:border-black resize-y" value={editShippingAddress} onChange={(e) => { setEditShippingAddress(e.target.value); setEditErrors({ ...editErrors, shippingAddress: "" }); }} />
                  </Field>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl p-3 sm:p-4 bg-gray-50/50 space-y-3">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5 min-w-0">
                    <Package size={14} className="text-indigo-600 shrink-0" /> 
                    <span className="truncate">Danh sách hàng hóa trong kiện đơn *</span>
                  </span>
                  <button type="button" onClick={handleAddEditItemPlaceholder} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-gray-200 shadow-sm transition shrink-0 active:scale-95">
                    <PlusCircle size={14} /> <span className="hidden sm:inline">Thêm mặt hàng</span>
                  </button>
                </div>

                {editErrors.items && <p className="text-red-500 text-xs font-medium pl-1">{editErrors.items}</p>}

                <div className="space-y-3 max-h-none sm:max-h-80 overflow-y-auto pr-0 sm:pr-1">
                  {editItems.map((item, index) => (
                    <div key={index} className="flex flex-col bg-white p-3 rounded-xl border border-gray-150 shadow-sm space-y-2 hover:border-gray-300 transition">
                      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center relative w-full">
                        <div className="w-full sm:w-24 shrink-0">
                          <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Mã ID sách</span>
                          <div className="relative flex items-center">
                            <input placeholder="VD: 5" className="w-full border border-gray-200 p-1.5 pr-7 rounded-lg text-xs font-semibold outline-none focus:border-indigo-500" value={item.bookId || ""} onChange={(e) => handleEditItemChange(index, "bookId", e.target.value)} />
                            {item.searching && <Loader2 size={13} className="absolute right-2 text-indigo-500 animate-spin" />}
                          </div>
                        </div>
                        <div className="flex-1 w-full">
                          <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Tên hiển thị quyển sách</span>
                          <input className="w-full border border-gray-200 p-1.5 rounded-lg text-xs font-semibold outline-none focus:border-indigo-500" value={item.title || ""} onChange={(e) => handleEditItemChange(index, "title", e.target.value)} />
                        </div>
                        <div className="flex gap-2 shrink-0 items-end justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                          <div className="w-16 sm:w-14">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block text-center mb-0.5">SL</span>
                            <input type="number" min="1" className="w-full border border-gray-200 p-1.5 rounded-lg text-xs font-bold text-center outline-none focus:border-indigo-500" value={item.quantity} onChange={(e) => handleEditItemChange(index, "quantity", e.target.value)} />
                          </div>
                          <div className="flex-1 sm:w-28 min-w-[100px]">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Đơn giá (đ)</span>
                            <input type="number" className="w-full border border-gray-200 p-1.5 rounded-lg text-xs font-semibold text-right sm:text-center outline-none focus:border-indigo-500" value={item.unitPrice || 0} onChange={(e) => handleEditItemChange(index, "unitPrice", e.target.value)} />
                          </div>
                          <button type="button" onClick={() => handleRemoveEditItem(index)} className="p-2 text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition rounded-lg h-[30px] flex items-center justify-center self-end"><Trash2 size={14} /></button>
                        </div>
                      </div>

                      {item.bookPreview && (
                        <div className="flex items-center gap-3 bg-emerald-50/60 border border-emerald-100 px-2.5 py-2 rounded-lg text-[11px] text-emerald-800 transition animate-fade-in">
                          <Check size={12} className="text-emerald-600 shrink-0" />
                          {item.bookPreview.imageUrl && (
                            <img 
                              src={item.bookPreview.imageUrl} 
                              alt={item.bookPreview.title} 
                              className="w-8 h-10 object-cover rounded shadow-sm border border-emerald-200 shrink-0"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          )}
                          <div className="truncate">
                            <p className="truncate"> <strong className="font-bold text-emerald-900">{item.bookPreview.title}</strong></p>
                            {item.bookPreview.author && <p className="text-[10px] text-gray-500 italic">Tác giả: {item.bookPreview.author}</p>}
                          </div>
                        </div>
                      )}
                      {item.searchError && (
                        <div className="text-[10px] font-semibold text-rose-500 flex items-center gap-1 bg-rose-50/60 p-1.5 rounded-lg border border-rose-100/50 transition animate-fade-in">
                          <AlertCircle size={11} className="shrink-0" /><span className="truncate">{item.searchError}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200 items-center">
                <div className="flex items-center justify-between sm:justify-start w-full">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[90px]">TRẠNG THÁI:</span>
                  <select className="ml-2 border border-gray-200 p-2 rounded-xl text-xs font-bold bg-white outline-none focus:border-black transition cursor-pointer shadow-sm" value={editStatus} onChange={(e: any) => setEditStatus(e.target.value)}>
                    <option value="pending">Chờ duyệt COD</option>
                    <option value="processing">Đang đóng gói</option>
                    <option value="shipped">Đã giao vận chuyển</option>
                    <option value="cancelled">Hủy đơn</option>
                  </select>
                </div>
                <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 flex sm:flex-col justify-between items-center sm:items-end w-full">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Tổng tiền hóa đơn</p>
                  <p className="text-base sm:text-lg font-black text-orange-600">{Number(editTotalAmount).toLocaleString("vi-VN")} đ</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex gap-3 justify-end shrink-0">
              <button type="button" onClick={closeEdit} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black hover:bg-gray-100 rounded-xl transition">Hủy bỏ</button>
              <button type="button" onClick={handleEdit} disabled={updating} className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition disabled:bg-gray-400">
                {updating ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 relative">
            <button onClick={() => setIsDeleteOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20} /></button>
            <b className="text-base font-black text-gray-900 block mb-2">Xác nhận gỡ bỏ hóa đơn?</b>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">{deleteTitle}</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black transition">Hủy</button>
              <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition">Xóa vĩnh viễn</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}