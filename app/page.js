'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AOS from "aos";
import axios from "axios";

import HeroBeranda from "@/components/Beranda/HeroBeranda";
import SectionTitle from "@/components/Beranda/SectionTitle";
import EventCard from "@/components/Beranda/EventCard";
import NewsCard from "@/components/Beranda/NewsCard";
import NewsCardSmartphone from "@/components/Beranda/NewsCardSmartphone";
import ImageCard from "@/components/Beranda/ImageCard";
import { BASE_API_URL, BASE_API_KEY } from "@/lib/api";
import NewsCardSmartphoneSkeleton from "@/components/Beranda/NewsCardSmartphoneSkeleton";
import NewsCardSkeleton from "@/components/Beranda/NewsCardSkeleton";
import Partners from "@/components/Beranda/Partners";
import ImageCardSkeleton from "@/components/Beranda/ImageCardSkeleton";

export default function Beranda() {
  const [loadingBeritaPilihan, setLoadingBeritaPilihan] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [beritaPilihan, setBeritaPilihan] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [partners, setPartners] = useState([]);
  const [events, setEvents] = useState([]);
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
    fetchBeritaPilihan();
    fetchGallery();
    fetchPartners();
    fetchEvents();
    AOS.init({
      duration: 1000,
    });
  }, []);

  // Handle sharing links for modal
  const getShareLink = (platform) => {
    if (!selectedNews) return "";
    const shareUrl = `${window.location.origin}/berita/${selectedNews.slug}`;
    const text = encodeURIComponent(`Baca berita HMTI: "${selectedNews.judul}"\n`);
    
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

  // Lock body scroll when modal opens
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

  const fetchBeritaPilihan = async () => {
    setLoadingBeritaPilihan(true);
    try {
      const response = await axios.get(`${BASE_API_URL}/api/berita-pilihan`, {
        headers: {
          "P3RT-HMTI-API-KEY": `${BASE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      setBeritaPilihan(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingBeritaPilihan(false);
    }
  };

  const fetchGallery = async () => {
    setLoadingGallery(true);
    try {
      const response = await axios.get(`${BASE_API_URL}/api/galeri-terbaru`, {
        headers: {
          "P3RT-HMTI-API-KEY": `${BASE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      setGallery(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingGallery(false);
    }
  };

  const fetchPartners = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/partners`, {
        headers: {
          "P3RT-HMTI-API-KEY": `${BASE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      if (response.data && Array.isArray(response.data)) {
        setPartners(response.data);
      } else {
        setPartners([]);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
      setPartners([]);
    }
  };

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await axios.get(`${BASE_API_URL}/api/events`, {
        headers: {
          "P3RT-HMTI-API-KEY": `${BASE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      setEvents(response.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  const currentNewsList = beritaPilihan.slice(0, 3);

  return (
    <div className="flex justify-center overflow-hidden">
      <div className="flex flex-col w-full">
        {/* hero */}
        <HeroBeranda />
        {/* hero */}
 
        {/* Centered content wrapper for sisa halaman beranda */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {/* berita laptop */}
          <div className="w-full hidden lg:block px-6 lg:px-16 py-16 overflow-hidden">
            <SectionTitle title={"HMTI NEWS"} />
            <h1
              data-aos="fade-up"
              className="w-full text-center text-xl font-bold lg:text-2xl italic pt-4 pb-8 dark:text-white"
            >
              Berita Pilihan
            </h1>
            <div
              data-aos="fade-up"
              className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8"
            >
              {loadingBeritaPilihan ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => <NewsCardSkeleton key={index} />)
              ) : currentNewsList.length === 0 ? (
                <p className="dark:text-white col-span-3 text-center py-10">Tidak ada berita</p>
              ) : (
                currentNewsList.map((news) => (
                  <NewsCard
                    key={news?.id}
                    slug={news?.slug}
                    author={news?.penulis}
                    date={news?.created_at}
                    image={news?.gambar}
                    title={news?.judul}
                    konten={news?.konten}
                    dibaca={news?.dibaca || 0}
                    kategori={news.kategori?.judul_kategori}
                    onClick={() => setSelectedNews(news)}
                  />
                ))
              )}
            </div>

            <div className="w-full">
              <div className="w-full flex justify-center pt-12">
                <Link
                  data-aos="fade-up"
                  href="/berita"
                  className="border-2 border-good-blue text-good-blue dark:border-white dark:text-white px-4 py-2 rounded-md font-bold hover:bg-good-blue hover:scale-105 hover:text-light-blue dark:hover:bg-white dark:hover:text-slate-900 transition-all"
                >
                  Lihat Berita Lainnya
                </Link>
              </div>
            </div>
          </div>
          {/* berita laptop */}

          {/* berita hp */}
          <div className="w-full lg:hidden px-6 lg:px-16 pt-10 pb-16 overflow-hidden">
            <SectionTitle title={"HMTI NEWS"} />
            <h1
              data-aos="fade-up"
              className="w-full text-center text-xl font-bold lg:text-2xl italic pt-4 pb-8 dark:text-white"
            >
              Berita Pilihan
            </h1>
            <div className="overflow-x-auto whitespace-nowrap scrollbar-hide mb-4">
              <div className="w-full flex flex-row gap-8">
                {loadingBeritaPilihan ? (
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <NewsCardSmartphoneSkeleton key={index} />
                    ))
                ) : currentNewsList.length === 0 ? (
                  <p className="dark:text-white w-full text-center py-10">Tidak ada berita</p>
                ) : (
                  currentNewsList.map((news) => (
                    <NewsCardSmartphone
                      key={news?.id}
                      slug={news?.slug}
                      author={news?.penulis}
                      date={news?.created_at}
                      image={news?.gambar}
                      title={news?.judul}
                      konten={news?.konten}
                      dibaca={news?.dibaca || 0}
                      kategori={news.kategori?.judul_kategori}
                      onClick={() => setSelectedNews(news)}
                    />
                  ))
                )}
              </div>
            </div>

            <div
              data-aos="fade-up"
              className="w-full flex justify-center pt-12"
            >
              <Link
                href="/berita"
                className="border-2 border-good-blue text-good-blue dark:border-white dark:text-white px-4 py-2 rounded-md font-bold hover:bg-good-blue hover:scale-105 hover:text-light-blue dark:hover:bg-white dark:hover:text-slate-900 transition-all"
              >
                Lihat Berita Lainnya
              </Link>
            </div>
          </div>
          {/* berita hp */}

          {/* event */}
          <div className="w-full px-6 lg:px-16 pt-16 pb-20 lg:pt-16 lg:pb-24 overflow-hidden">
            <SectionTitle title={"HMTI EVENT"} />
            <h1
              data-aos="fade-up"
              className="w-full text-center text-xl font-bold lg:text-2xl italic pt-4 pb-8 dark:text-white"
            >
              Semangat Berinovasi
            </h1>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10">
              {loadingEvents ? (
                <p className="dark:text-white text-center col-span-3 py-10 font-medium">Memuat Event...</p>
              ) : events.length === 0 ? (
                <p className="dark:text-white text-center col-span-3 py-10 font-medium">Tidak ada event aktif</p>
              ) : (
                events.slice(0, 3).map((event) => (
                  <EventCard
                    key={event.id}
                    link={event.link || "/event"}
                    title={event.title}
                    image={event.image ? `${BASE_API_URL}/storage/${event.image}` : "/assets/img/marchevent-min.JPG"}
                  />
                ))
              )}
            </div>
          </div>
          {/* event */}

          {/* galery */}
          <div className="w-full pt-16 px-6 lg:px-16 overflow-hidden">
            <SectionTitle title={"HMTI GALLERY"} />
            <section className="py-8">
              <div className="container mx-auto px-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {loadingGallery
                    ? Array(6)
                        .fill(0)
                        .map((_, index) => <ImageCardSkeleton key={index} />)
                    : gallery
                        .slice(0, 6)
                        .map((gambar) => (
                          <ImageCard key={gambar?.id} image={gambar?.gambar} />
                        ))}
                </div>
              </div>
            </section>
          </div>
          {/* galery */}

          {/* partner */}
          {partners && partners.length > 0 && (
            <div className="w-full pt-20">
              <SectionTitle title={"HMTI PARTNERS"} />
              <Partners partners={partners} />
            </div>
          )}
          {/* partner */}
        </div>
        {/* partner */}
      </div>

      {/* Pop-up Modal for Homepage News Details */}
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
                  {selectedNews.kategori?.judul_kategori || "Berita Terbaru"}
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
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-[#25D366] text-white hover:scale-110 active:scale-95 transition-all" title="Bagikan ke WhatsApp">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.556 0 10.074-4.513 10.077-10.068.001-2.69-1.045-5.22-2.951-7.129C16.59 1.498 14.062.453 11.381.453 5.826.453 1.309 4.966 1.306 10.52c-.001 1.636.432 3.23 1.255 4.636l-.993 3.633 3.73-.978l-.25.143z" /></svg>
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
}
