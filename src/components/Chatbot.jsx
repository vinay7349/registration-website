import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('chat'); // 'chat' or 'form'
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hello! I'm your Fly High assistant. How can I help you today?" }
  ]);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const messagesEndRef = useRef(null);

  const faqs = [
    { q: "Registration Deadline?", a: "The deadline for registrations is September 30, 2026." },
    { q: "Team Size?", a: "Each team must have 6 main players and can have up to 2 substitutes (total 8)." },
    { q: "Entry Fee?", a: "The entry fee is $100 per team, payable during physical verification." },
    { q: "Sports Supported?", a: "We currently support both Volleyball and Throwball tournaments." }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFaqClick = (faq) => {
    setMessages(prev => [
      ...prev,
      { type: 'user', text: faq.q },
      { type: 'bot', text: faq.a }
    ]);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        timestamp: serverTimestamp(),
        type: 'doubt/feedback'
      });
      setSubmitted(true);
      setMessages(prev => [...prev, { type: 'bot', text: "Thank you! Your message has been received. Our team will get back to you soon." }]);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => {
        setMode('chat');
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setLoading(false);
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? 'active' : ''}`}>
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <i className="fas fa-comment-dots"></i>
          <span className="badge-pulse"></span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-panel glass-panel animate-slideUp">
          <div className="chatbot-header">
            <div className="bot-info">
              <div className="bot-avatar"><i className="fas fa-robot"></i></div>
              <div>
                <h4>Support Assistant</h4>
                <small><span className="online-dot"></span> Online</small>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>&times;</button>
          </div>

          <div className="chatbot-body">
            {mode === 'chat' ? (
              <>
                <div className="messages-list">
                  {messages.map((msg, i) => (
                    <div key={i} className={`message-item ${msg.type}`}>
                      <div className="message-content">{msg.text}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="bot-actions">
                  <p className="action-hint">Quick Suggestions:</p>
                  <div className="faq-chips">
                    {faqs.map((faq, i) => (
                      <button key={i} className="faq-chip" onClick={() => handleFaqClick(faq)}>{faq.q}</button>
                    ))}
                  </div>
                  <button className="btn btn-outline btn-small btn-block" style={{ marginTop: '1rem' }} onClick={() => setMode('form')}>
                    <i className="fas fa-paper-plane"></i> Send a Message / Doubt
                  </button>
                </div>
              </>
            ) : (
              <div className="form-mode animate-fadeIn">
                <button className="btn-text" onClick={() => setMode('chat')}><i className="fas fa-arrow-left"></i> Back to Chat</button>
                <h4>Send your query</h4>
                {submitted ? (
                  <div className="success-msg"><i className="fas fa-check-circle"></i> Sent Successfully!</div>
                ) : (
                  <form onSubmit={handleSubmit} className="chatbot-form">
                    <input type="text" name="name" placeholder="Your Name" required value={formData.name} onChange={handleInputChange} />
                    <input type="email" name="email" placeholder="Your Email" required value={formData.email} onChange={handleInputChange} />
                    <textarea name="message" placeholder="Describe your doubt/feedback..." required value={formData.message} onChange={handleInputChange}></textarea>
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                      {loading ? 'Sending...' : 'Submit Message'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
