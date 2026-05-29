import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { invoiceApi } from "../services/invoiceApi";
import { useAuth } from "../context/AuthContext";
import { FileText, Calendar, Box, Truck, ShieldAlert, CheckCircle2, History, Loader2, ArrowLeft, RefreshCw, XCircle } from "lucide-react";

interface InvoiceItem {
  bookId: string;
  title: string;
  price: number;
  quantity: number;
}

interface Invoice {
  id: string;
  userId: string;
  userEmail: string;
  fullName: string;
  phone: string;
  shippingAddress: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "cancelled";
  createdAt: string;
}

export default function InvoicePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeInvoice = (inv: any): Invoice => {
    // If the invoice has note, let's try to parse fullName, phone, and shippingAddress from it
    let fullNameVal = inv.fullName || (user && user.fullName) || "Khách hàng";
    let phoneVal = inv.phone || (user && user.phone) || "";
    let shippingAddressVal = inv.shippingAddress || (user && user.address) || "Đang cập nhật";

    if (inv.note && inv.note.includes("Người nhận:") && inv.note.includes("SĐT:")) {
      try {
        const parts = inv.note.split(". ");
        const namePart = parts.find((p: string) => p.startsWith("Người nhận:"));
        const phonePart = parts.find((p: string) => p.startsWith("SĐT:"));
        const addrPart = parts.find((p: string) => p.startsWith("Đ/C:"));
        
        if (namePart) fullNameVal = namePart.replace("Người nhận: ", "").trim();
        if (phonePart) phoneVal = phonePart.replace("SĐT: ", "").trim();
        if (addrPart) shippingAddressVal = addrPart.replace("Đ/C: ", "").trim();
      } catch (e) {
        console.warn("Error parsing invoice note:", e);
      }
    }

    const rawItems = Array.isArray(inv.items) ? inv.items : [];
    const normalizedItems = rawItems.map((item: any) => ({
      bookId: (item.book_id || item.bookId || "").toString(),
      title: item.title || item.book_title || (item.book && item.book.title) || `Sách Mã #${item.book_id}`,
      price: Number(item.unit_price || item.price || 0),
      quantity: Number(item.quantity || 1)
    }));

    return {
      id: (inv.id || "").toString(),
      userId: (inv.user_id || inv.userId || "").toString(),
      userEmail: inv.userEmail || (user && user.email) || "contact@dawbookstore.vn",
      fullName: fullNameVal,
      phone: phoneVal,
      shippingAddress: shippingAddressVal,
      items: normalizedItems,
      totalAmount: Number(inv.total_amount || inv.totalAmount || 0),
      status: inv.status || "pending",
      createdAt: inv.created_at || inv.createdAt || new Date().toISOString(),
    };
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // If user is admin, fetch all. Otherwise, fetch user-specific invoices via /invoices/:userid
      const data = user.role === "admin"
        ? await invoiceApi.getInvoices()
        : await invoiceApi.getInvoicesByUserId(user.id);
        
      const normalized = (data || []).map(normalizeInvoice);

      // Sort: Newest invoices first
      const sorted = normalized.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setInvoices(sorted);
      
      // Keep selected invoice updated if open
      if (selectedInvoice) {
        const fresh = sorted.find(i => i.id === selectedInvoice.id);
        if (fresh) setSelectedInvoice(fresh);
      }
    } catch (err: any) {
      console.error(err);
      setError("Không thể nạp dữ liệu hóa đơn giao dịch của bạn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchInvoices();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
            <ShieldAlert className="h-3 w-3" />
            Chờ duyệt COD
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
            <Box className="h-3 w-3" />
            Đóng gói
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
            <CheckCircle2 className="h-3 w-3" />
            Đã bàn giao vận chuyển
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-500 border border-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
            <XCircle className="h-3 w-3" />
            Hủy đơn
          </span>
        );
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8" id="invoice-page">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <History className="h-6 w-6 text-indigo-600" />
            Lịch Sử Đơn Hàng Đã Đặt
          </h1>
          <p className="text-xs text-gray-500 font-medium">Theo dõi lịch trình xử lý đóng gói và bàn giao bưu chính</p>
        </div>
        <button
          onClick={fetchInvoices}
          className="flex items-center space-x-1 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Tự động cập nhật</span>
        </button>
      </div>

      {loading && invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3 bg-white border border-gray-100 rounded-xl">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-sm text-gray-500 font-medium font-sans">Đang truy vấn đơn hàng của khách hàng...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-xl text-center border border-red-100 font-semibold text-xs">
          {error}
        </div>
      ) : invoices.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center text-gray-500 space-y-3">
          <FileText className="h-12 w-12 text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-gray-700">Chưa Phát Sinh Đơn Hàng Nào</h3>
          <p className="text-xs text-gray-400">Tài khoản của bạn hiện chưa phát sinh hóa đơn giao dịch mua sách nào.</p>
          <Link to="/" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-lg transition">
            Danh sách đầu sách Hot
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Master Section: Left Columns Order List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chọn mã hóa đơn cần xem</h3>
            <div className="space-y-3">
              {invoices.map((inv) => (
                <button
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`w-full text-left p-4 rounded-xl border transition flex flex-col space-y-3 cursor-pointer ${selectedInvoice?.id === inv.id ? "bg-indigo-50/50 border-indigo-400 shadow-xs" : "bg-white border-gray-100 hover:border-indigo-150 hover:bg-gray-50/50"}`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-mono text-xs font-bold text-indigo-700">#{inv.id}</span>
                    <span className="text-xs font-extrabold text-orange-600 font-sans">
                      {inv.totalAmount.toLocaleString("vi-VN")} đ
                    </span>
                  </div>

                  <div className="flex justify-between items-center w-full text-[11px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1 text-[10px]">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {new Date(inv.createdAt).toLocaleDateString("vi-VN", {
                        year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"
                      })}
                    </span>
                    <span>{inv.items.reduce((sum, item) => sum + item.quantity, 0)} cuốn sách</span>
                  </div>

                  <div className="flex justify-between items-center w-full pt-2 border-t border-gray-100/60">
                    <span className="text-[10px] text-gray-400 font-mono">Người nhận: {inv.fullName}</span>
                    {getStatusBadge(inv.status)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detail Section: Right Columns Order Specification */}
          <div className="lg:col-span-7">
            {selectedInvoice ? (
              <div className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 space-y-6 shadow-xs" id="invoice-details font-sans">
                
                {/* Header detail */}
                <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                  <div className="space-y-1">
                    <p className="text-xs font-mono font-bold text-indigo-600">HOÁ ĐƠN CHI TIẾT</p>
                    <h2 className="text-lg font-black text-gray-900 font-mono">#{selectedInvoice.id}</h2>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[11px] text-gray-400 font-medium">Trạng thái hiện tại:</p>
                    <div>{getStatusBadge(selectedInvoice.status)}</div>
                  </div>
                </div>

                {/* Delivery coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100/80 text-xs font-medium text-gray-700">
                  <div className="space-y-2">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Thông Tin Người Nhận</p>
                    <p className="font-bold text-gray-900">{selectedInvoice.fullName}</p>
                    <p>SĐT: {selectedInvoice.phone}</p>
                    <p>Email: {selectedInvoice.userEmail}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Địa Chỉ Giao Nhận</p>
                    <p className="leading-relaxed">{selectedInvoice.shippingAddress}</p>
                    <p className="text-indigo-600">Thời gian: {new Date(selectedInvoice.createdAt).toLocaleString("vi-VN")}</p>
                  </div>
                </div>

                {/* Order books table list */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chi tiết sách đặt mua</p>
                  <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 font-sans">
                    {selectedInvoice.items.map((it, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                        <div className="space-y-0.5">
                          <p className="font-bold text-xs text-gray-950">{it.title}</p>
                          <p className="text-[10px] text-gray-400 font-mono font-medium">
                            Số lượng: {it.quantity} cuốn × {it.price.toLocaleString("vi-VN")} đ
                          </p>
                        </div>
                        <span className="text-xs font-bold text-gray-900 font-mono">
                          {(it.price * it.quantity).toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Foot billing summary */}
                <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="font-bold text-gray-900 text-sm">Tổng cộng hóa đơn:</span>
                  <span className="text-xl font-black text-orange-600 font-sans">
                    {selectedInvoice.totalAmount.toLocaleString("vi-VN")} đ
                  </span>
                </div>

                {/* COD Warning banner */}
                <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-indigo-700 text-[11px] leading-relaxed">
                  <p className="font-bold mb-0.5 flex items-center gap-1">
                    <Truck className="h-4 w-4" /> Phương thức: Giao hàng thu tiền COD tận nhà
                  </p>
                  Đơn hàng này đang được xử lý chuyển tiếp. Khi nhân viên giao dịch bưu điện tiếp cận, vui lòng thanh toán chính xác khoản tiền trên và kiểm tra đầy đủ sách vở bên trong niêm phong.
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-16 text-center text-gray-400 h-full flex flex-col justify-center items-center space-y-2">
                <FileText className="h-10 w-10 text-gray-300" />
                <p className="text-xs font-semibold text-gray-500 font-sans">Chọn một mã hóa đơn bên cột trái</p>
                <p className="text-[11px] text-gray-400">Bạn sẽ nhanh chóng xem được chi tiết phiếu mua hàng, số lượng sách đặt mua và tiến độ giao hàng bưu cục.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
