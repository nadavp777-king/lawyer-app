import { ScrollText, Clock, FileWarning, Zap, ShieldCheck, Scale, Search, ListChecks, MessageSquare, Gavel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ProblemSolution.css';

export default function ProblemSolution() {
  const navigate = useNavigate();
  const oldWays = [
    { icon: Clock, title: "Time Wasted", desc: "Weeks of asking friends and calling random offices." },
    { icon: ScrollText, title: "Zero Transparency", desc: "No clear pricing or real reviews upfront." },
    { icon: FileWarning, title: "High Risk", desc: "Choosing wrong can cost you your case." }
  ];

  const newWays = [
    { icon: Zap, title: "Instant Matches", desc: "Find the right lawyer in under a minute." },
    { icon: ShieldCheck, title: "Verified Trust", desc: "Real reviews and transparent track records." },
    { icon: Scale, title: "Fair Pricing", desc: "Know the estimated costs before you commit." }
  ];

  return (
    <div className="ps-container animate-fade-in-up">
      <motion.div 
        className="ps-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="section-title text-error">The Problem</h2>
        <p className="text-slate font-medium">Why finding a lawyer feels broken.</p>
      </motion.div>

      <div className="cards-grid old-way-grid">
        {oldWays.map((way, idx) => {
          const Icon = way.icon;
          return (
            <motion.div 
              key={idx} 
              className="status-card error-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
            >
              <div className="card-icon-wrapper error-icon-bg">
                <Icon className="text-error" size={24} />
              </div>
              <div className="card-content">
                <h4>{way.title}</h4>
                <p>{way.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        className="ps-header mt-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="section-title text-gold">The Solution</h2>
        <p className="text-slate font-medium">The Lawyer Finder way.</p>
      </motion.div>

      <div className="cards-grid new-way-grid">
        {newWays.map((way, idx) => {
          const Icon = way.icon;
          return (
            <motion.div 
              key={idx} 
              className="status-card success-card"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
            >
              <div className="card-icon-wrapper success-icon-bg">
                <Icon className="text-gold" size={24} />
              </div>
              <div className="card-content">
                 <h4>{way.title}</h4>
                 <p>{way.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        className="ps-header mt-12 mb-6 border-top-pt"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="section-title">How It Works</h2>
        <p className="text-slate font-medium">Four simple steps to find your match.</p>
      </motion.div>

      <div className="steps-container">
        {[
          { icon: Search, title: "1. Tell Us What You Need", desc: "Filter by location, legal domain, and your specific problem." },
          { icon: ListChecks, title: "2. Compare Transparently", desc: "Browse curated matches, check verified reviews, and understand costs upfront." },
          { icon: MessageSquare, title: "3. Connect Instantly", desc: "Chat directly with top lawyers through our secure platform." },
          { icon: Gavel, title: "4. Hire 'The One'", desc: "Select the perfect attorney and confidently resolve your case." }
        ].map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div 
              key={idx} 
              className="step-row"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
            >
              <div className="step-icon-wrapper">
                <Icon size={24} className="text-navy" />
              </div>
              <div className="step-text">
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        className="middle-cta-section bottom-cta mt-8"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <h3 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Ready to experience the difference?</h3>
        <p style={{ fontSize: '1.05rem', marginBottom: '16px', fontWeight: 500 }}>Jump straight into our smart matching system to find your ideal lawyer.</p>
        <button className="middle-cta-btn boxy-yellow-btn" onClick={() => navigate('/find')}>
          Start Finding Now <Zap size={22} color="currentColor" fill="currentColor" />
        </button>
      </motion.div>
    </div>
  );
}
