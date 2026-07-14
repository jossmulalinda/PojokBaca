'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { 
    to: '/', 
    icon: (
      <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 12V8.964"/>
        <path d="M14 12V8.964"/>
        <path d="M15 12a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1z"/>
        <path d="M8.5 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-2"/>
      </svg>
    ), 
    label: 'Beranda', 
    mobileLabel: 'Beranda', 
    exact: true 
  },
  { 
    to: '/profile', 
    icon: (
      <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 21a8 8 0 0 0-16 0"/>
        <circle cx="10" cy="8" r="5"/>
        <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>
      </svg>
    ), 
    label: 'Profil', 
    mobileLabel: 'Profil' 
  },
  { 
    to: '/event', 
    icon: (
      <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v2"/>
        <path d="M15.726 21.01A2 2 0 0 1 14 22H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2"/>
        <path d="M18 2v2"/>
        <path d="M2 13h2"/>
        <path d="M8 8h14"/>
        <rect x="8" y="3" width="14" height="14" rx="2"/>
      </svg>
    ), 
    label: 'Event', 
    mobileLabel: 'Event' 
  },
  { 
    to: '/berita', 
    icon: (
      <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18h-5"/>
        <path d="M18 14h-8"/>
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"/>
        <rect width="8" height="4" x="10" y="6" rx="1"/>
      </svg>
    ), 
    label: 'Berita', 
    mobileLabel: 'Berita' 
  },
  { 
    to: '/galery', 
    icon: (
      <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16"/>
        <path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2"/>
        <circle cx="13" cy="7" r="1" fill="currentColor"/>
        <rect x="8" y="2" width="14" height="14" rx="2"/>
      </svg>
    ), 
    label: 'Galeri', 
    mobileLabel: 'Galeri' 
  },
  { 
    to: '/projects', 
    icon: (
      <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 19a5 5 0 0 1-5-5v8"/>
        <path d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5"/>
        <circle cx="13" cy="12" r="2"/>
        <circle cx="20" cy="19" r="2"/>
      </svg>
    ), 
    label: 'Projects', 
    mobileLabel: 'Projects' 
  },
  { 
    to: '/contact', 
    icon: (
      <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 2v2"/>
        <path d="M17.915 22a6 6 0 0 0-12 0"/>
        <path d="M8 2v2"/>
        <circle cx="12" cy="12" r="4"/>
        <rect x="3" y="4" width="18" height="18" rx="2"/>
      </svg>
    ), 
    label: 'Kontak Kami', 
    mobileLabel: 'Kontak' 
  },
];

const NavList = ({ showIcons = true }) => {
  const pathname = usePathname();

  return (
    <>
      {navItems.map(({ to, icon, label, mobileLabel, exact }) => {
        const isActive = exact ? pathname === to : pathname.startsWith(to.split('/').slice(0, 2).join('/'));
        const galeriActive = (label === 'Galeri') && pathname.startsWith('/galery');
        const active = (label === 'Galeri') ? galeriActive : isActive;

        if (!showIcons) {
          // Desktop mode: text only, list item format
          return (
            <li key={to} className="flex flex-col justify-center items-center relative py-1 group">
              <Link
                href={to}
                className={`hover:text-good-blue transition-colors duration-200 relative pb-1.5 ${
                  active ? 'text-good-blue font-semibold' : 'text-dark-blue dark:text-white/80'
                }`}
              >
                {label}
              </Link>
              {/* Elegant horizontal underline indicator */}
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-good-blue rounded transition-all duration-300 origin-center transform ${
                active ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-75'
              }`} />
            </li>
          );
        }

        // Mobile mode: icons only (or with text if on large screens)
        return (
          <div key={to} className="flex justify-center items-center">
            <Link
              href={to}
              className={`flex flex-col items-center hover:text-good-blue transition-colors ${
                active ? 'text-good-blue text-2xl' : 'text-dark-blue dark:text-white/80'
              }`}
            >
              {icon}
              <span className="hidden lg:inline text-sm mt-0.5">{mobileLabel}</span>
            </Link>
          </div>
        );
      })}
    </>
  );
};

export default NavList;
