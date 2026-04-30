import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    
    if (!passwordRegex.test(password)) {
      setErrorMsg("Password must be at least 6 characters and include letters and numbers.");
      setLoading(false);
      return;
    }

    // Local Mode Bypass
    setTimeout(() => {
      localStorage.setItem('currentUser', JSON.stringify({ email }));
      window.dispatchEvent(new Event('authChange'));
    }, 500); // simulate network delay
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMsg('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-container">
      {/* Background Blobs */}
      <div className="login-bg-shape shape-1"></div>
      <div className="login-bg-shape shape-2"></div>

      <motion.div 
        className="login-card glass-panel"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="login-header">
          <motion.div 
            className="login-logo-wrapper"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <Scale size={36} className="login-logo-icon" />
          </motion.div>
          <h1 className="login-title">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="login-subtitle">
            {isLogin ? 'Enter your details to access your account.' : 'Join our premium legal network today.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
            <span className="helper-text">Must be a valid email format</span>
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
            <span className="helper-text">Password must be at least 6 characters and include letters and numbers.</span>
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit" 
            className="login-btn-primary" 
            disabled={loading}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="login-footer">
          <button type="button" onClick={toggleMode} className="toggle-mode-btn">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="gold-text">{isLogin ? 'Sign Up' : 'Sign In'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
