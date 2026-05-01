import React from 'react';

const Rules = ({ sport = 'Volleyball' }) => {
  const volleyballRules = [
    { icon: 'fa-users', title: 'Team Size', text: '6 players on court. Max 12 total including subs.' },
    { icon: 'fa-stopwatch', title: 'Match Format', text: 'Best of 3 sets. First two to 25, final set to 15.' },
    { icon: 'fa-tshirt', title: 'Uniforms', text: 'Matching uniforms with visible numbers. Libero in contrast.' },
    { icon: 'fa-gavel', title: 'Code of Conduct', text: 'Respect refs and opponents. Zero tolerance for misconduct.' }
  ];

  const throwballRules = [
    { icon: 'fa-users', title: 'Team Size', text: '7-9 players on court. Max 12 total including subs.' },
    { icon: 'fa-hand-paper', title: 'Service', text: 'One-hand overhand service. Must cross the net cleanly.' },
    { icon: 'fa-basketball-ball', title: 'Catching', text: 'Catch with two hands and return immediately. No body contact.' },
    { icon: 'fa-trophy', title: 'Scoring', text: 'Best of 3 sets. Each set is 15 points (Rally Score System).' }
  ];

  const currentRules = sport === 'Volleyball' ? volleyballRules : throwballRules;

  return (
    <div className="rules-display">
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>{sport} Official Rules</h3>
      <div className="rules-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {currentRules.map((rule, index) => (
          <div key={index} className="rule-card" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <i className={`fas ${rule.icon}`} style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
            <h4 style={{ marginBottom: '0.5rem' }}>{rule.title}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{rule.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rules;
