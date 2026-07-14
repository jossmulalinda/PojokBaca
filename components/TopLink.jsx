'use client';

import React from "react";
import Link from "next/link";

const TopLink = ({ activeTab }) => {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="bg-gray-150/80 dark:bg-dark-blue/80 backdrop-blur-md p-1.5 rounded-full border border-gray-200/50 dark:border-gray-800/80 flex gap-1 sm:gap-2">
        <Link
          href="/profile?tab=biografi"
          className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
            activeTab === 'biografi'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-102'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Biografi
        </Link>
        <Link
          href="/profile?tab=struktur"
          className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
            activeTab === 'struktur'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-102'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Struktur
        </Link>
      </div>
    </div>
  );
};

export default TopLink;
