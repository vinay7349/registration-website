import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo">Fly High <span className="text-orange">League</span></div>
      <nav className="nav">
        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMenu}>Home</Link></li>
          <li><Link to="/register" className={`nav-link ${location.pathname.startsWith('/register') ? 'active' : ''}`} onClick={closeMenu}>Register</Link></li>
          <li><a href="/#contact" className="nav-link" onClick={closeMenu}>Contact</a></li>
          {location.pathname === '/admin' && <li><Link to="/admin" className="nav-link active" onClick={closeMenu}>Admin</Link></li>}
        </ul>
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
