import React, { useState, useEffect } from 'react';

const Hero = ({ onOpenRegistration }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-05-03T18:32:16').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => num.toString().padStart(2, '0');

  return (
    <section id="home" className="section hero">
      <div className="hero-content">
        <h1 className="fade-in-up">Serve. Spike.<br />Throw. <span className="text-orange">Score.</span></h1>
        <p className="fade-in-up delay-1">Compete in Volleyball & Throwball</p>
        <div className="hero-details fade-in-up delay-2">
          <div className="detail-item"><i className="fas fa-calendar-alt"></i> Oct 15 - 17, 2026</div>
          <div className="detail-item"><i className="fas fa-map-marker-alt"></i> KIT Mangalore</div>

        </div>
        <div className="countdown-container fade-in-up delay-3">
          <h3>Registration Closes In:</h3>
          <div id="countdown" className="countdown">
            <div className="time-box"><span>{formatNumber(timeLeft.days)}</span><small>Days</small></div>
            <div className="time-box"><span>{formatNumber(timeLeft.hours)}</span><small>Hours</small></div>
            <div className="time-box"><span>{formatNumber(timeLeft.minutes)}</span><small>Minutes</small></div>
            <div className="time-box"><span>{formatNumber(timeLeft.seconds)}</span><small>Seconds</small></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }} className="fade-in-up delay-4">
          <a href="/register/volleyball" className="btn btn-primary">Volleyball Registration</a>
          <a href="/register/throwball" className="btn btn-primary" style={{ background: '#e67e22', borderColor: '#e67e22' }}>Throwball Registration</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
