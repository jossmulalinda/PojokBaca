import React from "react";
import { getImageUrl } from "@/lib/api";

const ImageCard = ({ image, altText = "Image", className = "" }) => {
  const imageUrl = getImageUrl(image);

  return (
    <div className={`gallery-card-wrapper ${className}`}>
      <style>{`
        .gallery-card-wrapper .gallery-card {
          display: flex;
          flex-direction: column;
          width: 100%;
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

        html.dark .gallery-card-wrapper .gallery-card {
          background-color: #1e293b;
          box-shadow: 0px 10px 12px rgba(0, 0, 0, 0.25),
            -4px -4px 12px rgba(0, 0, 0, 0.2);
        }

        .gallery-card-wrapper .gallery-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(18, 107, 241, 0.12), 0 8px 10px -6px rgba(18, 107, 241, 0.08), 0px 4px 6px -1px rgba(0,0,0,0.04);
        }

        html.dark .gallery-card-wrapper .gallery-card:hover {
          box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.2), 0 8px 10px -6px rgba(59, 130, 246, 0.15), 0px 4px 6px -1px rgba(0,0,0,0.06);
        }

        .gallery-card-wrapper .gallery-card-image {
          width: 100%;
          height: 220px;
          border-radius: 10px;
          overflow: hidden;
          background-color: #e2e8f0;
        }

        html.dark .gallery-card-wrapper .gallery-card-image {
          background-color: #334155;
        }

        .gallery-card-wrapper .gallery-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .gallery-card-wrapper .gallery-card:hover .gallery-card-image img {
          transform: scale(1.05);
        }
      `}</style>

      <div data-aos="fade-up" className="gallery-card">
        <div className="gallery-card-image">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={altText}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
              No Image
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
