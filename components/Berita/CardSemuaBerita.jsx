import React from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/api";

const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
};

const getExcerpt = (content, maxWords = 15) => {
  const plainText = stripHtml(content);
  const words = plainText.split(/\s+/);
  if (words.length <= maxWords) return plainText;
  return words.slice(0, maxWords).join(" ") + "...";
};

const CardSemuaBerita = ({ slug, gambar, thumbnail, kategori, judul, penulis, tanggal, konten, dibaca = 0, onClick }) => {
  const imageSrc = gambar || thumbnail;

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Link 
      href={`/berita/${slug}`} 
      onClick={handleClick}
      className="flex flex-col w-full bg-white dark:bg-dark-blue border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden h-full group"
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
      {/* Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {imageSrc ? (
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={getImageUrl(imageSrc)}
            alt={judul || "Berita HMTI"}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">
            No Image
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-[11px] text-gray-500 dark:text-gray-400 mb-3 font-heading font-medium tracking-wide w-full">
          {/* Date */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1-1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2h-1V1a1 1 0 10-2 0v1H7V1a1 1 0 00-1-1zM4 5h12v3H4V5zm0 5h12v5H4v-5z" clipRule="evenodd" />
            </svg>
            <span>{tanggal?.slice(0, 10)}</span>
          </div>

          {/* Author */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>{penulis || "Prodi"}</span>
          </div>

          {/* Views Count */}
          <div className="flex items-center gap-1 ml-auto text-[11px] text-gray-500 dark:text-gray-400 flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{dibaca}</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-base font-extrabold font-heading text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-good-blue transition-colors duration-200 leading-snug">
          {judul}
        </h2>

        {/* Excerpt */}
        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
          {getExcerpt(konten)}
        </p>
      </div>
    </Link>
  );
};

export default CardSemuaBerita;
