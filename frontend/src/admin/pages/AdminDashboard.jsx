import React, { useState, useEffect } from 'react';
import {
  IconFactory,
  IconShieldCheck,
  IconPhone,
  IconMail,
  IconRope,
  IconArrowRight,
  IconCheckCircle
} from '../../components/Icons';
import {
  fetchAdminProducts,
  fetchInquiries,
  fetchMessages,
  fetchActivityLogs,
} from '../../services/api';

export default function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedProducts: 0,
    newQuotes: 0,
    unreadMessages: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [prods, quotes, msgs, logs] = await Promise.all([
        fetchAdminProducts().catch(() => []),
        fetchInquiries().catch(() => []),
        fetchMessages().catch(() => []),
        fetchActivityLogs({ limit: 8 }).catch(() => []),
      ]);

      const totalProds = prods.length;
      const pubProds = prods.filter((p) => p.isPublished !== false).length;
      const newQ = quotes.filter((q) => (q.status || '').toUpperCase() === 'NEW').length;
      const unreadM = msgs.filter((m) => !m.isRead).length;

      setStats({
        totalProducts: totalProds,
        publishedProducts: pubProds,
        newQuotes: newQ,
        unreadMessages: unreadM,
      });

      setRecentQuotes(quotes.slice(0, 5));
      setRecentMessages(msgs.slice(0, 5));
      setRecentActivities(logs.slice(0, 6));
    } catch (err) {
      console.warn('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-content">
      {/* Top Stat Overview Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card" onClick={() => onNavigate('products')}>
          <div className="a-stat-header">
            <span className="a-stat-label">Total Products</span>
            <span className="a-stat-badge">Catalog</span>
          </div>
          <div className="a-stat-val text-gold">{loading ? '...' : stats.totalProducts}</div>
          <div className="a-stat-sub">{stats.publishedProducts} currently published online</div>
        </div>

        <div className="admin-stat-card" onClick={() => onNavigate('quotes')}>
          <div className="a-stat-header">
            <span className="a-stat-label">New Quote Requests</span>
            <span className="a-stat-badge badge-green">Leads</span>
          </div>
          <div className="a-stat-val text-green">{loading ? '...' : stats.newQuotes}</div>
          <div className="a-stat-sub">Actionable commercial inquiries</div>
        </div>

        <div className="admin-stat-card" onClick={() => onNavigate('messages')}>
          <div className="a-stat-header">
            <span className="a-stat-label">Unread Messages</span>
            <span className="a-stat-badge">Inbox</span>
          </div>
          <div className="a-stat-val text-amber">{loading ? '...' : stats.unreadMessages}</div>
          <div className="a-stat-sub">From website contact desk</div>
        </div>

        <div className="admin-stat-card" onClick={() => onNavigate('settings')}>
          <div className="a-stat-header">
            <span className="a-stat-label">Mill Status</span>
            <span className="a-stat-badge badge-gold">Active</span>
          </div>
          <div className="a-stat-val">Operational</div>
          <div className="a-stat-sub">Howrah Plant Sales Desk Online</div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="admin-quick-actions-card">
        <h3>Quick Mill Operations</h3>
        <div className="quick-actions-btn-group">
          <button className="btn-primary btn-sm" onClick={() => onNavigate('products')}>
            + Add New Product
          </button>
          <button className="btn-outline btn-sm" onClick={() => onNavigate('quotes')}>
            📋 Review Quotes ({stats.newQuotes})
          </button>
          <button className="btn-outline btn-sm" onClick={() => onNavigate('certifications')}>
            📜 Add Certification
          </button>
          <button className="btn-outline btn-sm" onClick={() => onNavigate('media')}>
            🖼️ Upload Media
          </button>
        </div>
      </div>

      {/* Two Column Layout: Recent Quotes & Recent Messages */}
      <div className="admin-dashboard-two-col">
        {/* Recent Quote Requests */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Recent Commercial Quotes</h3>
              <p>Direct inquiries from buyers</p>
            </div>
            <button className="btn-link" onClick={() => onNavigate('quotes')}>
              View All Quotes →
            </button>
          </div>

          {loading ? (
            <div className="admin-loading-state">Loading latest leads...</div>
          ) : recentQuotes.length === 0 ? (
            <div className="admin-empty-state">
              <IconRope size={32} />
              <p>No quote requests yet. New buyer inquiries will appear here automatically.</p>
            </div>
          ) : (
            <div className="admin-mini-table-wrap">
              <table className="admin-mini-table">
                <thead>
                  <tr>
                    <th>Buyer</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentQuotes.map((q) => (
                    <tr key={q._id}>
                      <td>
                        <strong>{q.fullName}</strong>
                        {q.companyName && <span className="cell-sub">{q.companyName}</span>}
                      </td>
                      <td>{q.productInterest}</td>
                      <td>{q.requiredQuantity || 'Standard'}</td>
                      <td>
                        <span className={`status-pill status-${(q.status || 'NEW').toLowerCase()}`}>
                          {q.status || 'NEW'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Contact Messages */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Recent Contact Inquiries</h3>
              <p>Messages from sales desk</p>
            </div>
            <button className="btn-link" onClick={() => onNavigate('messages')}>
              View All Messages →
            </button>
          </div>

          {loading ? (
            <div className="admin-loading-state">Loading messages...</div>
          ) : recentMessages.length === 0 ? (
            <div className="admin-empty-state">
              <IconMail size={32} />
              <p>No messages received yet.</p>
            </div>
          ) : (
            <div className="admin-mini-table-wrap">
              <table className="admin-mini-table">
                <thead>
                  <tr>
                    <th>Sender</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMessages.map((m) => (
                    <tr key={m._id}>
                      <td>
                        <strong>{m.name}</strong>
                        <span className="cell-sub">{m.phone}</span>
                      </td>
                      <td>{m.subject || 'General Inquiry'}</td>
                      <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-pill ${m.isRead ? 'status-contacted' : 'status-new'}`}>
                          {m.isRead ? 'Read' : 'Unread'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Activity Log Snapshot */}
      <div className="admin-card" style={{ marginTop: '20px' }}>
        <div className="admin-card-header">
          <div>
            <h3>Recent Admin Audit Trail</h3>
            <p>Logged activities & changes</p>
          </div>
          <button className="btn-link" onClick={() => onNavigate('activity')}>
            Full Audit Log →
          </button>
        </div>

        {loading ? (
          <div className="admin-loading-state">Loading activity...</div>
        ) : recentActivities.length === 0 ? (
          <div className="admin-empty-state">
            <p>No logged activities recorded yet.</p>
          </div>
        ) : (
          <div className="admin-activity-list">
            {recentActivities.map((act) => (
              <div key={act._id} className="activity-item">
                <div className="act-bullet"></div>
                <div className="act-info">
                  <strong>{act.action}</strong>
                  <span>{new Date(act.createdAt).toLocaleString()} • {act.adminEmail}</span>
                </div>
                <span className="act-cat-badge">{act.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
