import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  ShieldAlert,
  LayoutDashboard,
  BookOpen,
  Layers,
  Users,
  FileText,
  RefreshCcw,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Route Guard
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f5] p-6">
        <div className="bg-white rounded-[30px] border border-gray-200 shadow-xl p-8 max-w-md w-full text-center">

          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            Truy cập bị từ chối
          </h2>

          <p className="text-gray-500 mb-6">
            Bạn cần tài khoản Admin để truy cập trang này.
          </p>

          <button
            onClick={() => navigate("/")}
            className="w-full h-12 rounded-2xl bg-black text-white font-bold hover:bg-gray-800 transition"
          >
            Quay về Trang chủ
          </button>

        </div>
      </div>
    );
  }

  const menuItems = [
    {
      title: "Quản lý sách",
      icon: BookOpen,
      path: "/admin/books",
    },
    {
      title: "Phân loại",
      icon: Layers,
      path: "/admin/categories",
    },
    {
      title: "Người dùng",
      icon: Users,
      path: "/admin/users",
    },
    {
      title: "Hóa đơn",
      icon: FileText,
      path: "/admin/invoices",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f5] flex">

      {/* SIDEBAR */}
      <aside className="w-[320px] bg-[#020817] text-white p-7 flex flex-col">

        {/* LOGO */}
        <div className="flex items-center gap-4 mb-12">

          <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center">
            <LayoutDashboard className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-3xl font-extrabold">
              Admin Panel
            </h1>

            <p className="text-gray-400 text-lg">
              Book Store System
            </p>
          </div>

        </div>

        {/* MENU */}
        <div className="space-y-4">

          {menuItems.map((item) => {
            const Icon = item.icon;

            const active = location.pathname === item.path;

            return (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-6 h-[72px] rounded-[28px] font-bold text-[28px] transition border-2
                  ${
                    active
                      ? "bg-white text-black border-[#f59e0b]"
                      : "border-transparent text-white hover:bg-white/10"
                  }
                `}
              >

                <Icon className="w-8 h-8 shrink-0" />

                <span className="text-xl">
                  {item.title}
                </span>

              </button>
            );
          })}

        </div>

      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-10 overflow-auto">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-10">

          <div>
            <h1 className="text-5xl font-extrabold text-[#0f172a] mb-2">
              Dashboard Quản Trị
            </h1>

            <p className="text-2xl text-gray-500">
              Xin chào Admin
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="h-16 px-8 rounded-[24px] bg-[#0f172a] text-white font-bold text-xl flex items-center gap-3 hover:bg-black transition"
          >
            <RefreshCcw className="w-6 h-6" />

            Làm mới
          </button>

        </div>

        {/* PAGE CONTENT */}
        <div className="bg-white rounded-[36px] border border-gray-200 min-h-[700px] p-8 shadow-sm">

          <Outlet />

        </div>

      </main>

    </div>
  );
}