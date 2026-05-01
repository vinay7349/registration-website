import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Registration from '../components/Registration';
import Rules from '../components/Rules';

const Register = () => {
  const { sport: sportParam } = useParams();
  const navigate = useNavigate();
  const [sport, setSport] = useState(sportParam || null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (sportParam) {
      setSport(sportParam.charAt(0).toUpperCase() + sportParam.slice(1));
    } else {
      setSport(null);
      setCategory(null);
    }
  }, [sportParam]);

  const handleSportSelect = (selectedSport) => {
    setSport(selectedSport);
    // Optional: update URL if we want deep linking to update while on page
    // navigate(`/register/${selectedSport.toLowerCase()}`);
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  const resetSelection = () => {
    if (sportParam) {
      // If we came from a deep link, maybe go back to /register to clear sport
      navigate('/register');
    } else {
      setSport(null);
      setCategory(null);
    }
  };

  return (
    <div className="page-container" style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <div className="container">
        {!sport ? (
          <div className="selection-step animate-fadeIn">
            <h1 className="section-title">Select Your Sport</h1>
            <div className="selection-grid" style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '3rem' }}>
              <div className="glass-panel selection-card" onClick={() => handleSportSelect('Volleyball')}>
                <div className="icon-circle" style={{ background: 'rgba(52, 152, 219, 0.2)', color: '#3498db' }}>
                  <i className="fas fa-volleyball-ball"></i>
                </div>
                <h3>Volleyball</h3>
                <p>Fast-paced action on the court. Spike your way to victory!</p>
                <button className="btn btn-primary btn-small">Choose Volleyball</button>
              </div>
              <div className="glass-panel selection-card" onClick={() => handleSportSelect('Throwball')}>
                <div className="icon-circle" style={{ background: 'rgba(230, 126, 34, 0.2)', color: '#e67e22' }}>
                  <i className="fas fa-baseball-ball"></i>
                </div>
                <h3>Throwball</h3>
                <p>Teamwork and precision. The ultimate test of skill.</p>
                <button className="btn btn-primary btn-small" style={{ background: '#e67e22', borderColor: '#e67e22' }}>Choose Throwball</button>
              </div>
            </div>
          </div>
        ) : !category ? (
          <div className="selection-step animate-fadeIn">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
               <button onClick={resetSelection} className="btn-icon" style={{ background: 'rgba(255,255,255,0.1)' }}><i className="fas fa-arrow-left"></i></button>
               <h1 className="section-title" style={{ margin: 0 }}>{sport} Registration</h1>
            </div>
            <h3 style={{ textAlign: 'center', marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>Select Category</h3>
            <div className="selection-grid" style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <div className="glass-panel selection-card" onClick={() => handleCategorySelect('Boys')} style={{ padding: '2rem' }}>
                <div className="icon-circle" style={{ background: 'rgba(52, 152, 219, 0.2)', color: '#3498db', width: '60px', height: '60px', fontSize: '1.5rem' }}>
                  <i className="fas fa-male"></i>
                </div>
                <h3>Boys League</h3>
                <button className="btn btn-primary btn-small">Select Boys</button>
              </div>
              <div className="glass-panel selection-card" onClick={() => handleCategorySelect('Girls')} style={{ padding: '2rem' }}>
                <div className="icon-circle" style={{ background: 'rgba(155, 89, 182, 0.2)', color: '#9b59b6', width: '60px', height: '60px', fontSize: '1.5rem' }}>
                  <i className="fas fa-female"></i>
                </div>
                <h3>Girls League</h3>
                <button className="btn btn-primary btn-small" style={{ background: '#9b59b6', borderColor: '#9b59b6' }}>Select Girls</button>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
               <Rules sport={sport} />
            </div>
          </div>
        ) : (
          <div className="registration-container animate-fadeIn">
            <Registration 
              sport={sport} 
              category={category} 
              onBack={() => setCategory(null)} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
