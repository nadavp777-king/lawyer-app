import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
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

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // Note: App.js onAuthStateChanged handles the redirect automatically
    } catch (error) {
      // Clean up Firebase error messages
      let cleanMsg = "An error occurred. Please try again.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        cleanMsg = "Invalid email or password.";
      } else if (error.code === 'auth/email-already-in-use') {
        cleanMsg = "An account with this email already exists.";
      } else if (error.code === 'auth/weak-password') {
        cleanMsg = "Password should be at least 6 characters.";
      } else if (error.code === 'auth/invalid-email') {
        cleanMsg = "Please enter a valid email address.";
      }
      
      setErrorMsg(cleanMsg);
      setLoading(false);
    }
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
