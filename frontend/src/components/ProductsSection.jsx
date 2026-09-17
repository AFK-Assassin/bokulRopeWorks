import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS, CATEGORIES } from '../data/productsData';
import { fetchProducts } from '../services/api';
import { IconSearch, IconRope } from './Icons';

export default function ProductsSection({ onSelectProduct, onOpenQuote }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveProducts, setLiveProducts] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    const fetched = await fetchProducts(selectedCategory);
    if (fetched && fetched.length > 0) {
      setLiveProducts(fetched);
    }
  };

  const currentProducts = liveProducts || PRODUCTS;

  const filteredProducts = useMemo(() => {
    return currentProducts.filter((p) => {
      const matchCategory = selectedCategory === 'All' || (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
      const matchQuery =
        (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.shortDesc || p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.diameterRange || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(p.applications) ? p.applications : []).some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery, currentProducts]);

  return (
    <section id="products" className="section products-section">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-subtitle">Catalog & Specifications</div>
          <h2 className="section-title">Industrial Jute Product Range</h2>
          <p className="section-desc">
            Manufactured from selected Bengal golden fiber, precision-twisted to ensure minimal elongation and high tensile strength.
          </p>
        </motion.div>

        {/* Filter & Search Bar */}
        <div className="catalog-toolbar">
          <div className="category-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="search-box">
            <IconSearch size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search diameter, type, or application..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="no-products-found">
            <IconRope size={48} />
            <h3>No matching products found</h3>
            <p>Try searching for a different diameter, category, or application.</p>
            <button className="btn-outline" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div 
            className="products-card-grid"
            layout
          >
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id || product.id}
                  className="product-item-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="product-card-image-wrap">
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80'}
                      alt={product.name}
                      className="product-card-img"
                    />
                    <span className="product-category-badge">{product.category}</span>
                    {product.badge && <span className="product-highlight-badge">{product.badge}</span>}
                  </div>

                  <div className="product-card-body-content">
                    <h3 className="product-card-title">{product.name}</h3>
                    <p className="product-card-desc">{product.shortDesc || product.description}</p>

                    {/* Specs Box */}
                    <div className="product-spec-summary">
                      <div className="spec-item">
                        <span className="spec-label">Diameter:</span>
                        <span className="spec-value">{product.diameterRange}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Plies:</span>
                        <span className="spec-value">{product.ply || product.plies}</span>
                      </div>
                      {product.breakingStrength && (
                        <div className="spec-item">
                          <span className="spec-label">Breaking Load:</span>
                          <span className="spec-value text-amber">{product.breakingStrength}</span>
                        </div>
                      )}
                      <div className="spec-item">
                        <span className="spec-label">MOQ:</span>
                        <span className="spec-value">{product.moq}</span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="product-card-actions">
                      <button
                        className="btn-card-details"
                        onClick={() => onSelectProduct(product)}
                      >
                        Specs Sheet
                      </button>
                      <button
                        className="btn-card-quote-sm"
                        onClick={() => onOpenQuote(product)}
                      >
                        Request Quote →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Custom Order Callout */}
        <motion.div 
          className="custom-order-box"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="custom-order-text">
            <h4>Need a specialized twist pitch or custom diameter?</h4>
            <p>Our Howrah plant manufactures custom batches engineered directly to procurement tender specifications.</p>
          </div>
          <button className="btn-primary" onClick={() => onOpenQuote('Custom Engineered OEM Jute Ropes')}>
            Inquire Custom Batch Specs
          </button>
        </motion.div>
      </div>
    </section>
  );
}
