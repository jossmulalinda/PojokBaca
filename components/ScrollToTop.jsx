'use client';

import { useState, useEffect } from 'react';
import { HiArrowSmUp } from 'react-icons/hi';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 400);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bg-dark-blue dark:bg-white text-white dark:text-dark-blue p-1 rounded-full bottom-24 md:bottom-5 right-5 md:right-10 animate-slideup transition-all"
        >
          <HiArrowSmUp size={30} />
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
