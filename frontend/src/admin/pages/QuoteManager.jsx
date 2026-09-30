import React, { useState, useEffect } from 'react';
import {
  IconRope,
  IconSearch,
  IconX,
  IconCheckCircle,
  IconPhone,
  IconMail,
  IconMapPin
} from '../../components/Icons';
import {
  fetchInquiries,
  updateInquiryStatusApi,
  deleteInquiryApi
} from '../../services/api';

export default function QuoteManager() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [internalNoteInput, setInternalNoteInput] = useState('');
  const [updatingNote, setUpdatingNote] = useState(false);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const data = await fetchInquiries();
      setQuotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Quotes load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (quoteId, newStatus) => {
    try {
      await updateInquiryStatusApi(quoteId, { status: newStatus });
      setQuotes((prev) =>
        prev.map((q) => (q._id === quoteId ? { ...q, status: newStatus } : q))
      );
      if (selectedQuote && selectedQuote._id === quoteId) {
        setSelectedQuote((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(err.message || 'Failed to update quote status');
    }
  };

  const handleSaveInternalNote = async () => {
    if (!selectedQuote) return;
    setUpdatingNote(true);
    try {
      await updateInquiryStatusApi(selectedQuote._id, { internalNotes: internalNoteInput });
      setSelectedQuote((prev) => ({ ...prev, internalNotes: internalNoteInput }));
      setQuotes((prev) =>
        prev.map((q) => (q._id === selectedQuote._id ? { ...q, internalNotes: internalNoteInput } : q))
      );
    } catch (err) {
      alert(err.message || 'Failed to save notes');
    } finally {
      setUpdatingNote(false);
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    if (!window.confirm('Are you sure you want to delete this buyer quote request?')) return;
    try {
      await deleteInquiryApi(quoteId);
      setQuotes((prev) => prev.filter((q) => q._id !== quoteId));
      if (selectedQuote?._id === quoteId) setSelectedQuote(null);
    } catch (err) {
      alert(err.message || 'Failed to delete quote');
    }
  };

  const exportCSV = () => {
    if (quotes.length === 0) return alert('No quotes available to export.');
    const headers = [
      'Date',
      'Buyer Name',
      'Company',
      'Phone',
      'WhatsApp',
      'Email',
      'Product',
      'Diameter',
      'Quantity',
      'Delivery Port/City',
      'Status',
      'Indicative Rate',
      'Buyer Note',
      'Internal Notes'
    ];

    const rows = quotes.map((q) => [
      new Date(q.createdAt).toLocaleDateString(),
      `"${(q.fullName || '').replace(/"/g, '""')}"`,
      `"${(q.companyName || '').replace(/"/g, '""')}"`,
      `"${q.phone || ''}"`,
      `"${q.whatsApp || q.phone || ''}"`,
      `"${q.email || ''}"`,
      `"${(q.productInterest || '').replace(/"/g, '""')}"`,
      `"${q.diameter || ''}"`,
      `"${(q.requiredQuantity || '').replace(/"/g, '""')}"`,
      `"${(q.deliveryLocation || '').replace(/"/g, '""')}"`,
      q.status || 'NEW',
      `"${q.estimate?.priceRangePerKg || ''}"`,
      `"${(q.message || '').replace(/"/g, '""')}"`,
      `"${(q.internalNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `BokulRopeWorks_Quotes_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'QUOTED', 'NEGOTIATING', 'WON', 'LOST'];

  // Filter quotes
  const filteredQuotes = quotes.filter((q) => {
    const qStatus = (q.status || 'NEW').toUpperCase();
    const matchStatus = statusFilter === 'All' || qStatus === statusFilter;
    const matchSearch =
      (q.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.phone || '').includes(searchQuery) ||
      (q.productInterest || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.deliveryLocation || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchSearch;
  });

  const countByStatus = (st) =>
    quotes.filter((q) => (q.status || 'NEW').toUpperCase() === st).length;

  return (
    <div className="admin-page-content">
      {/* Top Status Tabs */}
      <div className="status-pipeline-tabs">
        <button
          className={`pipeline-tab ${statusFilter === 'All' ? 'active' : ''}`}
          onClick={() => setStatusFilter('All')}
        >
          All Quotes ({quotes.length})
        </button>
        {STATUS_OPTIONS.map((st) => (
          <button
            key={st}
            className={`pipeline-tab ${statusFilter === st ? 'active' : ''}`}
            onClick={() => setStatusFilter(st)}
          >
            {st} ({countByStatus(st)})
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar-card">
        <div className="admin-toolbar-left">
          <div className="search-box">
            <IconSearch size={16} />
            <input
              type="text"
              placeholder="Search buyer name, phone, email, product, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-toolbar-right">
          <button className="btn-outline btn-sm" onClick={exportCSV}>
            📥 Export to CSV
          </button>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Buyer Commercial Inquiries ({filteredQuotes.length})</h3>
            <p>Direct leads and quote requests submitted via website</p>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading-state">Loading quotation requests...</div>
        ) : filteredQuotes.length === 0 ? (
          <div className="admin-empty-state">
            <IconRope size={36} />
            <h4>No quote requests found</h4>
            <p>Inquiries submitted from the Request Quote modal or Contact section appear here in real time.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Buyer / Enterprise</th>
                  <th>Contact Info</th>
                  <th>Product & Spec</th>
                  <th>Quantity</th>
                  <th>Estimate</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map((q) => (
                  <tr key={q._id}>
                    <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                    <td>
                      <strong>{q.fullName}</strong>
                      {q.companyName && <span className="cell-sub">{q.companyName}</span>}
                    </td>
                    <td>
                      <div>📞 {q.phone}</div>
                      {q.email && <span className="cell-sub">✉️ {q.email}</span>}
                    </td>
                    <td>
                      <strong>{q.productInterest}</strong>
                      {q.deliveryLocation && (
                        <span className="cell-sub">📍 {q.deliveryLocation}</span>
                      )}
                    </td>
                    <td>{q.requiredQuantity || 'Standard'}</td>
                    <td>
                      <span className="rate-badge">
                        {q.estimate?.priceRangePerKg || '₹110 - ₹135/kg'}
                      </span>
                    </td>
                    <td>
                      <select
                        className={`status-select status-${(q.status || 'NEW').toLowerCase()}`}
                        value={(q.status || 'NEW').toUpperCase()}
                        onChange={(e) => handleStatusChange(q._id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button
                          className="btn-outline btn-xs"
                          onClick={() => {
                            setSelectedQuote(q);
                            setInternalNoteInput(q.internalNotes || '');
                          }}
                        >
                          View Details
                        </button>
                        <button
                          className="btn-danger btn-xs"
                          onClick={() => handleDeleteQuote(q._id)}
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

      {/* Quote Detail Modal / Drawer */}
      {selectedQuote && (
        <div className="admin-modal-overlay" onClick={() => setSelectedQuote(null)}>
          <div className="admin-modal-box large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Commercial Lead Inquiry Details</h3>
              <button className="admin-modal-close" onClick={() => setSelectedQuote(null)}>
                <IconX size={20} />
              </button>
            </div>

            <div className="quote-detail-grid">
              <div className="detail-col">
                <h4>Buyer & Company Profile</h4>
                <div className="detail-row"><strong>Full Name:</strong> <span>{selectedQuote.fullName}</span></div>
                <div className="detail-row"><strong>Company:</strong> <span>{selectedQuote.companyName || 'N/A'}</span></div>
                <div className="detail-row"><strong>Phone:</strong> <a href={`tel:${selectedQuote.phone}`}>{selectedQuote.phone}</a></div>
                <div className="detail-row"><strong>WhatsApp:</strong> <a href={`https://wa.me/${(selectedQuote.whatsApp || selectedQuote.phone).replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer">{selectedQuote.whatsApp || selectedQuote.phone}</a></div>
                <div className="detail-row"><strong>Email:</strong> <a href={`mailto:${selectedQuote.email}`}>{selectedQuote.email || 'N/A'}</a></div>
                <div className="detail-row"><strong>Delivery Destination:</strong> <span>{selectedQuote.deliveryLocation || 'Not specified'}</span></div>
              </div>

              <div className="detail-col">
                <h4>Quotation Requirements</h4>
                <div className="detail-row"><strong>Product Interest:</strong> <span className="text-gold">{selectedQuote.productInterest}</span></div>
                <div className="detail-row"><strong>Target Diameter:</strong> <span>{selectedQuote.diameter || 'Standard'}</span></div>
                <div className="detail-row"><strong>Estimated Volume:</strong> <span>{selectedQuote.requiredQuantity || 'Standard Batch'}</span></div>
                <div className="detail-row"><strong>Received On:</strong> <span>{new Date(selectedQuote.createdAt).toLocaleString()}</span></div>
                <div className="detail-row">
                  <strong>Current Workflow Status:</strong>
                  <select
                    className={`status-select status-${(selectedQuote.status || 'NEW').toLowerCase()}`}
                    value={(selectedQuote.status || 'NEW').toUpperCase()}
                    onChange={(e) => handleStatusChange(selectedQuote._id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {selectedQuote.message && (
              <div className="quote-buyer-message-box">
                <strong>Buyer Requirement Specification:</strong>
                <p>{selectedQuote.message}</p>
              </div>
            )}

            {selectedQuote.estimate && (
              <div className="quote-ai-box">
                <div className="ai-est-header">⚡ Instant Factory Estimate Summary</div>
                <div className="form-grid-3" style={{ marginTop: '10px' }}>
                  <div><span>Price Range:</span> <strong>{selectedQuote.estimate.priceRangePerKg}</strong></div>
                  <div><span>Batch Value:</span> <strong>{selectedQuote.estimate.estimatedTotalRange || 'Custom Calculation'}</strong></div>
                  <div><span>Production Lead Time:</span> <strong>{selectedQuote.estimate.leadTime}</strong></div>
                </div>
              </div>
            )}

            {/* Internal Admin Notes */}
            <div className="internal-notes-box">
              <label>Internal Plant Sales Notes (Only visible to Owner / Admin):</label>
              <textarea
                rows="3"
                placeholder="e.g. Quoted ₹122/kg ex-mill on 28/09. Buyer requested 20% advance terms..."
                value={internalNoteInput}
                onChange={(e) => setInternalNoteInput(e.target.value)}
              ></textarea>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn-primary btn-sm"
                  disabled={updatingNote}
                  onClick={handleSaveInternalNote}
                >
                  {updatingNote ? 'Saving Notes...' : 'Save Internal Notes'}
                </button>
              </div>
            </div>

            <div className="admin-modal-actions">
              <button className="btn-outline" onClick={() => setSelectedQuote(null)}>
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
