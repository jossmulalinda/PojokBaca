'use client';

import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_API_URL, BASE_API_KEY } from "@/lib/api";
import Link from "next/link";
import AOS from "aos";

// ── Coming Soon card ──────────────────────────────────────────────────────────
const ComingSoonCard = () => (
  <div
    data-aos="fade-up"
    className="col-span-2 md:col-span-3 flex flex-col items-center justify-center py-10 px-6"
  >
    {/* Animated rocket + orbit ring */}
    <div className="relative flex items-center justify-center w-36 h-36 mb-6">
      {/* Dashed orbit ring */}
      <div
        className="absolute w-36 h-36 rounded-full border-2 border-dashed border-good-blue/30"
        style={{ animation: "spin 8s linear infinite" }}
      />
      {/* Soft glow */}
      <div className="absolute w-24 h-24 rounded-full bg-good-blue/10 blur-xl" />
      {/* Rocket */}
      <span
        className="text-5xl select-none"
        style={{ animation: "float 3s ease-in-out infinite" }}
      >
        🚀
      </span>
      {/* Orbiting dot */}
      <div
        className="absolute w-3 h-3 bg-good-blue rounded-full shadow-lg shadow-good-blue/50"
        style={{
          top: "0",
          left: "50%",
          transformOrigin: "0 72px",
          animation: "orbit 8s linear infinite",
        }}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes orbit {
          from { transform: translateX(-50%) rotate(0deg)   translateY(-72px); }
          to   { transform: translateX(-50%) rotate(360deg) translateY(-72px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>

    {/* "Coming Soon" badge */}
    <div className="inline-flex items-center gap-2 bg-good-blue/10 border border-good-blue/30 text-good-blue text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
      <span className="w-2 h-2 rounded-full bg-good-blue animate-pulse" />
      Coming Soon
    </div>

    {/* Heading */}
    <h3 className="text-xl md:text-2xl font-bold text-dark-blue dark:text-white text-center leading-tight mb-3">
      Proyek Sedang Disiapkan
    </h3>

    {/* Description */}
    <p className="text-sm md:text-base text-gray-500 dark:text-slate-400 text-center max-w-xs leading-relaxed">
      Mahasiswa HMTI sedang mengerjakan karya inovatif di bidang ini.
      Pantau terus untuk update terbaru! 👀
    </p>

    {/* Animated bounce dots */}
    <div className="flex gap-2 mt-6">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-good-blue"
          style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
  </div>
);

// ── ProjectList ───────────────────────────────────────────────────────────────
const ProjectList = ({ slug }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/api/kategori/${slug}/projects`,
        {
          headers: {
            "P3RT-HMTI-API-KEY": BASE_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      setProjects(response.data);
    } catch (error) {
      setError("Failed to load projects.");
      console.error("Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
    AOS.init({ duration: 1500 });
  }, [slug]);

  return (
    <>
      {loading ? (
        <div className="loading-indicator dark:text-white">Loading...</div>
      ) : error ? (
        <div className="error-message text-red-500">{error}</div>
      ) : (
        <div className="pt-4 pb-12 grid grid-cols-2 md:grid-cols-3 gap-y-7 gap-x-5">
          {projects.length ? (
            projects.map((p, i) => (
              <div key={i} data-aos="fade-up">
                <div className="w-32 h-32 md:w-64 md:h-40 bg-cover bg-center rounded-xl my-3 overflow-hidden shadow-md">
                  <Link href={`/projects/${p.kategori.slug}/${p.slug}`}>
                    <img
                      src={`${BASE_API_URL}/storage/${p.gambar_utama}`}
                      alt={`gambar-project-${p.slug}`}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                </div>
                <Link
                  href={`/projects/${p.kategori.slug}/${p.slug}`}
                  className="font-medium text-sm md:text-base hover:text-good-blue transition-all dark:text-white block"
                >
                  {p.judul}
                </Link>
              </div>
            ))
          ) : (
            <ComingSoonCard />
          )}
        </div>
      )}
    </>
  );
};

export default ProjectList;
