import React, { useState, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { CartProvider } from './context/CartContext';
import Preloader from './components/layout/Preloader';
import CustomCursor from './components/layout/CustomCursor';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import ErrorBoundary from './components/layout/ErrorBoundary';

import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function AppContent() {
  const location = useLocation();
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Stable identity so the Preloader animation effect is not restarted.
  const handlePreloaderComplete = useCallback(() => setPreloaderDone(true), []);

  return (
    <>
      <Preloader onComplete={handlePreloaderComplete} />
      <CustomCursor />

      <div className="noise-overlay" />

      {/* Only show main UI after preloader finishes its intro phase */}
      <div style={{ opacity: preloaderDone ? 1 : 0, transition: 'opacity 0.5s' }}>
        <Navbar />
        <CartDrawer />

        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </AnimatePresence>
        </ErrorBoundary>

        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
