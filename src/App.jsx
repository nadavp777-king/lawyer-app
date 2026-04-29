import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import ProblemSolution from './pages/ProblemSolution';
import MatchUI from './pages/MatchUI';
import Support from './pages/Support';
import MyProgress from './pages/MyProgress';
import Onboarding from './pages/Onboarding';
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

function App() {
  const [onboarded, setOnboarded] = useState(true); // Default true until effect runs

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('userPreferences');
    if (!hasOnboarded) {
      setOnboarded(false);
    }
  }, []);

  if (!onboarded) {
    return <Onboarding onComplete={() => setOnboarded(true)} />;
  }

  return (
    <Router>
      <div className="app-layout">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/why-us" element={<PageWrapper><ProblemSolution /></PageWrapper>} />
            <Route path="/find" element={<PageWrapper><MatchUI /></PageWrapper>} />
            <Route path="/progress" element={<PageWrapper><MyProgress /></PageWrapper>} />
            <Route path="/support" element={<PageWrapper><Support /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
