import React, { useState, useEffect } from 'react';
import { IconSearch, IconShieldCheck } from '../../components/Icons';
import { fetchActivityLogs } from '../../services/api';

export default function ActivityLogManager() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchActivityLogs({ limit: 100 });
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Activity log error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchCat = categoryFilter === 'All' || log.category === categoryFilter;
    const matchSearch =
      (log.action || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.adminEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="admin-page-content">
      <div className="admin-toolbar-card">
        <div className="admin-toolbar-left">
          <div className="search-box">
            <IconSearch size={16} />
            <input
              type="text"
              placeholder="Search audit actions, admin email, details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="admin-select"
          >
            <option value="All">All Categories</option>
            <option value="Product">Product Updates</option>
            <option value="Quote">Quote Management</option>
            <option value="Message">Contact Messages</option>
            <option value="Process">Manufacturing Process</option>
            <option value="Application">Sector Applications</option>
            <option value="Certification">Certifications</option>
            <option value="Media">Media Library</option>
            <option value="Settings">Website Settings</option>
            <option value="Auth">Authentication & Logins</option>
          </select>
        </div>

        <div className="admin-toolbar-right">
          <button className="btn-outline btn-sm" onClick={loadLogs}>
            🔄 Refresh Logs
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Administrative Audit Trail ({filteredLogs.length})</h3>
            <p>Immutable log of actions performed by authorized owner credentials</p>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading-state">Loading audit trail...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="admin-empty-state">
            <IconShieldCheck size={36} />
            <h4>No activity recorded</h4>
            <p>Admin actions (creating products, updating quotes, etc.) will be logged here.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Category</th>
                  <th>Admin User</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log._id}>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                    <td><strong>{log.action}</strong></td>
                    <td>
                      <span className="act-cat-badge">{log.category}</span>
                    </td>
                    <td><code>{log.adminEmail}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
