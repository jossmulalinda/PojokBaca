'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer/Footer';
import ScrollToTopButton from '@/components/ScrollToTop';

// ── Network Status Toast ──────────────────────────────────────────────────────
function NetworkToast() {
  const [status, setStatus] = useState(null); // null | 'online' | 'offline'

  useEffect(() => {
    const handleOnline = () => {
      setStatus('online');
      setTimeout(() => setStatus(null), 3000);
    };
    const handleOffline = () => setStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show offline immediately if already offline on mount
    if (!navigator.onLine) setStatus('offline');

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!status) return null;

  const isOnline = status === 'online';

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 18px',
        borderRadius: '14px',
        boxShadow: isOnline
          ? '0 8px 24px rgba(16,185,129,0.25)'
          : '0 8px 24px rgba(239,68,68,0.25)',
        background: isOnline
          ? 'linear-gradient(135deg, #059669, #10b981)'
          : 'linear-gradient(135deg, #dc2626, #ef4444)',
        color: '#fff',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontWeight: 600,
        fontSize: '13px',
        animation: 'toastSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
        minWidth: '200px',
      }}
    >
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <svg
        width="18" height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        {isOnline ? (
          <>
            <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
            <circle cx="12" cy="20" r="1" fill="currentColor"/>
          </>
        ) : (
          <>
            <line x1="1" y1="1" x2="23" y2="23"/>
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
            <path d="M10.71 5.05A16 16 0 0 1 22.56 9"/>
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
            <circle cx="12" cy="20" r="1" fill="currentColor"/>
          </>
        )}
      </svg>
      <span>{isOnline ? 'Koneksi kembali online' : 'Anda sedang offline'}</span>
    </div>
  );
}

// ── Layout Wrapper ─────────────────────────────────────────────────────────────
export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <div className="flex-grow">{children}</div>;
  }

  const isHome = pathname === '/';
  const isNewsHome = pathname === '/berita';
  const noPadding = isHome || isNewsHome;

  return (
    <>
      <Navbar isHome={noPadding} />
      {/* Global network status toast */}
      <NetworkToast />
      {/* Ambient background glows for dark mode */}
      <div className="hidden dark:block pointer-events-none fixed inset-0 z-[-10] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-indigo-600/10 blur-[130px]" />
      </div>
      {/* Render layout conditionally */}
      {pathname === "/" || pathname === "/berita" ? (
        <div className={`w-full flex-grow relative bg-[#FAF9F6] dark:bg-[#080c14] transition-colors duration-300 ${noPadding ? '' : 'md:pt-[72px]'}`}>
          {children}
        </div>
      ) : (
        <div className="w-full flex-grow flex justify-center bg-[#FAF9F6] dark:bg-[#080c14] transition-colors duration-300">
          <div className={`w-full max-w-7xl px-4 md:px-8 relative ${noPadding ? '' : 'md:pt-[72px]'}`}>
            {children}
          </div>
        </div>
      )}
      <ScrollToTopButton />
      <Footer />
    </>
  );
}
