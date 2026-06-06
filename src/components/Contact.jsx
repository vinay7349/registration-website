import React, { useState } from 'react';

const Contact = () => {
  return (
    <section id="contact" className="section dark-section">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Contact Info Cards */}
          <div className="contact-info-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
              <i className="fas fa-map-marker-alt" style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
              <h4 style={{ marginBottom: '0.8rem', fontSize: '1.2rem' }}>Location</h4>
              <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Mangalore</span>
            </div>
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
              <i className="fas fa-phone-alt" style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
              <h4 style={{ marginBottom: '0.8rem', fontSize: '1.2rem' }}>Phone</h4>
              <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>+91 98765 43210</span>
            </div>
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
              <i className="fas fa-envelope" style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
              <h4 style={{ marginBottom: '0.8rem', fontSize: '1.2rem' }}>Email</h4>
              <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>support@flyhighleague.com</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
