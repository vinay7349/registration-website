import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  // Authentication Logic
  const loginOverlay = document.getElementById('loginOverlay');
  const loginBtn = document.getElementById('loginBtn');
  const passwordInput = document.getElementById('adminPassword');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');

  // Check if already authenticated
  if (sessionStorage.getItem('adminAuth') === 'true') {
    loginOverlay.style.display = 'none';
  } else {
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  const handleLogin = () => {
    const pwd = passwordInput.value;
    // Simple frontend password check
    if (pwd === 'admin123' || pwd === 'flyhigh') {
      sessionStorage.setItem('adminAuth', 'true');
      loginError.style.display = 'none';
      loginOverlay.style.opacity = '0';
      document.body.style.overflow = 'auto';
      setTimeout(() => {
        loginOverlay.style.display = 'none';
      }, 500);
    } else {
      loginError.style.display = 'block';
    }
  };

  loginBtn.addEventListener('click', handleLogin);
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('adminAuth');
    location.reload();
  });

  // Data Management
  let teamsData = [];

  const fetchAdminTeams = async () => {
    try {
      const q = query(collection(db, "teams"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      teamsData = [];
      querySnapshot.forEach((doc) => {
        teamsData.push({ id: doc.id, ...doc.data() });
      });
      applyAdminFilter();
      updateStats();
    } catch (e) {
      console.warn("Firebase not configured or error fetching. Using mock data.");
      teamsData = JSON.parse(localStorage.getItem('teamsData')) || [];
      applyAdminFilter();
      updateStats();
    }
  };

  fetchAdminTeams();

  const tbody = document.querySelector('#adminTable tbody');
  const searchInput = document.getElementById('adminSearch');
  const modal = document.getElementById('teamModal');
  const closeModalBtn = document.getElementById('closeModal');

  // Load and Render Stats
  const updateStats = () => {
    document.getElementById('totalTeams').textContent = teamsData.length;
    document.getElementById('approvedTeams').textContent = teamsData.filter(t => t.status === 'Approved').length;
    document.getElementById('pendingTeams').textContent = teamsData.filter(t => t.status === 'Pending').length;
  };

  // Render Table
  const renderTable = (teams) => {
    tbody.innerHTML = '';
    
    if (teams.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem;">No teams found</td></tr>`;
      return;
    }

    teams.forEach(team => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="font-size:0.8rem; color:var(--text-muted)">#${team.id}</div>
          <div>${team.date || 'N/A'}</div>
        </td>
        <td><strong>${team.name}</strong></td>
        <td>${team.captain}</td>
        <td>
          <div style="font-size:0.9rem"><i class="fas fa-phone" style="color:var(--primary); width:15px;"></i> ${team.phone || 'N/A'}</div>
          <div style="font-size:0.9rem"><i class="fas fa-envelope" style="color:var(--primary); width:15px;"></i> ${team.email || 'N/A'}</div>
        </td>
        <td><span class="status-badge ${team.statusClass}">${team.status}</span></td>
        <td>
          <div class="admin-actions">
            <button class="btn-icon btn-view" onclick="viewTeam('${team.id}')" title="View Details"><i class="fas fa-eye"></i></button>
            ${team.status === 'Pending' ? `<button class="btn-icon btn-approve" onclick="updateStatus('${team.id}', 'Approved')" title="Approve"><i class="fas fa-check"></i></button>` : ''}
            ${team.status === 'Approved' ? `<button class="btn-icon btn-reject" onclick="updateStatus('${team.id}', 'Pending')" title="Mark Pending"><i class="fas fa-undo"></i></button>` : ''}
            <button class="btn-icon btn-delete" onclick="deleteTeam('${team.id}')" title="Delete Team"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  };

  // Admin Tab Filtering
  let currentAdminTab = 'Boys';
  const tabBoys = document.getElementById('adminTabBoys');
  const tabGirls = document.getElementById('adminTabGirls');

  const applyAdminFilter = () => {
    const term = searchInput.value.toLowerCase();
    const filtered = teamsData.filter(team => {
      const matchName = team.name.toLowerCase().includes(term) || team.captain.toLowerCase().includes(term) || (team.email && team.email.toLowerCase().includes(term));
      const matchCat = team.category === currentAdminTab;
      return matchName && matchCat;
    });
    renderTable(filtered);
  };

  tabBoys.addEventListener('click', () => {
    currentAdminTab = 'Boys';
    tabBoys.classList.add('active');
    tabGirls.classList.remove('active');
    applyAdminFilter();
  });

  tabGirls.addEventListener('click', () => {
    currentAdminTab = 'Girls';
    tabGirls.classList.add('active');
    tabBoys.classList.remove('active');
    applyAdminFilter();
  });

  // Search functionality
  searchInput.addEventListener('input', applyAdminFilter);

  // Global functions for inline onclick handlers
  window.viewTeam = (id) => {
    const team = teamsData.find(t => t.id === id);
    if (!team) return;

    document.getElementById('modalTeamName').textContent = team.name;
    document.getElementById('modalCaptain').textContent = team.captain;
    document.getElementById('modalDate').textContent = team.date || 'N/A';
    document.getElementById('modalPhone').textContent = team.phone || 'N/A';
    document.getElementById('modalEmail').textContent = team.email || 'N/A';
    document.getElementById('modalCategory').textContent = team.category || 'N/A';
    
    // Players
    const playersContainer = document.getElementById('modalPlayers');
    playersContainer.innerHTML = '';
    const playersList = team.players || [];
    document.getElementById('modalPlayerCount').textContent = playersList.length;
    
    if (playersList.length === 0) {
      playersContainer.innerHTML = '<span style="color:var(--text-muted)">No players listed</span>';
    } else {
      playersList.forEach(player => {
        const badge = document.createElement('span');
        badge.className = 'player-badge';
        badge.textContent = player;
        playersContainer.appendChild(badge);
      });
    }

    // Modal Actions
    const actionsContainer = document.getElementById('modalActions');
    actionsContainer.innerHTML = '';
    
    if (team.status === 'Pending') {
      actionsContainer.innerHTML = `<button class="btn btn-primary" onclick="updateStatus('${team.id}', 'Approved'); closeModal()">Approve Team</button>`;
    } else {
      actionsContainer.innerHTML = `<button class="btn btn-outline" onclick="updateStatus('${team.id}', 'Pending'); closeModal()">Mark as Pending</button>`;
    }

    modal.classList.add('active');
  };

  window.updateStatus = async (id, newStatus) => {
    const index = teamsData.findIndex(t => t.id === id);
    if (index !== -1) {
      const statusClass = newStatus === 'Approved' ? 'status-approved' : 'status-pending';
      teamsData[index].status = newStatus;
      teamsData[index].statusClass = statusClass;
      
      try {
        await updateDoc(doc(db, "teams", id.toString()), {
          status: newStatus,
          statusClass: statusClass
        });
      } catch(e) {
        console.warn("Failed to update Firebase, updating localStorage fallback");
        localStorage.setItem('teamsData', JSON.stringify(teamsData));
      }
      
      applyAdminFilter();
      updateStats();
    }
  };

  window.deleteTeam = async (id) => {
    if (confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      teamsData = teamsData.filter(t => t.id !== id);
      
      try {
        await deleteDoc(doc(db, "teams", id.toString()));
      } catch(e) {
        console.warn("Failed to delete from Firebase, updating localStorage fallback");
        localStorage.setItem('teamsData', JSON.stringify(teamsData));
      }
      
      applyAdminFilter();
      updateStats();
    }
  };

  // Modal logic
  window.closeModal = () => {
    modal.classList.remove('active');
  };

  closeModalBtn.addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

});
