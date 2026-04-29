import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, FileText, Search, User, MessageCircle, Scale, Fingerprint, CalendarCheck, UserMinus } from 'lucide-react';
import './MyProgress.css';

export default function MyProgress() {
  const navigate = useNavigate();
  const [contactedLawyers, setContactedLawyers] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('contactedLawyers');
    if (saved) {
      setContactedLawyers(JSON.parse(saved));
    }
  }, []);

  const handleCutConnection = (id) => {
    // Confirm before deleting (optional, but good UX. We'll just do it instantly for now for fluid demo)
    const updated = contactedLawyers.filter(l => l.id !== id);
    setContactedLawyers(updated);
    localStorage.setItem('contactedLawyers', JSON.stringify(updated));
    if (activeChatId === id) setActiveChatId(null);
  };

  const toggleChat = (id) => {
    setActiveChatId(prev => prev === id ? null : id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (contactedLawyers.length === 0) {
    return (
      <div className="progress-container flex-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div 
            className="empty-icon-wrapper mb-8"
            animate={{ boxShadow: ["0 0 20px rgba(255,228,130,0.1)", "0 0 60px rgba(255,228,130,0.3)", "0 0 20px rgba(255,228,130,0.1)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Scale size={54} color="var(--gold)" />
          </motion.div>
          
          <h2 className="section-title text-center mb-4">Your Journey Starts Here</h2>
          <p className="text-slate mb-8 text-center" style={{ maxWidth: '440px', lineHeight: '1.7', fontSize: '1.05rem' }}>
            We've built a curated network of elite attorneys. Find your perfect match and we'll track your interactions here to keep you organized.
          </p>
          
          <motion.button 
            className="btn-primary" 
            onClick={() => navigate('/find')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '50px' }}
          >
            <Search className="btn-icon" size={20} /> Browse Lawyers
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="progress-container"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="progress-header mb-8">
        <h2 className="section-title">Your Progress Dashboard</h2>
        <p className="text-slate mt-2">Oversee your legal journey and upcoming milestones.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="status-overview mb-10">
        <div className="status-card">
          <div className="status-icon"><Fingerprint className="text-gold" size={28} /></div>
          <div className="status-info">
            <h4>Connections Made</h4>
            <span className="status-value">{contactedLawyers.length}</span>
          </div>
        </div>
        <div className="status-card">
          <div className="status-icon"><Clock size={28} color="#60a5fa" /></div>
          <div className="status-info">
            <h4>Awaiting Replies</h4>
            <span className="status-value">{contactedLawyers.length}</span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h3 className="subsection-title">
          <MessageCircle size={22} className="text-gold" /> Active Conversations
        </h3>
        <div className="contacted-list mb-12">
          <AnimatePresence>
            {contactedLawyers.map((lawyer) => (
              <motion.div 
                key={lawyer.id} 
                className="contacted-card-wrapper"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`contacted-card ${activeChatId === lawyer.id ? 'active-glow' : ''}`}>
                  <img src={lawyer.image} alt={lawyer.name} className="contacted-avatar" />
                  <div className="contacted-details">
                    <h4>{lawyer.name}</h4>
                    <p className="text-slate text-sm">{lawyer.practice}</p>
                    <div className="timestamp-badge">
                      <CalendarCheck size={14} />
                      {new Date(lawyer.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="card-actions-right">
                    <button 
                      className={`action-icon-btn ${activeChatId === lawyer.id ? 'active' : ''}`} 
                      onClick={() => toggleChat(lawyer.id)} 
                      title={activeChatId === lawyer.id ? "Close Chat" : "Open Chat"}
                    >
                      <MessageCircle size={20} />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {activeChatId === lawyer.id && (
                    <motion.div
                      className="inline-chat-container"
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="inline-chat-header">
                        <div className="chat-status">
                          <span className="online-dot"></span> Online
                        </div>
                        <button 
                          className="cut-connection-btn"
                          onClick={() => handleCutConnection(lawyer.id)}
                        >
                          <UserMinus size={14} /> Cut Connection
                        </button>
                      </div>
                      
                      <div className="inline-chat-history">
                        {lawyer.messages && lawyer.messages.map((msg, idx) => (
                           <div key={idx} className={`message ${msg.sender === 'user' ? 'sent' : 'received'}`}>
                             <p>{msg.text}</p>
                             <span className="msg-time">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                           </div>
                        ))}
                        {(!lawyer.messages || lawyer.messages.length === 0) && (
                           <div className="message sent">
                             <p>Hi {lawyer.name.split(' ')[0]}, I would like to consult with you regarding my case.</p>
                             <span className="msg-time">{new Date(lawyer.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                           </div>
                        )}
                      </div>
                      
                      <div className="inline-chat-input">
                        <input type="text" id={`prog-chat-input-${lawyer.id}`} placeholder="Type a follow-up message..." onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                              document.getElementById(`prog-send-btn-${lawyer.id}`).click();
                           }
                        }} />
                        <button id={`prog-send-btn-${lawyer.id}`} className="btn-gold-small" onClick={() => {
                            const inputEl = document.getElementById(`prog-chat-input-${lawyer.id}`);
                            if (!inputEl || !inputEl.value.trim()) return;
                            
                            const newMsg = {
                                text: inputEl.value.trim(),
                                timestamp: new Date().toISOString(),
                                sender: 'user'
                            };
                            
                            const updatedLawyers = contactedLawyers.map(l => {
                                if (l.id === lawyer.id) {
                                    return {
                                        ...l,
                                        messages: [...(l.messages || []), newMsg]
                                    };
                                }
                                return l;
                            });
                            
                            setContactedLawyers(updatedLawyers);
                            localStorage.setItem('contactedLawyers', JSON.stringify(updatedLawyers));
                            inputEl.value = '';
                        }}>Send</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="next-steps-section">
        <h3 className="subsection-title" style={{ color: 'var(--text)' }}>Roadmap to Resolution</h3>
        <div className="timeline">
          <div className="timeline-item completed">
            <div className="timeline-marker"><CheckCircle2 size={16} /></div>
            <div className="timeline-content">
              <h4>Find & Select Match</h4>
              <p>You successfully browsed our verified network and reached out to potential legal representatives.</p>
            </div>
          </div>
          <div className="timeline-item active">
            <div className="timeline-marker"><Clock size={16} /></div>
            <div className="timeline-content">
              <h4>Initial Consultation</h4>
              <p>Attorneys usually reply within 24 hours. Keep an eye out to schedule a free introductory video or phone call.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker"><FileText size={16} /></div>
            <div className="timeline-content">
              <h4>Documentation & Strategy</h4>
              <p>Prepare your ID, main contracts, and any relevant case evidence to build a bulletproof strategy.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker"><User size={16} /></div>
            <div className="timeline-content">
              <h4>Sign Engagement Letter</h4>
              <p>Review the formal agreement and securely sign to officially hire your lawyer and begin work.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
