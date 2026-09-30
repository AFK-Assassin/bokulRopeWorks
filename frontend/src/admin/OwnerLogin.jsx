import React, { useState } from 'react';
import { IconShieldCheck, IconEye, IconEyeOff, IconArrowRight, IconX } from '../components/Icons';
import { loginAdmin } from '../services/api';

export default function OwnerLogin({ onLoginSuccess, onBackToSite }) {
  const [email, setEmail] = useState('admin@bokulrope.com');
  const [password, setPassword] = useState('Admin@Bokul2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const data = await loginAdmin(email, password);
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="owner-login-viewport">
      <div className="owner-login-card">
        <div className="owner-login-header">
          <div className="owner-login-logo">
            <img src="/images/BRW-logo.webp" alt="BRW Logo" />
          </div>
          <h2>Owner Control Desk</h2>
          <p>Bokul Rope Works • Howrah Manufacturing Plant</p>
        </div>

        {errorMsg && (
          <div className="owner-login-error">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="owner-login-form">
          <div className="owner-form-group">
            <label>Owner / Admin Email</label>
            <input
              type="email"
              required
              placeholder="admin@bokulrope.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="owner-form-group">
            <label>Security Password</label>
            <div className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary owner-submit-btn"
            disabled={loading}
          >
            {loading ? 'Verifying Credentials...' : 'Authenticate & Access Dashboard →'}
          </button>
        </form>

        <div className="owner-login-footer">
          <div className="security-note">
            <IconShieldCheck size={16} />
            <span>256-bit Encrypted Session • Bcrypt Hashed Passwords</span>
          </div>
          {onBackToSite && (
            <button className="back-to-site-btn" onClick={onBackToSite}>
              ← Return to Public Website
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
