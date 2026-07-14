'use client';

import React from "react";
import Link from "next/link";
import { RiGroupLine, RiNewspaperLine, RiImageLine, RiArrowRightLine, RiHandHeartLine, RiCalendarEventLine } from "react-icons/ri";

const menuCards = [
  {
    title: "Struktur Organisasi",
    description: "Kelola data pengurus, bidang, dan upload foto anggota",
    icon: <RiGroupLine size={28} />,
    path: "/admin/struktur",
    color: "from-blue-500 to-blue-700",
    shadow: "shadow-blue-500/30",
  },
  {
    title: "Berita",
    description: "Kelola artikel dan publikasi berita HMTI",
    icon: <RiNewspaperLine size={28} />,
    path: "/admin/berita",
    color: "from-emerald-500 to-emerald-700",
    shadow: "shadow-emerald-500/30",
  },
  {
    title: "Galeri",
    description: "Kelola foto dan dokumentasi kegiatan",
    icon: <RiImageLine size={28} />,
    path: "/admin/galeri",
    color: "from-purple-500 to-purple-700",
    shadow: "shadow-purple-500/30",
  },
  {
    title: "Partner",
    description: "Kelola logo dan link partner kerja sama HMTI",
    icon: <RiHandHeartLine size={28} />,
    path: "/admin/partners",
    color: "from-rose-500 to-rose-700",
    shadow: "shadow-rose-500/30",
  },
  {
    title: "Event",
    description: "Kelola agenda, DIES Natalis, Expo, dan event dinamis HMTI",
    icon: <RiCalendarEventLine size={28} />,
    path: "/admin/events",
    color: "from-amber-500 to-amber-700",
    shadow: "shadow-amber-500/30",
  },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto font-[Poppins]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Selamat datang di panel pengelola HMTI. Pilih menu untuk mulai mengelola konten.
          </p>
        </div>
      </div>

      {/* Menu Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuCards.map((card) => (
          <div key={card.path} className="relative">
            {card.comingSoon ? (
              <div className="block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 opacity-60 cursor-not-allowed select-none">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4 shadow-lg ${card.shadow}`}>
                  {card.icon}
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{card.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{card.description}</p>
                <span className="absolute top-4 right-4 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
                  Segera
                </span>
              </div>
            ) : (
              <Link
                href={card.path}
                className="block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4 shadow-lg ${card.shadow} group-hover:scale-105 transition-transform duration-200`}>
                  {card.icon}
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{card.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{card.description}</p>
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-medium">
                  Kelola <RiArrowRightLine size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
