import React from "react";
import Link from "next/link";

const CardWithoutPic = ({ slug, penulis, tanggal, judul, kategori }) => {
  const truncateTitle = (title) => {
    const words = title.split(" ");
    return words.slice(0, 6).join(" ");
  };

  return (
    <Link
      href={`/berita/${slug}`}
      className="flex flex-col gap-3 w-full border-t-2 border-gray-400 lg:hover:scale-105 transition-all block"
    >
      <div className="flex flex-row gap-6 mt-4">
        <p className="text-sm lg:text-xl dark:text-gray-300">{penulis}</p>
        <p className="text-sm lg:text-xl opacity-50 dark:text-gray-400">{tanggal?.slice(0, 10)}</p>
      </div>
      <h1 className="text-2xl lg:text-3xl font-bold dark:text-white">{truncateTitle(judul)}</h1>
      <div className="inline-block">
        <p className="inline-block font-bold text-good-blue">• {kategori}</p>
      </div>
    </Link>
  );
};

export default CardWithoutPic;
