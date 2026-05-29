import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userApi } from "../services/userApi";
import { invoiceApi } from "../services/invoiceApi";
import { bookApi } from "../services/bookApi";
import { categoryApi } from "../services/categoryApi";
import {
  ShieldAlert,
  Terminal,
  Code2,
  Database,
  BookOpen,
  Layers,
  Users,
  FileText,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Route guarding - only admins can access
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-xl max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Truy cập bị từ chối</h2>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            Bạn cần quyền quản trị viên (Admin) để có thể xem và quản trị hệ thống. vui lòng đăng nhập với tài khoản hợp lệ.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer min-h-[44px]"
          >
            Quay về Trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Responsive Workspace Header */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden border border-gray-800">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-gray-800/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-4 relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-xs font-bold text-gray-200">
              <Terminal className="h-3.5 w-3.5 animate-pulse" />
              <span>Workspace Lập Trình Viên</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Trang Quản Trị Hệ Thống
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed">
              Mã nguồn trang Admin đã được dọn sạch sẽ và tối ưu hóa tối đa. Sẵn sàng để Lập trình viên xây dựng mới toàn bộ bảng điều khiển quản trị tùy chỉnh từ đầu!
            </p>
          </div>
        </div>

        {/* Developer Guide Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Service Connections Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-gray-900">
              <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700 border border-gray-100">
                <Database className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-bold tracking-tight">Dịch Vụ API Sẵn Sàng Sử Dụng</h2>
            </div>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Chúng tôi đã liên kết và cấu hình đầy đủ kết nối bảo mật tới các dịch vụ sau trong file để lập trình viên sử dụng bất cứ lúc nào:
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-start gap-2.5 p-2.5 hover:bg-gray-50 rounded-xl transition border border-transparent hover:border-gray-100">
                <BookOpen className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-gray-850">bookApi</h3>
                  <p className="text-[11px] text-gray-500 font-medium leading-normal">
                    Truy vấn dữ liệu sách, lọc danh mục, thêm mới sách, cập nhật thông tin và thực thi lệnh DELETE sách thực tế.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 hover:bg-gray-50 rounded-xl transition border border-transparent hover:border-gray-100">
                <Layers className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-gray-850">categoryApi</h3>
                  <p className="text-[11px] text-gray-500 font-medium leading-normal">
                    Quản lý danh mục phân loại sách, thêm mới hoặc sửa đổi & loại bỏ các danh mục trên máy chủ.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 hover:bg-gray-50 rounded-xl transition border border-transparent hover:border-gray-100">
                <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-gray-850">userApi</h3>
                  <p className="text-[11px] text-gray-500 font-medium leading-normal">
                    Xử lý hồ sơ thành viên hệ thống, phân quyền và duyệt danh sách tài khoản khách hàng.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 hover:bg-gray-50 rounded-xl transition border border-transparent hover:border-gray-100">
                <FileText className="h-4 w-4 text-purple-600 mt-0.5" />
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-gray-850">invoiceApi</h3>
                  <p className="text-[11px] text-gray-500 font-medium leading-normal">
                    Truy vấn thông tin hóa đơn đơn hàng, xử lý trạng thái đặt mua và hỗ trợ quản trị viên hủy biên nhận.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick-start Examples Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900">
                <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700 border border-gray-100">
                  <Code2 className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-bold tracking-tight">Ví Dụ Gọi Dữ Liệu Nhanh</h2>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Chỉ cần viết hàm chuẩn dạng async/await bên dưới để thiết lập bảng dữ liệu:
              </p>

              <div className="bg-gray-950 rounded-xl p-4 font-mono text-[10.5px] text-gray-300 leading-relaxed border border-gray-850 overflow-x-auto shadow-inner select-all">
                {`// Ví dụ tải danh sách các cuốn sách
const refreshData = async () => {
  setIsLoading(true);
  try {
    const list = await bookApi.getBooks();
    setBooks(list);
  } catch (err) {
    console.error("Lỗi nạp dữ liệu:", err);
  } finally {
    setIsLoading(false);
  }
};`}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 flex items-center gap-2 text-[11px] text-gray-500 font-semibold">
              <Sparkles className="h-4 w-4 text-gray-800 shrink-0" />
              <span>Giao diện trống siêu nhẹ giúp giữ file code ngăn nắp và cực kỳ dễ hiểu.</span>
            </div>
          </div>

        </div>

        {/* Empty Canvas visual template placeholder */}
        <div className="bg-white rounded-2xl border border-gray-200 border-dashed p-10 sm:p-12 text-center shadow-xs space-y-6">
          <div className="mx-auto w-12 h-12 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400">
            <Code2 className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">Nơi Lập Trình Giao Diện Admin</h3>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              Bạn có thể bắt đầu xây dựng Drawer, Tabs, Biểu mẫu hoặc Bảng danh sách tại đây trong file <code className="bg-gray-100 text-gray-900 px-1 py-0.5 rounded font-mono text-[10px]">src/pages/AdminDashboard.tsx</code>. Các import API bảo mật đều đã được giữ lại cho bạn!
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 font-extrabold text-xs transition cursor-pointer"
            >
              Xem trang chủ Bookstore <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
