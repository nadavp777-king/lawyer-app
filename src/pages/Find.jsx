import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Briefcase, Languages, Clock, ChevronRight } from 'lucide-react';
import { lawyersData } from '../mockData';
import './Find.css';

const LOCATIONS = ["All Locations", "Tel Aviv", "Jerusalem", "Haifa", "Herzliya", "Rishon LeZion", "Ashdod"];
const PRACTICES = ["All Practices", "Corporate & Tech", "Real Estate", "Family Law", "Criminal Defense", "Immigration", "Personal Injury"];

export default function Find() {
  const [filterLocation, setFilterLocation] = useState('All Locations');
  const [filterPractice, setFilterPractice] = useState('All Practices');

  // Load initial filters from localStorage
  useEffect(() => {
    const prefs = localStorage.getItem('userPreferences');
    if (prefs) {
      const { location, practice } = JSON.parse(prefs);
      if (location && LOCATIONS.includes(location)) setFilterLocation(location);
      if (practice && PRACTICES.includes(practice)) setFilterPractice(practice);
    }
  }, []);

  const filteredLawyers = useMemo(() => {
    return lawyersData.filter(lawyer => {
      const matchLocation = filterLocation === 'All Locations' || lawyer.location === filterLocation;
      const matchPractice = filterPractice === 'All Practices' || lawyer.practice === filterPractice;
      return matchLocation && matchPractice;
    });
  }, [filterLocation, filterPractice]);

  return (
    <div className="find-container">
      <header className="find-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="find-title"
        >
          Find Your <span className="gold-text">Legal Partner</span>
        </motion.h1>
        
        <div className="filter-bar glass-panel">
          <div className="filter-group">
            <label><MapPin size={16} /> Location</label>
            <select 
              value={filterLocation} 
              onChange={(e) => setFilterLocation(e.target.value)}
              className="find-select"
            >
              {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label><Briefcase size={16} /> Practice Area</label>
            <select 
              value={filterPractice} 
              onChange={(e) => setFilterPractice(e.target.value)}
              className="find-select"
            >
              {PRACTICES.map(prac => <option key={prac} value={prac}>{prac}</option>)}
            </select>
          </div>
        </div>
      </header>

      <section className="results-section">
        <p className="results-count">Showing {filteredLawyers.length} attorneys</p>
        
        <div className="lawyer-grid">
          <AnimatePresence mode="popLayout">
            {filteredLawyers.map((lawyer, index) => (
              <motion.div
                key={lawyer.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="lawyer-card glass-panel"
              >
                <div className="card-image-container">
                  <img src={lawyer.imageUrl} alt={lawyer.name} className="lawyer-image" />
                  <div className="rating-badge">
                    <Star size={14} fill="var(--gold)" color="var(--gold)" />
                    <span>{lawyer.rating}</span>
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="lawyer-name">{lawyer.name}</h3>
                  
                  <div className="card-info">
                    <div className="info-item">
                      <Briefcase size={14} />
                      <span>{lawyer.practice}</span>
                    </div>
                    <div className="info-item">
                      <MapPin size={14} />
                      <span>{lawyer.location}</span>
                    </div>
                  </div>

                  <p className="lawyer-bio">{lawyer.bio}</p>

                  <div className="card-footer">
                    <div className="hourly-rate">
                      <span className="rate-label">Hourly Rate</span>
                      <span className="rate-value">₪{lawyer.hourlyRateILS}</span>
                    </div>
                    <button className="view-profile-btn">
                      View Profile
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredLawyers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="no-results"
          >
            <h3>No attorneys found matching these criteria.</h3>
            <p>Try adjusting your filters to see more options.</p>
            <button onClick={() => { setFilterLocation('All Locations'); setFilterPractice('All Practices'); }} className="reset-btn">
              Reset Filters
            </button>
          </motion.div>
        )}
      </section>
    </div>
  );
}
