import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Scale, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
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

  const firstName = userData.name ? userData.name.split(' ')[0] : '';

  return (
    <div className="luxury-home-container">
      {/* Hero Section with Mesh Gradient / Animated Blob */}
      <header className="lux-hero-section">
        <div className="mesh-bg">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
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
    </div>
  );
}
