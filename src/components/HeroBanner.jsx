// RepairMitra Hero Banner Component
import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Wrench,
  Hammer,
  Sparkles,
  MapPin,
  Crosshair,
  SlidersHorizontal
} from 'lucide-react';

export default function HeroBanner() {
  const {
    userLocation,
    detectLocation,
    isLocating,
    maxDistanceKm,
    setMaxDistanceKm,
    setSelectedCategory,
    listingTypeFilter,
    setListingTypeFilter,
    sortBy,
    setSortBy,
    openModal,
    setActiveTab
  } = useApp();

  const quickPills = [
    { label: 'Cordless Drills', cat: 'Power Tools', type: 'tools' },
    { label: 'Circular Saws', cat: 'Woodworking', type: 'tools' },
    { label: 'Pressure Washers', cat: 'Cleaning & Washers', type: 'tools' },
    { label: 'Plumbing & Leaks', cat: 'Plumbing & Leaks', type: 'skills' },
    { label: 'MCB / Electrical', cat: 'Electrical & Wiring', type: 'skills' },
    { label: 'Telescopic Ladders', cat: 'Ladders & Safety', type: 'tools' }
  ];

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      {/* Compact Hero Card */}
      <div
        className="glass-panel"
        style={{
          background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.08) 0%, rgba(20, 184, 166, 0.03) 50%, rgba(245, 158, 11, 0.05) 100%)',
          borderColor: 'rgba(13, 148, 136, 0.2)',
          padding: '1.75rem 1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(13, 148, 136, 0.12)',
              color: 'var(--primary-700)',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '0.85rem'
            }}
          >
            <Sparkles size={14} color="var(--primary-600)" />
            <span>Hyperlocal Circular Economy • Borrow Tools, Hire Trusted Neighbors</span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              lineHeight: 1.25,
              marginBottom: '0.75rem',
              color: 'var(--text-main)'
            }}
          >
            Don't buy tools you only use for 15 minutes.{' '}
            <span style={{ color: 'var(--primary-600)' }}>
              Borrow from next door.
            </span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-muted)',
              marginBottom: '1.25rem',
              maxWidth: '680px',
              margin: '0 auto 1.25rem',
              lineHeight: 1.5
            }}
          >
            Borrow heavy-duty equipment or request expert repair skills from verified residents in{' '}
            <strong style={{ color: 'var(--text-main)' }}>{userLocation.neighborhood || 'Indiranagar'}</strong>. Zero middleman fees, direct in-app coordination, verified IDs.
          </p>

          {/* Quick Find */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quick Find:</span>
            {quickPills.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setListingTypeFilter(p.type);
                  setSelectedCategory(p.cat);
                  setActiveTab(p.type);
                }}
                className="badge badge-category"
                style={{
                  cursor: 'pointer',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.15s ease'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div
        className="glass-panel"
        style={{
          marginTop: '1rem',
          padding: '0.85rem 1.15rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        {/* Toggle Type tabs: All / Tools / Skills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            className={`btn btn-sm ${listingTypeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setListingTypeFilter('all')}
          >
            All Listings
          </button>
          <button
            className={`btn btn-sm ${listingTypeFilter === 'tools' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setListingTypeFilter('tools')}
            style={{ gap: '0.35rem' }}
          >
            <Wrench size={13} />
            <span>Tools Only</span>
          </button>
          <button
            className={`btn btn-sm ${listingTypeFilter === 'skills' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setListingTypeFilter('skills')}
            style={{ gap: '0.35rem' }}
          >
            <Hammer size={13} />
            <span>Skills & Repairs</span>
          </button>
        </div>

        {/* Proximity Radius Slider & Location Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Detect Location Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={detectLocation}
            disabled={isLocating}
            title="Use live device location"
            style={{ gap: '0.35rem' }}
          >
            <Crosshair size={13} color="var(--primary-600)" />
            <span>{isLocating ? 'Detecting...' : 'Detect Location'}</span>
          </button>

          <div
            onClick={() => openModal('location')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              color: 'var(--text-main)',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            <MapPin size={14} color="var(--primary-600)" />
            <span>Near {userLocation.neighborhood || 'Select Area'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: 'var(--bg-card)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Radius:</span>
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              style={{ width: '75px', accentColor: 'var(--primary-600)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-700)', minWidth: '36px' }}>
              {maxDistanceKm} km
            </span>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <SlidersHorizontal size={14} color="var(--text-muted)" />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
            style={{ padding: '0.3rem 0.55rem', fontSize: '0.78rem', width: 'auto', height: 'auto', borderRadius: 'var(--radius-sm)' }}
          >
            <option value="proximity">Nearest Distance</option>
            <option value="trust">Highest Trust Score</option>
            <option value="rating">Top Rated</option>
            <option value="price_low">Lowest Price</option>
          </select>
        </div>
      </div>
    </div>
  );
}
