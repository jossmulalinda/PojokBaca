'use client';

import { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  function setDark() {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    localStorage.setItem('theme', 'dark');
    setIsDark(true);
  }

  function setLight() {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    setIsDark(false);
  }

  function toggleMode() {
    isDark ? setLight() : setDark();
  }

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      setDark();
    } else {
      setLight();
    }
  }, []);

  return (
    <button
      onClick={toggleMode}
      aria-label="Toggle dark mode"
      className={`
        relative flex items-center gap-1 p-1 rounded-full
        transition-all duration-300 ease-in-out
        ${isDark
          ? 'bg-[#1e3a8a] shadow-[0_0_12px_rgba(59,130,246,0.4)]'
          : 'bg-slate-200/80 shadow-inner'
        }
      `}
      style={{ width: '68px', height: '34px' }}
    >
      {/* Track */}
      {/* Sliding Pill Indicator */}
      <span
        className={`
          absolute top-[3px] w-7 h-7 rounded-full flex items-center justify-center
          transition-all duration-400 ease-in-out shadow-md
          ${isDark
            ? 'translate-x-[36px] bg-white/15 backdrop-blur-sm border border-white/20'
            : 'translate-x-[2px] bg-white shadow-sm'
          }
        `}
      >
        {isDark ? (
          // Moon icon
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-blue-200">
            <path
              d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
              fill="currentColor"
            />
          </svg>
        ) : (
          // Sun icon
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-amber-500">
            <circle cx="12" cy="12" r="5" fill="currentColor"/>
            <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </span>

      {/* Opposite icon (dimmed) */}
      <span
        className={`
          absolute flex items-center justify-center w-7 h-7 rounded-full
          transition-all duration-400 ease-in-out
          ${isDark ? 'left-[3px] opacity-50' : 'right-[3px] opacity-40'}
        `}
      >
        {isDark ? (
          // Sun (dimmed) on left when dark
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-slate-300">
            <circle cx="12" cy="12" r="5" fill="currentColor"/>
            <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          // Moon (dimmed) on right when light
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-slate-400">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/>
          </svg>
        )}
      </span>
    </button>
  );
};

export default DarkModeToggle;
