import React, { useState } from 'react';
import {
  IconFactory,
  IconRope,
  IconShieldCheck,
  IconMail,
  IconPhone,
  IconX,
  IconArrowRight,
  IconCheckCircle
} from '../components/Icons';
import AdminDashboard from './pages/AdminDashboard';
import ProductManager from './pages/ProductManager';
import CategoryManager from './pages/CategoryManager';
import QuoteManager from './pages/QuoteManager';
import MessageManager from './pages/MessageManager';
import ProcessManager from './pages/ProcessManager';
import ApplicationManager from './pages/ApplicationManager';
import CertificationManager from './pages/CertificationManager';
import MediaManager from './pages/MediaManager';
import HomepageManager from './pages/HomepageManager';
import SettingsManager from './pages/SettingsManager';
import ProfileManager from './pages/ProfileManager';
import ActivityLogManager from './pages/ActivityLogManager';

export default function AdminLayout({ currentUser, onLogout, onExitAdmin }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Products Catalog', icon: '🪢' },
    { id: 'categories', label: 'Categories', icon: '🏷️' },
    { id: 'quotes', label: 'Quote Requests', icon: '📋' },
    { id: 'messages', label: 'Contact Messages', icon: '✉️' },
    { id: 'process', label: 'Manufacturing Process', icon: '⚙️' },
    { id: 'applications', label: 'Sector Applications', icon: '🏭' },
    { id: 'certifications', label: 'Standards & Certs', icon: '📜' },
    { id: 'media', label: 'Media Library', icon: '🖼️' },
    { id: 'homepage', label: 'Homepage Content', icon: '🏠' },
    { id: 'settings', label: 'Website Settings', icon: '🔧' },
    { id: 'activity', label: 'Audit Activity Log', icon: '🛡️' },
    { id: 'profile', label: 'Owner Profile', icon: '👤' },
  ];

  const pageTitles = {
    dashboard: 'Executive Dashboard',
    products: 'Product Catalogue & Specs Manager',
    categories: 'Product Categories',
    quotes: 'Commercial Quote Requests & CRM',
    messages: 'Customer Inquiries & Messages',
    process: '8-Stage Manufacturing Workflow',
    applications: 'Core Industrial Sectors & Applications',
    certifications: 'Quality Standards & BIS Certifications',
    media: 'Mill Photo & Document Library',
    homepage: 'Controlled Homepage Content',
    settings: 'Website Settings & Sales Info',
    activity: 'Audit Activity Trail',
    profile: 'Owner Security Credentials',
  };

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileDrawerOpen(false);
  };

  return (
    <div className="admin-layout-root">
      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${mobileDrawerOpen ? 'drawer-open' : ''}`}>
        <div className="sidebar-brand">
          <img src="/images/BRW-logo.webp" alt="BRW" className="sidebar-logo" />
          <div className="sidebar-brand-text">
            <strong>Bokul Rope Works</strong>
            <span>Owner Control Desk</span>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setMobileDrawerOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-title">Overview</div>
          <button
            className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <span className="item-icon">📊</span>
            <span>Dashboard</span>
          </button>

          <div className="nav-group-title">Commercial Leads</div>
          <button
            className={`sidebar-nav-item ${activeTab === 'quotes' ? 'active' : ''}`}
            onClick={() => handleNavClick('quotes')}
          >
            <span className="item-icon">📋</span>
            <span>Quote Requests</span>
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => handleNavClick('messages')}
          >
            <span className="item-icon">✉️</span>
            <span>Contact Messages</span>
          </button>

          <div className="nav-group-title">Catalog & Mill Operations</div>
          <button
            className={`sidebar-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => handleNavClick('products')}
          >
            <span className="item-icon">🪢</span>
            <span>Products Catalog</span>
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => handleNavClick('categories')}
          >
            <span className="item-icon">🏷️</span>
            <span>Categories</span>
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === 'process' ? 'active' : ''}`}
            onClick={() => handleNavClick('process')}
          >
            <span className="item-icon">⚙️</span>
            <span>Manufacturing Process</span>
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => handleNavClick('applications')}
          >
            <span className="item-icon">🏭</span>
            <span>Sector Applications</span>
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === 'certifications' ? 'active' : ''}`}
            onClick={() => handleNavClick('certifications')}
          >
            <span className="item-icon">📜</span>
            <span>Standards & Certs</span>
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => handleNavClick('media')}
          >
            <span className="item-icon">🖼️</span>
            <span>Media Library</span>
          </button>

          <div className="nav-group-title">Configuration</div>
          <button
            className={`sidebar-nav-item ${activeTab === 'homepage' ? 'active' : ''}`}
            onClick={() => handleNavClick('homepage')}
          >
            <span className="item-icon">🏠</span>
            <span>Homepage Content</span>
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavClick('settings')}
          >
            <span className="item-icon">🔧</span>
            <span>Website Settings</span>
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => handleNavClick('activity')}
          >
            <span className="item-icon">🛡️</span>
            <span>Audit Trail</span>
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavClick('profile')}
          >
            <span className="item-icon">👤</span>
            <span>Owner Profile</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <div className="user-avatar">BR</div>
            <div className="user-text">
              <strong>{currentUser?.name || 'Bokul Admin'}</strong>
              <span>{currentUser?.email || 'admin@bokulrope.com'}</span>
            </div>
          </div>
          <button className="sidebar-logout-btn" onClick={onLogout} title="Logout">
            Logout ⎋
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="admin-main-wrapper">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="topbar-left-area">
            <button
              className="admin-menu-toggle"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open sidebar drawer"
            >
              ☰
            </button>
            <div className="topbar-breadcrumbs">
              <span className="crumb-root">Owner Portal</span>
              <span className="crumb-sep">/</span>
              <span className="crumb-current">{pageTitles[activeTab] || 'Dashboard'}</span>
            </div>
          </div>

          <div className="topbar-right-area">
            <button
              className="btn-outline btn-xs exit-site-btn"
              onClick={onExitAdmin}
              title="View public website"
            >
              🌐 View Public Website
            </button>
            <div className="admin-header-pill">
              <span className="live-dot"></span>
              <span>Encrypted Session</span>
            </div>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="admin-body">
          {activeTab === 'dashboard' && <AdminDashboard onNavigate={handleNavClick} />}
          {activeTab === 'products' && <ProductManager />}
          {activeTab === 'categories' && <CategoryManager />}
          {activeTab === 'quotes' && <QuoteManager />}
          {activeTab === 'messages' && <MessageManager />}
          {activeTab === 'process' && <ProcessManager />}
          {activeTab === 'applications' && <ApplicationManager />}
          {activeTab === 'certifications' && <CertificationManager />}
          {activeTab === 'media' && <MediaManager />}
          {activeTab === 'homepage' && <HomepageManager />}
          {activeTab === 'settings' && <SettingsManager />}
          {activeTab === 'activity' && <ActivityLogManager />}
          {activeTab === 'profile' && <ProfileManager onLogout={onLogout} />}
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          className="admin-drawer-backdrop"
          onClick={() => setMobileDrawerOpen(false)}
        ></div>
      )}
    </div>
  );
}
