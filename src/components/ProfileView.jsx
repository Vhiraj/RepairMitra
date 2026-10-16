// RepairMitra ProfileView Component - User Trust & Listings Showcase
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  Star,
  MapPin,
  Lock,
  Phone,
  Mail,
  Calendar,
  Hammer,
  Wrench,
  RotateCcw,
  Clock,
  Heart,
  Plus
} from 'lucide-react';

export default function ProfileView({ user: targetUser = null }) {
  const {
    currentUser,
    users,
    tools,
    skills,
    requests,
    reviews,
    favorites,
    openModal,
    toggleItemAvailability,
    createRequest
  } = useApp();

  const user = targetUser || currentUser;
  const isMe = user.id === currentUser.id;

  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'history' | 'reviews' | 'favorites'

  const userTools = tools.filter((t) => t.ownerId === user.id);
  const userSkills = skills.filter((s) => s.ownerId === user.id);
  const userReviews = reviews.filter((r) => r.revieweeId === user.id);

  // User transaction history (both borrowed & lent)
  const userHistory = requests.filter(
    (r) => r.borrowerId === user.id || r.ownerId === user.id
  );

  const completedCount = userHistory.filter((r) => r.status === 'completed').length;

  const favoriteTools = tools.filter((t) => favorites.includes(t.id));
  const favoriteSkills = skills.filter((s) => favorites.includes(s.id));

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Profile Header Card */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          marginBottom: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar with Verified Ring */}
          <div style={{ position: 'relative' }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: user.isVerified ? '3px solid #3b82f6' : '3px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            {user.isVerified && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  background: '#3b82f6',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
                title="Government ID Verified"
              >
                <CheckCircle2 size={16} />
              </div>
            )}
          </div>

          {/* User Details */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  {user.name}
                </h2>
                {user.isVerified ? (
                  <span className="badge badge-verified">
                    <CheckCircle2 size={13} /> Verified Neighbor
                  </span>
                ) : (
                  <span className="badge badge-pending">Unverified</span>
                )}
                {user.role === 'admin' && (
                  <span className="badge" style={{ background: '#ede9fe', color: '#6d28d9' }}>
                    Platform Moderator
                  </span>
                )}
              </div>

              {/* Action */}
              {isMe && !user.isVerified && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => openModal('verify')}
                >
                  Verify My Identity (+35 Trust)
                </button>
              )}
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.85rem', lineHeight: 1.5 }}>
              {user.bio || 'Active resident in the neighborhood sharing circular economy.'}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={14} color="var(--primary-600)" />
                <strong>{user.location}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Lock size={14} color="var(--text-muted)" />
                <span>Phone: {user.phoneEncrypted} (Privacy Protected)</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={14} />
                <span>Member since {user.memberSince}</span>
              </span>
            </div>
          </div>

          {/* Trust Score Gauge Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.08), rgba(16, 185, 129, 0.05))',
              border: '1px solid rgba(13, 148, 136, 0.25)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              textAlign: 'center',
              minWidth: '180px'
            }}
          >
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--primary-800)', fontWeight: 700 }}>
              Neighbor Trust Metric
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--primary-700)', lineHeight: 1.1, margin: '0.2rem 0' }}>
              🛡️ {user.trustScore}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>
              <Star size={14} fill="#f59e0b" />
              <span>{user.ratingAverage || 5.0}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({userReviews.length} reviews)</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              {completedCount} Completed Exchanges
            </div>
          </div>
        </div>

        {/* Trust Score Formula Breakdown banner */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 1rem',
            background: 'var(--bg-page)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}
        >
          <span>
            <strong>How Trust Score is Calculated:</strong> Base (40) + Government ID ({user.isVerified ? '+35 ✓' : '0'}) + Completed Exchanges (+{Math.min(15, completedCount * 2)}) + Community Reviews (+{Math.round(((user.ratingAverage || 5) / 5) * 10)})
          </span>
          <span style={{ color: 'var(--primary-700)', fontWeight: 600 }}>
            {user.trustScore >= 90 ? '🌟 Highly Trusted Neighbor' : 'Solid Community Standing'}
          </span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '1.5rem',
          gap: '0.5rem'
        }}
      >
        <button
          className={`btn btn-sm ${activeTab === 'listings' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('listings')}
        >
          Listed Gear & Skills ({userTools.length + userSkills.length})
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('history')}
        >
          Exchange History & Re-Order ({userHistory.length})
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'reviews' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews Received ({userReviews.length})
        </button>
        {isMe && (
          <button
            className={`btn btn-sm ${activeTab === 'favorites' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('favorites')}
          >
            Saved Bookmarks ({favorites.length})
          </button>
        )}
      </div>

      {/* Tab 1: Listings */}
      {activeTab === 'listings' && (
        <div>
          {isMe && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button className="btn btn-primary btn-sm" onClick={() => openModal('postChoice')}>
                <Plus size={14} /> Add New Tool or Skill
              </button>
            </div>
          )}

          {userTools.length === 0 && userSkills.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p>No listings currently active for this neighbor.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Tools Section */}
              {userTools.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                    Tools Offered for Borrowing
                  </h3>
                  <div className="cards-grid">
                    {userTools.map((t) => (
                      <div key={t.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                        <img src={t.images[0]} alt={t.title} style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.2rem' }}>{t.title}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--primary-700)', fontWeight: 700 }}>
                            ₹{t.rentalFee}/day
                          </span>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => toggleItemAvailability(t.id, 'tool')}
                            >
                              {t.isAvailable ? 'Mark Inactive' : 'Mark Available'}
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => openModal('toolDetail', t)}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Section */}
              {userSkills.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                    Repairs & Services Offered
                  </h3>
                  <div className="cards-grid">
                    {userSkills.map((s) => (
                      <div key={s.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                        <img src={s.images[0]} alt={s.title} style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.2rem' }}>{s.title}</h4>
                          <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700 }}>
                            ₹{s.price} {s.pricingType === 'hourly' ? '/ hr' : 'fixed'}
                          </span>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => openModal('skillDetail', s)}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: History & 1-Click Re-Order */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {userHistory.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Clock size={36} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
              <p>No past exchange history recorded.</p>
            </div>
          ) : (
            userHistory.map((h) => (
              <div key={h.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img src={h.listingImage} alt={h.listingTitle} style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.2rem' }}>{h.listingTitle}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Date: {h.startDate} • ₹{h.totalCost} total
                    </span>
                    <div style={{ marginTop: '0.2rem' }}>
                      <span className={`badge ${h.status === 'completed' ? 'badge-available' : 'badge-pending'}`} style={{ fontSize: '0.65rem' }}>
                        {h.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      const next = new Date();
                      next.setDate(next.getDate() + (h.daysCount || 2));
                      createRequest({
                        listingId: h.listingId,
                        listingType: h.listingType,
                        listingTitle: h.listingTitle,
                        listingImage: h.listingImage,
                        ownerId: h.ownerId,
                        startDate: today,
                        endDate: next.toISOString().split('T')[0],
                        daysCount: h.daysCount || 1,
                        projectScope: `One-Click Re-order: ${h.projectScope}`,
                        totalCost: h.totalCost,
                        deposit: h.deposit
                      });
                      alert(`Re-ordered "${h.listingTitle}"! Check your Requests tab.`);
                    }}
                  >
                    <RotateCcw size={14} />
                    <span>Re-Order Tool (1-Click)</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Reviews */}
      {activeTab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {userReviews.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p>No community reviews posted yet.</p>
            </div>
          ) : (
            userReviews.map((rev) => (
              <div key={rev.id} className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={rev.reviewerAvatar} alt={rev.reviewerName} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{rev.reviewerName}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#f59e0b" />
                    ))}
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '0 0 0.5rem', lineHeight: 1.5 }}>
                  "{rev.comment}"
                </p>

                {rev.tags && (
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {rev.tags.map((tag, i) => (
                      <span key={i} className="badge badge-trust" style={{ fontSize: '0.65rem' }}>
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Saved Favorites */}
      {activeTab === 'favorites' && isMe && (
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
            Your Saved Bookmarks
          </h3>
          {favoriteTools.length === 0 && favoriteSkills.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Heart size={36} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
              <p>No items bookmarked yet. Click the bookmark icon on any tool or skill to save it here.</p>
            </div>
          ) : (
            <div className="cards-grid">
              {favoriteTools.map((t) => (
                <div key={t.id} className="glass-panel" style={{ padding: '1rem' }}>
                  <img src={t.images[0]} alt={t.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }} />
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.3rem' }}>{t.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 700 }}>₹{t.rentalFee}/day</span>
                  <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => openModal('toolDetail', t)}>
                    Borrow
                  </button>
                </div>
              ))}
              {favoriteSkills.map((s) => (
                <div key={s.id} className="glass-panel" style={{ padding: '1rem' }}>
                  <img src={s.images[0]} alt={s.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }} />
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.3rem' }}>{s.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 700 }}>₹{s.price}</span>
                  <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => openModal('skillDetail', s)}>
                    Hire Fixer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
