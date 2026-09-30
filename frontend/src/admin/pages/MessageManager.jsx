import React, { useState, useEffect } from 'react';
import { IconMail, IconSearch, IconX, IconCheckCircle, IconPhone, IconMapPin } from '../../components/Icons';
import { fetchMessages, markMessageReadApi, deleteMessageApi } from '../../services/api';

export default function MessageManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await fetchMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Messages load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (msg) => {
    try {
      const newStatus = !msg.isRead;
      await markMessageReadApi(msg._id, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, isRead: newStatus } : m))
      );
      if (selectedMessage && selectedMessage._id === msg._id) {
        setSelectedMessage((prev) => ({ ...prev, isRead: newStatus }));
      }
    } catch (err) {
      alert(err.message || 'Failed to update message');
    }
  };

  const handleDelete = async (msgId) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await deleteMessageApi(msgId);
      setMessages((prev) => prev.filter((m) => m._id !== msgId));
      if (selectedMessage?._id === msgId) setSelectedMessage(null);
    } catch (err) {
      alert(err.message || 'Failed to delete message');
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Unread' && !m.isRead) ||
      (filterStatus === 'Read' && m.isRead);

    const matchSearch =
      (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.phone || '').includes(searchQuery) ||
      (m.message || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchSearch;
  });

  return (
    <div className="admin-page-content">
      <div className="admin-toolbar-card">
        <div className="admin-toolbar-left">
          <div className="search-box">
            <IconSearch size={16} />
            <input
              type="text"
              placeholder="Search sender, company, email, phone, message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="admin-select"
          >
            <option value="All">All Inquiries</option>
            <option value="Unread">Unread Only</option>
            <option value="Read">Read Messages</option>
          </select>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Contact Desk Inquiries ({filteredMessages.length})</h3>
            <p>Direct inquiries received through the contact section</p>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading-state">Loading messages...</div>
        ) : filteredMessages.length === 0 ? (
          <div className="admin-empty-state">
            <IconMail size={36} />
            <h4>No messages found</h4>
            <p>Customer submissions from the Contact page will be listed here.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sender / Company</th>
                  <th>Contact</th>
                  <th>Subject</th>
                  <th>Message Preview</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((msg) => (
                  <tr key={msg._id} className={!msg.isRead ? 'row-unread' : ''}>
                    <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                    <td>
                      <strong>{msg.name}</strong>
                      {msg.company && <span className="cell-sub">{msg.company}</span>}
                    </td>
                    <td>
                      <div>📞 {msg.phone}</div>
                      {msg.email && <span className="cell-sub">✉️ {msg.email}</span>}
                    </td>
                    <td>{msg.subject || 'General Inquiry'}</td>
                    <td>
                      <span className="msg-preview-text">
                        {(msg.message || '').slice(0, 60)}...
                      </span>
                    </td>
                    <td>
                      <button
                        className={`status-pill ${msg.isRead ? 'status-contacted' : 'status-new'}`}
                        onClick={() => handleToggleRead(msg)}
                      >
                        {msg.isRead ? 'Read' : '● Unread'}
                      </button>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button
                          className="btn-outline btn-xs"
                          onClick={() => {
                            setSelectedMessage(msg);
                            if (!msg.isRead) handleToggleRead(msg);
                          }}
                        >
                          Open
                        </button>
                        <button
                          className="btn-danger btn-xs"
                          onClick={() => handleDelete(msg._id)}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="admin-modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Contact Message from {selectedMessage.name}</h3>
              <button className="admin-modal-close" onClick={() => setSelectedMessage(null)}>
                <IconX size={20} />
              </button>
            </div>

            <div className="quote-detail-grid" style={{ marginBottom: '16px' }}>
              <div className="detail-col">
                <div className="detail-row"><strong>From:</strong> <span>{selectedMessage.name}</span></div>
                <div className="detail-row"><strong>Company:</strong> <span>{selectedMessage.company || 'N/A'}</span></div>
                <div className="detail-row"><strong>Phone:</strong> <a href={`tel:${selectedMessage.phone}`}>{selectedMessage.phone}</a></div>
                <div className="detail-row"><strong>Email:</strong> <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email || 'N/A'}</a></div>
              </div>
              <div className="detail-col">
                <div className="detail-row"><strong>Subject:</strong> <span>{selectedMessage.subject || 'General'}</span></div>
                <div className="detail-row"><strong>Date:</strong> <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span></div>
                <div className="detail-row">
                  <strong>Status:</strong>
                  <button
                    className={`status-pill ${selectedMessage.isRead ? 'status-contacted' : 'status-new'}`}
                    onClick={() => handleToggleRead(selectedMessage)}
                  >
                    {selectedMessage.isRead ? 'Read' : '● Unread'}
                  </button>
                </div>
              </div>
            </div>

            <div className="quote-buyer-message-box">
              <strong>Message Content:</strong>
              <p style={{ marginTop: '8px', lineHeight: '1.6' }}>{selectedMessage.message}</p>
            </div>

            <div className="admin-modal-actions">
              <button className="btn-outline" onClick={() => setSelectedMessage(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
