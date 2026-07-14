import React from "react";
import Link from "next/link";
import { BASE_API_URL } from "@/lib/api";

const NewsCardSmartphone = ({
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
    <div className={`news-card-sp-wrapper ${className}`}>
      <style>{`
        .news-card-sp-wrapper {
          flex-shrink: 0;
          width: 220px;
        }

        .news-card-sp-wrapper .news-card-sp {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 300px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0px 10px 12px rgba(0, 0, 0, 0.08),
            -4px -4px 12px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          box-sizing: border-box;
          padding: 10px;
        }

        html.dark .news-card-sp-wrapper .news-card-sp {
          background-color: #1e293b;
          box-shadow: 0px 10px 12px rgba(0, 0, 0, 0.25),
            -4px -4px 12px rgba(0, 0, 0, 0.2);
        }

        .news-card-sp-wrapper .news-card-sp:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(18, 107, 241, 0.12), 0 8px 10px -6px rgba(18, 107, 241, 0.08), 0px 4px 6px -1px rgba(0,0,0,0.04);
        }

        html.dark .news-card-sp-wrapper .news-card-sp:hover {
          box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.2), 0 8px 10px -6px rgba(59, 130, 246, 0.15), 0px 4px 6px -1px rgba(0,0,0,0.06);
        }

        .news-card-sp-wrapper .news-card-sp-image {
          width: 100%;
          height: 45%;
          border-radius: 10px;
          margin-bottom: 8px;
          overflow: hidden;
          background-color: #e2e8f0;
          flex-shrink: 0;
        }
 
        html.dark .news-card-sp-wrapper .news-card-sp-image {
          background-color: #334155;
        }
 
        .news-card-sp-wrapper .news-card-sp-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
 
        .news-card-sp-wrapper .news-card-sp-title {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          font-weight: 700;
          color: #0f172a;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.35;
        }
 
        html.dark .news-card-sp-wrapper .news-card-sp-title {
          color: #f1f5f9;
        }
 
        .news-card-sp-wrapper .news-card-sp-des {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0 0 auto 0;
          font-size: 11.5px;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          color: #64748b;
          line-height: 1.5;
        }

        html.dark .news-card-sp-wrapper .news-card-sp-des {
          color: #94a3b8;
        }

        .news-card-sp-wrapper .news-card-sp-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px solid #f1f5f9;
          gap: 4px;
        }

        html.dark .news-card-sp-wrapper .news-card-sp-meta {
          border-top-color: #334155;
        }

        .news-card-sp-wrapper .news-card-sp-meta-left {
          display: flex;
          align-items: center;
          gap: 4px;
          min-width: 0;
          flex: 1;
        }

        .news-card-sp-wrapper .news-card-sp-meta-author {
          font-size: 10.5px;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          font-weight: 500;
          color: #475569;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        html.dark .news-card-sp-wrapper .news-card-sp-meta-author {
          color: #cbd5e1;
        }

        .news-card-sp-wrapper .news-card-sp-meta-dot {
          font-size: 10px;
          color: #94a3b8;
          flex-shrink: 0;
        }

        .news-card-sp-wrapper .news-card-sp-meta-date {
          font-size: 10px;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          color: #94a3b8;
          white-space: nowrap;
          flex-shrink: 0;
        }

        html.dark .news-card-sp-wrapper .news-card-sp-meta-date {
          color: #64748b;
        }

        .news-card-sp-wrapper .news-card-sp-meta-views {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 10px;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          color: #94a3b8;
          flex-shrink: 0;
        }

        html.dark .news-card-sp-wrapper .news-card-sp-meta-views {
          color: #64748b;
        }

        .news-card-sp-wrapper .news-card-sp-meta-views svg {
          width: 12px;
          height: 12px;
          fill: currentColor;
        }
      `}</style>

      <Link href={`/berita/${slug}`} onClick={handleClick} className="block">
        <div className="news-card-sp">
          <div className="news-card-sp-image">
            {image && (
              <img
                src={`${BASE_API_URL}/storage/${image}`}
                alt={title || "Berita HMTI"}
                loading="lazy"
              />
            )}
          </div>
          <p className="news-card-sp-title">{title}</p>
          <p className="news-card-sp-des line-clamp-3">{plainText}</p>
          <div className="news-card-sp-meta">
            <div className="news-card-sp-meta-left">
              <span className="news-card-sp-meta-author">{author || "HMTI"}</span>
              <span className="news-card-sp-meta-dot">•</span>
              <span className="news-card-sp-meta-date">{formatDate(date)}</span>
            </div>
            <div className="news-card-sp-meta-views">
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

export default NewsCardSmartphone;
