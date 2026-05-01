import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import volleyballBg from '../volleyball_bg.png';

const Registration = ({ sport, category, onBack }) => {
  const mainCount = sport === 'Volleyball' ? 6 : 9;
  const subCount = 2;
  const totalCount = mainCount + subCount;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    teamName: '',
    captainName: '',
    phone: '',
    email: '',
    players: Array.from({ length: totalCount }, () => ({ name: '', course: '' }))
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showRetry, setShowRetry] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePlayerChange = (index, field, value) => {
    setFormData(prev => {
      const newPlayers = [...prev.players];
      newPlayers[index] = { ...newPlayers[index], [field]: value };
      return { ...prev, players: newPlayers };
    });
  };

  const nextStep = () => {
    if (!formData.teamName || !formData.captainName || !formData.phone || !formData.email) {
      setMessage({ type: 'error', text: 'Please fill all details to proceed.' });
      return;
    }
    const phonePattern = /^[0-9]{10,15}$/;
    if (!phonePattern.test(formData.phone)) {
      setMessage({ type: 'error', text: 'Valid phone number required.' });
      return;
    }
    setMessage({ type: '', text: '' });
    setStep(2);
  };

  const prevStep = () => setStep(1);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: 'Submitting...' });
    setShowRetry(false);
    
    // Validation
    for (let i = 0; i < mainCount; i++) {
      const p = formData.players[i];
      if (!p.name.trim() || !p.course.trim()) {
        setMessage({ type: 'error', text: `Missing details for Player ${i + 1} (Main Player).` });
        setLoading(false);
        return;
      }
    }

    const registrationData = {
      teamName: formData.teamName,
      captainName: formData.captainName,
      sport: sport,
      category: category,
      phone: formData.phone,
      email: formData.email,
      numPlayers: formData.players.filter(p => p.name.trim() !== '').length,
      players: formData.players.filter(p => p.name.trim() !== ''),
      status: 'Pending',
      statusClass: 'status-pending',
      date: new Date().toISOString().split('T')[0]
    };

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firebase connection timeout")), 10000)
      );
      
      await Promise.race([
        addDoc(collection(db, "registrations"), {
          ...registrationData,
          createdAt: serverTimestamp()
        }),
        timeoutPromise
      ]);
      
      setMessage({ type: 'success', text: 'Team Registered Successfully!' });
      setLoading(false);

    } catch (error) {
      console.error("REGISTRATION ERROR:", error);
      setLoading(false);
      setShowRetry(true);
      setMessage({ type: 'error', text: 'Submission Failed: ' + error.message });
      
      // Fallback
      const localRegistrations = JSON.parse(localStorage.getItem('registrationsData')) || [];
      localRegistrations.unshift({ id: Date.now().toString(), ...registrationData });
      localStorage.setItem('registrationsData', JSON.stringify(localRegistrations));
    }
  };

  return (
    <div className="registration-card-container" style={{ 
      display: 'grid', 
      gridTemplateColumns: sport === 'Volleyball' ? '1fr 400px' : '1fr', 
      maxWidth: sport === 'Volleyball' ? '1200px' : '800px', 
      margin: '0 auto',
      background: 'var(--bg-dark)',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      border: '1px solid var(--glass-border)'
    }}>
      <div style={{ padding: '3rem', position: 'relative' }}>
        {message.type === 'success' ? (
          <div className="animate-fadeIn" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: 'rgba(46, 204, 113, 0.1)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1.5rem',
              border: '2px solid #2ecc71'
            }}>
              <i className="fas fa-check" style={{ fontSize: '2.5rem', color: '#2ecc71' }}></i>
            </div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: 'white' }}>Registration Completed!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
              Your team <strong>{formData.teamName}</strong> has been successfully registered for the {sport} League.
              <br /><br />
              <span style={{ color: 'var(--primary)', fontWeight: 'bold', background: 'rgba(52, 152, 219, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                <i className="fas fa-bell"></i> Check your notification & email for details.
              </span>
            </p>
            <button 
              onClick={() => window.location.href = '/'} 
              className="btn btn-primary" 
              style={{ padding: '0.8rem 2.5rem' }}
            >
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
              <button onClick={onBack} className="btn-icon" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }}><i className="fas fa-arrow-left"></i></button>
              <h2 style={{ margin: 0, fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>{sport} Registration</h2>
            </div>

            <div className="progress-stepper" style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
              <div style={{ flex: 1, height: '4px', background: step >= 1 ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }}></div>
              <div style={{ flex: 1, height: '4px', background: step >= 2 ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }}></div>
            </div>

            {message.text && (
              <div style={{ 
                padding: '1rem', 
                borderRadius: '8px', 
                marginBottom: '2rem', 
                background: message.type === 'error' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(46, 204, 113, 0.1)',
                border: `1px solid ${message.type === 'error' ? '#e74c3c' : '#2ecc71'}`,
                color: message.type === 'error' ? '#e74c3c' : '#2ecc71',
                textAlign: 'center'
              }}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <div className="animate-fadeIn">
                  <div className="form-group-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Team Name</label>
                      <input type="text" id="teamName" required placeholder="Team Name" style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} value={formData.teamName} onChange={handleInputChange} disabled={loading} />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Captain Name</label>
                      <input type="text" id="captainName" required placeholder="Captain Name" style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} value={formData.captainName} onChange={handleInputChange} disabled={loading} />
                    </div>
                  </div>
                  <div className="form-group-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Phone Number</label>
                      <input type="tel" id="phone" required placeholder="Phone" style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} value={formData.phone} onChange={handleInputChange} disabled={loading} />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
                      <input type="email" id="email" required placeholder="Email" style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} value={formData.email} onChange={handleInputChange} disabled={loading} />
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary btn-block" onClick={nextStep} style={{ width: '100%', padding: '1rem' }} disabled={loading}>Continue to Roster <i className="fas fa-arrow-right"></i></button>
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <div style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '1rem', marginBottom: '2rem' }}>
                    {formData.players.map((player, index) => (
                      <div key={index} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '12px', marginBottom: '1rem', border: `1px solid ${index < mainCount ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}` }}>
                        <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: index < mainCount ? 'var(--primary)' : 'var(--text-muted)' }}>Player {index + 1} {index < mainCount ? '(Main)' : '(Substitute)'}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <input type="text" placeholder="Full Name" required={index < mainCount} style={{ width: '100%', padding: '0.7rem', background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', borderRadius: '6px' }} value={player.name} onChange={e => handlePlayerChange(index, 'name', e.target.value)} disabled={loading} />
                          <input type="text" placeholder="Course/Branch" required={index < mainCount} style={{ width: '100%', padding: '0.7rem', background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', borderRadius: '6px' }} value={player.course} onChange={e => handlePlayerChange(index, 'course', e.target.value)} disabled={loading} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                    <input 
                      type="checkbox" 
                      id="agree" 
                      checked={agreed} 
                      onChange={(e) => setAgreed(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="agree" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      I confirm that all player details are correct and we will follow the tournament rules.
                    </label>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={prevStep} disabled={loading}><i className="fas fa-arrow-left"></i> Back</button>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ flex: 2, opacity: agreed ? 1 : 0.5, cursor: agreed ? 'pointer' : 'not-allowed' }} 
                      disabled={loading || !agreed}
                    >
                      {loading ? 'Processing...' : 'Complete Registration'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </>
        )}
      </div>

      {sport === 'Volleyball' && (
        <div style={{ 
          background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${volleyballBg})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '3rem'
        }}>
          <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Ready to Soar?</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Fill in your team details and secure your spot in the league.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;
