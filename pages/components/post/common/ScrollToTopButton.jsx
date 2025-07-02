'use client';

import { useEffect, useState } from 'react';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  const buttonStyle = {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    width: '3.25rem',
    height: '3.25rem',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #007cf0, #00dfd8)',
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    zIndex: 999,
  };

  return (
    <button
      onClick={scrollToTop}
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)';
      }}
      aria-label="Scroll to top"
      title="Back to top"
    >
      ↑
    </button>
  );
}