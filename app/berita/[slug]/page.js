'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useParams } from "next/navigation";
import { dateFormat } from "@/lib/date-libs";
import { BASE_API_URL, BASE_API_KEY, getImageUrl } from "@/lib/api";
import OtherNews from "@/components/OtherNews";
import BounceLoading from "@/components/BounceLoading";
import NotFound from "@/components/NotFound";

const DetailBeritaPage = () => {
  const { slug } = useParams();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  const fetchBerita = async () => {
    if (!slug) return;
    try {
      const response = await axios.get(`${BASE_API_URL}/api/berita/${slug}`, {
        headers: {
          "P3RT-HMTI-API-KEY": `${BASE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      setBerita(response.data);
      if (response.data?.gambar || response.data?.thumbnail) {
        setActiveImage(response.data.gambar || response.data.thumbnail);
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBerita();
  }, [slug]);

  const allPhotos = [
    ...(berita?.gambar || berita?.thumbnail ? [berita.gambar || berita.thumbnail] : []),
    ...(Array.isArray(berita?.foto_tambahan) ? berita.foto_tambahan : []),
  ];

  if (loading) {
    return <BounceLoading />;
  }

  if (error) {
    return (
      <NotFound
        msg="Sepertinya berita yang anda cari tidak ditemukan."
        btnText="Kembali ke Berita"
        btnLink="/berita"
      />
    );
  }

  return (
    <div className="flex-grow bg-slate-50/50 dark:bg-[#0f172a] pt-[110px] pb-16 px-4 md:px-8">
      {/* Outer Card Wrapper */}
      <div className="max-w-screen-lg mx-auto bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 md:p-10 shadow-sm flex flex-col">
        
        {/* Premium Back Button */}
        <div className="mb-6">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-sm font-semibold text-good-blue hover:text-blue-600 transition-colors group"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Semua Berita
          </Link>
        </div>

        {/* Breadcrumbs inside the card */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mb-5">
          <Link href="/" className="hover:text-good-blue flex items-center gap-1 transition-colors duration-200">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Beranda
          </Link>
          <span>/</span>
          <Link href="/berita" className="hover:text-good-blue transition-colors duration-200">
            Post
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-semibold line-clamp-1 max-w-[200px] sm:max-w-md">
            {berita?.judul}
          </span>
        </div>

        {/* Meta Info List */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500 dark:text-gray-400 font-heading font-medium tracking-wide">
          {/* Date */}
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1-1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2h-1V1a1 1 0 10-2 0v1H7V1a1 1 0 00-1-1zM4 5h12v3H4V5zm0 5h12v5H4v-5z" clipRule="evenodd" />
            </svg>
            <span>{dateFormat(berita?.created_at || berita?.published_at)}</span>
          </div>

          {/* Author */}
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>{berita?.penulis || "Prodi"}</span>
          </div>

          {/* Category/Tag */}
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 020 1.414l-7 7a1 1 0 02-1.414 0l-7-7A1 1 0 023 9V3a1 1 0 021-1h6a1 1 0 02.707.293l7 7zM6 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span>{berita?.kategori || "Post"}</span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span>Dibaca {berita?.dibaca || 0} kali</span>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-slate-100 dark:border-slate-800 my-4" />

        {/* Title */}
        <h1 className="font-extrabold text-2xl md:text-4xl font-heading text-slate-900 dark:text-white leading-tight tracking-tight mt-3 mb-6">
          {berita?.judul}
        </h1>

        {/* Header Image & Interactive Photo Switcher Gallery */}
        <div className="w-full flex flex-col gap-3 mb-8">
          <div className="w-full overflow-hidden rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 bg-black/5 flex items-center justify-center">
            <img
              src={getImageUrl(activeImage || berita?.gambar || berita?.thumbnail)}
              alt={berita?.judul}
              className="w-full max-h-[520px] object-cover transition-all duration-300"
            />
          </div>

          {/* Additional Photos Thumbnail Switcher */}
          {allPhotos.length > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex-shrink-0">
                Dokumentasi ({allPhotos.length} Foto):
              </span>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 sm:pb-0">
                {allPhotos.map((imgSrc, idx) => {
                  const isActive = (activeImage || berita?.gambar || berita?.thumbnail) === imgSrc;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(imgSrc)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                        isActive
                          ? "border-blue-600 ring-2 ring-blue-500/30 scale-105"
                          : "border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100 hover:border-blue-400"
                      }`}
                    >
                      <img
                        src={getImageUrl(imgSrc)}
                        alt={`Dokumentasi ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {idx === 0 ? (
                        <span className="absolute top-1 left-1 bg-blue-600 text-white text-[8px] font-extrabold px-1 rounded shadow">
                          Sampul
                        </span>
                      ) : (
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-extrabold px-1 rounded shadow">
                          Foto {idx + 1}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Article Body Content */}
        <div
          className="text-justify leading-relaxed text-slate-700 dark:text-slate-200 text-sm md:text-base font-normal space-y-6 prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: berita?.konten }}
        />
      </div>

      {/* Other News Section */}
      <div className="max-w-screen-lg mx-auto w-full mt-10">
        <OtherNews />
      </div>
    </div>
  );
};

export default DetailBeritaPage;
