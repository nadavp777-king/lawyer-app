import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Scale, Search, CheckCircle2 } from 'lucide-react';
import './Onboarding.css';

const STEPS = [
  { id: 'name', title: "Let's get started", subtitle: "What should we call you?", icon: Sparkles },
  { id: 'practice', title: "What do you need help with?", subtitle: "This helps us filter the best attorneys for you.", icon: Scale },
  { id: 'location', title: "Where are you located?", subtitle: "We'll find top lawyers near you.", icon: MapPin },
  { id: 'discovery', title: "One last thing", subtitle: "How did you hear about us?", icon: Search }
];

const PRACTICE_OPTIONS = [
  "Corporate & Tech",
  "Real Estate",
  "Family Law",
  "Criminal Defense",
  "Immigration",
  "Personal Injury"
];

const LOCATION_OPTIONS = [
  "Tel Aviv",
  "Jerusalem",
  "Haifa",
  "Herzliya",
  "Rishon LeZion",
  "Ashdod"
];

const DISCOVERY_OPTIONS = [
  "Social Media (Instagram/TikTok)",
  "Search Engine (Google)",
  "Friend or Colleague",
  "Advertisement",
  "Other"
];

export default function Onboarding({ onComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    practice: '',
    location: '',
    discovery: ''
  });

  const step = STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Save data and complete
      localStorage.setItem('userPreferences', JSON.stringify(formData));
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const isNextDisabled = () => {
    if (step.id === 'name') return formData.name.trim() === '';
    if (step.id === 'practice') return formData.practice === '';
    if (step.id === 'location') return formData.location === '';
    if (step.id === 'discovery') {
      if (formData.discovery === 'Other') {
        return !formData.otherDiscovery || formData.otherDiscovery.trim() === '';
      }
      return formData.discovery === '';
    }
    return false;
  };

  const renderInput = () => {
    switch (step.id) {
      case 'name':
        return (
          <input 
            type="text" 
            className="onboarding-input" 
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && !isNextDisabled() && handleNext()}
            autoFocus
          />
        );
      case 'practice':
        return (
          <div className="onboarding-options">
            {PRACTICE_OPTIONS.map(opt => (
              <button 
                key={opt}
                className={`option-btn ${formData.practice === opt ? 'selected' : ''}`}
                onClick={() => {
                  setFormData({ ...formData, practice: opt });
                  setTimeout(handleNext, 300); // Auto advance slightly delayed
                }}
              >
                {opt}
                {formData.practice === opt && <CheckCircle2 size={18} color="var(--gold)" />}
              </button>
            ))}
          </div>
        );
      case 'location':
        return (
          <div className="onboarding-options">
            {LOCATION_OPTIONS.map(opt => (
              <button 
                key={opt}
                className={`option-btn ${formData.location === opt ? 'selected' : ''}`}
                onClick={() => {
                  setFormData({ ...formData, location: opt });
                  setTimeout(handleNext, 300); // Auto advance
                }}
              >
                {opt}
                {formData.location === opt && <CheckCircle2 size={18} color="var(--gold)" />}
              </button>
            ))}
          </div>
        );
      case 'discovery':
        return (
          <div className="onboarding-options">
            {DISCOVERY_OPTIONS.map(opt => (
              <button 
                key={opt}
                className={`option-btn ${formData.discovery === opt ? 'selected' : ''}`}
                onClick={() => {
                  setFormData({ ...formData, discovery: opt });
                  // Don't auto advance on last step so they can see selection and click "Done"
                }}
              >
                {opt}
                {formData.discovery === opt && <CheckCircle2 size={18} color="var(--gold)" />}
              </button>
            ))}
            <AnimatePresence>
              {formData.discovery === 'Other' && (
                <motion.input 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  type="text" 
                  className="onboarding-input" 
                  placeholder="Please tell us..."
                  value={formData.otherDiscovery || ''}
                  onChange={(e) => setFormData({ ...formData, otherDiscovery: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && !isNextDisabled() && handleNext()}
                  style={{ marginBottom: 0 }}
                  autoFocus
                />
              )}
            </AnimatePresence>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-bg-shape shape-1"></div>
      <div className="onboarding-bg-shape shape-2"></div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentStepIndex}
          className="onboarding-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="onboarding-icon">
            <step.icon size={36} color="var(--gold)" />
          </div>
          
          <h2 className="onboarding-title">{step.title}</h2>
          <p className="onboarding-subtitle">{step.subtitle}</p>

          {renderInput()}

          <div className="onboarding-nav">
            {currentStepIndex > 0 && (
              <button className="btn-secondary" onClick={handleBack}>Back</button>
            )}
            <button 
              className="btn-primary-full" 
              onClick={handleNext}
              disabled={isNextDisabled()}
              style={{ flex: currentStepIndex === 0 ? '1' : '2' }}
            >
              {currentStepIndex === STEPS.length - 1 ? "Complete Setup" : "Continue"}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="progress-dots">
        {STEPS.map((_, idx) => (
          <div key={idx} className={`dot ${idx === currentStepIndex ? 'active' : ''}`} />
        ))}
      </div>
    </div>
  );
}
