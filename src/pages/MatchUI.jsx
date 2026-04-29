import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Briefcase, User, MessageCircle, Check, HelpCircle } from 'lucide-react';
import danaHarelImg from '../assets/dana-harel.png';

// Import professional lawyer portraits
import f1 from '../assets/lawyers/f1.png';
import f2 from '../assets/lawyers/f2.png';
import f3 from '../assets/lawyers/f3.png';
import f4 from '../assets/lawyers/f4.png';
import f5 from '../assets/lawyers/f5.png';
import f6 from '../assets/lawyers/f6.png';
import m1 from '../assets/lawyers/m1.png';
import m2 from '../assets/lawyers/m2.png';
import m3 from '../assets/lawyers/m3.png';
import m4 from '../assets/lawyers/m4.png';
import m5 from '../assets/lawyers/m5.png';
import m6 from '../assets/lawyers/m6.png';

const FEMALE_IMAGES = [f1, f2, f3, f4, f5, f6];
const MALE_IMAGES = [m1, m2, m3, m4, m5, m6];

const FEMALE_FIRST_NAMES = ["Eleanor", "Ronit", "Tali", "Dana", "Shira", "Maya", "Rachel", "Michal", "Galit", "Sarah", "Elana", "Liat", "Keren", "Anat"];

import './MatchUI.css';

const LOCATIONS = ["Tel Aviv", "Jerusalem", "Haifa", "Herzliya", "Rishon LeZion", "Ashdod"];
const PRACTICES = ["Corporate & Tech", "Real Estate", "Family Law", "Criminal Defense", "Immigration", "Personal Injury"];

const generateMockLawyers = () => {
  const FIRST_NAMES = ["Eleanor", "Jonathan", "Ronit", "Adam", "Tali", "David", "Ariel", "Dana", "Eliyahu", "Shira", "Maya", "Yaron", "Rachel", "Avi", "Michal", "Michael", "Igor", "Tomer", "Galit", "Nadav", "Sarah", "John", "Elana", "Omer", "Liat", "Yossi", "Keren", "Erez", "Shlomi", "Anat"];
  const LAST_NAMES = ["Vance", "Adler", "Gilad", "Levine", "Shahar", "Harel", "Barakat", "Katz", "Cohen", "Ben-Tov", "Levi", "Weinberg", "Peretz", "Or", "Chen", "Dorenko", "Ganon", "Mor", "Amir", "Levin", "Atias", "Shapira", "Yigal", "Kadosh", "Ben-David", "Peled", "Golan", "Biton", "Gabay"];
  
  const lawyers = [];
  let idCounter = 1;
  let imgCounter = 10;
  
  for (let pIdx = 0; pIdx < PRACTICES.length; pIdx++) {
    for (let lIdx = 0; lIdx < LOCATIONS.length; lIdx++) {
      // 2 lawyers per combination
      for(let i=0; i<2; i++) {
        const practice = PRACTICES[pIdx];
        const location = LOCATIONS[lIdx];
        
        // Pick pseudo-random consistent names
        const fName = FIRST_NAMES[(pIdx * 7 + lIdx * 3 + i * 2) % FIRST_NAMES.length];
        const lName = LAST_NAMES[(pIdx * 5 + lIdx * 4 + i * 3) % LAST_NAMES.length];
        
        const rating = (4.5 + (idCounter % 5) * 0.1).toFixed(1);
        const reviews = 50 + (idCounter * 13) % 250;
        const costStr = i === 0 ? "$$" : "$$$";
        
        const isFemale = FEMALE_FIRST_NAMES.includes(fName);
        const imagePool = isFemale ? FEMALE_IMAGES : MALE_IMAGES;
        const imgIndex = idCounter % imagePool.length;

        lawyers.push({
          id: idCounter,
          name: `${fName} ${lName}${i === 1 && pIdx === 0 ? ", Esq." : ""}`,
          practice: practice,
          location: location,
          rating: parseFloat(rating),
          reviews: reviews,
          cost: costStr,
          bio: `Experienced specialist in ${practice}. Dedicated to achieving the best outcomes for clients in the ${location} area with over ${(idCounter % 15) + 5} years of experience.`,
          image: (fName === "Dana" && lName === "Harel") ? danaHarelImg : imagePool[imgIndex]
        });
        idCounter++;
        imgCounter++;
        if(imgCounter > 65) imgCounter = 10;
      }
    }
  }
  return lawyers;
};

const MOCK_LAWYERS = generateMockLawyers();

export default function MatchUI() {
  const navigate = useNavigate();
  const [filterPractice, setFilterPractice] = useState(() => {
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    return prefs.practice || 'All';
  });
  const [filterLocation, setFilterLocation] = useState(() => {
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    return prefs.location || 'All';
  });

  // Custom states for interactive modals
  const [profileModal, setProfileModal] = useState(null);
  const [chatModal, setChatModal] = useState(null);

  // Derived state: first filter the mock list...
  const filteredLawyers = useMemo(() => {
    return MOCK_LAWYERS.filter(lawyer => {
      const matchPractice = filterPractice === 'All' || lawyer.practice === filterPractice;
      const matchLocation = filterLocation === 'All' || lawyer.location === filterLocation;
      return matchPractice && matchLocation;
    });
  }, [filterPractice, filterLocation]);

  const handleActionClick = (actionName, card) => {
    if (actionName === 'Profile') {
      setChatModal(null);
      setProfileModal(prev => prev?.id === card.id ? null : card);
    } else if (actionName === 'Message') {
      setProfileModal(null);
      setChatModal(prev => prev?.id === card.id ? null : card);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  return (
    <div className="match-container animate-fade-in-up">
      <div className="match-header">
        <h2 className="section-title">Find Your Match</h2>
        <p className="text-slate mb-4 inter-font">Scroll to explore. Filter to find the perfect fit.</p>

        {/* Interactive Pill Filters */}
        <div className="filter-section">
          <div className="filter-row">
            <span className="filter-label">Area</span>
            <div className="filter-pill-scroll">
              <button 
                className={`filter-pill ${filterLocation === 'All' ? 'active' : ''}`}
                onClick={() => setFilterLocation('All')}
              >
                All
              </button>
              {LOCATIONS.map(loc => (
                <button 
                  key={loc}
                  className={`filter-pill ${filterLocation === loc ? 'active' : ''}`}
                  onClick={() => setFilterLocation(loc)}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-row">
            <span className="filter-label">Practice</span>
            <div className="filter-pill-scroll">
              <button 
                className={`filter-pill ${filterPractice === 'All' ? 'active' : ''}`}
                onClick={() => setFilterPractice('All')}
              >
                Any
              </button>
              {PRACTICES.map(prac => (
                <button 
                  key={prac}
                  className={`filter-pill ${filterPractice === prac ? 'active' : ''}`}
                  onClick={() => setFilterPractice(prac)}
                >
                  {prac}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          className="card-feed-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${filterLocation}-${filterPractice}`}
        >
          {filteredLawyers.length > 0 ? (
            filteredLawyers.map(card => (
              <motion.div key={card.id} className="lawyer-card-wrapper" variants={itemVariants}>
                <div className="lawyer-card glassmorphic-card">
                  <div className="card-image-wrapper">
                    <img src={card.image} alt={card.name} className="card-image grayscale-hover" draggable="false" />
                    <div className="card-overlay">
                      <div className="card-rating">
                        <Star size={16} fill="var(--gold)" color="#D4AF37" />
                        <span>{card.rating} ({card.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-info">
                    <h3>{card.name}</h3>
                    <div className="info-row tracked-out">
                      <Briefcase size={16} className="text-navy" />
                      <span className="font-medium">{card.practice}</span>
                    </div>
                    <div className="info-row tracked-out">
                      <MapPin size={16} className="text-navy" />
                      <span>{card.location}</span>
                      <span className="cost-badge ml-auto">{card.cost}</span>
                    </div>
                    <p className="card-bio">{card.bio}</p>

                    <div className="card-actions">
                      <button className="card-action-btn secondary-action" onClick={() => handleActionClick('Profile', card)}>
                        <User size={18} /> Profile
                      </button>
                      <button className="card-action-btn primary-action" onClick={() => handleActionClick('Message', card)}>
                        Hello 👋
                      </button>
                    </div>
                  </div>

                  {/* Inline Modals with Slide-Up */}
                  <AnimatePresence>
                    {chatModal?.id === card.id && (
                      <motion.div
                        className="overlay-modal"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      >
                        <div className="chat-header">
                          <img src={chatModal.image} alt={chatModal.name} className="chat-avatar" />
                          <div>
                            <h4 style={{ margin: 0, fontFamily: 'Playfair Display', fontSize: '1.2rem', color: '#0A192F' }}>{chatModal.name}</h4>
                            <span style={{ fontSize: '0.8rem', opacity: 0.7, fontFamily: 'Inter', color: '#0A192F' }}>Usually replies instantly</span>
                          </div>
                          <button className="close-chat-btn ml-auto" onClick={() => setChatModal(null)}>&times;</button>
                        </div>
                        <div className="chat-body inter-font">
                          This is a secure connection. Your privacy is guaranteed.
                        </div>
                        <div className="chat-input-area">
                          <input type="text" id={`chat-input-${chatModal.id}`} placeholder="Start typing your message..." className="chat-input" />
                          <button className="btn-gold" onClick={() => {
                              const inputEl = document.getElementById(`chat-input-${chatModal.id}`);
                              const messageText = inputEl && inputEl.value.trim() ? inputEl.value : "Hi, I would like to consult with you regarding my case.";
                              
                              const existingStr = localStorage.getItem('contactedLawyers');
                              let current = existingStr ? JSON.parse(existingStr) : [];
                              let lawyerEntry = current.find(l => l.id === chatModal.id);
                              
                              if (!lawyerEntry) {
                                lawyerEntry = {
                                   id: chatModal.id,
                                   name: chatModal.name,
                                   practice: chatModal.practice,
                                   image: chatModal.image,
                                   timestamp: new Date().toISOString(),
                                   messages: []
                                };
                                current.push(lawyerEntry);
                              }
                              
                              lawyerEntry.messages.push({
                                  text: messageText,
                                  timestamp: new Date().toISOString(),
                                  sender: 'user'
                              });

                              localStorage.setItem('contactedLawyers', JSON.stringify(current));
                              setChatModal(null);
                          }}>Send</button>
                        </div>
                      </motion.div>
                    )}

                    {profileModal?.id === card.id && (
                      <motion.div
                        className="overlay-modal"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      >
                        <div className="chat-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '8px' }}>
                          <h3 style={{ margin: 0, fontFamily: 'Playfair Display', color: '#0A192F' }}>Full Profile</h3>
                          <button className="close-chat-btn ml-auto" onClick={() => setProfileModal(null)}>&times;</button>
                        </div>
                        <div className="modal-scroll-content">
                          <p className="modal-bio inter-font">{profileModal.bio} They have handled over 200+ cases in their career with an outstanding success record.</p>
                          <ul className="modal-details inter-font tracked-out">
                            <li><Check size={16} className="text-gold" /> Bar Admission: Israel 2012</li>
                            <li><Check size={16} className="text-gold" /> Languages: Hebrew, English</li>
                            <li><Check size={16} className="text-gold" /> Response Time: Usually under 2 hours</li>
                          </ul>
                        </div>
                        <button className="btn-gold mt-auto" style={{ width: '100%', marginTop: 'auto' }} onClick={() => setProfileModal(null)}>Close Profile</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="no-cards-left">
              <div className="empty-avatar mb-4">🔍</div>
              <h3 className="playfair-font">No lawyers found</h3>
              <p className="inter-font">Try adjusting your search filters.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.div 
        className="concierge-card mt-4 mb-8"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        onClick={() => navigate('/support')}
        role="button"
        tabIndex={0}
      >
        <div className="concierge-icon">
          <HelpCircle size={56} color="#D4AF37" />
        </div>
        <div className="concierge-text">
          <h3 className="inter-font text-gold">Need expert guidance?</h3>
          <p className="inter-font">If you’re not sure which legal category fits your case, or you're having trouble using the app, our legal matchmakers are here to help.</p>
        </div>
        <div className="concierge-btn inter-font">
          Chat with Support
        </div>
      </motion.div>
    </div>
  );
}
