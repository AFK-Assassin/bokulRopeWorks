import React from 'react';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container nav-container">
        <div className="brand-logo">
          <div className="brand-badge">BRW</div>
          <div className="brand-text">
            Bokul Rope Works
            <span>Jute Rope Manufacturer • Howrah</span>
          </div>
        </div>

        <nav>
          <ul className="nav-links">
            <li><a href="#home" className="active">Home</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#specifications">Specifications</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        <div className="nav-cta">
          <a href="#contact" className="btn-primary">
            Request Quote
          </a>
        </div>
      </div>
    </header>
  );
}
