import React, { useState } from 'react';
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
import AdminPanel from './components/AdminPanel';

function App() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [prefilledProduct, setPrefilledProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [isAdminView, setIsAdminView] = useState(false);

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

  if (isAdminView) {
    return <AdminPanel onCloseAdmin={() => setIsAdminView(false)} />;
  }

  return (
    <div className="app-root">
      {/* Navigation */}
      <Navbar
        onOpenQuote={handleOpenQuote}
        onOpenAdmin={() => setIsAdminView(true)}
      />

      <main>
        {/* Hero Section */}
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

      {/* Footer */}
      <Footer
        onOpenQuote={handleOpenQuote}
        onOpenAdmin={() => setIsAdminView(true)}
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
