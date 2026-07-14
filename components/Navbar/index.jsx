'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LogoHmti from '@/public/assets/img/logoHmti.png';
import DarkModeToggle from './DarkModeToggle';
import MobileNav from './MobileNav';
import NavList from './NavList';

const Navbar = ({ isHome = false }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <header className="hidden md:block fixed top-0 left-0 w-full z-50">
        {/* Glass backdrop layer */}
        <div
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            scrolled
              ? 'bg-white/80 dark:bg-[#0d1829]/85 backdrop-blur-xl border-b border-white/20 dark:border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
              : 'bg-white/60 dark:bg-[#0d1829]/60 backdrop-blur-md border-b border-white/10 dark:border-white/5'
          }`}
        />

        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-good-blue/60 to-transparent" />

        {/* Content */}
        <div
          className={`relative flex justify-between items-center w-full transition-all duration-500 ease-in-out ${
            scrolled ? 'py-2.5 px-10 lg:px-28' : 'py-4 px-10 lg:px-28'
          }`}
        >
          <div className="flex lg:gap-20 gap-0 items-center w-full">
            <Link href="/" className="transition-transform hover:scale-105 duration-200 flex-shrink-0">
              <Image src={LogoHmti} alt="HMTI" className="w-10 h-auto drop-shadow-sm" width={40} height={40} />
            </Link>
            <nav className="flex justify-between items-center w-full">
              <ul className="flex gap-8 font-heading font-medium text-[15px] tracking-wide mx-auto">
                <NavList showIcons={false} />
              </ul>
              <DarkModeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </>
  );
};

export default Navbar;
