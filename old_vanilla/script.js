import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
  // Mobile Navigation
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-link');
  const icon = mobileBtn.querySelector('i');

  mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    if (navLinks.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('active');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });

  // Sticky Header & Active Nav Link
  const header = document.querySelector('.header');
  const sections = document.querySelectorAll('.section');

  window.addEventListener('scroll', () => {
    // Header shadow
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - 250)) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // Countdown Timer
  // Set deadline 14 days from now
  const countdownDate = new Date().getTime() + (14 * 24 * 60 * 60 * 1000); 

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days < 10 ? '0' + days : days;
    document.getElementById('hours').textContent = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').textContent = seconds < 10 ? '0' + seconds : seconds;

    if (distance < 0) {
      clearInterval(interval);
      document.getElementById('countdown').innerHTML = '<h2>Registration Closed</h2>';
    }
  };

  const interval = setInterval(updateCountdown, 1000);
  updateCountdown();

  // Dynamic Player Fields based on Number Input
  const numPlayersInput = document.getElementById('numPlayers');
  const playersList = document.getElementById('playersList');

  const renderPlayerInputs = () => {
    let count = parseInt(numPlayersInput.value);
    if (isNaN(count) || count < 6) count = 6;
    if (count > 12) count = 12;
    
    playersList.innerHTML = '';
    for (let i = 1; i <= count; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'player-input';
      input.placeholder = `Player ${i}`;
      input.required = true;
      playersList.appendChild(input);
    }
    // Also update grid dynamically
    playersList.style.gridTemplateColumns = count > 6 ? '1fr 1fr 1fr' : '1fr 1fr';
  };

  if (numPlayersInput && playersList) {
    numPlayersInput.addEventListener('input', renderPlayerInputs);
    numPlayersInput.addEventListener('change', renderPlayerInputs);
    renderPlayerInputs(); // Initial render
  }

  // Registration Form Submission

  // Form Submission Mock - Registration
  const regForm = document.getElementById('registrationForm');
  const formMessage = document.getElementById('formMessage');

  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const teamName = document.getElementById('teamName').value;
    
    // Animate button
    const btn = regForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Submitting...';
    btn.disabled = true;
    
    const newTeam = {
      name: teamName,
      captain: document.getElementById('captainName').value,
      category: document.getElementById('categoryInput').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      numPlayers: document.getElementById('numPlayers').value,
      players: Array.from(playersList.querySelectorAll('.player-input'))
                    .map(input => input.value.trim())
                    .filter(val => val !== ''),
      status: 'Pending',
      statusClass: 'status-pending',
      date: new Date().toISOString().split('T')[0]
    };

    try {
      // Save to Firebase
      await addDoc(collection(db, "teams"), {
        ...newTeam,
        timestamp: serverTimestamp()
      });
      
      formMessage.textContent = `Team Registered Successfully!`;
      formMessage.className = 'form-message success';
      formMessage.style.display = 'block';
      
      // Also update localStorage as fallback
      const localTeams = JSON.parse(localStorage.getItem('teamsData')) || [];
      localTeams.unshift({ id: Date.now().toString(), ...newTeam });
      localStorage.setItem('teamsData', JSON.stringify(localTeams));
      
      // Reset form
      regForm.reset();
      renderPlayerInputs();
      
      setTimeout(() => {
        formMessage.style.display = 'none';
      }, 5000);
      
    } catch (error) {
      console.error("Error adding document: ", error);
      
      // Fallback: Save to LocalStorage if Firebase fails
      const localTeams = JSON.parse(localStorage.getItem('teamsData')) || [];
      localTeams.unshift({ id: Date.now().toString(), ...newTeam });
      localStorage.setItem('teamsData', JSON.stringify(localTeams));
      
      formMessage.textContent = `Team Registered Successfully! (Local Mode)`;
      formMessage.className = 'form-message success';
      formMessage.style.display = 'block';
      
      regForm.reset();
      renderPlayerInputs();
      
      setTimeout(() => {
        formMessage.style.display = 'none';
      }, 5000);
    }
    
    btn.textContent = originalText;
    btn.disabled = false;
  });

  // Form Submission Mock - Contact
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    
    setTimeout(() => {
      alert('Message sent successfully! We will get back to you soon.');
      contactForm.reset();
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1000);
  });

  // Registration Selection Cards Logic
  const categoryInput = document.getElementById('categoryInput');
  const formTitle = document.getElementById('formTitle');
  const formWrapper = document.getElementById('formWrapperPanel');
  const registrationSelection = document.getElementById('registrationSelection');

  window.openRegistrationForm = (category) => {
    // Hide Selection, Show Form
    registrationSelection.style.display = 'none';
    formWrapper.style.display = 'block';
    // Small timeout for CSS transition
    setTimeout(() => {
      formWrapper.style.opacity = '1';
    }, 10);
    
    // Set form context
    if (category === 'Boys') {
      categoryInput.value = 'Boys';
      formTitle.textContent = 'Boys Team Registration';
      formTitle.style.color = 'var(--primary)';
    } else {
      categoryInput.value = 'Girls';
      formTitle.textContent = 'Girls Team Registration';
      formTitle.style.color = '#9b59b6'; // Purple for girls
    }
  };

  window.closeRegistrationForm = () => {
    formWrapper.style.opacity = '0';
    setTimeout(() => {
      formWrapper.style.display = 'none';
      registrationSelection.style.display = 'flex';
      // Reset step
      if(window.prevStep) window.prevStep();
    }, 300);
  };

  // Multi-step wizard logic
  const step1 = document.getElementById('form-step-1');
  const step2 = document.getElementById('form-step-2');
  const step1Indicator = document.getElementById('step1-indicator');
  const step2Indicator = document.getElementById('step2-indicator');

  window.nextStep = () => {
    // Validate step 1 fields
    const inputs = step1.querySelectorAll('input');
    let isValid = true;
    inputs.forEach(input => {
      if (!input.checkValidity()) {
        input.reportValidity();
        isValid = false;
      }
    });

    if (isValid) {
      step1.style.display = 'none';
      step2.style.display = 'block';
      step1Indicator.classList.remove('active');
      step1Indicator.style.color = 'var(--text-muted)';
      step2Indicator.classList.add('active');
      step2Indicator.style.color = 'var(--primary)';
    }
  };

  window.prevStep = () => {
    step2.style.display = 'none';
    step1.style.display = 'block';
    step2Indicator.classList.remove('active');
    step2Indicator.style.color = 'var(--text-muted)';
    step1Indicator.classList.add('active');
    step1Indicator.style.color = 'var(--primary)';
  };

});
