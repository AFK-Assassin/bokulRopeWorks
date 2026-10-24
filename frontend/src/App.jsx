import { useState, useEffect, lazy, Suspense } from 'react';
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
import { checkAuthStatus, logoutAdmin } from './services/api';

// Code Splitting: Lazy load non-homepage and administrative components
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./components/TermsConditions'));
const NotFound = lazy(() => import('./components/NotFound'));
const OwnerLogin = lazy(() => import('./admin/OwnerLogin'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));

const PageFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#103926', fontFamily: 'inherit' }}>
    <div style={{ textAlign: 'center' }}>
      <div className="loading-spinner" />
      <p style={{ margin: 0, fontSize: '14px', letterSpacing: '0.05em', color: '#4a5568' }}>Loading Bokul Rope Works...</p>
    </div>
  </div>
);

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

  // Handle hash-based scrolling when landing page renders
  useEffect(() => {
    if (currentPath === '/' && window.location.hash) {
      const elementId = window.location.hash.replace('#', '');
      // Delay to allow React to render all sections
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [currentPath]);

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

  // ROUTE 1: Privacy Policy (/privacy-policy)
  if (currentPath === '/privacy-policy') {
    return (
      <Suspense fallback={<PageFallback />}>
        <PrivacyPolicy
          onNavigateHome={() => navigateTo('/')}
          onOpenQuote={handleOpenQuote}
        />
      </Suspense>
    );
  }

  // ROUTE 2: Terms & Conditions (/terms-and-conditions or /terms)
  if (currentPath === '/terms-and-conditions' || currentPath === '/terms') {
    return (
      <Suspense fallback={<PageFallback />}>
        <TermsConditions
          onNavigateHome={() => navigateTo('/')}
          onOpenQuote={handleOpenQuote}
        />
      </Suspense>
    );
  }

  // ROUTE 3: Dedicated Owner Login (/owner-login)
  if (currentPath === '/owner-login') {
    if (isAuthenticated) {
      return (
        <Suspense fallback={<PageFallback />}>
          <AdminLayout
            currentUser={currentUser}
            onLogout={handleLogout}
            onExitAdmin={() => navigateTo('/')}
          />
        </Suspense>
      );
    }
    return (
      <Suspense fallback={<PageFallback />}>
        <OwnerLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToSite={() => navigateTo('/')}
        />
      </Suspense>
    );
  }

  // ROUTE 4: Admin Dashboard & Management Suite (/admin/*)
  if (currentPath.startsWith('/admin')) {
    if (!isAuthenticated) {
      return (
        <Suspense fallback={<PageFallback />}>
          <OwnerLogin
            onLoginSuccess={handleLoginSuccess}
            onBackToSite={() => navigateTo('/')}
          />
        </Suspense>
      );
    }
    return (
      <Suspense fallback={<PageFallback />}>
        <AdminLayout
          currentUser={currentUser}
          onLogout={handleLogout}
          onExitAdmin={() => navigateTo('/')}
        />
      </Suspense>
    );
  }

  // ROUTE 5: Public Website Homepage (/)
  if (currentPath === '/' || currentPath === '') {
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
          onNavigate={(path) => navigateTo(path)}
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

  // ROUTE 6: Custom 404 Page for Unrecognized URLs
  return (
    <Suspense fallback={<PageFallback />}>
      <NotFound
        onNavigateHome={() => navigateTo('/')}
        onOpenQuote={handleOpenQuote}
      />
    </Suspense>
  );
}

export default App;
