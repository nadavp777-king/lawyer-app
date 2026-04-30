import React, { useState, useEffect } from 'react';
import { UserCircle, LogOut, Settings, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// Removed Firebase imports for local mode
import './Navbar.css';

const LOCATIONS = ["Tel Aviv", "Jerusalem", "Haifa", "Herzliya", "Rishon LeZion", "Ashdod"];
const PRACTICES = ["Corporate & Tech", "Real Estate", "Family Law", "Criminal Defense", "Immigration", "Personal Injury"];
const DISCOVERIES = ["Social Media (Instagram/TikTok)", "Search Engine (Google)", "Friend or Colleague", "Advertisement", "Other"];

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ name: '', practice: '', location: '', discovery: '' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ location: '', practice: '', discovery: '' });

  useEffect(() => {
    // In local mode, just read from localStorage
    const fetchUserData = () => {
      const prefs = localStorage.getItem('userPreferences');
      if (prefs) {
        const parsed = JSON.parse(prefs);
        setUserData({
          name: parsed.name || '',
          practice: parsed.practice || parsed.specialty || '',
          location: parsed.location || '',
          discovery: parsed.discovery || parsed.heardFrom || ''
        });
        setEditForm({
          location: parsed.location || '',
          practice: parsed.practice || parsed.specialty || '',
          discovery: parsed.discovery || parsed.heardFrom || ''
        });
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    localStorage.clear();
    setDropdownOpen(false);
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    // Immediately update local UI and close modal so it feels instant
    setUserData(prev => ({ ...prev, ...editForm }));
    setModalOpen(false);

    // Save to localStorage
    const prefs = localStorage.getItem('userPreferences');
    const existing = prefs ? JSON.parse(prefs) : {};
    const updated = { ...existing, ...editForm };
    localStorage.setItem('userPreferences', JSON.stringify(updated));
  };


  return (
    <>
      <div className="global-navbar">
        <button className="profile-toggle-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <UserCircle size={32} />
        </button>
        
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div 
              className="profile-dropdown-menu"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="dropdown-user-info">
                <p className="dropdown-name">{userData.name || 'User'}</p>
              </div>
              <button className="dropdown-action" onClick={() => { setModalOpen(true); setDropdownOpen(false); }}>
                <Settings size={18} /> Edit Profile
              </button>
              <button className="dropdown-action logout" onClick={handleLogout}>
                <LogOut size={18} /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div 
            className="edit-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="edit-modal-content"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
            >
              <div className="modal-header">
                <h2>Edit Profile</h2>
                <button className="close-modal-btn" onClick={() => setModalOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSaveProfile} className="edit-profile-form">
                <div className="form-group">
                  <label>Location</label>
                  <select 
                    className="lux-select"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  >
                    <option value="">Select Location</option>
                    {LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Practice Area</label>
                  <select 
                    className="lux-select"
                    value={editForm.practice}
                    onChange={(e) => setEditForm({...editForm, practice: e.target.value})}
                  >
                    <option value="">Select Specialty</option>
                    {PRACTICES.map(prac => (
                      <option key={prac} value={prac}>{prac}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Discovery Source</label>
                  <select 
                    className="lux-select"
                    value={editForm.discovery}
                    onChange={(e) => setEditForm({...editForm, discovery: e.target.value})}
                  >
                    <option value="">How did you hear about us?</option>
                    {DISCOVERIES.map(disc => (
                      <option key={disc} value={disc}>{disc}</option>
                    ))}
                  </select>
                </div>
                
                <button type="submit" className="lux-btn-primary save-btn">
                  Save Changes
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
