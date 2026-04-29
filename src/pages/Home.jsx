import { Search, ChevronRight, Scale, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';

// Reusable scroll reveal component
const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

  export default function Home() {
    const navigate = useNavigate();
    
    // Attempt to get user name from onboarding
    const prefsStr = localStorage.getItem('userPreferences');
    const prefs = prefsStr ? JSON.parse(prefsStr) : null;
    const userName = prefs?.name ? prefs.name.split(' ')[0] : '';
  
    return (
      <div className="home-container">
        {/* Hero Section with image background */}
        <header className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <motion.div 
              className="hero-logo-wrapper"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Scale className="hero-logo-icon" size={48} />
            </motion.div>
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="title-brand">{userName ? `Welcome, ${userName}` : 'LawyerFinder'}</span>
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Finding the right legal representation shouldn't be a trial.
            </motion.p>
          <motion.button 
            className="btn-primary main-cta" 
            onClick={() => navigate('/find')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Start Matching
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </header>

      {/* Feature Grid */}
      <section className="info-section bg-light">
        <FadeIn>
          <div className="section-header">
            <h2 className="font-serif text-navy">Why Lawyer Finder?</h2>
            <p className="text-slate">We stripped away the confusion to leave only what matters: trust, transparency, and results.</p>
          </div>
        </FadeIn>

        <div className="feature-grid">
          <FadeIn delay={0.1}>
            <div className="feature-card">
              <div className="feature-icon"><Zap size={24} /></div>
              <h3>Instant Connection</h3>
              <p>Skip the waiting lists. Swipe and connect with attorneys immediately.</p>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <div className="feature-card">
              <div className="feature-icon"><ShieldCheck size={24} /></div>
              <h3>Verified Truth</h3>
              <p>Every rating is verified. Read real reviews from past clients.</p>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <div className="feature-card">
              <div className="feature-icon"><Scale size={24} /></div>
              <h3>Upfront Costs</h3>
              <p>Know the estimated budget before you even send a message.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Image & Text Informative Scroll Section */}
      <section className="split-scroll-section">
        <FadeIn>
          <div className="split-content-block">
            <div className="image-wrapper">
              <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800" alt="Lawyer meeting" />
            </div>
            <div className="text-wrapper">
              <h3 className="font-serif">You deserve competent defense.</h3>
              <p>Whether it's a messy divorce, a real estate closing, or a complex corporate merger, the right lawyer changes everything.</p>
            </div>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <div className="split-content-block reverse">
            <div className="image-wrapper">
              <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=800" alt="Using a smartphone app" />
            </div>
            <div className="text-wrapper">
              <h3 className="font-serif">Swipe your way to security.</h3>
              <p>Our app-like interface makes comparing, reviewing, and contacting attorneys as easy as ordering food or matching with a date.</p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Social Proof / Mini Testimonial */}
      <section className="testimonial-section">
        <FadeIn>
          <div className="testimonial-card">
            <p className="quote">"I was terrified about my case until I found my lawyer on this app in 3 minutes. Total lifesaver."</p>
            <div className="author">
              <div className="author-avatar">D</div>
              <span>David S., Tel Aviv</span>
            </div>
          </div>
        </FadeIn>
      </section>
      
      {/* Final CTA */}
      <section className="final-cta-section">
        <FadeIn>
          <h2 className="font-serif text-gold">Ready to take control?</h2>
          <button className="btn-gold final-btn" onClick={() => navigate('/find')}>Get Matched Now</button>
        </FadeIn>
      </section>
    </div>
  );
}
