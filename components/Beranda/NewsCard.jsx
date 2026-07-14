import React from "react";
import Link from "next/link";
import { BASE_API_URL, getImageUrl } from "@/lib/api";

const NewsCard = ({
  slug,
  author,
  date,
  title,
  kategori,
  image,
  konten,
  dibaca = 0,
  className = "",
  onClick,
}) => {
  // Strip HTML tags from konten for plain text preview and limit to 15 words
  const plainText = konten
    ? (() => {
        const text = konten.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
        const words = text.split(/\s+/);
        if (words.length <= 15) return text;
        return words.slice(0, 15).join(" ") + "...";
      })()
    : "";

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

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className={`news-card-wrapper ${className}`}>
      <style>{`
        .news-card-wrapper {
          width: 100%;
        }

        .news-card-wrapper .news-card {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 340px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0px 10px 12px rgba(0, 0, 0, 0.08),
            -4px -4px 12px rgba(0, 0, 0, 0.04);
          padding: 10px;
          text-decoration: none;
          box-sizing: border-box;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        html.dark .news-card-wrapper .news-card {
          background-color: #1e293b;
          box-shadow: 0px 10px 12px rgba(0, 0, 0, 0.3);
        }

        .news-card-wrapper .news-card:hover {
          transform: translateY(-3px);
          box-shadow: 0px 14px 20px rgba(0, 0, 0, 0.12);
        }

        .news-card-wrapper .news-card-image {
          width: 100%;
          height: 140px;
          border-radius: 8px;
          overflow: hidden;
          background-color: #f1f5f9;
          flex-shrink: 0;
        }

        html.dark .news-card-wrapper .news-card-image {
          background-color: #334155;
        }

        .news-card-wrapper .news-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .news-card-wrapper .news-card-title {
          font-size: 15px;
          font-weight: 700;
          font-family: 'Outfit', 'Plus Jakarta Sans', sans-serif;
          color: #0f172a;
          margin-top: 10px;
          margin-bottom: 4px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        html.dark .news-card-wrapper .news-card-title {
          color: #f8fafc;
        }

        .news-card-wrapper .news-card-des {
          font-size: 12.5px;
          color: #64748b;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.5;
        }

        html.dark .news-card-wrapper .news-card-des {
          color: #94a3b8;
        }

        .news-card-wrapper .news-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 8px;
          border-top: 1px solid #f1f5f9;
          gap: 6px;
        }

        html.dark .news-card-wrapper .news-card-meta {
          border-top-color: #334155;
        }

        .news-card-wrapper .news-card-meta-left {
          display: flex;
          align-items: center;
          gap: 5px;
          min-width: 0;
          flex: 1;
        }

        .news-card-wrapper .news-card-meta-author {
          font-size: 11.5px;
          font-weight: 600;
          color: #3b82f6;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        html.dark .news-card-wrapper .news-card-meta-author {
          color: #60a5fa;
        }

        .news-card-wrapper .news-card-meta-dot {
          color: #cbd5e1;
          font-size: 10px;
          flex-shrink: 0;
        }

        .news-card-wrapper .news-card-meta-date {
          font-size: 11px;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          color: #94a3b8;
          white-space: nowrap;
          flex-shrink: 0;
        }

        html.dark .news-card-wrapper .news-card-meta-date {
          color: #64748b;
        }

        .news-card-wrapper .news-card-meta-views {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          color: #94a3b8;
          flex-shrink: 0;
        }

        html.dark .news-card-wrapper .news-card-meta-views {
          color: #64748b;
        }

        .news-card-wrapper .news-card-meta-views svg {
          width: 13px;
          height: 13px;
          fill: currentColor;
        }
      `}</style>

      <Link href={`/berita/${slug}`} onClick={handleClick} className="block">
        <div className="news-card">
          <div className="news-card-image">
            {image && (
              <img
                src={getImageUrl(image)}
                alt={title || "Berita HMTI"}
                loading="lazy"
              />
            )}
          </div>
          <p className="news-card-title">{title}</p>
          <p className="news-card-des line-clamp-3">{plainText}</p>
          <div className="news-card-meta">
            <div className="news-card-meta-left">
              <span className="news-card-meta-author">{author || "HMTI"}</span>
              <span className="news-card-meta-dot">•</span>
              <span className="news-card-meta-date">{formatDate(date)}</span>
            </div>
            <div className="news-card-meta-views">
              <svg viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
              <span>{dibaca}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
