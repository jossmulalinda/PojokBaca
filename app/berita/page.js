'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import CardSemuaBerita from "@/components/Berita/CardSemuaBerita";
import CardSemuaBeritaSkeleton from "@/components/Berita/CardSemuaBeritaSkeleton";
import AOS from "aos";
import axios from "axios";
import { BASE_API_URL, BASE_API_KEY } from "@/lib/api";
import NewsSlider from "@/components/Beranda/NewsSlider";

const BeritaPage = () => {
  const [activeCategorySlug, setActiveCategorySlug] = useState("semua-berita");
  const [kategori, setKategori] = useState([]);
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);

  const calculateReadTime = (htmlContent) => {
    if (!htmlContent) return 1;
    const text = htmlContent.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200) || 1;
  };

  const formatNewsDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr.slice(0, 10);
    }
  };

  useEffect(() => {
    fetchKategori();
    AOS.init({
      duration: 1000,
    });
  }, []);

  // Fetch berita secara dinamis setiap kali activeCategorySlug berubah
  useEffect(() => {
    fetchBerita();
  }, [activeCategorySlug]);

  const fetchKategori = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/kategori-berita`, {
        headers: {
          "P3RT-HMTI-API-KEY": `${BASE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      setKategori(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchBerita = async () => {
    setLoading(true);
    setBerita([]);
    
    let url = `${BASE_API_URL}/api/semua-berita`;
    if (activeCategorySlug !== "semua-berita") {
      url = `${BASE_API_URL}/api/kategori/${activeCategorySlug}/berita`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          "P3RT-HMTI-API-KEY": `${BASE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      const beritaList = Array.isArray(response.data)
        ? response.data
        : (Array.isArray(response.data?.data) ? response.data.data : []);
      setBerita(beritaList);
    } catch (error) {
      setBerita([]);
    } finally {
      setLoading(false);
    }
  };

  const activeCategory = kategori.find(kat => kat.slug === activeCategorySlug);
  const kategoriName = activeCategory ? activeCategory.judul_kategori : (activeCategorySlug === "semua-berita" ? "Semua Berita" : "Kategori");

  // Client-side search filtering
  const filteredBerita = berita.filter(news =>
    news?.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news?.konten?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news?.penulis?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle sharing links
  const getShareLink = (platform) => {
    if (!selectedNews) return "";
    const shareUrl = `${window.location.origin}/berita/${selectedNews.slug}`;
    const text = encodeURIComponent(`Baca berita terbaru dari HMTI Unkhair: "${selectedNews.judul}"\n`);
    
    switch (platform) {
      case "wa":
        return `https://api.whatsapp.com/send?text=${text}${encodeURIComponent(shareUrl)}`;
      case "fb":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      case "tw":
        return `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`;
      case "ig":
        return `https://www.instagram.com/`;
      default:
        return shareUrl;
    }
  };

  const copyToClipboard = () => {
    const link = getShareLink("copy");
    navigator.clipboard.writeText(link);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedNews) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedNews]);

  return (
    <div className="flex-grow flex flex-col pb-16 lg:pb-24">
      {/* Permanent Full-Width Hero News Slider */}
      <div className="w-full mt-0 px-0 lg:px-0">
        <NewsSlider />
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-screen-xl mx-auto w-full px-6 lg:px-16 pt-6 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
        <Link href="/" className="hover:text-good-blue flex items-center gap-1 transition-colors duration-200">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Beranda
        </Link>
        <span>/</span>
        <span className="hover:text-good-blue cursor-pointer transition-colors duration-200" onClick={() => setActiveCategorySlug("semua-berita")}>
          Berita
        </span>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-semibold">
          {kategoriName}
        </span>
      </div>

      {/* Search Input Area */}
      <div className="max-w-xl mx-auto w-full px-6 py-6 md:py-8">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari berita dalam kategori ini..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#162741] border border-slate-200 dark:border-slate-800/80 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-good-blue/50 focus:border-good-blue transition-all duration-200 shadow-sm text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Modern Capsule Category Selector */}
      <div className="max-w-screen-xl mx-auto w-full px-6 lg:px-16 pb-10 flex flex-wrap gap-2.5 justify-center">
        <button
          onClick={() => setActiveCategorySlug("semua-berita")}
          className={`px-5 py-2 rounded-full text-xs font-bold font-heading transition-all duration-200 tracking-wide cursor-pointer ${
            activeCategorySlug === "semua-berita"
              ? "bg-good-blue text-white shadow-md shadow-good-blue/20"
              : "bg-white dark:bg-[#162741] text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-slate-800 hover:border-good-blue/50"
          }`}
        >
          Semua Berita
        </button>
        {kategori.map((kat) => (
          <button
            key={kat.id}
            onClick={() => setActiveCategorySlug(kat.slug)}
            className={`px-5 py-2 rounded-full text-xs font-bold font-heading transition-all duration-200 tracking-wide cursor-pointer ${
              activeCategorySlug === kat.slug
                ? "bg-good-blue text-white shadow-md shadow-good-blue/20"
                : "bg-white dark:bg-[#162741] text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-slate-800 hover:border-good-blue/50"
            }`}
          >
            {kat?.judul_kategori}
          </button>
        ))}
      </div>

      {/* Grid of news cards */}
      <div className="max-w-screen-xl mx-auto w-full px-6 lg:px-16">
        <div data-aos="fade-up" className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6)
                .fill(0)
                .map((_, index) => <CardSemuaBeritaSkeleton key={index} />)}
            </div>
          ) : filteredBerita.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-bold text-xl text-gray-500 dark:text-gray-400">
                Berita Tidak Ada
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBerita.map((news) => (
                <CardSemuaBerita
                  key={news?.id}
                  slug={news?.slug}
                  gambar={news?.gambar}
                  penulis={news?.penulis}
                  kategori={news.kategori?.judul_kategori}
                  tanggal={news?.created_at}
                  judul={news?.judul}
                  konten={news?.konten}
                  dibaca={news?.dibaca || 0}
                  onClick={() => setSelectedNews(news)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pop-up Modal for News Details */}
      {selectedNews && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedNews(null)}
        >
          {/* Relative wrapper for the modal panel to allow floating elements outside */}
          <div 
            className="relative w-full max-w-5xl h-[88vh] flex flex-col animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* X button floating OUTSIDE the modal panel */}
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute -top-12 right-0 md:top-0 md:-right-12 w-10 h-10 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md hover:bg-red-500 text-white transition-all duration-200 cursor-pointer shadow-lg z-50"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>

            {/* Modal Panel */}
            <div className="w-full h-full bg-white dark:bg-[#1a2333] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0 bg-slate-50/50 dark:bg-dark-blue/20">
                <span className="text-xs uppercase font-extrabold tracking-widest text-good-blue">
                  {selectedNews.kategori?.judul_kategori || "Detail Berita"}
                </span>
              </div>
 
              {/* Modal Body (Scrollable) */}
              <div className="p-8 md:p-10 overflow-y-auto flex-grow custom-scrollbar">
                {/* Title (Headline) */}
                <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-slate-900 dark:text-white leading-tight mb-4">
                  {selectedNews.judul}
                </h2>
 
                {/* Metadata Row (Author, Date, Views, Read Time) */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-5">
                  {/* Author */}
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span>{selectedNews.penulis || "HMTI UNKHAIR"}</span>
                  </div>
                  <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                  {/* Date */}
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008z" />
                    </svg>
                    <span>{formatNewsDate(selectedNews.created_at)}</span>
                  </div>
                  <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                  {/* Views */}
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{selectedNews.dibaca || 0} Views</span>
                  </div>
                  <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                  {/* Read time */}
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{calculateReadTime(selectedNews.konten)} menit baca</span>
                  </div>
                </div>
 
                {/* Sharing Section (Directly under metadata) */}
                <div className="flex flex-wrap items-center gap-3 py-3.5 border-y border-slate-100 dark:border-slate-800/80 mb-6">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                    BAGIKAN:
                  </span>
                  <div className="flex items-center gap-2">
                    {/* WhatsApp */}
                    <a href={getShareLink("wa")} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-[#25D366] text-white hover:scale-115 active:scale-95 transition-all" title="Bagikan ke WhatsApp">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.977h.004c4.368 0 7.92-3.558 7.924-7.93A7.867 7.867 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.69-4.98c-.202-.101-1.194-.588-1.378-.654-.184-.066-.317-.099-.45.099-.132.199-.512.654-.627.784-.114.13-.23.145-.43.045-.222-.112-.937-.345-1.785-1.102-.661-.588-1.107-1.317-1.237-1.513-.13-.197-.014-.303.087-.404.091-.09.202-.236.303-.353.1-.118.134-.197.2-.33.067-.132.033-.248-.017-.348-.05-.1-.45-1.085-.617-1.487-.163-.393-.328-.34-.45-.346-.114-.006-.245-.008-.376-.008-.13 0-.343.05-.522.247-.18.197-.687.671-.687 1.636 0 .965.7 1.897.798 2.029.098.13 1.378 2.106 3.339 2.956.467.202.83.323 1.114.413.47.149.897.128 1.237.078.378-.057 1.194-.488 1.362-.96.168-.472.168-.876.118-.96-.05-.084-.183-.132-.38-.23z"/>
                      </svg>
                    </a>
                    {/* Instagram */}
                    <a href={getShareLink("ig")} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all" 
                      style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
                      title="Bagikan ke Instagram"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </a>
                    {/* Twitter */}
                    <a href={getShareLink("tw")} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-black text-white hover:scale-110 active:scale-95 transition-all" title="Bagikan ke Twitter">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    {/* Facebook */}
                    <a href={getShareLink("fb")} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1877F2] text-white hover:scale-110 active:scale-95 transition-all" title="Bagikan ke Facebook">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    </a>
                    {/* Copy Link Button - always shows "Salin Link" */}
                    <button onClick={copyToClipboard}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:scale-110 active:scale-95 transition-all cursor-pointer" title="Salin Link">
                      <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                  </div>
                </div>
 
                {/* Photo (Header Image) */}
                <div className="w-full h-[320px] md:h-[450px] overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm mb-6 flex-shrink-0">
                  <img
                    src={`${BASE_API_URL}/storage/${selectedNews.gambar}`}
                    alt={selectedNews.judul}
                    className="w-full h-full object-cover"
                  />
                </div>
 
                {/* Description (Full HTML content) */}
                <div 
                  className="text-justify leading-relaxed text-slate-750 dark:text-slate-200 text-base font-normal space-y-4 prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedNews.konten }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast alert top-right for link copied */}
      {shareCopied && (
        <div className="fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-bold animate-toast-in"
          style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 8px 24px rgba(16,185,129,0.35)' }}>
          <svg className="w-5 h-5 fill-none stroke-current flex-shrink-0" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
          <span>Link Berita Berhasil Disalin!</span>
        </div>
      )}

      {/* Styled Animations for Modal */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default BeritaPage;
