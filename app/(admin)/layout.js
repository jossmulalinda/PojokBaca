'use client';

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthData, selectAuthData } from "@/lib/redux/authSlice";
import axios from "axios";
import { BASE_API_URL, BASE_API_KEY } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import LogoHmti from "@/public/assets/img/logoHmti.png";
import { ToastProvider } from "@/components/Admin/ToastProvider";
import {
  RiDashboardLine,
  RiGroupLine,
  RiLogoutBoxLine,
  RiMenuLine,
  RiCloseLine,
  RiHandHeartLine,
  RiNewspaperLine,
  RiImageLine,
  RiCalendarEventLine,
  RiUserLine,
} from "react-icons/ri";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: <RiDashboardLine size={20} />,
  },
  {
    label: "Struktur Organisasi",
    path: "/admin/struktur",
    icon: <RiGroupLine size={20} />,
  },
  {
    label: "Kelola Partner",
    path: "/admin/partners",
    icon: <RiHandHeartLine size={20} />,
  },
  {
    label: "Kelola Berita",
    path: "/admin/berita",
    icon: <RiNewspaperLine size={20} />,
  },
  {
    label: "Kelola Galeri",
    path: "/admin/galeri",
    icon: <RiImageLine size={20} />,
  },
  {
    label: "Kelola Event",
    path: "/admin/events",
    icon: <RiCalendarEventLine size={20} />,
  },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const auth = useSelector(selectAuthData);

  const isLoggingOut = React.useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !auth?.token && !isLoggingOut.current) {
      router.push("/admin/login");
    }
  }, [auth, router, mounted]);

  const handleLogout = async () => {
    isLoggingOut.current = true;
    try {
      await axios.post(
        `${BASE_API_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "P3RT-HMTI-API-KEY": BASE_API_KEY,
          },
        }
      );
    } catch (_) {}
    dispatch(clearAuthData());
    window.location.href = "/";
  };

  const isActive = (path) =>
    path === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(path);

  if (!mounted || !auth?.token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 font-[Poppins]">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg transform transition-transform duration-300 flex flex-col justify-between
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:sticky md:top-0 md:h-screen md:shadow-none`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <div className="w-9 h-9 flex items-center justify-center overflow-hidden">
              <Image src={LogoHmti} alt="HMTI Logo" className="w-full h-auto object-contain" width={36} height={36} />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-800 dark:text-white leading-tight">HMTI Admin</p>
              <p className="text-xs text-gray-400">Panel Pengelola</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 p-3 mt-2">
            {(auth?.role === "super_admin" 
              ? [...menuItems, { label: "Manajemen Admin", path: "/admin/users", icon: <RiUserLine size={20} /> }]
              : menuItems
            ).map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive(item.path)
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* User info + Logout */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-300 font-semibold text-xs uppercase">
                {auth?.username?.[0] || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                {auth?.username || "Admin"}
              </p>
              <p className="text-xs text-gray-400 truncate">{auth?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
          >
            <RiLogoutBoxLine size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 md:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {sidebarOpen ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
          </button>
          <h1 className="text-base font-semibold text-gray-800 dark:text-white">
            {menuItems.find((m) => isActive(m.path))?.label || "Admin Panel"}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
    </ToastProvider>
  );
}
