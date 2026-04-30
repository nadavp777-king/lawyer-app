import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
// Removed Firebase imports for local mode

import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import ProblemSolution from './pages/ProblemSolution';
import MatchUI from './pages/MatchUI';
import Support from './pages/Support';
import MyProgress from './pages/MyProgress';
import Onboarding from './pages/Onboarding';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import './App.css';

// Wrapper for page transitions
const PageWrapper = ({ children }) => {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="page-container"
    >
      {children}
    </motion.div>
  );
};

// Premium Gold Loading Spinner
const LoadingSpinner = () => (
  <div style={{
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh', 
    backgroundColor: '#0a0f1d'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '4px solid rgba(255, 215, 0, 0.1)',
      borderTop: '4px solid #ffd700',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

// Protected Routes Logic
const ProtectedRoute = ({ user, userData, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (!userData?.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return children;
};

const OnboardingRoute = ({ user, userData, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (userData?.onboardingComplete) return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ user, userData, children }) => {
  if (user) {
    if (userData?.onboardingComplete) return <Navigate to="/" replace />;
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = localStorage.getItem('currentUser');
      const onboardComplete = localStorage.getItem('onboardingComplete') === 'true';

      if (currentUser) {
        setUser(JSON.parse(currentUser));
        if (onboardComplete) {
          const prefs = localStorage.getItem('userPreferences');
          setUserData(prefs ? { ...JSON.parse(prefs), onboardingComplete: true } : { onboardingComplete: true });
        } else {
          setUserData({ onboardingComplete: false });
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    };

    checkAuth();
    
    // Listen for custom event to trigger re-renders on login/logout/onboarding
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  const handleOnboardingComplete = async (formData) => {
    localStorage.setItem('userPreferences', JSON.stringify(formData));
    localStorage.setItem('onboardingComplete', 'true');
    window.dispatchEvent(new Event('authChange'));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const isFullyAuthenticated = user && userData?.onboardingComplete;

  return (
    <Router>
      <div className="app-layout">
        {isFullyAuthenticated && <Navbar />}
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Route */}
            <Route 
              path="/login" 
              element={
                <PublicRoute user={user} userData={userData}>
                  <PageWrapper><Login /></PageWrapper>
                </PublicRoute>
              } 
            />

            {/* Onboarding Route */}
            <Route 
              path="/onboarding" 
              element={
                <OnboardingRoute user={user} userData={userData}>
                  <PageWrapper><Onboarding onComplete={handleOnboardingComplete} /></PageWrapper>
                </OnboardingRoute>
              } 
            />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute user={user} userData={userData}><PageWrapper><Home /></PageWrapper></ProtectedRoute>} />
            <Route path="/why-us" element={<ProtectedRoute user={user} userData={userData}><PageWrapper><ProblemSolution /></PageWrapper></ProtectedRoute>} />
            <Route path="/find" element={<ProtectedRoute user={user} userData={userData}><PageWrapper><MatchUI /></PageWrapper></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute user={user} userData={userData}><PageWrapper><MyProgress /></PageWrapper></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute user={user} userData={userData}><PageWrapper><Support /></PageWrapper></ProtectedRoute>} />
            
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to={user ? (userData?.onboardingComplete ? "/" : "/onboarding") : "/login"} replace />} />
          </Routes>
        </AnimatePresence>
        {isFullyAuthenticated && <BottomNav />}
      </div>
    </Router>
  );
}

export default App;
