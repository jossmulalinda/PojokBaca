'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import SearchForm from "@/components/Berita/SearchForm";
import AOS from "aos";
import CardSemuaBeritaSkeleton from "@/components/Berita/CardSemuaBeritaSkeleton";
import CardSemuaBerita from "@/components/Berita/CardSemuaBerita";
import { BASE_API_URL, BASE_API_KEY } from "@/lib/api";
import { useParams } from "next/navigation";
import axios from "axios";

const SearchBeritaPage = () => {
  const [loading, setLoading] = useState(true);
  const [berita, setBerita] = useState([]);
  const { slug } = useParams();

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
    fetchBerita();
  }, [slug]);

  const fetchBerita = async () => {
    if (!slug) return;
    setLoading(true);
    setBerita([]);
    try {
      const response = await axios.get(
        `${BASE_API_URL}/api/search?cari=${slug}`,
        {
          headers: {
            "P3RT-HMTI-API-KEY": `${BASE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      setBerita(response.data);
    } catch (error) {
      setBerita([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col pb-16 lg:pb-24">
      {/* Search Header Banner */}
      <div className="w-full bg-gradient-to-r from-good-blue via-bad-blue to-dark-blue py-12 px-6 lg:px-16 text-white shadow-sm mt-[76px]">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">
          <svg className="w-8 h-8 fill-current opacity-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <h1 className="text-2xl lg:text-3xl font-extrabold font-heading tracking-wide">
            Hasil Pencarian: "{decodeURIComponent(slug || "")}"
          </h1>
        </div>
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
        <Link href="/berita/kategori/semua-berita" className="hover:text-good-blue transition-colors duration-200">
          Berita
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-semibold">
          Pencarian
        </span>
      </div>

      {/* Search Input Area */}
      <div className="max-w-xl mx-auto w-full px-6 py-6 md:py-8">
        <SearchForm />
      </div>

      {/* Grid of news cards */}
      <div className="max-w-screen-xl mx-auto w-full px-6 lg:px-16 mt-4">
        <div data-aos="fade-up" className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6)
                .fill(0)
                .map((_, index) => <CardSemuaBeritaSkeleton key={index} />)}
            </div>
          ) : berita.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-bold text-xl text-gray-500 dark:text-gray-400">
                Berita Tidak Ditemukan
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {berita.map((news) => (
                <CardSemuaBerita
                  key={news?.id}
                  slug={news?.slug}
                  gambar={news?.gambar}
                  penulis={news?.penulis}
                  kategori={news.kategori?.judul_kategori}
                  tanggal={news?.created_at}
                  judul={news?.judul}
                  konten={news?.konten}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBeritaPage;
