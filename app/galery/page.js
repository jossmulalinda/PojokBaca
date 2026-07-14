'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import Link from "next/link";
import SectionTitle from "@/components/Beranda/SectionTitle";
import ImageCard from "@/components/Beranda/ImageCard";
import ImageCardSkeleton from "@/components/Beranda/ImageCardSkeleton";
import { BASE_API_URL, BASE_API_KEY } from "@/lib/api";
import BounceLoading from "@/components/BounceLoading";

const GaleryPage = () => {
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [galleryNew, setGalleryNew] = useState([]);
  const [galleryOld, setGalleryOld] = useState([]);

  useEffect(() => {
    fetchNewGallery();
    fetchOldGallery();
    AOS.init({
      duration: 1000,
    });
  }, []);

  const fetchNewGallery = async () => {
    setLoadingGallery(true);
    try {
      const response = await axios.get(`${BASE_API_URL}/api/galeri-terbaru`, {
        headers: {
          "P3RT-HMTI-API-KEY": `${BASE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      setGalleryNew(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingGallery(false);
    }
  };

  const fetchOldGallery = async () => {
    setLoadingGallery(true);
    try {
      const response = await axios.get(`${BASE_API_URL}/api/galeri-terlama`, {
        headers: {
          "P3RT-HMTI-API-KEY": `${BASE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      setGalleryOld(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingGallery(false);
    }
  };

  if (loadingGallery) {
    return (
      <div className="w-full">
        <BounceLoading />
      </div>
    );
  }

  return (
    <div className="flex-grow">
      <div className="flex flex-col-reverse py-28 lg:flex-row lg:max-h-screen overflow-hidden">
        <div className="w-full lg:w-1/2 px-6 py-5 lg:py-16 lg:pl-40 flex justify-center items-center">
          <div
            data-aos="fade-right"
            className="flex flex-col gap-5 w-auto h-auto"
          >
            <h1 className="font-bold text-4xl lg:text-6xl dark:text-white">GALLERY HMTI</h1>
            <h3 className="text-2xl lg:text-4xl dark:text-white">
              Simpan Sejuta Cerita, Biarkan Kenangan Berbicara
            </h3>
            <div className="flex gap-3 pt-3">
              <Link
                href="/kenangan"
                className="bg-good-blue px-4 border-2 border-transparent text-light-blue py-2 rounded-md font-bold hover:bg-transparent hover:scale-105 hover:border-good-blue hover:text-good-blue transition-all"
              >
                Kenangan HMTI
              </Link>
            </div>
          </div>
        </div>
        <div
          data-aos="fade-left"
          className="w-full lg:w-1/2 py-16 lg:pr-32 lg:pb-24 flex justify-center items-center"
        >
          <div className="relative w-full max-w-lg flex justify-center items-center">
            {/* Main Illustration */}
            <img
              src="/assets/img/galeryIMG.svg"
              alt="Galeri HMTI"
              className="w-3/4 lg:w-full max-w-md drop-shadow-xl"
            />

            {/* Floating Cube 1 - Top Left */}
            <div className="absolute -top-3 left-2 sm:left-2 z-10 w-14 h-14 sm:w-16 sm:h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200/70 dark:border-gray-800/70 rounded-2xl p-2.5 shadow-xl hover:shadow-2xl hover:-translate-y-2.5 transition-all duration-300 animate-float group cursor-pointer flex items-center justify-center">
              <img
                src="/assets/img/logoHmti.png"
                alt="Logo HMTI"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Floating Cube 2 - Bottom Right */}
            <div className="absolute -bottom-3 right-2 sm:right-2 z-10 w-14 h-14 sm:w-16 sm:h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200/70 dark:border-gray-800/70 rounded-2xl p-2.5 shadow-xl hover:shadow-2xl hover:-translate-y-2.5 transition-all duration-300 animate-float-delayed group cursor-pointer flex items-center justify-center">
              <img
                src="/assets/img/logoHmti.png"
                alt="Logo HMTI"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Floating Cube 3 - Top Right */}
            <div className="absolute top-4 right-4 sm:right-8 z-10 w-12 h-12 bg-white/75 dark:bg-gray-900/75 backdrop-blur-md border border-gray-200/60 dark:border-gray-800/60 rounded-2xl p-2 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-float group cursor-pointer hidden sm:flex items-center justify-center">
              <img
                src="/assets/img/logoHmti.png"
                alt="Logo HMTI"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
      {/* New Galery */}
      <div className="py-8">
        <div className="w-full pt-16 px-6 lg:px-16 overflow-hidden">
          <SectionTitle title={"CUPLIKAN KOLEKSI TERKINI"} />
          <section className="py-8">
            <div className="container mx-auto px-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {loadingGallery
                  ? Array(6)
                      .fill(0)
                      .map((_, index) => <ImageCardSkeleton key={index} />)
                  : galleryNew
                      .slice(0, 6)
                      .map((gambar) => (
                        <ImageCard key={gambar?.id} image={gambar?.gambar} />
                      ))}
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* End New Galery */}

      {/* Old Galery */}
      <div className="py-8">
        <div className="w-full pt-16 px-6 lg:px-16 overflow-hidden">
          <SectionTitle title={"JELAJAHI KENANGAN"} />
          <section className="py-8">
            <div className="container mx-auto px-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {loadingGallery
                  ? Array(6)
                      .fill(0)
                      .map((_, index) => <ImageCardSkeleton key={index} />)
                  : galleryOld
                      .slice(0, 6)
                      .map((gambar) => (
                        <ImageCard key={gambar?.id} image={gambar?.gambar} />
                      ))}
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* End Old Galery */}
    </div>
  );
};

export default GaleryPage;
