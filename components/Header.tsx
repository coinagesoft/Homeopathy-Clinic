'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu whenever pathname changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="utility">
        <div className="container utility-inner">
          <span>Monday to Saturday, 9:00 AM to 6:00 PM</span>
          <a href="tel:+919876543210">+91 98765 43210</a>
        </div>
      </div>
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={closeMenu}>
          <strong>Dr. Aarav Mehta</strong>
          <small>Homeopathy Clinic, Pune</small>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="main-nav"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav
          id="main-nav"
          className={`main-nav ${isMenuOpen ? 'open' : ''}`}
          aria-label="Main"
        >
          <ul>
            <li>
              <Link
                href="/"
                className={pathname === '/' ? 'active' : ''}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={pathname === '/about' ? 'active' : ''}
                onClick={closeMenu}
              >
                About the doctor
              </Link>
            </li>
            <li>
              <Link href="/#treatments" onClick={closeMenu}>
                Treatments
              </Link>
            </li>
            <li>
              <Link
                href="/appointment"
                className={pathname === '/appointment' ? 'active' : ''}
                onClick={closeMenu}
              >
                Appointment
              </Link>
            </li>
            <li>
              <a href="#contact" onClick={closeMenu}>
                Contact
              </a>
            </li>
          </ul>
          <Link
            href="/appointment"
            className="btn btn-small"
            onClick={closeMenu}
          >
            Book an appointment
          </Link>
        </nav>
      </div>
    </header>
  );
}

