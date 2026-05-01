import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [data, setData] = useState({ teams: [], messages: [] });
  const [view, setView] = useState('teams'); // 'teams' or 'messages'
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ sport: 'All', category: 'All' });
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin@flyhigh') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    // Real-time listener for Registrations
    const unsubTeams = onSnapshot(collection(db, "registrations"), (snapshot) => {
      const teams = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          teamName: d.teamName || d.name,
          captainName: d.captainName || d.captain,
          date: d.createdAt?.toDate ? d.createdAt.toDate().toLocaleDateString() : (d.date || 'N/A'),
          statusClass: d.status === 'Approved' ? 'status-approved' : 'status-pending'
        };
      }).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      
      setData(prev => ({ ...prev, teams }));
    }, (error) => {
      console.error("Teams listener error:", error);
    });

    // Real-time listener for Messages
    const unsubMsgs = onSnapshot(collection(db, "messages"), (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          formattedDate: d.timestamp?.toDate ? d.timestamp.toDate().toLocaleDateString() : 'N/A'
        };
      }).sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));

      setData(prev => ({ ...prev, messages }));
    }, (error) => {
      console.error("Messages listener error:", error);
    });

    return () => {
      unsubTeams();
      unsubMsgs();
    };
  }, [isAuthenticated]);

  const updateStatus = async (id, newStatus) => {
    const statusClass = newStatus === 'Approved' ? 'status-approved' : 'status-pending';
    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === id ? { ...t, status: newStatus, statusClass } : t)
    }));
    try {
      await updateDoc(doc(db, "registrations", id), { status: newStatus, statusClass });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const deleteEntry = async (id, collectionName) => {
    if (!window.confirm(`Are you sure you want to delete this ${collectionName === 'registrations' ? 'team' : 'message'}?`)) return;
    
    setData(prev => ({
      ...prev,
      [collectionName === 'registrations' ? 'teams' : 'messages']: prev[collectionName === 'registrations' ? 'teams' : 'messages'].filter(item => item.id !== id)
    }));

    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'radial-gradient(circle at center, #1a1a2e 0%, #0f0f1a 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 9999
      }}>
        <div className="glass-panel animate-fadeIn" style={{ 
          width: '100%', 
          maxWidth: '420px', 
          padding: '3.5rem', 
          textAlign: 'center',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 0 40px rgba(0,0,0,0.5)'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 2rem',
            border: '1px solid var(--primary)'
          }}>
            <i className="fas fa-shield-alt" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}></i>
          </div>
          
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>System Access</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>This area is restricted to authorized personnel only.</p>
          
          <form onSubmit={handleLogin}>
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <i className="fas fa-key" style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
              <input 
                type="password" 
                placeholder="Secure Access Key" 
                autoFocus
                style={{ 
                  width: '100%', 
                  padding: '1.2rem 1.2rem 1.2rem 3rem', 
                  background: 'rgba(0,0,0,0.3)', 
                  border: '1px solid var(--glass-border)', 
                  color: 'white', 
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            
            {loginError && (
              <div style={{ 
                padding: '0.8rem', 
                background: 'rgba(231, 76, 60, 0.1)', 
                color: '#e74c3c', 
                borderRadius: '8px', 
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                border: '1px solid rgba(231, 76, 60, 0.2)'
              }}>
                <i className="fas fa-exclamation-circle"></i> Invalid Access Key
              </div>
            )}
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontWeight: 'bold', fontSize: '1rem', letterSpacing: '1px' }}>
              AUTHENTICATE <i className="fas fa-chevron-right" style={{ marginLeft: '0.5rem' }}></i>
            </button>
          </form>
          
          <div style={{ marginTop: '2.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Authorized Access Only • IP Logged
          </div>
        </div>
      </div>
    );
  }

  const filteredTeams = data.teams.filter(t => {
    const matchSport = filters.sport === 'All' || t.sport === filters.sport;
    const matchCat = filters.category === 'All' || t.category === filters.category;
    const matchSearch = t.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        t.captainName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSport && matchCat && matchSearch;
  });

  const filteredMessages = data.messages.filter(m => {
    return m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           m.message?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--white)' }}>
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Command Center</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage league registrations and support queries.</p>
          </div>
          <button className="btn btn-outline" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</button>
        </div>

        {/* View Switcher */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
          <button 
            className={`btn-text ${view === 'teams' ? 'active' : ''}`} 
            onClick={() => setView('teams')}
            style={{ fontSize: '1.2rem', padding: '0.5rem 1rem', color: view === 'teams' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: view === 'teams' ? '2px solid var(--primary)' : 'none' }}
          >
            <i className="fas fa-users"></i> Teams ({data.teams.length})
          </button>
          <button 
            className={`btn-text ${view === 'messages' ? 'active' : ''}`} 
            onClick={() => setView('messages')}
            style={{ fontSize: '1.2rem', padding: '0.5rem 1rem', color: view === 'messages' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: view === 'messages' ? '2px solid var(--primary)' : 'none' }}
          >
            <i className="fas fa-envelope"></i> Messages ({data.messages.length})
          </button>
        </div>

        {view === 'teams' ? (
          <div className="glass-panel animate-fadeIn" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <select className="btn btn-outline btn-small" value={filters.sport} onChange={e => setFilters({...filters, sport: e.target.value})} style={{ background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '4px' }}>
                  <option value="All">All Sports</option>
                  <option value="Volleyball">Volleyball</option>
                  <option value="Throwball">Throwball</option>
                </select>
                <select className="btn btn-outline btn-small" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} style={{ background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '4px' }}>
                  <option value="All">All Categories</option>
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                </select>
              </div>
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search teams or captains..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>

            <div className="table-responsive">
              <table className="teams-table">
                <thead>
                  <tr>
                    <th>Sport / Date</th>
                    <th>Team Name</th>
                    <th>Captain</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>No registrations found matching filters.</td></tr>
                  ) : (
                    filteredTeams.map(team => (
                      <tr key={team.id}>
                        <td data-label="Sport / Date">
                          <span className={`badge ${team.sport === 'Volleyball' ? 'badge-blue' : 'badge-orange'}`} style={{ marginBottom: '0.3rem', fontSize: '0.7rem' }}>{team.sport}</span>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{team.date}</div>
                        </td>
                        <td data-label="Team Name">
                          <div style={{ fontWeight: 'bold' }}>{team.teamName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{team.category} League</div>
                        </td>
                        <td data-label="Captain">
                          <div>{team.captainName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}><i className="fas fa-phone"></i> {team.phone}</div>
                        </td>
                        <td data-label="Actions">
                          <div className="admin-actions">
                            <button className="btn-icon btn-view" onClick={() => setSelectedTeam(team)} title="View Roster"><i className="fas fa-eye"></i> View Roster</button>
                            <button className="btn-icon btn-delete" onClick={() => deleteEntry(team.id, 'registrations')} title="Delete"><i className="fas fa-trash"></i></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass-panel animate-fadeIn" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search messages..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="teams-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>No messages found.</td></tr>
                  ) : (
                    filteredMessages.map(msg => (
                      <tr key={msg.id}>
                        <td data-label="From">
                          <div style={{ fontWeight: 'bold' }}>{msg.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{msg.email}</div>
                        </td>
                        <td data-label="Message" style={{ maxWidth: '400px' }}>
                          <p style={{ fontSize: '0.9rem' }}>{msg.message}</p>
                        </td>
                        <td data-label="Date" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleDateString() : 'Just now'}
                        </td>
                        <td data-label="Actions">
                          <button className="btn-icon btn-delete" onClick={() => deleteEntry(msg.id, 'messages')}><i className="fas fa-trash"></i></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedTeam && (
        <div className="modal active" onClick={(e) => { if (e.target.className.includes('modal')) setSelectedTeam(null) }}>
          <div className="modal-content glass-panel animate-slideUp" style={{ border: '1px solid var(--primary)' }}>
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{selectedTeam.teamName}</h2>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span><i className="fas fa-trophy"></i> {selectedTeam.sport} League</span>
                  <span><i className="fas fa-venus-mars"></i> {selectedTeam.category} Division</span>
                </div>
              </div>
              <button className="close-btn" onClick={() => setSelectedTeam(null)} style={{ fontSize: '2rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '15px' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--primary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>Team Captain</label>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedTeam.captainName}</div>
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--primary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>Contact Info</label>
                  <div style={{ fontSize: '1rem' }}>{selectedTeam.phone}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{selectedTeam.email}</div>
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--primary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>Registration Date</label>
                  <div style={{ fontSize: '1rem' }}>{selectedTeam.date}</div>
                </div>
              </div>
              
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <i className="fas fa-users" style={{ color: 'var(--primary)' }}></i> 
                Confirmed Players 
                <span style={{ fontSize: '0.9rem', background: 'var(--primary)', color: 'white', padding: '0.2rem 0.8rem', borderRadius: '20px' }}>{selectedTeam.players?.length}</span>
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {selectedTeam.players?.map((p, i) => (
                  <div key={i} style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    padding: '1.2rem', 
                    borderRadius: '12px', 
                    border: '1px solid var(--glass-border)',
                    borderLeft: `4px solid ${i < 6 ? 'var(--primary)' : '#666'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.2rem' }}>{i + 1}. {typeof p === 'object' ? p.name : p}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{typeof p === 'object' ? p.course : 'Student'}</div>
                    </div>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: i < 6 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 'bold' }}>
                      {i < 6 ? 'Main Player' : 'Substitute'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
