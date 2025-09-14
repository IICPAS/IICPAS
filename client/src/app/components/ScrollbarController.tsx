"use client";

import { useEffect } from 'react';

const ScrollbarController = () => {
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (!footer) return;

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if footer is visible (when it starts appearing on screen)
      const isFooterVisible = footerRect.top < windowHeight;
      
      if (isFooterVisible) {
        // Footer is visible, apply dark theme
        document.documentElement.classList.add('scrollbar-dark');
        document.documentElement.classList.remove('scrollbar-light');
      } else {
        // Footer is not visible, apply light theme
        document.documentElement.classList.add('scrollbar-light');
        document.documentElement.classList.remove('scrollbar-dark');
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ScrollbarController;
