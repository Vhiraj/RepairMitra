// RepairMitra AdminDashboard Component - Site Moderation & Network Analytics
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Users,
  Wrench,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Activity,
  Zap,
  TrendingUp,
  Search
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    users,
    tools,
    skills,
    requests,
    adminDeleteListing,
    adminToggleVerifyUser,
    resetAllData
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'tools' | 'users'
  const [searchFilter, setSearchFilter] = useState('');

  const completedExchanges = requests.filter((r) => r.status === 'completed').length;
  const activeExchanges = requests.filter((r) => r.status === 'accepted' || r.status === 'pending').length;
  const verifiedUsersCount = users.filter((u) => u.isVerified).length;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          borderLeft: '4px solid #8b5cf6'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge" style={{ background: '#ede9fe', color: '#6d28d9', fontWeight: 800 }}>
              ADMINISTRATION & SAFETY
            </span>
            <span className="badge badge-available">
              System Online (99.98% SLA)
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            RepairMitra Network Moderation
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
            Review flagged listings, manage neighbor verification badges, audit requests, and test recovery.
          </p>
        </div>

        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => {
            if (window.confirm('Reset all mock database data back to pristine initial state?')) {
              resetAllData();
            }
          }}
          title="Reset database to fresh defaults"
        >
          <RotateCcw size={14} />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <span>ACTIVE TOOLS</span>
            <Wrench size={16} color="var(--primary-600)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary-700)' }}>{tools.length}</div>
          <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>+4 new this week</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <span>ACTIVE EXCHANGES</span>
            <TrendingUp size={16} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f59e0b' }}>{activeExchanges}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{completedExchanges} completed all-time</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <span>VERIFIED NEIGHBORS</span>
            <ShieldCheck size={16} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#3b82f6' }}>{verifiedUsersCount} / {users.length}</div>
          <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>Zero identity fraud incidents</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <span>SEARCH LATENCY</span>
            <Zap size={16} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#8b5cf6' }}>1.4 ms</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Indexed geo-proximity cache</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('overview')}
        >
          Listing Moderation ({tools.length + skills.length})
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          User Verification Directory ({users.length})
        </button>
      </div>

      {/* Moderation Table */}
      {activeTab === 'overview' && (
        <div className="glass-panel" style={{ padding: '1.25rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Listing</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Owner</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Rate / Terms</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Moderation Action</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((t) => {
                const owner = users.find((u) => u.id === t.ownerId);
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={t.images[0]} alt="" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                        <span>{t.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className="badge badge-category" style={{ fontSize: '0.65rem' }}>{t.category}</span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{owner?.name || 'User'}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>₹{t.rentalFee}/day</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className={`badge ${t.isAvailable ? 'badge-available' : 'badge-unavailable'}`} style={{ fontSize: '0.65rem' }}>
                        {t.isAvailable ? 'Available' : 'In Use'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => adminDeleteListing(t.id, 'tool')}
                        title="Remove listing for violation"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {skills.map((s) => {
                const owner = users.find((u) => u.id === s.ownerId);
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={s.images[0]} alt="" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                        <span>{s.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className="badge badge-category" style={{ fontSize: '0.65rem' }}>{s.serviceType}</span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{owner?.name || 'User'}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>₹{s.price} ({s.pricingType})</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className="badge badge-available" style={{ fontSize: '0.65rem' }}>Active Skill</span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => adminDeleteListing(s.id, 'skill')}
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* User Directory Table */}
      {activeTab === 'users' && (
        <div className="glass-panel" style={{ padding: '1.25rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Neighbor</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Area</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Trust Score</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Rating</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Verification Status</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Admin Toggle</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img src={u.avatar} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div>{u.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>{u.neighborhood}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span className="badge badge-trust" style={{ fontSize: '0.75rem' }}>
                      🛡️ {u.trustScore}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span style={{ color: '#f59e0b', fontWeight: 700 }}>★ {u.ratingAverage}</span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    {u.isVerified ? (
                      <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                        ✓ {u.verificationDocType || 'Verified'}
                      </span>
                    ) : (
                      <span className="badge badge-pending" style={{ fontSize: '0.7rem' }}>
                        Unverified
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => adminToggleVerifyUser(u.id)}
                    >
                      {u.isVerified ? 'Revoke Badge' : 'Grant Verified'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
