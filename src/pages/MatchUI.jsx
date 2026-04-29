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

const generateMockLawyers = () => {
  const PRACTICES = ["Corporate & Tech", "Real Estate", "Family Law", "Criminal Defense", "Immigration", "Personal Injury"];
  const LOCATIONS = ["Tel Aviv", "Jerusalem", "Haifa", "Herzliya", "Rishon LeZion", "Ashdod"];
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

  return (
    <div className="match-container animate-fade-in-up">
      <div className="match-header">
        <h2 className="section-title">Find Your Match</h2>
        <p className="text-slate mb-4">Scroll to explore. Filter to find the perfect fit.</p>

        {/* Interactive Filters */}
        <div className="filter-pill-container">
          <select
            className="filter-select"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          >
            <option value="All">Area: All</option>
            <option value="Tel Aviv">Tel Aviv</option>
            <option value="Jerusalem">Jerusalem</option>
            <option value="Haifa">Haifa</option>
            <option value="Herzliya">Herzliya</option>
            <option value="Rishon LeZion">Rishon LeZion</option>
            <option value="Ashdod">Ashdod</option>
          </select>

          <select
            className="filter-select"
            value={filterPractice}
            onChange={(e) => setFilterPractice(e.target.value)}
          >
            <option value="All">Practice: Any</option>
            <option value="Corporate & Tech">Corp & Tech</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Family Law">Family Law</option>
            <option value="Criminal Defense">Criminal</option>
            <option value="Immigration">Immigration</option>
            <option value="Personal Injury">Personal Injury</option>
          </select>
        </div>
      </div>

      <div className="card-feed-container">
        {filteredLawyers.length > 0 ? (
          filteredLawyers.map(card => (
            <div key={card.id} className="lawyer-card-wrapper">
              <motion.div
                className="lawyer-card"
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                <div className="card-image-wrapper">
                <img src={card.image} alt={card.name} className="card-image" draggable="false" />
                <div className="card-overlay">
                  <div className="card-rating">
                    <Star size={16} fill="var(--gold)" color="var(--gold)" />
                    <span>{card.rating} ({card.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="card-info">
                <h3>{card.name}</h3>
                <div className="info-row">
                  <Briefcase size={16} className="text-slate" />
                  <span className="text-slate font-medium">{card.practice}</span>
                </div>
                <div className="info-row">
                  <MapPin size={16} className="text-slate" />
                  <span className="text-slate">{card.location}</span>
                  <span className="cost-badge ml-auto">{card.cost}</span>
                </div>
                <p className="card-bio">{card.bio}</p>

                {/* Fully working action buttons */}
                <div className="card-actions">
                  <button className="card-action-btn secondary-action" onClick={() => handleActionClick('Profile', card)}>
                    <User size={18} /> Profile
                  </button>
                  <button className="card-action-btn primary-action" onClick={() => handleActionClick('Message', card)}>
                    Hello 👋
                  </button>
                </div>
              </div>
            </motion.div>
            
            <AnimatePresence mode="wait">
              {chatModal?.id === card.id && (
                <motion.div
                  key="chat"
                  className="chat-inline"
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                >
                  <div className="chat-header">
                    <img src={chatModal.image} alt={chatModal.name} className="chat-avatar" />
                    <div>
                      <h4 style={{ margin: 0 }}>{chatModal.name}</h4>
                      <span className="text-slate" style={{ fontSize: '0.8rem' }}>Usually replies instantly</span>
                    </div>
                    <button className="close-chat-btn ml-auto" onClick={() => setChatModal(null)}>&times;</button>
                  </div>
                  <div className="chat-body text-slate">
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
                  key="profile"
                  className="chat-inline"
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                >
                  <div className="chat-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '8px' }}>
                    <h3 style={{ margin: 0 }}>Full Profile: {profileModal.name}</h3>
                    <button className="close-chat-btn ml-auto" onClick={() => setProfileModal(null)}>&times;</button>
                  </div>
                  <p className="modal-bio">{profileModal.bio} They have handled over 200+ cases in their career with an outstanding success record.</p>
                  <ul className="modal-details text-slate">
                    <li><Check size={16} className="text-gold" /> Bar Admission: Israel 2012</li>
                    <li><Check size={16} className="text-gold" /> Languages: Hebrew, English</li>
                    <li><Check size={16} className="text-gold" /> Response Time: Usually under 2 hours</li>
                  </ul>
                  <button className="btn-primary mt-8" style={{ width: '100%' }} onClick={() => setProfileModal(null)}>Close Profile</button>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          ))
        ) : (
          <div className="no-cards-left">
            <div className="empty-avatar mb-4">🔍</div>
            <h3>No lawyers found</h3>
            <p>Try adjusting your search filters.</p>
          </div>
        )}
      </div>

      <motion.div 
        className="help-section mt-4 mb-8"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="help-icon-wrapper">
          <HelpCircle size={36} color="#ffe482" />
        </div>
        <div className="help-text">
          <h3>Still didn't find the right lawyer?</h3>
          <p style={{ fontSize: '0.95rem', marginTop: '8px' }}>Our matching experts are standing by. Let us help you navigate your legal needs and find the perfect attorney.</p>
        </div>
        <button className="help-btn mt-2" onClick={() => navigate('/support')}>
          Get Guided Support
        </button>
      </motion.div>
    </div>
  );
}
