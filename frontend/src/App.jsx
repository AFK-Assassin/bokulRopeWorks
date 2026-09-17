import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductHighlights from './components/ProductHighlights';
import WhyChooseUs from './components/WhyChooseUs';
import QuoteBanner from './components/QuoteBanner';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main>
        <Hero />
        <ProductHighlights />
        <WhyChooseUs />
        <QuoteBanner />
      </main>
      <Footer />
    </div>
  );
}

export default App;
