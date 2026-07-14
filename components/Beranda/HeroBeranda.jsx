import React from "react";
import Link from "next/link";
import ShapeGrid from "./ShapeGrid";
import TextType from "./TextType";

const HeroBeranda = () => {
  return (
    <div className="relative w-full lg:min-h-screen overflow-hidden flex items-center justify-center">
      {/* ShapeGrid Interactive Background */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-40">
        <ShapeGrid
          speed={0.1}
          squareSize={41}
          direction="diagonal"
          borderColor="#48464c"
          hoverFillColor="#2699eb"
          shape="hexagon"
          hoverTrailAmount={0}
        />
      </div>

      <div className="relative z-10 w-full lg:w-1/2 px-6 py-5 lg:pt-36 lg:pb-16 lg:pl-40 flex lg:justify-start justify-center items-start">
        <div
          data-aos="fade-right"
          className="flex flex-col gap-5 w-full h-auto"
        >
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] text-slate-900 dark:text-white flex flex-col gap-1">
            <span>Himpunan</span>
            <span>Mahasiswa Teknik</span>
            <span>Informatika</span>
            
            {/* Warna dan font-bold dihapus karena sudah diatur di h1 dan TextType */}
            <span className="block min-h-[3rem] lg:min-h-[4.5rem] whitespace-nowrap">
              <TextType
                text={["Informatika Tetap Satu !"]}
                typingSpeed={80}
                deletingSpeed={40}
                pauseDuration={2500}
                showCursor={true}
                cursorCharacter="|"
                className="inline text-3xl md:text-5xl bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent !whitespace-nowrap"
              />
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-[90%] font-bold">
            Kenali Kami Lebih Jauh.
          </p>
          <div className="flex gap-4 pt-3 z-10">
            {/* Button Gassken! (Redirect to profile?tab=biografi) */}
            <Link
              href="/profile?tab=biografi"
              className="w-[145px] h-[51px] rounded-[15px] p-[2px] transition-all duration-300 bg-good-blue/20 bg-gradient-to-br from-good-blue to-transparent hover:bg-good-blue/70 hover:shadow-[0_0_15px_rgba(18,107,241,0.5)] focus:outline-none flex items-center justify-center cursor-pointer"
            >
              <div className="w-full h-full rounded-[13px] bg-good-blue flex items-center justify-center gap-2 text-white font-semibold text-sm">
                <svg className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z" />
                </svg>
                <span>Gassken!</span>
              </div>
            </Link>

            {/* Button News HMTI (Redirect to /berita/kategori/semua-berita) */}
            <Link
              href="/berita/kategori/semua-berita"
              className="w-[145px] h-[51px] rounded-[15px] p-[2px] transition-all duration-300 bg-good-blue/20 bg-gradient-to-br from-good-blue to-transparent hover:bg-good-blue/70 hover:shadow-[0_0_15px_rgba(18,107,241,0.5)] focus:outline-none flex items-center justify-center cursor-pointer"
            >
              <div className="w-full h-full rounded-[13px] bg-white dark:bg-[#162741] flex items-center justify-center gap-2 text-good-blue dark:text-blue-400 font-semibold text-sm">
                <svg className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 14H5V6h14v12zm-3-10H7v2h9V8zm0 4H7v2h9v-2zm-5 4H7v2h4v-2z" />
                </svg>
                <span>HMTI News</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div
        data-aos="fade-left"
        className="relative z-10 w-full lg:w-1/2 py-12 lg:py-0 flex justify-center items-center"
      >
        <div className="relative w-full max-w-[450px] aspect-square flex justify-center items-center">
          {/* Background Image (GIF) */}
          <img
            src="/assets/img/backhero.gif"
            alt="Back Hero"
            className="absolute w-4/5 h-4/5 object-contain opacity-80 z-0"
          />

          {/* Logo Image */}
          <img
            src="/assets/img/hmti-logo.png"
            alt="Logo HMTI"
            className="w-1/2 lg:w-3/5 max-w-[280px] h-auto object-contain z-10 filter drop-shadow-[0_15px_30px_rgba(18,107,241,0.25)] dark:drop-shadow-[0_20px_40px_rgba(59,130,246,0.35)]"
          />
        </div>
      </div>

      {/* Bottom Fade Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#FAF9F6] to-transparent dark:from-[#080c14] dark:to-transparent pointer-events-none z-20" />
    </div>
  );
};

export default HeroBeranda;
