import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustMetrics from './components/TrustMetrics';
import ProductsSection from './components/ProductsSection';
import ProductDetailModal from './components/ProductDetailModal';
import ManufacturingProcess from './components/ManufacturingProcess';
import ApplicationsSection from './components/ApplicationsSection';
import QualitySpecs from './components/QualitySpecs';
import AboutSection from './components/AboutSection';
import FAQSection from './components/FAQSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import QuoteModal from './components/QuoteModal';
import FloatingCTA from './components/FloatingCTA';
import OwnerLogin from './admin/OwnerLogin';
import AdminLayout from './admin/AdminLayout';
import { checkAuthStatus, logoutAdmin } from './services/api';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuthStatus());
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('adminUser'));
    } catch {
      return null;
    }
  });

  // Modals state for public website
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [prefilledProduct, setPrefilledProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      setIsAuthenticated(checkAuthStatus());
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    setIsAuthenticated(checkAuthStatus());
  };

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    navigateTo('/admin/dashboard');
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigateTo('/owner-login');
  };

  const handleOpenQuote = (productOrName = null) => {
    if (productOrName) {
      if (typeof productOrName === 'string') {
        setPrefilledProduct({ name: productOrName });
      } else {
        setPrefilledProduct(productOrName);
      }
    } else {
      setPrefilledProduct(null);
    }
    setQuoteModalOpen(true);
  };

  const handleCloseQuote = () => {
    setQuoteModalOpen(false);
    setPrefilledProduct(null);
  };

  const handleSelectProduct = (product) => {
    setDetailProduct(product);
  };

  const handleCloseDetail = () => {
    setDetailProduct(null);
  };

  // ROUTE 1: Dedicated Owner Login (/owner-login)
  if (currentPath === '/owner-login') {
    if (isAuthenticated) {
      return (
        <AdminLayout
          currentUser={currentUser}
          onLogout={handleLogout}
          onExitAdmin={() => navigateTo('/')}
        />
      );
    }
    return (
      <OwnerLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToSite={() => navigateTo('/')}
      />
    );
  }

  // ROUTE 2: Admin Dashboard & Management Suite (/admin/*)
  if (currentPath.startsWith('/admin')) {
    if (!isAuthenticated) {
      return (
        <OwnerLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToSite={() => navigateTo('/')}
        />
      );
    }
    return (
      <AdminLayout
        currentUser={currentUser}
        onLogout={handleLogout}
        onExitAdmin={() => navigateTo('/')}
      />
    );
  }

  // ROUTE 3: Public Website
  return (
    <div className="app-root">
      {/* Navigation - Clean Public Nav without Admin Button */}
      <Navbar
        onOpenQuote={handleOpenQuote}
      />

      <main>
        {/* Hero Section - Preserved exactly as approved */}
        <Hero onOpenQuote={handleOpenQuote} />

        {/* 4 Trust Pillars */}
        <TrustMetrics />

        {/* Product Catalog & Specifications */}
        <ProductsSection
          onSelectProduct={handleSelectProduct}
          onOpenQuote={handleOpenQuote}
        />

        {/* 8-Stage Manufacturing Workflow */}
        <ManufacturingProcess onOpenQuote={handleOpenQuote} />

        {/* Core Industry Applications */}
        <ApplicationsSection onOpenQuote={handleOpenQuote} />

        {/* Technical Specs & Breaking Load Tables */}
        <QualitySpecs onOpenQuote={handleOpenQuote} />

        {/* Company Legacy & Heritage */}
        <AboutSection onOpenQuote={handleOpenQuote} />

        {/* B2B FAQ Accordion */}
        <FAQSection onOpenQuote={handleOpenQuote} />

        {/* Interactive Quote & Contact Form */}
        <ContactSection />
      </main>

      {/* Footer with subtle discreet owner link */}
      <Footer
        onOpenQuote={handleOpenQuote}
        onOpenAdmin={() => navigateTo('/owner-login')}
      />

      {/* Floating CTA Buttons */}
      <FloatingCTA onOpenQuote={handleOpenQuote} />

      {/* Full Product Specifications Modal */}
      <ProductDetailModal
        product={detailProduct}
        isOpen={!!detailProduct}
        onClose={handleCloseDetail}
        onRequestQuote={handleOpenQuote}
      />

      {/* Request Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={handleCloseQuote}
        prefilledProduct={prefilledProduct}
      />
    </div>
  );
}

export default App;
