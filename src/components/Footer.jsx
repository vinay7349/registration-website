import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-logo">Fly High Volley</div>
        <div className="social-links">
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-facebook-f"></i></a>
        </div>
      </div>
      <div className="footer-bottom">
        <div>&copy; 2026 Fly High Volley League. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
