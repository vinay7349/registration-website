import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/:sport" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Chatbot />
      <BottomNav />
      <Footer />
    </Router>
  );
}

export default App;
