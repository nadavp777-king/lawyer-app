import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Scale, ShieldCheck, Zap, UserCircle, LogOut, Settings, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import './Home.css';

// Framer motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: '', practice: '', location: '', discovery: '' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ location: '', practice: '', discovery: '' });

  // Clear local storage and fetch from Firebase
  useEffect(() => {
    localStorage.clear();
    
    const fetchUserData = async () => {
      // Small timeout to ensure auth resolves if they just loaded the app
      const checkAuth = setInterval(async () => {
        if (auth.currentUser) {
          clearInterval(checkAuth);
          try {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              // Support both the old flat structure and new 'profile' structure if it exists
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
      }, 500);

      // Give up after 5 seconds
      setTimeout(() => clearInterval(checkAuth), 5000);
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        location: editForm.location,
        practice: editForm.practice,
        discovery: editForm.discovery
      });
      
      // Update local state instantly
      setUserData(prev => ({ ...prev, ...editForm }));
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const firstName = userData.name ? userData.name.split(' ')[0] : '';

  return (
    <div className="luxury-home-container">
      {/* Hero Section with Mesh Gradient / Animated Blob */}
      <header className="lux-hero-section">
        <div className="mesh-bg">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>

        {/* Profile Management Dropdown */}
        <div className="home-profile-container">
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
        
        <div className="lux-hero-content glass-panel">
          <motion.div 
            className="lux-logo-wrapper"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <Scale className="lux-logo-icon" size={40} />
          </motion.div>
          
          <motion.h1 
            className="lux-hero-title"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <span className="lux-title-brand">{firstName ? `Welcome, ${firstName}` : 'LawyerFinder'}</span>
          </motion.h1>
          
          <motion.p 
            className="lux-hero-subtitle"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Premium legal representation. Without the friction.
          </motion.p>
          
          <motion.button 
            className="lux-btn-primary lux-main-cta" 
            onClick={() => navigate('/find')}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Start Matching
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </header>

      {/* Feature Grid - Bento Style */}
      <section className="lux-info-section">
        <FadeIn className="lux-section-header">
          <h2>Why Lawyer Finder?</h2>
          <p>We stripped away the confusion to leave only what matters: trust, transparency, and results.</p>
        </FadeIn>

        <motion.div 
          className="lux-bento-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={itemVariants} className="lux-bento-card col-span-2">
            <div className="lux-card-icon"><Zap size={24} /></div>
            <h3>Instant Connection</h3>
            <p>Skip the waiting lists. Swipe and connect with top-tier attorneys immediately.</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="lux-bento-card">
            <div className="lux-card-icon"><ShieldCheck size={24} /></div>
            <h3>Verified Truth</h3>
            <p>Every rating is cryptographically verified. Read real reviews from past clients.</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="lux-bento-card">
            <div className="lux-card-icon"><Scale size={24} /></div>
            <h3>Upfront Costs</h3>
            <p>Know the estimated budget before you even send a message.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Image & Text Informative Scroll Section */}
      <section className="lux-split-scroll-section">
        <FadeIn>
          <div className="lux-split-content-block">
            <div className="lux-image-wrapper">
              <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800" alt="Lawyer meeting" className="lux-premium-img" />
            </div>
            <div className="lux-text-wrapper">
              <h3>You deserve competent defense.</h3>
              <p>Whether it's a complex corporate merger or personal affairs, the right lawyer changes everything.</p>
            </div>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <div className="lux-split-content-block reverse">
            <div className="lux-image-wrapper">
              <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=800" alt="Using a smartphone app" className="lux-premium-img" />
            </div>
            <div className="lux-text-wrapper">
              <h3>Swipe your way to security.</h3>
              <p>Our sophisticated interface makes comparing, reviewing, and contacting attorneys seamless.</p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Social Proof / Testimonial */}
      <section className="lux-testimonial-section">
        <FadeIn>
          <div className="lux-testimonial-card glass-panel-dark">
            <p className="lux-quote">"I was terrified about my case until I found my lawyer on this app in 3 minutes. Exceptional experience."</p>
            <div className="lux-author">
              <div className="lux-author-avatar">D</div>
              <span>David S., CEO</span>
            </div>
          </div>
        </FadeIn>
      </section>
      
      {/* Final CTA */}
      <section className="lux-final-cta-section">
        <FadeIn>
          <h2 className="lux-gold-text">Ready to take control?</h2>
          <button className="lux-final-btn" onClick={() => navigate('/find')}>Get Matched Now</button>
        </FadeIn>
      </section>

      {/* Edit Profile Modal */}
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
                  <input 
                    type="text" 
                    className="lux-input"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    placeholder="E.g., New York, NY"
                  />
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
    </div>
  );
}
