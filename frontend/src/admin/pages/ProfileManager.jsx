import React, { useState, useEffect } from 'react';
import { IconShieldCheck, IconCheckCircle, IconEye, IconEyeOff } from '../../components/Icons';
import { getAdminProfile, updateAdminProfile, changeAdminPassword } from '../../services/api';

export default function ProfileManager({ onLogout }) {
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

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const user = await getAdminProfile();
      if (user) {
        setProfile({ name: user.name || '', email: user.email || '' });
      }
    } catch (err) {
      console.warn('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess('');
    setProfileError('');
    try {
      const updated = await updateAdminProfile(profile);
      setProfileSuccess('Profile details saved successfully.');
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

  return (
    <div className="admin-page-content">
      <div className="admin-toolbar-card">
        <div className="admin-toolbar-left">
          <h3>Owner Security & Profile Credentials</h3>
          <p style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
            Manage the authenticated Bokul Rope Works administrator profile and access credentials.
          </p>
        </div>
      </div>

      <div className="form-grid-2" style={{ alignItems: 'start' }}>
        {/* Profile Details Form */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Admin Profile Details</h3>
              <p>Name and contact email for notifications</p>
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

      {/* Logout & Revocation */}
      <div className="admin-card" style={{ marginTop: '20px' }}>
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
