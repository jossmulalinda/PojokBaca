'use client';

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import AOS from "aos";
import TopLink from "@/components/TopLink";
import BounceLoading from "@/components/BounceLoading";

// Biografi components
import ImageCard from "@/components/Beranda/ImageCard";

// Visi-Misi components
import HeaderStruktur from "@/components/HeaderStruktur";

// Struktur components
import BidangPengurus from "@/components/BidangPengurus";
import CardPengurus from "@/components/CardPengurus";
import { stringDash, stringTanpaKurung } from "@/lib/string-libs";

import { BASE_API_URL, BASE_API_KEY } from "@/lib/api";

const fallbackStruktur = {
  parent: null,
  ketum: { nama: "—", foto: null },
  sekum: { nama: "—", foto: null },
  bendum: { nama: "—", foto: null },
  bidang: []
};

function ProfileContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "biografi";

  // State for Biografi
  const [loadingBiografi, setLoadingBiografi] = useState(true);
  const [sejarah, setSejarah] = useState({});
  const [filosofi, setFilosofi] = useState({});
  const [hoveredWarna, setHoveredWarna] = useState("biru");
  const [isHoveredPalette, setIsHoveredPalette] = useState(false);

  // Auto rotation of color palette when not hovered
  useEffect(() => {
    if (isHoveredPalette || activeTab !== "biografi") return;

    const timer = setInterval(() => {
      setHoveredWarna((prev) => {
        if (prev === "biru") return "hitam";
        if (prev === "hitam") return "putih";
        return "biru";
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [isHoveredPalette, activeTab]);



  // State for Struktur
  const [loadingStruktur, setLoadingStruktur] = useState(false);
  const [pengurus, setPengurus] = useState(fallbackStruktur);

  const hasMembers = (b) => {
    const hasKabid = b.kabid?.nama && b.kabid.nama !== "—" && b.kabid.nama !== "";
    const hasSekbid = b.sekbid?.nama && b.sekbid.nama !== "—" && b.sekbid.nama !== "";
    const hasDivisiMembers = b.divisi && b.divisi.some(d => {
      const hasKadiv = d.kadiv?.nama && d.kadiv.nama !== "—" && d.kadiv.nama !== "";
      const hasAnggota = d.anggota && d.anggota.length > 0;
      return hasKadiv || hasAnggota;
    });
    return hasKabid || hasSekbid || hasDivisiMembers;
  };

  const pado = pengurus?.bidang?.find((b) => {
    const isPao = b.nama_bidang.toUpperCase().includes("PAO") || b.nama_bidang.toUpperCase().includes("APARATUR");
    return isPao && hasMembers(b);
  });
  const otherBidang = pengurus?.bidang?.filter((b) => {
    const isPao = b.nama_bidang.toUpperCase().includes("PAO") || b.nama_bidang.toUpperCase().includes("APARATUR");
    return !isPao && hasMembers(b);
  }) || [];

  // Drag scroll for horizontal list BPH
  const scrollRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const renderBidangCard = (bidang, index, prefix) => {
    return (
      <div
        key={`${prefix}-${index}`}
        id={prefix === "first" ? stringDash(stringTanpaKurung(bidang.nama_bidang).toLowerCase()) : undefined}
        className="flex-shrink-0 w-[280px] md:w-[320px] bg-white/70 dark:bg-dark-blue/50 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 flex flex-col items-center gap-6"
      >
        {/* Division Title */}
        <h3 className="text-center font-bold text-base md:text-lg text-blue-600 dark:text-blue-400 h-16 flex items-center justify-center border-b border-gray-100 dark:border-gray-800 w-full pb-2">
          {stringTanpaKurung(bidang.nama_bidang)}
        </h3>

        {/* Kabid & Sekbid stack */}
        <div className="flex flex-col gap-6 w-full items-center">
          {/* Kabid */}
          <div className="flex flex-col items-center w-full">
            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
              Ketua Bidang
            </span>
            <div className="h-52 w-42 overflow-hidden border-2 border-good-blue dark:border-white rounded-2xl shadow-md bg-white dark:bg-bad-blue relative">
              <img
                src={bidang.kabid?.foto ? `${BASE_API_URL}/storage/${bidang.kabid.foto}` : "/assets/img/placeholder-pengurus.png"}
                alt={bidang.kabid?.nama}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/img/placeholder-pengurus.png";
                }}
              />
              {/* Bottom shadow overlay */}
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-center mt-2 dark:text-white max-w-[220px] line-clamp-2 h-10 flex items-center justify-center leading-tight break-words px-1">
              {bidang.kabid?.nama || "—"}
            </span>
          </div>

          {/* Sekbid */}
          <div className="flex flex-col items-center w-full">
            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
              Sekretaris Bidang
            </span>
            <div className="h-52 w-42 overflow-hidden border-2 border-good-blue dark:border-white rounded-2xl shadow-md bg-white dark:bg-bad-blue relative">
              <img
                src={bidang.sekbid?.foto ? `${BASE_API_URL}/storage/${bidang.sekbid.foto}` : "/assets/img/placeholder-pengurus.png"}
                alt={bidang.sekbid?.nama}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/img/placeholder-pengurus.png";
                }}
              />
              {/* Bottom shadow overlay */}
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-center mt-2 dark:text-white max-w-[220px] line-clamp-2 h-10 flex items-center justify-center leading-tight break-words px-1">
              {bidang.sekbid?.nama || "—"}
            </span>
          </div>
        </div>

        {/* Divisi List under Kabid & Sekbid inside the card */}
        {bidang.divisi && bidang.divisi.length > 0 && (
          <div className="w-full flex flex-col gap-5 mt-4 border-t border-gray-150 dark:border-gray-800 pt-5">
            {bidang.divisi.map((div, divIndex) => (
              <div
                key={divIndex}
                className="w-full flex flex-col items-center bg-gray-50/50 dark:bg-bad-blue/30 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-800/80 shadow-sm"
              >
                <h4 className="text-center font-bold text-xs text-blue-600 dark:text-blue-400 mb-3">
                  {div.nama_divisi}
                </h4>
                {div.kadiv ? (
                  <div className="flex flex-col items-center w-full mb-3">
                    <span className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Ketua Divisi
                    </span>
                    <div className="h-36 w-30 overflow-hidden border-2 border-good-blue dark:border-white rounded-xl shadow-sm bg-white dark:bg-bad-blue relative">
                      <img
                        src={div.kadiv.foto ? `${BASE_API_URL}/storage/${div.kadiv.foto}` : "/assets/img/placeholder-pengurus.png"}
                        alt={div.kadiv.nama}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/assets/img/placeholder-pengurus.png";
                        }}
                      />
                      {/* Bottom shadow overlay */}
                      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-center mt-1.5 dark:text-white max-w-[180px] line-clamp-2 h-8 flex items-center justify-center leading-tight break-words px-1">
                      {div.kadiv.nama}
                    </span>
                  </div>
                ) : (
                  <div className="text-[10px] text-gray-400 my-2">Tidak ada Ketua Divisi</div>
                )}
                {div.anggota && div.anggota.length > 0 && (
                  <div className="text-center w-full mt-1">
                    <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">
                      Anggota
                    </span>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium leading-normal px-1">
                      {div.anggota.map((m) => m.nama).join(", ")}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // multiplier
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Continuous smooth auto scroll
  useEffect(() => {
    if (activeTab === "struktur" && scrollRef.current && otherBidang.length > 0) {
      let animationFrameId;
      let lastTime = performance.now();
      const speed = 40; // pixels per second
      let direction = 1;

      const scrollContainer = scrollRef.current;

      const animate = (time) => {
        if (!scrollContainer || isDown || isHovered) {
          lastTime = time;
          animationFrameId = requestAnimationFrame(animate);
          return;
        }

        const delta = (time - lastTime) / 1000;
        lastTime = time;

        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

        if (direction === 1 && scrollLeft + clientWidth >= scrollWidth - 2) {
          direction = -1;
        } else if (direction === -1 && scrollLeft <= 1) {
          direction = 1;
        }

        scrollContainer.scrollLeft += speed * delta * direction;

        animationFrameId = requestAnimationFrame(animate);
      };

      animationFrameId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [activeTab, isDown, isHovered, otherBidang]);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Fetch Biografi
  useEffect(() => {
    if (activeTab === "biografi") {
      const fetchBiografi = async () => {
        setLoadingBiografi(true);
        try {
          const response = await axios.get(`${BASE_API_URL}/api/sejarah-filosofi`, {
            headers: {
              "P3RT-HMTI-API-KEY": `${BASE_API_KEY}`,
              "Content-Type": "application/json",
            },
          });
          setSejarah(response.data.sejarah || {});
          setFilosofi(response.data.filosofi || {});
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingBiografi(false);
        }
      };
      fetchBiografi();
    }
  }, [activeTab]);



  // Fetch Struktur
  useEffect(() => {
    if (activeTab === "struktur") {
      const fetchStruktur = async () => {
        setLoadingStruktur(true);
        try {
          const response = await axios.get(`${BASE_API_URL}/api/struktur`, {
            headers: {
              "P3RT-HMTI-API-KEY": `${BASE_API_KEY}`,
              "Content-Type": "application/json",
            },
          });
          if (response.data) {
            const data = response.data;
            const merged = {
              periode: data.periode,
              ketum: data.ketum?.nama ? data.ketum : fallbackStruktur.ketum,
              sekum: data.sekum?.nama ? data.sekum : fallbackStruktur.sekum,
              bendum: data.bendum?.nama ? data.bendum : fallbackStruktur.bendum,
              bidang: (data.bidang && data.bidang.length > 0) ? data.bidang : fallbackStruktur.bidang
            };
            setPengurus(merged);
          }
        } catch (error) {
          console.warn("Backend offline, using fallback structure data.", error);
        } finally {
          setLoadingStruktur(false);
        }
      };
      fetchStruktur();
    }
  }, [activeTab]);

  return (
    <div className="flex-grow">
      <TopLink activeTab={activeTab} />

      {activeTab === "biografi" && (
        <div className="container mx-auto gap-6 p-5 overflow-hidden">
          {loadingBiografi ? (
            <BounceLoading />
          ) : (
            <>
              {/* Sejarah HMTI Section with Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 my-8 items-center">
                <div className="lg:col-span-7 flex flex-col justify-center" data-aos="fade-right">
                  <h2 className="text-4xl md:text-5xl font-bold mb-8 text-blue-600 dark:text-blue-400 font-heading">
                    SEJARAH HMTI
                  </h2>
                  
                  {/* Interactive Timeline Stepper */}
                  <div className="relative pl-6 border-l-2 border-blue-100 dark:border-gray-800 space-y-8">
                    {/* Milestone 1: 2011 */}
                    <div className="relative group transition-all duration-300">
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-white dark:border-[#080c14] group-hover:scale-125 transition-transform" />
                      <div className="bg-white/40 dark:bg-[#162741]/20 backdrop-blur-sm p-5 rounded-2xl border border-gray-150 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                        <span className="inline-block px-3 py-1 mb-2 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">Tahun 2011</span>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white font-heading">Langkah Awal Perintisan</h3>
                        <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                          Sejarah berdirinya HMTI dimulai pada tahun 2011 di bawah naungan Teknik Elektro, sebagai fondasi awal bagi mahasiswa Teknik Informatika.
                        </p>
                      </div>
                    </div>

                    {/* Milestone 2: 2014 */}
                    <div className="relative group transition-all duration-300">
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white dark:border-[#080c14] group-hover:scale-125 transition-transform" />
                      <div className="bg-white/40 dark:bg-[#162741]/20 backdrop-blur-sm p-5 rounded-2xl border border-gray-150 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                        <span className="inline-block px-3 py-1 mb-2 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">14 Juni 2014</span>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white font-heading">Peresmian & Pelantikan Resmi</h3>
                        <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                          HMTI secara resmi berdiri mandiri melalui proses pelantikan, rapat kerja, dan musyawarah besar pertama yang dihadiri oleh Angkatan 2011, 2012, dan 2013.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex items-center justify-center" data-aos="fade-left">
                  {/* Direct logo image with drop shadow */}
                  <div className="relative p-8 md:p-12 flex justify-center items-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-indigo-600/5 dark:from-blue-600/10 dark:to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
                    <img
                      src="/assets/img/logoHmti.png"
                      alt="Logo HMTI"
                      className="w-4/5 md:w-3/4 max-w-[280px] h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(18,107,241,0.2)] dark:drop-shadow-[0_15px_30px_rgba(59,130,246,0.35)]"
                    />
                  </div>
                </div>
              </div>

              {/* Filosofi Logo Section with Direct Cards Grid */}
              <div className="my-20 border-t border-gray-150 dark:border-gray-800/50 pt-16">
                <div className="text-center mb-12" data-aos="fade-up">
                  <h2 className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 font-heading">
                    FILOSOFI LOGO HMTI
                  </h2>
                  <p className="text-gray-550 dark:text-gray-400 text-sm md:text-base max-w-xl mx-auto mt-3 leading-relaxed">
                    Setiap elemen pada lambang HMTI memiliki makna filosofis mendalam yang melambangkan identitas dan pilar keilmuan kami.
                  </p>
                </div>

                <div className="flex flex-col gap-12 w-full">
                  {/* Card 1: Segitiga (Text Left, Symbol Right) */}
                  <div 
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8 group" 
                    data-aos="fade-up"
                  >
                    <div className="col-span-12 lg:col-span-8 lg:order-1 flex flex-col gap-3">
                      <h4 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white font-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        Segitiga
                      </h4>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                        Bentuk segitiga melambangkan keselarasan unsur alam semesta yang terdiri dari tiga pilar penting: Tuhan, Manusia, Alam; Ayah, Ibu, Anak; dan Guru, Buku, Siswa.
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-justify pt-2 border-t border-gray-100 dark:border-gray-800/40">
                        Ini merepresentasikan perjuangan bersama dari bawah dengan satu tujuan. Konstruksi segitiga sangat kokoh, jika dibalik pun bentuk kokohnya tetap sama.
                      </p>
                    </div>
                    <div className="col-span-12 lg:col-span-4 lg:order-2 flex justify-center items-center">
                      <div className="w-40 h-40 lg:w-[250px] lg:h-[250px] flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 transition-transform duration-500 group-hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Bola Bumi (Symbol Left, Text Right) */}
                  <div 
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8 group" 
                    data-aos="fade-up" 
                    data-aos-delay="100"
                  >
                    <div className="col-span-12 lg:col-span-4 lg:order-1 flex justify-center items-center">
                      <div className="w-40 h-40 lg:w-[250px] lg:h-[250px] flex items-center justify-center text-teal-600 dark:text-teal-400 flex-shrink-0 transition-transform duration-500 group-hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"/>
                          <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17"/>
                          <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"/>
                          <circle cx="12" cy="12" r="10"/>
                        </svg>
                      </div>
                    </div>
                    <div className="col-span-12 lg:col-span-8 lg:order-2 flex flex-col gap-3">
                      <h4 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white font-heading group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-200">
                        Bola Bumi
                      </h4>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                        Bola bumi mengartikan bahwa dunia Teknologi Informasi (IT) memiliki fungsi global tanpa batas geografis yang menghubungkan semua lini kehidupan secara digital.
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-justify pt-2 border-t border-gray-100 dark:border-gray-800/40">
                        Bola Bumi juga menyimbolkan HMTI sebagai tempat inklusif bagi mahasiswa untuk menyerap dan membagikan wawasan di era digitalisasi global.
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Tower & Gelombang Jaringan (Text Left, Symbol Right) */}
                  <div 
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8 group" 
                    data-aos="fade-up" 
                    data-aos-delay="200"
                  >
                    <div className="col-span-12 lg:col-span-8 lg:order-1 flex flex-col gap-3">
                      <h4 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white font-heading group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                        Tower & Gelombang Jaringan
                      </h4>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                        Tower sinyal dan gelombang nirkabel melambangkan salah satu bidang konsentrasi utama Informatika yaitu teknologi jaringan, transmisi data, dan sistem server.
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-justify pt-2 border-t border-gray-100 dark:border-gray-800/40">
                        Gelombang diposisikan bersamaan dengan tower sebagai lambang sinergi pemancar sinyal informasi digital yang terus mengalir dinamis tanpa batas ruang.
                      </p>
                    </div>
                    <div className="col-span-12 lg:col-span-4 lg:order-2 flex justify-center items-center">
                      <div className="w-40 h-40 lg:w-[250px] lg:h-[250px] flex items-center justify-center gap-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 transition-transform duration-500 group-hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" width="105" height="105" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5">
                          <path d="M4.9 16.1C1 12.2 1 5.8 4.9 1.9"/>
                          <path d="M7.8 4.7a6.14 6.14 0 0 0-.8 7.5"/>
                          <circle cx="12" cy="9" r="2"/>
                          <path d="M16.2 4.8c2 2 2.26 5.11.8 7.47"/>
                          <path d="M19.1 1.9a9.96 9.96 0 0 1 0 14.1"/>
                          <path d="M9.5 18h5"/>
                          <path d="m8 22 4-11 4 11"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-80 transition-transform duration-300 group-hover:translate-y-0.5">
                          <path d="M2 12q2.5 2 5 0t5 0 5 0 5 0 5 0"/>
                          <path d="M2 19q2.5 2 5 0t5 0 5 0 5 0 5 0"/>
                          <path d="M2 5q2.5 2 5 0t5 0 5 0 5 0 5 0"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: PC / Komputer (Symbol Left, Text Right) */}
                  <div 
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8 group" 
                    data-aos="fade-up" 
                    data-aos-delay="300"
                  >
                    <div className="col-span-12 lg:col-span-4 lg:order-1 flex justify-center items-center">
                      <div className="w-40 h-40 lg:w-[250px] lg:h-[250px] flex items-center justify-center text-pink-600 dark:text-pink-400 flex-shrink-0 transition-transform duration-500 group-hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="14" height="8" x="5" y="2" rx="2"/>
                          <rect width="20" height="8" x="2" y="14" rx="2"/>
                          <path d="M6 18h2"/>
                          <path d="M12 18h6"/>
                        </svg>
                      </div>
                    </div>
                    <div className="col-span-12 lg:col-span-8 lg:order-2 flex flex-col gap-3">
                      <h4 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white font-heading group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-200">
                        PC / Komputer
                      </h4>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                        Simbol PC/Komputer secara eksplisit menunjukkan orientasi aktivitas akademis maupun praktis di program studi Teknik Informatika.
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-justify pt-2 border-t border-gray-100 dark:border-gray-800/40">
                        Ini melambangkan alat kerja utama mahasiswa Informatika dalam berkreasi, memecahkan masalah, melakukan riset, dan melahirkan inovasi teknologi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filosofi Warna Section with Palette Hover Synced Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 my-20 items-center border-t border-gray-150 dark:border-gray-800/50 pt-16">
                
                {/* Left Side: Dynamic Color Meanings */}
                <div className="lg:col-span-7 flex flex-col justify-center h-full min-h-[250px]" data-aos="fade-right">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-600 dark:text-blue-400 font-heading">
                    FILOSOFI WARNA
                  </h2>
                  <div className="bg-white/60 dark:bg-[#162741]/20 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-gray-150 dark:border-white/5 shadow-md space-y-4 transition-all duration-300">
                    
                    {/* Biru Detail */}
                    <div className={`p-4 rounded-2xl border transition-all duration-300 ${
                      hoveredWarna === "biru" 
                        ? "bg-blue-500/10 border-blue-500 shadow-sm scale-101" 
                        : "bg-transparent border-transparent opacity-60"
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#126BF1] border-2 border-white dark:border-[#080c14]" />
                        <h4 className="font-bold text-slate-800 dark:text-white font-heading">Warna Biru (Identitas Kelautan)</h4>
                      </div>
                      <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-350 leading-relaxed text-justify">
                        Warna biru dipilih karena daerah Maluku Utara merupakan daerah kepulauan yang secara geografis sangat didominasi oleh perairan laut.
                      </p>
                    </div>

                    {/* Hitam Detail */}
                    <div className={`p-4 rounded-2xl border transition-all duration-300 ${
                      hoveredWarna === "hitam" 
                        ? "bg-slate-800/10 border-slate-700 shadow-sm scale-101 dark:bg-slate-800/30" 
                        : "bg-transparent border-transparent opacity-60"
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#080C14] border-2 border-white dark:border-[#080c14]" />
                        <h4 className="font-bold text-slate-800 dark:text-white font-heading">Warna Hitam (Kekuatan & Kebijaksanaan)</h4>
                      </div>
                      <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-350 leading-relaxed text-justify">
                        Merupakan simbol kekuatan pendirian, ketahanan, dan kebijaksanaan tinggi dalam mengambil keputusan. Ini adalah karakter utama yang diharapkan terpatri dalam jiwa mahasiswa Teknik.
                      </p>
                    </div>

                    {/* Putih Detail */}
                    <div className={`p-4 rounded-2xl border transition-all duration-300 ${
                      hoveredWarna === "putih" 
                        ? "bg-slate-100 border-gray-300 shadow-sm scale-101 dark:bg-white/5 dark:border-white/10" 
                        : "bg-transparent border-transparent opacity-60"
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#FFFFFF] border-2 border-gray-300 dark:border-[#080c14]" />
                        <h4 className="font-bold text-slate-800 dark:text-white font-heading">Warna Putih (Kesederhanaan & Kebersihan)</h4>
                      </div>
                      <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-350 leading-relaxed text-justify">
                        Merupakan simbol kebersihan niat, integritas etika yang jujur, serta kesederhanaan bersosialisasi di tengah masyarakat.
                      </p>
                    </div>

                  </div>
                </div>
                
                {/* Right Side: Interactive Palette Widget */}
                <div 
                  onMouseEnter={() => setIsHoveredPalette(true)}
                  onMouseLeave={() => setIsHoveredPalette(false)}
                  className="lg:col-span-5 flex flex-col justify-center items-center gap-3" 
                  data-aos="fade-left"
                >
                  <div className="w-[350px] h-[200px] rounded-2xl overflow-hidden shadow-xl border border-gray-200/50 dark:border-gray-800/80 bg-white dark:bg-[#1a2333] transition-all duration-300 hover:shadow-2xl">
                    <div className="flex h-[86%] w-full">
                      {/* Biru */}
                      <button
                        onMouseEnter={() => setHoveredWarna("biru")}
                        onClick={() => setHoveredWarna("biru")}
                        className={`h-full flex-1 transition-all duration-300 flex items-center justify-center bg-[#126BF1] group cursor-pointer ${
                          hoveredWarna === "biru" ? "flex-[2.5]" : ""
                        }`}
                      >
                        <span className={`transition-opacity duration-300 text-white font-bold text-xs tracking-wider ${
                          hoveredWarna === "biru" ? "opacity-100" : "opacity-0"
                        }`}>#126BF1</span>
                      </button>
                      
                      {/* Hitam */}
                      <button
                        onMouseEnter={() => setHoveredWarna("hitam")}
                        onClick={() => setHoveredWarna("hitam")}
                        className={`h-full flex-1 transition-all duration-300 flex items-center justify-center bg-[#080C14] group cursor-pointer ${
                          hoveredWarna === "hitam" ? "flex-[2.5]" : ""
                        }`}
                      >
                        <span className={`transition-opacity duration-300 text-white font-bold text-xs tracking-wider ${
                          hoveredWarna === "hitam" ? "opacity-100" : "opacity-0"
                        }`}>#080C14</span>
                      </button>

                      {/* Putih */}
                      <button
                        onMouseEnter={() => setHoveredWarna("putih")}
                        onClick={() => setHoveredWarna("putih")}
                        className={`h-full flex-1 transition-all duration-300 flex items-center justify-center bg-[#FFFFFF] group cursor-pointer border-l border-gray-200/10 ${
                          hoveredWarna === "putih" ? "flex-[2.5]" : ""
                        }`}
                      >
                        <span className={`transition-opacity duration-300 text-slate-800 font-bold text-xs tracking-wider ${
                          hoveredWarna === "putih" ? "opacity-100" : "opacity-0"
                        }`}>#FFFFFF</span>
                      </button>
                    </div>
                    <div className="h-[14%] w-full bg-white dark:bg-[#111926] flex items-center justify-between px-6 text-gray-400 dark:text-gray-500 text-xs font-semibold">
                      <span>Sorot warna untuk melihat maknanya</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="opacity-70" viewBox="0 0 16 16">
                        <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1A5 5 0 1 0 8 3a5 5 0 0 0 0 10z"/>
                      </svg>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 animate-pulse text-center">
                    Sorot kursor (hover) di atas bar warna untuk menyeleksi
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}



      {activeTab === "struktur" && (
        <div className="flex flex-col overflow-hidden px-4 w-full">
          {loadingStruktur ? (
            <div className="w-full py-16">
              <BounceLoading />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full min-w-0 overflow-hidden">
            <div className="w-full flex flex-col justify-center items-center py-6 mb-4">
              {/* Highlight Header */}
              <HeaderStruktur id="main-title" title="STRUKTUR PENGURUS ORGANISASI" />

              {/* Subtitle & Periode */}
              <div className="flex flex-col items-center text-center -mt-2" data-aos="fade-up">
                <h2 className="text-sm sm:text-base md:text-xl font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest px-4">
                  Himpunan Mahasiswa Teknik Informatika
                </h2>
                <p className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-dark-blue dark:text-white">
                  Periode {pengurus?.periode || "2024/2025"}
                </p>
              </div>
            </div>
              <div className="flex justify-center gap-4 sm:gap-6 lg:gap-14 w-full max-w-full px-2 sm:px-6 flex-wrap sm:flex-nowrap">
                <CardPengurus
                  id="bendahara-umum"
                  title="Bendahara Umum"
                  nama={pengurus?.bendum?.nama}
                  image={pengurus?.bendum?.foto ? `${BASE_API_URL}/storage/${pengurus.bendum.foto}` : null}
                  className="mt-8 sm:mt-12 lg:mt-16"
                />
                <CardPengurus
                  id="ketua-umum"
                  title="Ketua Umum"
                  nama={pengurus?.ketum?.nama}
                  image={pengurus?.ketum?.foto ? `${BASE_API_URL}/storage/${pengurus.ketum.foto}` : null}
                />
                <CardPengurus
                  id="sekertaris-umum"
                  title="Sekertaris Umum"
                  nama={pengurus?.sekum?.nama}
                  image={pengurus?.sekum?.foto ? `${BASE_API_URL}/storage/${pengurus.sekum.foto}` : null}
                  className="mt-8 sm:mt-12 lg:mt-16"
                />
              </div>

              {/* Render Bidang PAO (Full Width) */}
              {pado && (
                <div className="w-full flex flex-col items-center mt-12 px-2 sm:px-6">
                  <HeaderStruktur
                    id={stringDash(stringTanpaKurung(pado.nama_bidang).toLowerCase())}
                    title={stringTanpaKurung(pado.nama_bidang).toUpperCase()}
                  />
                  <BidangPengurus>
                    <CardPengurus
                      title="Ketua Bidang"
                      nama={pado.kabid?.nama}
                      image={pado.kabid?.foto ? `${BASE_API_URL}/storage/${pado.kabid.foto}` : null}
                    />
                    <CardPengurus
                      title="Sekertaris Bidang"
                      nama={pado.sekbid?.nama}
                      image={pado.sekbid?.foto ? `${BASE_API_URL}/storage/${pado.sekbid.foto}` : null}
                      className="mt-8 sm:mt-12 lg:mt-16"
                    />
                  </BidangPengurus>

                  {/* Render Divisi di bawah PAO (Foto Kadiv, Teks Anggota) */}
                  {pado.divisi && pado.divisi.length > 0 && (
                    <div className="w-full max-w-4xl flex flex-wrap justify-center gap-8 mt-12 border-t border-gray-200/50 dark:border-gray-800/50 pt-8">
                      {pado.divisi.map((div, dIdx) => (
                        <div key={dIdx} className="flex flex-col items-center p-6 bg-white/50 dark:bg-dark-blue/30 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md w-[280px]">
                          <h4 className="text-center font-bold text-sm text-blue-600 dark:text-blue-400 border-b border-gray-100 dark:border-gray-800 w-full pb-2 mb-4">
                            {div.nama_divisi}
                          </h4>
                          {div.kadiv && (
                            <CardPengurus
                              title="Ketua Divisi"
                              nama={div.kadiv.nama}
                              image={div.kadiv.foto ? `${BASE_API_URL}/storage/${div.kadiv.foto}` : null}
                            />
                          )}
                          {div.anggota && div.anggota.length > 0 && (
                            <div className="text-center mt-3">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                                Anggota
                              </span>
                              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium px-2 leading-relaxed">
                                {div.anggota.map((m) => m.nama).join(", ")}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Render Bidang Lainnya (Horizontal Scroll) */}
              {otherBidang.length > 0 && (
                <div className="w-full flex flex-col items-center mt-10 px-2 md:px-6 overflow-hidden">
                  {/* Custom Marquee Wrapper */}
                  <div className="marquee-container w-full py-4">
                    <div className="marquee-track gap-6">
                      {otherBidang.map((bidang, index) => renderBidangCard(bidang, index, "first"))}
                      {otherBidang.map((bidang, index) => renderBidangCard(bidang, index, "second"))}
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="flex justify-center gap-2 mt-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500 animate-pulse">
                      Sorot kursor untuk menghentikan gerakan
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<BounceLoading />}>
      <ProfileContent />
    </Suspense>
  );
}
