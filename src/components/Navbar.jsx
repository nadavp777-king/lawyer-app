import React, { useState, useEffect } from 'react';
import { UserCircle, LogOut, Settings, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import './Navbar.css';

const LOCATIONS = ["Tel Aviv", "Jerusalem", "Haifa", "Herzliya", "Rishon LeZion", "Ashdod"];

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ name: '', practice: '', location: '', discovery: '' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ location: '', practice: '', discovery: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const profileData = data.profile || data; 
            setUserData({
              name: profileData.name || '',
              practice: profileData.practice || profileData.specialty || '',
              location: profileData.location || '',
              discovery: profileData.discovery || profileData.heardFrom || ''
            });
            setEditForm({
              location: profileData.location || '',
              practice: profileData.practice || profileData.specialty || '',
              discovery: profileData.discovery || profileData.heardFrom || ''
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        location: editForm.location,
        practice: editForm.practice,
        discovery: editForm.discovery
      });
      
      setUserData(prev => ({ ...prev, ...editForm }));
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  if (!user) return null; // Don't render anything if not logged in

  return (
    <>
      <div className="global-navbar">
        <button className="profile-toggle-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <UserCircle size={32} />
        </button>
        
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div 
              className="profile-dropdown-menu glass-panel"
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
              className="edit-modal-content glass-panel"
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
                    <option value="Family Law">Family Law</option>
                    <option value="Criminal Defense">Criminal Defense</option>
                    <option value="Corporate Law">Corporate Law</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Intellectual Property">Intellectual Property</option>
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
                    <option value="Social Media">Social Media</option>
                    <option value="Search Engine">Search Engine</option>
                    <option value="Friend/Family">Friend/Family</option>
                    <option value="Advertisement">Advertisement</option>
                    <option value="Other">Other</option>
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
