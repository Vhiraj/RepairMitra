// RepairMitra AuthModal Component - SQLite Database Authentication
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
  Key
} from 'lucide-react';
import { NEIGHBORHOODS } from '../data/mockData';

export default function AuthModal({ initialMode = 'login', onClose }) {
  const { loginUser, registerUser } = useApp();

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regNeighborhood, setRegNeighborhood] = useState('Indiranagar');
  const [regRole, setRegRole] = useState('buyer');
  const [regBio, setRegBio] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await loginUser(loginIdentifier, loginPassword);
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await registerUser({
        name: regName,
        username: regUsername || regEmail.split('@')[0],
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

  const fillTestCredentials = (identifier, pwd) => {
    setLoginIdentifier(identifier);
    setLoginPassword(pwd);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '460px' }}
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
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              {mode === 'login' ? 'Sign In to RepairMitra' : 'Create an Account'}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              SQLite Database Authentication • Password Hashed with Bcrypt
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
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
              cursor: 'pointer',
              fontSize: '0.85rem'
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
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
          >
            Register
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

        <div style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
          {mode === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Username or Email
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter username or email"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    style={{ paddingLeft: '2.25rem', borderRadius: 'var(--radius-sm)' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Enter account password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{ paddingLeft: '2.25rem', borderRadius: 'var(--radius-sm)' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', fontWeight: 700, marginBottom: '1.25rem' }}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>

              {/* Bot Accounts Test Reference */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                  <Key size={13} color="var(--primary-600)" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Bot Accounts Reference (Password: password123)
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'space-between', fontSize: '0.75rem' }}
                    onClick={() => fillTestCredentials('bot_lender', 'password123')}
                  >
                    <span>Tool Custodian Bot: <strong>bot_lender</strong></span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary-700)' }}>Fill</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'space-between', fontSize: '0.75rem' }}
                    onClick={() => fillTestCredentials('bot_artisan', 'password123')}
                  >
                    <span>Repair Artisan Bot: <strong>bot_artisan</strong></span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary-700)' }}>Fill</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'space-between', fontSize: '0.75rem' }}
                    onClick={() => fillTestCredentials('admin', 'password123')}
                  >
                    <span>Platform Admin: <strong>admin</strong></span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary-700)' }}>Fill</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Harissh Sharma"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    style={{ paddingLeft: '2.25rem', borderRadius: 'var(--radius-sm)' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Username *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. harissh_fixer"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  style={{ borderRadius: 'var(--radius-sm)' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    className="input-field"
                    placeholder="e.g. harissh@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    style={{ paddingLeft: '2.25rem', borderRadius: 'var(--radius-sm)' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Create a strong password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={{ paddingLeft: '2.25rem', borderRadius: 'var(--radius-sm)' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Neighborhood
                  </label>
                  <select
                    className="input-field"
                    value={regNeighborhood}
                    onChange={(e) => setRegNeighborhood(e.target.value)}
                    style={{ borderRadius: 'var(--radius-sm)' }}
                  >
                    {NEIGHBORHOODS.map((n) => (
                      <option key={n.name} value={n.name}>
                        {n.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Primary Role
                  </label>
                  <select
                    className="input-field"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    style={{ borderRadius: 'var(--radius-sm)' }}
                  >
                    <option value="buyer">Borrower</option>
                    <option value="seller">Tool Lender</option>
                    <option value="artisan">Repair Artisan</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="+91 98000 00000"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    style={{ paddingLeft: '2.25rem', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', fontWeight: 700 }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
