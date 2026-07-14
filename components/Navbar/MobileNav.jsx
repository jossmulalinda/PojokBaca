'use client';

import DarkModeToggle from './DarkModeToggle';
import NavList from './NavList';

const MobileNav = () => {
  return (
    <div className="fixed z-40 bottom-0 left-1/2 transform -translate-x-1/2 md:hidden w-11/12 h-16 bg-white dark:bg-dark-blue rounded-3xl shadow-lg py-1 px-2 transition-all duration-500 flex justify-center items-center mb-3">
      <nav className="flex justify-center items-center h-full w-full">
        <div className="flex justify-around w-full">
          <NavList />
          <DarkModeToggle />
        </div>
      </nav>
    </div>
  );
};

export default MobileNav;
