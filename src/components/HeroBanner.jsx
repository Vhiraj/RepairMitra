// RepairMitra Hero Banner Component
import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Wrench,
  Search,
  Sparkles,
  ShieldCheck,
  Leaf,
  Users,
  MapPin,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { TOOL_CATEGORIES, SKILL_CATEGORIES } from '../data/mockData';

export default function HeroBanner() {
  const {
    userLocation,
    maxDistanceKm,
    setMaxDistanceKm,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    listingTypeFilter,
    setListingTypeFilter,
    sortBy,
    setSortBy,
    openModal,
    activeTab,
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
    <div style={{ marginBottom: '2rem' }}>
      {/* Hero Card */}
      <div
        className="glass-panel"
        style={{
          background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.08) 0%, rgba(20, 184, 166, 0.03) 50%, rgba(245, 158, 11, 0.05) 100%)',
          borderColor: 'rgba(13, 148, 136, 0.2)',
          padding: '2.5rem 2rem',
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
              gap: '0.5rem',
              background: 'rgba(13, 148, 136, 0.12)',
              color: 'var(--primary-700)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}
          >
            <Sparkles size={15} color="var(--primary-600)" />
            <span>Hyperlocal Circular Economy • Borrow Tools, Hire Trusted Neighbors</span>
          </div>

          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '1rem',
              color: 'var(--text-main)'
            }}
          >
            Don't buy tools you only use for 15 minutes.{' '}
            <span style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Borrow from next door.
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-muted)',
              marginBottom: '1.75rem',
              maxWidth: '680px',
              margin: '0 auto 1.75rem'
            }}
          >
            Borrow heavy-duty equipment or request expert repair skills from verified residents in{' '}
            <strong style={{ color: 'var(--text-main)' }}>{userLocation.neighborhood}</strong>. Zero middleman fees, direct in-app coordination, verified IDs.
          </p>

          {/* Impact Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.75rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-600)' }}>840+</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tools Listed</div>
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>390+</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Repairs Completed</div>
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>100%</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>ID Verified Neighbors</div>
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#3b82f6' }}>~12 mins</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Response Time</div>
            </div>
          </div>

          {/* Quick search pills */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
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
          marginTop: '1.25rem',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        {/* Toggle Type tabs: All / Tools / Skills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            className={`btn btn-sm ${listingTypeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setListingTypeFilter('all')}
          >
            All Listings
          </button>
          <button
            className={`btn btn-sm ${listingTypeFilter === 'tools' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setListingTypeFilter('tools')}
          >
            🧰 Tools Only
          </button>
          <button
            className={`btn btn-sm ${listingTypeFilter === 'skills' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setListingTypeFilter('skills')}
          >
            👨‍🔧 Skills & Repairs
          </button>
        </div>

        {/* Proximity Radius Slider & Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
            <MapPin size={15} color="var(--primary-600)" />
            <span>Near {userLocation.neighborhood}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Radius:</span>
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              style={{ width: '80px', accentColor: 'var(--primary-600)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-700)', minWidth: '40px' }}>
              {maxDistanceKm} km
            </span>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SlidersHorizontal size={15} color="var(--text-muted)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', width: 'auto', height: 'auto', borderRadius: 'var(--radius-sm)' }}
          >
            <option value="proximity">Nearest Distance</option>
            <option value="trust">Highest Trust Score</option>
            <option value="rating">Top Rated (Stars)</option>
            <option value="price_low">Lowest Price / Free</option>
          </select>
        </div>
      </div>
    </div>
  );
}
