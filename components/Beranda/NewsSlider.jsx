import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { BASE_API_URL, BASE_API_KEY } from "@/lib/api";

const NewsSlider = () => {
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRandomNews();
  }, []);

  const fetchRandomNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_API_URL}/api/semua-berita`, {
        headers: {
          "P3RT-HMTI-API-KEY": `${BASE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data && Array.isArray(response.data)) {
        // Shuffle and select up to 5 news items
        const shuffled = [...response.data].sort(() => 0.5 - Math.random());
        setNews(shuffled.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching slider news:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (news.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [news, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? news.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === news.length - 1 ? 0 : prev + 1));
  };

  // Strip HTML tags for clean description
  const getExcerpt = (htmlContent) => {
    if (!htmlContent) return "";
    const plainText = htmlContent.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
    return plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText;
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="w-full h-[300px] md:h-[450px] lg:h-[520px] bg-slate-100 dark:bg-slate-900 animate-pulse flex items-center justify-center relative overflow-hidden rounded-none">
        <div className="text-slate-400 dark:text-slate-600 font-medium">Memuat Rekomendasi Berita...</div>
      </div>
    );
  }

  if (news.length === 0) return null;

  return (
    <div className="w-full relative overflow-hidden bg-slate-950 shadow-2xl group/slider">
      <style>{`
        .slider-overlay {
          background: linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.7) 40%, rgba(15, 23, 42, 0.1) 100%);
        }
        @media (max-width: 768px) {
          .slider-overlay {
            background: linear-gradient(to top, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0.8) 60%, rgba(15, 23, 42, 0.3) 100%);
          }
        }
      `}</style>

      {/* Slides Container */}
      <div className="relative w-full h-[380px] md:h-[480px] lg:h-[520px]">
        {news.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image */}
            <img
              src={`${BASE_API_URL}/storage/${item.gambar}`}
              alt={item.judul}
              className="w-full h-full object-cover transform scale-100 transition-transform duration-[6000ms] ease-out"
              style={{
                transform: index === currentIndex ? "scale(1.06)" : "scale(1)"
              }}
            />

            {/* Dark Overlay with content */}
            <div className="absolute inset-0 slider-overlay z-10 flex flex-col justify-end p-6 md:p-12 lg:p-16">
              <div className="max-w-4xl flex flex-col gap-3 md:gap-4">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                  <span className="text-slate-500">•</span>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zM9 16h6" />
                    </svg>
                    <span>{item.kategori?.judul_kategori || "Berita Terbaru"}</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-white leading-snug md:leading-tight line-clamp-3 hover:text-sky-300 transition-colors duration-200">
                  <Link href={`/berita/${item.slug}`}>{item.judul}</Link>
                </h2>

                {/* Excerpt */}
                <p className="text-sm md:text-base text-slate-300 line-clamp-2 md:line-clamp-3 leading-relaxed font-light max-w-3xl">
                  {getExcerpt(item.konten)}
                </p>

                {/* Button */}
                <div className="pt-2">
                  <Link
                    href={`/berita/${item.slug}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-600 hover:from-emerald-600 hover:to-sky-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-sky-500/20 hover:scale-105 transition-all duration-300"
                  >
                    <span>Baca Selengkapnya</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {news.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 opacity-80 md:opacity-0 md:group-hover/slider:opacity-100 border border-white/20 active:scale-95"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 opacity-80 md:opacity-0 md:group-hover/slider:opacity-100 border border-white/20 active:scale-95"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {news.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {news.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-sky-400" : "w-2.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsSlider;
