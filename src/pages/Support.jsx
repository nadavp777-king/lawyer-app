import { useState } from 'react';
import { ShieldCheck, Send, CheckCircle, HeartHandshake } from 'lucide-react';
import './Support.css';

export default function Support() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="support-container animate-fade-in-up">
      <div className="support-header">
        <div className="header-icon-wrapper">
          <HeartHandshake size={48} className="text-gold" />
        </div>
        <h2 className="section-title">We're Here For You</h2>
        <p className="support-intro-text">
          Legal issues can be deeply stressful and overwhelming. Whether you're unsure about how the platform works, have a question about a lawyer, or just need guidance on where to start—please don't hesitate to reach out. There are no wrong questions, and our team is dedicated to giving you peace of mind.
        </p>
      </div>

      <div className="trust-badge-card">
        <ShieldCheck size={36} className="text-navy" />
        <div className="trust-text">
          <h4 className="font-serif text-navy">Verified & Secure</h4>
          <p>Your privacy is our priority. We operate strictly under the guidelines of the Ministry of Justice of Israel.</p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="support-form">
          <div className="input-group">
            <input type="text" id="name" required placeholder=" " />
            <label htmlFor="name">Hi, what's your name?</label>
          </div>
          
          <div className="input-group">
            <input type="email" id="email" required placeholder=" " />
            <label htmlFor="email">Where can we reach you? (Email)</label>
          </div>

          <div className="input-group">
            <textarea id="message" rows="5" required placeholder=" "></textarea>
            <label htmlFor="message">How can we help ease your mind today?</label>
          </div>

          <button 
            type="submit" 
            className={`submit-btn ${submitted ? 'submitted' : ''}`}
            disabled={submitted}
          >
            {submitted ? (
              <>
                <CheckCircle size={20} /> Thank you! We'll reply shortly.
              </>
            ) : (
              <>
                <Send size={20} /> Send Secure Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
