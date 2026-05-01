import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <i className="fas fa-home"></i>
        <span>Home</span>
      </Link>
      <Link to="/register" className={`bottom-nav-item ${location.pathname.startsWith('/register') ? 'active' : ''}`}>
        <i className="fas fa-edit"></i>
        <span>Register</span>
      </Link>
      <a href="/#contact" className="bottom-nav-item">
        <i className="fas fa-envelope"></i>
        <span>Contact</span>
      </a>

    </nav>
  );
};

export default BottomNav;
