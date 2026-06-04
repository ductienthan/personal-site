'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface NavProps {
  activePage?: 'home' | 'blog';
}

export default function Nav({ activePage = 'home' }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = activePage === 'home';

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <Link href="/" className="nav-logo">
        <span className="dot" />
        DUC&nbsp;THAN <small>// SWE</small>
      </Link>
      <button
        className="nav-toggle"
        aria-label="menu"
        onClick={() => setMenuOpen(o => !o)}
      >
        {menuOpen ? 'CLOSE' : 'MENU'}
      </button>
      <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
        <li><a href={isHome ? '#about' : '/#about'}>About</a></li>
        <li><a href={isHome ? '#skills' : '/#skills'}>Skills</a></li>
        <li><a href={isHome ? '#experience' : '/#experience'}>Experience</a></li>
        <li><a href={isHome ? '#projects' : '/#projects'}>Projects</a></li>
        <li>
          <Link href="/blog" className={activePage === 'blog' ? 'active' : ''}>
            Journal {activePage !== 'blog' && '↗'}
          </Link>
        </li>
        <li><a href={isHome ? '#contact' : '/#contact'}>Contact</a></li>
      </ul>
    </nav>
  );
}
