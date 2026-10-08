import { useState, useEffect, useCallback } from 'react';
import { IconX } from '../../components/Icons';
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  fetchAdminsApi,
  registerAdminApi,
  deleteAdminApi,
} from '../../services/api';

export default function ProfileManager({ onLogout }) {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password state
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [passSaving, setPassSaving] = useState(false);
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  // Multi-Admin Management State
  const [adminsList, setAdminsList] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'owner',
  });
  const [newAdminSaving, setNewAdminSaving] = useState(false);
  const [newAdminError, setNewAdminError] = useState('');
  const [newAdminSuccess, setNewAdminSuccess] = useState('');

  const loadAdminsList = useCallback(async () => {
    setAdminsLoading(true);
    try {
      const list = await fetchAdminsApi();
      setAdminsList(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn('Admins list load warning:', err.message);
    } finally {
      setAdminsLoading(false);
    }
  }, []);

  const loadProfileAndAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const user = await getAdminProfile();
      if (user) {
        setCurrentAdmin(user);
        setProfile({ name: user.name || '', email: user.email || '' });
      }
      await loadAdminsList();
    } catch (err) {
      console.warn('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  }, [loadAdminsList]);

  useEffect(() => {
    loadProfileAndAdmins();
  }, [loadProfileAndAdmins]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess('');
    setProfileError('');
    try {
      await updateAdminProfile(profile);
      setProfileSuccess('Profile details saved successfully.');
      await loadAdminsList();
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassSuccess('');
    setPassError('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }

    setPassSaving(true);
    try {
      await changeAdminPassword(passwords.currentPassword, passwords.newPassword);
      setPassSuccess('Password updated successfully! Please keep it secure.');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassError(err.message || 'Failed to change password. Verify current password.');
    } finally {
      setPassSaving(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setNewAdminSaving(true);
    setNewAdminError('');
    setNewAdminSuccess('');

    try {
      await registerAdminApi(newAdminForm);
      setNewAdminSuccess('New administrator/owner registered successfully!');
      setNewAdminForm({ name: '', email: '', password: '', role: 'owner' });
      setShowAddAdminModal(false);
      await loadAdminsList();
    } catch (err) {
      setNewAdminError(err.message || 'Failed to add administrator.');
    } finally {
      setNewAdminSaving(false);
    }
  };

  const handleDeleteAdmin = async (admin) => {
    if (admin._id === currentAdmin?.id || admin._id === currentAdmin?._id) {
      alert('You cannot delete your own active administrator account.');
      return;
    }
    if (!window.confirm(`Revoke admin access for "${admin.name}" (${admin.email})?`)) return;

    try {
      await deleteAdminApi(admin._id);
      setAdminsList((prev) => prev.filter((a) => a._id !== admin._id));
    } catch (err) {
      alert(err.message || 'Failed to remove administrator.');
    }
  };

  return (
    <div className="admin-page-content">
      <div className="admin-toolbar-card">
        <div className="admin-toolbar-left">
          <h3>Mill Owners & Admin Security Console</h3>
          <p>
            Manage multi-owner access, credentials, and concurrent administrator accounts for Bokul Rope Works.
          </p>
        </div>
        <div className="admin-toolbar-right">
          <button className="btn-primary btn-sm" onClick={() => setShowAddAdminModal(true)}>
            + Add New Owner / Admin
          </button>
        </div>
      </div>

      {/* Multi-Admin / Owners List Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Authorized Owners & Administrators ({adminsList.length})</h3>
            <p>Multiple owners and plant managers can log in and access the portal concurrently</p>
          </div>
        </div>

        {newAdminSuccess && (
          <div className="owner-login-error" style={{ background: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.4)', color: '#86efac', marginBottom: '16px' }}>
            <span>✓</span> {newAdminSuccess}
          </div>
        )}

        {adminsLoading ? (
          <div className="admin-loading-state">Loading authorized administrators...</div>
        ) : adminsList.length === 0 ? (
          <div className="admin-empty-state">
            <h4>No additional administrators found</h4>
            <p>Click "+ Add New Owner / Admin" to grant portal access to business partners.</p>
          </div>
        ) : (
          <div className="admin-users-grid">
            {adminsList.map((adm) => {
              const isSelf = adm._id === currentAdmin?.id || adm._id === currentAdmin?._id || adm.email === currentAdmin?.email;
              const initials = (adm.name || adm.email || 'A').slice(0, 2).toUpperCase();
              return (
                <div key={adm._id} className="admin-user-card">
                  <div className="admin-user-avatar">{initials}</div>
                  <div className="admin-user-info">
                    <strong>
                      {adm.name} {isSelf && <span style={{ color: '#fbbf24', fontSize: '0.75rem' }}>(You)</span>}
                    </strong>
                    <span>{adm.email}</span>
                    <span className={adm.role === 'owner' ? 'admin-badge-owner' : 'admin-badge-admin'}>
                      {adm.role === 'owner' ? '👑 Owner' : '🛡️ Admin'}
                    </span>
                  </div>
                  <div>
                    {!isSelf && (
                      <button
                        className="btn-danger btn-xs"
                        onClick={() => handleDeleteAdmin(adm)}
                        title="Revoke Admin Access"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Profile Details & Change Password Grids */}
      <div className="form-grid-2" style={{ alignItems: 'start' }}>
        {/* Profile Details Form */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>My Profile Details</h3>
              <p>Your display name and notification email</p>
            </div>
          </div>

          {profileSuccess && (
            <div className="owner-login-error" style={{ background: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.4)', color: '#86efac' }}>
              <span>✓</span> {profileSuccess}
            </div>
          )}

          {profileError && (
            <div className="owner-login-error">
              <span>⚠️</span> {profileError}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="admin-form">
            <div className="admin-form-group">
              <label>Administrator Name</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>Administrator Email</label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={profileSaving} style={{ marginTop: '10px' }}>
              {profileSaving ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Change Security Password</h3>
              <p>Protected by salted Bcrypt hashing</p>
            </div>
          </div>

          {passSuccess && (
            <div className="owner-login-error" style={{ background: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.4)', color: '#86efac' }}>
              <span>✓</span> {passSuccess}
            </div>
          )}

          {passError && (
            <div className="owner-login-error">
              <span>⚠️</span> {passError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="admin-form">
            <div className="admin-form-group">
              <label>Current Security Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>New Password (min 6 characters)</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>Confirm New Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <button
                type="button"
                className="btn-outline btn-xs"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? 'Hide Passwords' : 'Show Passwords'}
              </button>

              <button type="submit" className="btn-primary" disabled={passSaving}>
                {passSaving ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add Administrator / Owner Modal */}
      {showAddAdminModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddAdminModal(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Add New Owner / Administrator</h3>
              <button className="admin-modal-close" onClick={() => setShowAddAdminModal(false)}>
                <IconX size={20} />
              </button>
            </div>

            {newAdminError && (
              <div className="owner-login-error" style={{ marginBottom: '14px' }}>
                <span>⚠️</span> {newAdminError}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="admin-form">
              <div className="admin-form-group">
                <label>Full Name <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subhash Ghosh"
                  value={newAdminForm.name}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Login Email <span className="req">*</span></label>
                <input
                  type="email"
                  required
                  placeholder="e.g. partner@bokulrope.com"
                  value={newAdminForm.email}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>Initial Password (min 6 chars) <span className="req">*</span></label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={newAdminForm.password}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Administrative Role</label>
                  <select
                    value={newAdminForm.role}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                  >
                    <option value="owner">Owner (Full Privileges)</option>
                    <option value="admin">Administrator (Plant/Sales Desk)</option>
                  </select>
                </div>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowAddAdminModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={newAdminSaving}>
                  {newAdminSaving ? 'Registering...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout & Revocation */}
      <div className="admin-card" style={{ marginTop: '10px' }}>
        <div className="admin-card-header">
          <div>
            <h3>Active Session Management</h3>
            <p>End authenticated session and invalidate JWT token on this device</p>
          </div>
          <button className="btn-danger btn-sm" onClick={onLogout}>
            Logout & Revoke Token
          </button>
        </div>
      </div>
    </div>
  );
}
