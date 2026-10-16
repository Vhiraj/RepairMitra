// RepairMitra ListingDetailModal Component
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  MapPin,
  ShieldCheck,
  Star,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  MessageSquare,
  Clock,
  Info,
  DollarSign,
  Heart,
  Share2
} from 'lucide-react';

export default function ListingDetailModal({ listing, type = 'tool', onClose }) {
  const {
    currentUser,
    users,
    getListingDistance,
    createRequest,
    openModal,
    setActiveTab,
    reviews,
    favorites,
    toggleFavorite
  } = useApp();

  const isTool = type === 'tool';
  const owner = users.find((u) => u.id === listing.ownerId) || {
    name: 'Neighbor',
    trustScore: 85,
    isVerified: true,
    ratingAverage: 5.0,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    memberSince: 'Oct 2023'
  };

  const isOwner = currentUser?.id === listing.ownerId;
  const distance = getListingDistance(listing);
  const isFav = favorites.includes(listing.id);

  const ownerReviews = reviews.filter((r) => r.revieweeId === listing.ownerId);

  // Form State for Booking
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 2);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(tomorrowStr);
  const [projectScope, setProjectScope] = useState('');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Calculate days & cost
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end - start);
  const daysCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const totalCost = isTool ? (listing.rentalFee || 0) * daysCount : (listing.price || 250);
  const totalDue = totalCost + (isTool ? (listing.deposit || 0) : 0);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!projectScope.trim()) {
      alert('Please describe your project or what you need repaired/done.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      createRequest({
        listingId: listing.id,
        listingType: isTool ? 'tool' : 'skill',
        listingTitle: listing.title,
        listingImage: listing.images[0],
        ownerId: listing.ownerId,
        startDate,
        endDate: isTool ? endDate : startDate,
        daysCount,
        projectScope,
        totalCost,
        deposit: isTool ? (listing.deposit || 0) : 0
      });
      setIsSubmitting(false);
      onClose();
      setActiveTab('requests');
    }, 400);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '800px', maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky',
            top: 0,
            background: 'var(--bg-card)',
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="badge badge-category">
              {isTool ? listing.category : listing.serviceType}
            </span>
            <span className="badge badge-distance">
              <MapPin size={12} />
              {distance} km away ({listing.neighborhood})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => toggleFavorite(listing.id)}
              className="btn btn-secondary btn-sm"
              title="Save to favorites"
            >
              <Heart size={15} fill={isFav ? '#ef4444' : 'none'} color={isFav ? '#ef4444' : 'currentColor'} />
            </button>
            <button onClick={handleShare} className="btn btn-secondary btn-sm" title="Share listing link">
              <Share2 size={15} />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* Image Gallery */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '100%',
                height: '320px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: '#0f172a',
                marginBottom: '0.75rem',
                position: 'relative'
              }}
            >
              <img
                src={listing.images[activeImageIdx] || listing.images[0]}
                alt={listing.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {isTool && (
                <div
                  className={`badge ${listing.isAvailable ? 'badge-available' : 'badge-unavailable'}`}
                  style={{ position: 'absolute', top: '1rem', left: '1rem' }}
                >
                  {listing.isAvailable ? '● Available for Loan' : '● Currently In Use'}
                </div>
              )}
            </div>

            {/* Thumbnail switcher if multiple images */}
            {listing.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: idx === activeImageIdx ? '2px solid var(--primary-600)' : '1px solid var(--border-color)',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                  >
                    <img src={img} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }} className="detail-grid">
            {/* Left Column: Details & Specs */}
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                {listing.title}
              </h2>

              <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {listing.description}
              </p>

              {/* Specifications / Highlights */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  marginBottom: '1.5rem'
                }}
              >
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                  {isTool ? 'Tool Details & Specs' : 'Service Scope'}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.825rem' }}>
                  {isTool ? (
                    <>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Condition: </span>
                        <strong>{listing.condition}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Category: </span>
                        <strong>{listing.category}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Daily Rate: </span>
                        <strong>₹{listing.rentalFee} / day</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Security Deposit: </span>
                        <strong>₹{listing.deposit} (Refundable)</strong>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Experience: </span>
                        <strong>{listing.experienceYears} Years</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Rate Type: </span>
                        <strong>{listing.pricingType === 'hourly' ? '₹' + listing.price + ' / hour' : '₹' + listing.price + ' base'}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Availability: </span>
                        <strong>{listing.availability}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Service Area: </span>
                        <strong>{listing.location}</strong>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Safety & Domain Rules Alert */}
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  gap: '0.75rem'
                }}
              >
                <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  <strong>Safety & Privacy Rule:</strong> {listing.safetyGuidelines || 'Personal phone numbers are strictly protected. Exact pick-up address is unlocked immediately after the owner accepts your request.'}
                </div>
              </div>

              {/* Owner Trust Profile Card */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={owner.avatar}
                      alt={owner.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{owner.name}</span>
                        {owner.isVerified && <CheckCircle2 size={16} color="#3b82f6" title="Government ID Verified" />}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>Member since {owner.memberSince}</span>
                        <span>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontWeight: 700 }}>
                          <Star size={12} fill="#f59e0b" /> {owner.ratingAverage || 5.0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="badge badge-trust" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}>
                    🛡️ {owner.trustScore} Trust Score
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.75rem' }}>
                  {owner.bio}
                </p>

                {/* Neighbor reviews on owner */}
                {ownerReviews.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase' }}>
                      Recent Neighbor Feedback:
                    </span>
                    <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      "{ownerReviews[0].comment}" — <strong style={{ fontStyle: 'normal' }}>{ownerReviews[0].reviewerName}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Booking Request Form */}
            <div>
              <div
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  position: 'sticky',
                  top: '5rem',
                  background: 'var(--bg-card)'
                }}
              >
                <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {isTool ? 'Equipment Loan Terms' : 'Service Booking'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                      ₹{isTool ? listing.rentalFee : listing.price}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {isTool ? '/ day' : (listing.pricingType === 'hourly' ? '/ hr' : 'flat fee')}
                    </span>
                  </div>
                  {isTool && listing.deposit > 0 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      + ₹{listing.deposit} refundable deposit at pickup
                    </span>
                  )}
                </div>

                {isOwner ? (
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      You are the owner of this listing.
                    </p>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%' }}
                      onClick={() => {
                        onClose();
                        setActiveTab('requests');
                      }}
                    >
                      View Active Requests For This Item
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit}>
                    {/* Date Pickers */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />
                        {isTool ? 'Pickup Date' : 'Service Date'}
                      </label>
                      <input
                        type="date"
                        className="input-field"
                        min={todayStr}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>

                    {isTool && (
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                          <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />
                          Return Date ({daysCount} days total)
                        </label>
                        <input
                          type="date"
                          className="input-field"
                          min={startDate}
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                        />
                      </div>
                    )}

                    {/* Project Scope / Description */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        Project Scope / Need
                      </label>
                      <textarea
                        className="input-field"
                        rows={3}
                        placeholder={
                          isTool
                            ? 'e.g. Drilling 6 wall anchors for living room wooden shelves this weekend.'
                            : 'e.g. Kitchen tap cartridge needs replacement; water leaking continuously.'
                        }
                        value={projectScope}
                        onChange={(e) => setProjectScope(e.target.value)}
                        required
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    {/* Cost Breakdown */}
                    <div
                      style={{
                        background: 'var(--primary-50)',
                        border: '1px solid var(--primary-100)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.85rem',
                        marginBottom: '1.25rem',
                        fontSize: '0.8rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span>
                          {isTool ? `Rental Fee (${daysCount} days × ₹${listing.rentalFee})` : 'Service Estimate'}
                        </span>
                        <strong style={{ color: 'var(--text-main)' }}>₹{totalCost}</strong>
                      </div>
                      {isTool && listing.deposit > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                          <span>Refundable Deposit</span>
                          <span>₹{listing.deposit}</span>
                        </div>
                      )}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          borderTop: '1px solid rgba(13, 148, 136, 0.2)',
                          paddingTop: '0.4rem',
                          fontWeight: 800,
                          color: 'var(--primary-800)',
                          fontSize: '0.9rem'
                        }}
                      >
                        <span>Total Payable at Pickup</span>
                        <span>₹{totalDue}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%', fontWeight: 800, boxShadow: 'var(--shadow-teal)' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending Request...' : isTool ? 'Request to Borrow' : 'Hire / Book Service'}
                    </button>

                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.65rem' }}>
                      🛡️ In-app chat and exact pickup address unlock automatically once accepted.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
