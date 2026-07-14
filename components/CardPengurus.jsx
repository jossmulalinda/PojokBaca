'use client';

import React, { useEffect } from "react";
import AOS from "aos";

const CardPengurus = ({ id, title, nama, image, className }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  const handleError = (event) => {
    event.target.onerror = null;
    event.target.src = "/assets/img/placeholder-pengurus.png"; // fallback image
  };

  return (
    <div
      id={id}
      className={`flex flex-col items-center group ${className || ""}`}
      data-aos="fade-up"
    >
      <div 
        className="w-[145px] sm:w-[190px] lg:w-[245px] bg-white dark:bg-dark-blue border border-gray-200/80 dark:border-gray-800/80 rounded-2xl shadow-md shadow-gray-100 dark:shadow-none flex flex-col p-2.5 sm:p-3.5"
        style={{ transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(18,107,241,0.12), 0 8px 10px -6px rgba(18,107,241,0.08)';
          e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '';
          e.currentTarget.style.borderColor = '';
        }}
      >
        {/* macOS Style Dot Header */}
        <div className="flex gap-1.5 pb-2 border-b border-gray-150 dark:border-gray-800/50">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FF5F56]" />
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#27C93F]" />
        </div>

        {/* Card Content */}
        <div className="flex flex-col mt-2.5 flex-grow">
          {/* Title / Jabatan */}
          <span className="text-[10px] sm:text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center mb-2 block truncate">
            {title}
          </span>
          {/* Image */}
          <div className="w-full aspect-[3/4] overflow-hidden rounded-xl bg-gray-50 dark:bg-bad-blue/30 border border-gray-100 dark:border-gray-800/50 relative">
            <img 
              src={image || "/assets/img/placeholder-pengurus.png"} 
              alt={nama || "pengurus"} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={handleError}
            />
            {/* Bottom shadow overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>
          {/* Name */}
          <span className="text-xs sm:text-xs lg:text-sm font-bold text-center mt-2.5 text-gray-850 dark:text-white line-clamp-2 h-8 sm:h-10 lg:h-12 flex items-center justify-center leading-tight break-words px-0.5">
            {nama}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardPengurus;
