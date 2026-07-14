'use client';

import Link from 'next/link';
import Image from 'next/image';
import LogoHmti from '@/public/assets/img/logoHmti.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-600 dark:bg-dark-blue overflow-hidden md:py-0 py-20 transition-colors duration-300">
      <div className="mx-auto w-full max-w-screen-xl px-10 lg:py-10">
        <div className="flex flex-col md:flex-row md:justify-between items-start text-left gap-10 md:gap-0">
          {/* Logo & Sosmed */}
          <div className="mb-8 md:mb-0 flex flex-col items-center md:items-start w-full md:w-auto">
            <div className="flex flex-col md:flex-row items-center gap-3.5 text-center md:text-left mb-4">
              <Image 
                src={LogoHmti} 
                className="h-14 w-auto object-contain flex-shrink-0" 
                alt="Logo HMTI" 
                height={56} 
                width={56} 
              />
              <div className="text-white font-heading">
                <h3 className="text-sm font-black uppercase tracking-wider leading-snug">
                  Himpunan Mahasiswa <br className="hidden md:block" /> Teknik Informatika
                </h3>
                <p className="text-[10.5px] font-bold text-blue-100 uppercase tracking-widest mt-0.5 flex items-center justify-center md:justify-start gap-1.5">
                  <span className="opacity-60">_</span> <span>Universitas Khairun</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center md:justify-start gap-3.5 pt-4 w-full">
              <a href="https://www.instagram.com/hmti_unkhair" target="_blank" rel="noopener noreferrer" className="text-white hover:scale-115 transition-transform">
                <svg className="w-5.5 h-5.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="https://www.facebook.com/share/tY5yzZb1U55xiAMq/" target="_blank" rel="noopener noreferrer" className="text-white hover:scale-115 transition-transform">
                <svg className="w-5.5 h-5.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@hmti_unkhair" target="_blank" rel="noopener noreferrer" className="text-white hover:scale-115 transition-transform">
                <svg className="w-5.5 h-5.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@hmti_unkhair" target="_blank" rel="noopener noreferrer" className="text-white hover:scale-115 transition-transform">
                <svg className="w-5.5 h-5.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.108C19.53 3.53 12 3.53 12 3.53s-7.53 0-9.388.525a3.003 3.003 0 00-2.11 2.108C0 8.018 0 12 0 12s0 3.982.502 5.837a3.003 3.003 0 002.11 2.108C4.47 20.47 12 20.47 12 20.47s7.53 0 9.388-.525a3.002 3.002 0 002.11-2.108C24 15.982 24 12 24 12s0-3.982-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
            <div className="text-white py-4 text-xs font-semibold tracking-wide opacity-90 text-center md:text-left w-full">
              hmtiunkhairternate@gmail.com
            </div>
          </div>
 
          {/* Links */}
          <div className="flex flex-col md:flex-row items-start text-left justify-start gap-8 sm:gap-16 md:w-2/4 w-full">
            <div className="flex flex-col items-start">
              <h2 className="mb-4 text-md font-semibold text-white uppercase tracking-wider">tautan</h2>
              <ul className="text-white font-medium text-left">
                <li className="mb-3.5"><Link href="/berita" className="hover:underline">Berita Terbaru</Link></li>
                <li className="mb-3.5"><Link href="/galery" className="hover:underline">Arsip Galeri</Link></li>
                <li className="mb-3.5"><Link href="/projects" className="hover:underline">Hasil Karya</Link></li>
                <li className="mb-3.5"><Link href="/admin/login" className="hover:underline text-blue-200 hover:text-white">Panel Admin</Link></li>
              </ul>
            </div>
            <div className="flex flex-col items-start">
              <h2 className="mb-4 text-md font-semibold uppercase text-white tracking-wider">Organisasi</h2>
              <ul className="text-white font-medium text-left">
                <li className="mb-3.5"><Link href="/profile?tab=biografi" className="hover:underline">Sejarah Singkat HMTI</Link></li>
                <li className="mb-3.5"><Link href="/profile?tab=struktur" className="hover:underline">Struktur Organisasi</Link></li>
              </ul>
            </div>
            <div className="flex flex-col items-start">
              <h2 className="mb-4 text-md font-semibold uppercase text-white tracking-wider">Events</h2>
              <ul className="text-white font-medium text-left">
                <li className="mb-3.5"><Link href="/event" className="hover:underline">IT EXPO</Link></li>
                <li className="mb-3.5"><Link href="/event" className="hover:underline">March Event</Link></li>
                <li className="mb-3.5"><Link href="/event" className="hover:underline">Dies Natalis</Link></li>
              </ul>
            </div>
          </div>
 
          {/* Alamat */}
          <div className="flex flex-col items-start mt-6 md:mt-0 md:w-1/4 text-left w-full">
            <h2 className="mb-4 text-md font-semibold uppercase text-white tracking-wider">Alamat Sekretariat</h2>
            <span className="text-white leading-relaxed text-left text-sm md:text-base">
              Jl. Jati Metro, Jati, Kec. <br /> Ternate Sel., Kota Ternate, <br /> Maluku Utara
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center sm:flex sm:items-center sm:justify-between mt-5">
          <span className="text-sm text-white text-center">
            Copyright © <a href="https://hmti.unkhair.ac.id" className="hover:underline">{currentYear} Himpunan Mahasiswa Teknik Informatika</a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
