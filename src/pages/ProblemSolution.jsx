import { ScrollText, Clock, FileWarning, Zap, ShieldCheck, Scale, Search, ListChecks, MessageSquare, Gavel, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ProblemSolution.css';

export default function ProblemSolution() {
  const navigate = useNavigate();
  
  const comparisons = [
    {
      problem: { icon: Clock, title: "Time Wasted", desc: "Weeks of asking friends and calling random offices." },
      solution: { icon: Zap, title: "Instant Matches", desc: "Find the right lawyer in under a minute." }
    },
    {
      problem: { icon: ScrollText, title: "Zero Transparency", desc: "No clear pricing or real reviews upfront." },
      solution: { icon: ShieldCheck, title: "Verified Trust", desc: "Real reviews and transparent track records." }
    },
    {
      problem: { icon: FileWarning, title: "High Risk", desc: "Choosing wrong can cost you your case." },
      solution: { icon: Scale, title: "Fair Pricing", desc: "Know the estimated costs before you commit." }
    }
  ];

  const steps = [
    { icon: Search, title: "1. Tell Us What You Need", desc: "Filter by location, legal domain, and your specific problem." },
    { icon: ListChecks, title: "2. Compare Transparently", desc: "Browse curated matches, check verified reviews, and understand costs upfront." },
    { icon: MessageSquare, title: "3. Connect Instantly", desc: "Chat directly with top lawyers through our secure platform." },
    { icon: Gavel, title: "4. Hire 'The One'", desc: "Select the perfect attorney and confidently resolve your case." }
  ];

  const problemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      x: [0, -4, 4, -2, 2, 0],
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const solutionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 80, damping: 20 } 
    }
  };

  return (
    <div className="ps-container luxury-minimalist">
      <motion.div 
        className="ps-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="section-title playfair-title hidden-desktop">The Problem <span className="vs-text">vs</span> The Solution</h2>
      </motion.div>

      <div className="comparison-section">
        <div className="comparison-headers hidden-mobile">
          <h2 className="playfair-title text-muted-red">The Problem</h2>
          <h2 className="playfair-title text-navy">The Solution</h2>
        </div>

        <div className="comparison-grid">
          {comparisons.map((pair, idx) => {
            const ProbIcon = pair.problem.icon;
            const SolIcon = pair.solution.icon;
            return (
              <div key={idx} className="comparison-row">
                {/* Mobile Header for Problem */}
                <h3 className="mobile-only-header text-muted-red">The Problem</h3>
                <motion.div 
                  className="luxury-card problem-card glassmorphism"
                  variants={problemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <div className="golden-ratio-icon muted-bg">
                    <ProbIcon className="icon-heavy" size={28} />
                  </div>
                  <div className="card-content">
                    <h4>{pair.problem.title}</h4>
                    <p>{pair.problem.desc}</p>
                  </div>
                </motion.div>

                {/* Mobile Header for Solution */}
                <h3 className="mobile-only-header text-navy mt-4">The Solution</h3>
                <motion.div 
                  className="luxury-card solution-card glassmorphism"
                  variants={solutionVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <div className="golden-ratio-icon gold-bg">
                    <SolIcon className="icon-light text-gold" size={28} />
                  </div>
                  <div className="card-content">
                     <h4>{pair.solution.title}</h4>
                     <p>{pair.solution.desc}</p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <motion.div 
        className="ps-header mt-16 mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="section-title playfair-title text-navy">How It Works</h2>
        <p className="text-slate font-inter">Four simple steps to find your match.</p>
      </motion.div>

      <div className="steps-container-luxury">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div 
              key={idx} 
              className="step-card-luxury glassmorphism"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
            >
              <div className="step-icon-wrapper-luxury">
                <Icon size={28} className="text-navy" />
              </div>
              <div className="step-text-luxury">
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        className="luxury-cta-section bottom-cta mt-16"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <h3 className="playfair-title">Ready to experience the difference?</h3>
        <p className="font-inter">Jump straight into our smart matching system to find your ideal lawyer.</p>
        <button className="golden-gradient-btn" onClick={() => navigate('/find')}>
          Start Finding Now <ArrowRight size={20} />
        </button>
      </motion.div>
    </div>
  );
}
