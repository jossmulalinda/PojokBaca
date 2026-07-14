'use client';

import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BASE_API_URL, BASE_API_KEY } from "@/lib/api";
import { dateFormat } from "@/lib/date-libs";

const OtherNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/semua-berita`, {
        headers: {
          "P3RT-HMTI-API-KEY": `${BASE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      setNews(response.data);
    } catch (error) {
      setError("Gagal mengambil data. Status error: " + error.response?.status);
      console.error("Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return <p className="dark:text-white">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-[90%] mx-auto my-32 py-7 flex md:flex-row flex-col justify-between gap-10 border-t-[3px] border-b-[3px] border-dark-blue dark:border-light-blue">
      {news?.map((n, i) => {
        if (i < 3) {
          return (
            <Link key={i} href={`/berita/${n.slug}`} className="group block">
              <p className="text-sm lg:text-base dark:text-gray-300">{`${dateFormat(
                n?.created_at
              )} | ${n.penulis} `}</p>
              <h2 className="py-2 font-semibold md:text-lg group-hover:text-good-blue transition-all dark:text-white">
                {n.judul}
              </h2>
            </Link>
          );
        }
        return null;
      })}
    </div>
  );
};

export default OtherNews;
