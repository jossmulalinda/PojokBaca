import React from "react";
import { BASE_API_URL } from "@/lib/api";

// Single partner card
const PartnerCard = ({ image, name }) => (
  <div className="partner-marquee-card">
    <div className="partner-marquee-logo">
      <img
        src={`${BASE_API_URL}/storage/${image}`}
        alt={name || "Partner"}
        onError={(e) => {
          e.target.style.display = "none";
          const fb = e.target.nextSibling;
          if (fb) fb.style.display = "flex";
        }}
      />
      <div className="partner-marquee-fallback">
        {name?.charAt(0) || "P"}
      </div>
    </div>
    <p className="partner-marquee-name">{name}</p>
  </div>
);

const Partners = ({ partners = [] }) => {
  if (!partners || partners.length === 0) return null;

  // Duplicate enough times so the loop fills any screen width smoothly
  // Minimum 6 copies so even 1 partner scrolls seamlessly
  const minCopies = Math.ceil(12 / partners.length);
  const items = Array.from({ length: Math.max(minCopies, 2) }, () => partners).flat();

  // Speed: wider set = slightly faster, but always feels smooth
  const speed = Math.max(20, partners.length * 6);

  return (
    <div className="partner-marquee-wrapper">
      <style>{`
        .partner-marquee-wrapper {
          width: 100%;
          overflow: hidden;
          padding: 8px 0 40px;
        }

        .partner-marquee-row {
          overflow: hidden;
          width: 100%;
          -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
          mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
        }

        .partner-marquee-track {
          display: flex;
          width: max-content;
          gap: 32px;
          will-change: transform;
          animation-name: marquee-left;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .partner-marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .partner-marquee-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 120px;
          background-color: #ffffff;
          border-radius: 14px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07),
            0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 14px 10px 12px;
          gap: 8px;
          flex-shrink: 0;
          cursor: pointer;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .partner-marquee-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(18, 107, 241, 0.14),
            0 8px 10px -6px rgba(18, 107, 241, 0.10);
          border-color: rgba(59, 130, 246, 0.3);
        }

        html.dark .partner-marquee-card {
          background-color: rgba(22, 39, 65, 0.85);
          border-color: rgba(59, 130, 246, 0.12);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3),
            0 1px 3px rgba(0, 0, 0, 0.2);
        }

        html.dark .partner-marquee-card:hover {
          box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.22),
            0 8px 10px -6px rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.35);
        }

        .partner-marquee-logo {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          overflow: hidden;
          background-color: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        html.dark .partner-marquee-logo {
          background-color: #1e3a5f;
        }

        .partner-marquee-logo img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .partner-marquee-fallback {
          display: none;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          color: #3b82f6;
          font-weight: 700;
          font-size: 20px;
          text-transform: uppercase;
          border-radius: 10px;
        }

        html.dark .partner-marquee-fallback {
          background: linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(30, 64, 175, 0.3));
          color: #60a5fa;
        }

        .partner-marquee-name {
          margin: 0;
          font-size: 11px;
          font-family: 'Plus Jakarta Sans', 'Poppins', sans-serif;
          font-weight: 600;
          color: #334155;
          text-align: center;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.3;
        }

        html.dark .partner-marquee-name {
          color: #cbd5e1;
        }
      `}</style>

      <div className="partner-marquee-row">
        <div
          className="partner-marquee-track"
          style={{ animationDuration: `${speed}s` }}
        >
          {items.map((item, idx) => (
            <PartnerCard key={`${item.id ?? idx}-${idx}`} image={item.logo} name={item.nama} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partners;
