// RepairMitra AuthModal Component - Login & Registration with SQLite/Express
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Lock,
  Mail,
  User,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { NEIGHBORHOODS } from '../data/mockData';

export default function AuthModal({ initialMode = 'login', onClose }) {
  const { loginUser, registerUser, users, switchUser } = useApp();

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regNeighborhood, setRegNeighborhood] = useState('Indiranagar');
  const [regRole, setRegRole] = useState('buyer'); // 'buyer' | 'seller' | 'artisan'
  const [regBio, setRegBio] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await loginUser(loginEmail, loginPassword);
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await registerUser({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        neighborhood: regNeighborhood,
        location: `${regNeighborhood}, Bangalore`,
        role: regRole,
        bio: regBio
      });
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Registration failed.');
    }
  };

  const quickLogin = (email, pwd) => {
    setLoginEmail(email);
    setLoginPassword(pwd);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '480px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              {mode === 'login' ? 'Neighbor Sign In' : 'Join RepairMitra Network'}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              SQLite Database Authentication • Password Hashed with Bcrypt
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-page)' }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              background: mode === 'login' ? 'var(--bg-card)' : 'transparent',
              fontWeight: mode === 'login' ? 700 : 500,
              color: mode === 'login' ? 'var(--primary-700)' : 'var(--text-muted)',
              borderBottom: mode === 'login' ? '2px solid var(--primary-600)' : 'none',
              cursor: 'pointer'
            }}
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              background: mode === 'register' ? 'var(--bg-card)' : 'transparent',
              fontWeight: mode === 'register' ? 700 : 500,
              color: mode === 'register' ? 'var(--primary-700)' : 'var(--text-muted)',
              borderBottom: mode === 'register' ? '2px solid var(--primary-600)' : 'none',
              cursor: 'pointer'
            }}
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              margin: '1rem 1.5rem 0',
              padding: '0.75rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-sm)',
              color: '#b91c1c',
              fontSize: '0.8rem'
            }}
          >
            {errorMsg}
          </div>
        )}

        <div style={{ padding: '1.5rem' }}>
          {mode === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    className="input-field"
                    placeholder="e.g. aarav.sharma@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    style={{ paddingLeft: '2.25rem' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Enter your account password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{ paddingLeft: '2.25rem' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', fontWeight: 800, marginBottom: '1.25rem' }}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In to RepairMitra'}
              </button>

              {/* Quick Fill Demo Credentials */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  One-Click Demo Sign-In (Password: password123):
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', fontSize: '0.75rem' }}
                    onClick={() => quickLogin('aarav.sharma@example.com', 'password123')}
                  >
                    <span>Borrower / Buyer: <strong>Aarav Sharma</strong> (Indiranagar)</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', fontSize: '0.75rem' }}
                    onClick={() => quickLogin('rajesh.kumar@example.com', 'password123')}
                  >
                    <span>Lender / Seller: <strong>Rajesh Kumar</strong> (Indiranagar)</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', fontSize: '0.75rem' }}
                    onClick={() => quickLogin('priya.patel@example.com', 'password123')}
                  >
                    <span>Artisan / Electrician: <strong>Priya Patel</strong> (Koramangala)</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', fontSize: '0.75rem' }}
                    onClick={() => quickLogin('admin@repairmitra.org', 'password123')}
                  >
                    <span>Administrator: <strong>Vikramaditya Rao</strong> (Admin)</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Meera Nambiar"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    style={{ paddingLeft: '2.25rem' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    className="input-field"
                    placeholder="meera@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    style={{ paddingLeft: '2.25rem' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Choose Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Min 6 characters (hashed with bcrypt)"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={{ paddingLeft: '2.25rem' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Neighborhood *
                  </label>
                  <select
                    className="input-field"
                    value={regNeighborhood}
                    onChange={(e) => setRegNeighborhood(e.target.value)}
                  >
                    {NEIGHBORHOODS.map((n) => (
                      <option key={n.name} value={n.name}>{n.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Primary Role *
                  </label>
                  <select
                    className="input-field"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                  >
                    <option value="buyer">Borrower / Buyer</option>
                    <option value="seller">Lender / Tool Seller</option>
                    <option value="artisan">Repair Artisan / Fixer</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Phone Number (Encrypted & Kept Private)
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="+91 98765 43210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    style={{ paddingLeft: '2.25rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Short Neighbor Bio
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Keen home baker and DIY furniture builder."
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', fontWeight: 800 }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register in SQLite Database'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
