'use client';

import React, { useEffect } from "react";
import Link from "next/link";
import AOS from "aos";
import { RiComputerLine, RiArrowLeftLine } from "react-icons/ri";
import { TbDeviceMobileCode } from "react-icons/tb";
import { IoGameControllerOutline } from "react-icons/io5";
import { LuBrainCircuit, LuRadioTower } from "react-icons/lu";
import { GoFileMedia } from "react-icons/go";
import { BiChip } from "react-icons/bi";
import { MdOutlineVpnLock } from "react-icons/md";

const ProjectsPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="flex-grow min-h-screen flex flex-col justify-center items-center py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background soft glowing orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-good-blue/10 blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-2xl text-center flex flex-col items-center z-10">
        
        {/* Animated Rocket & Orbit */}
        <div className="relative flex items-center justify-center w-40 h-40 mb-8" data-aos="zoom-in">
          {/* Dashed orbit ring */}
          <div
            className="absolute w-40 h-40 rounded-full border-2 border-dashed border-good-blue/30"
            style={{ animation: "spin 12s linear infinite" }}
          />
          {/* Outer glow */}
          <div className="absolute w-28 h-28 rounded-full bg-good-blue/20 blur-2xl animate-pulse" />
          {/* Rocket emoji */}
          <span
            className="text-6xl select-none"
            style={{ animation: "float 4s ease-in-out infinite" }}
          >
            🚀
          </span>
          {/* Orbiting dot */}
          <div
            className="absolute w-3 h-3 bg-good-blue rounded-full shadow-lg shadow-good-blue/50"
            style={{
              top: "0",
              left: "50%",
              transformOrigin: "0 80px",
              animation: "orbit 6s linear infinite",
            }}
          />
        </div>

        {/* Coming Soon Badge */}
        <div 
          data-aos="fade-up"
          data-aos-delay="200"
          className="inline-flex items-center gap-2 bg-good-blue/10 border border-good-blue/30 text-good-blue text-xs md:text-sm font-bold px-5 py-2 rounded-full mb-6 tracking-widest uppercase"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-good-blue animate-pulse" />
          Under Construction
        </div>

        {/* Heading */}
        <h1 
          data-aos="fade-up"
          data-aos-delay="300"
          className="text-4xl md:text-5xl font-black text-dark-blue dark:text-white leading-tight mb-4 tracking-tight"
        >
          HMTI Projects
        </h1>

        {/* Subtitle */}
        <p 
          data-aos="fade-up"
          data-aos-delay="400"
          className="text-lg md:text-xl font-medium text-blue-600 dark:text-blue-400 italic mb-6"
        >
          "Lampaui Batas Imajinasi Teknologi Dengan Inovasi."
        </p>

        {/* Description */}
        <p 
          data-aos="fade-up"
          data-aos-delay="500"
          className="text-sm md:text-base text-gray-500 dark:text-slate-350 leading-relaxed max-w-lg mb-10"
        >
          Wadah pameran portofolio dan hasil karya inovatif dari mahasiswa Teknik Informatika Universitas Khairun. Modul ini sedang kami persiapkan agar terintegrasi dengan database karya mahasiswa secara berkala.
        </p>

        {/* Future Categories Badges */}
        <div 
          data-aos="fade-up"
          data-aos-delay="650"
          className="w-full mb-12"
        >
          <span className="text-xs uppercase font-bold text-gray-400 dark:text-slate-500 tracking-wider block mb-4">
            Kategori yang akan hadir
          </span>
          <div className="flex flex-wrap justify-center gap-2.5 max-w-xl mx-auto">
            {[
              { label: "Web Dev", icon: <RiComputerLine /> },
              { label: "Mobile Dev", icon: <TbDeviceMobileCode /> },
              { label: "Game Dev", icon: <IoGameControllerOutline /> },
              { label: "Network Eng", icon: <LuRadioTower /> },
              { label: "Multimedia", icon: <GoFileMedia /> },
              { label: "IoT", icon: <BiChip /> },
              { label: "AI & ML", icon: <LuBrainCircuit /> },
              { label: "Cyber Security", icon: <MdOutlineVpnLock /> },
            ].map((cat, i) => (
              <div 
                key={i} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/70 dark:bg-dark-blue/40 border border-gray-200/50 dark:border-gray-800/80 rounded-lg text-xs font-semibold text-gray-600 dark:text-slate-300 shadow-sm"
              >
                <span className="text-good-blue text-sm">{cat.icon}</span>
                <span>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div 
          data-aos="fade-up"
          data-aos-delay="800"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-good-blue hover:bg-blue-600 hover:scale-105 active:scale-98 text-white px-6 py-3 rounded-2xl font-bold shadow-md shadow-good-blue/20 transition-all duration-200"
          >
            <RiArrowLeftLine size={18} />
            Kembali ke Beranda
          </Link>
        </div>

      </div>

      {/* Styled Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes orbit {
          from { transform: translateX(-50%) rotate(0deg)   translateY(-80px); }
          to   { transform: translateX(-50%) rotate(360deg) translateY(-80px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProjectsPage;
