// RepairMitra SkillCard Component
import React from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  ShieldCheck,
  Star,
  CheckCircle2,
  Briefcase,
  Bookmark,
  Clock,
  Sparkles
} from 'lucide-react';

export default function SkillCard({ skill }) {
  const {
    users,
    currentUser,
    getListingDistance,
    favorites,
    toggleFavorite,
    openModal
  } = useApp();

  const owner = users.find((u) => u.id === skill.ownerId) || {
    name: 'Skilled Neighbor',
    trustScore: 90,
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  };

  const distance = getListingDistance(skill);
  const isFav = favorites.includes(skill.id);
  const isOwner = currentUser?.id === skill.ownerId;

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      {/* Top Banner Image */}
      <div style={{ position: 'relative', height: '170px', background: '#0f172a', overflow: 'hidden' }}>
        <img
          src={skill.images[0]}
          alt={skill.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />

        <div
          className="badge badge-distance"
          style={{
            position: 'absolute',
            bottom: '0.6rem',
            left: '0.6rem',
            backdropFilter: 'blur(8px)',
            background: 'rgba(255, 255, 255, 0.92)'
          }}
        >
          <MapPin size={12} />
          <span>{distance} km away</span>
        </div>

        {/* Favorite Bookmark */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(skill.id);
          }}
          style={{
            position: 'absolute',
            top: '0.6rem',
            right: '0.6rem',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isFav ? '#ef4444' : 'var(--text-muted)',
            boxShadow: 'var(--shadow-sm)'
          }}
          title={isFav ? 'Remove from saved' : 'Save skill for later'}
        >
          <Bookmark size={16} fill={isFav ? '#ef4444' : 'none'} />
        </button>

        {/* Experience Tag */}
        <span
          style={{
            position: 'absolute',
            bottom: '0.6rem',
            right: '0.6rem',
            background: 'rgba(15, 23, 42, 0.8)',
            color: '#fff',
            fontSize: '0.65rem',
            padding: '0.15rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600
          }}
        >
          {skill.experienceYears} yrs experience
        </span>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <span className="badge badge-category" style={{ fontSize: '0.7rem' }}>
            {skill.serviceType}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <MapPin size={12} />
            <span>{skill.neighborhood}</span>
          </span>
        </div>

        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            lineHeight: 1.35,
            marginBottom: '0.5rem',
            color: 'var(--text-main)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {skill.title}
        </h3>

        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
            marginBottom: '0.85rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1
          }}
        >
          {skill.description}
        </p>

        {/* Included sub-skills pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
          {skill.skillsIncluded?.slice(0, 3).map((item, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.68rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)'
              }}
            >
              ✓ {item}
            </span>
          ))}
        </div>

        {/* Rate Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            padding: '0.5rem 0.75rem',
            background: 'rgba(245, 158, 11, 0.08)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '0.85rem'
          }}
        >
          <div>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#b45309' }}>
              ₹{skill.price}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {' '}{skill.pricingType === 'hourly' ? '/ hr' : 'fixed base'}
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} />
            <span>{skill.availability?.split('(')[0] || 'Flexible'}</span>
          </span>
        </div>

        {/* Owner Trust Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '0.75rem',
            marginBottom: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <img
              src={owner.avatar}
              alt={owner.name}
              style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {owner.name.split(' ')[0]}
                </span>
                {owner.isVerified && <CheckCircle2 size={12} color="#3b82f6" />}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.68rem', color: '#f59e0b' }}>
                <Star size={11} fill="#f59e0b" />
                <span style={{ fontWeight: 700 }}>{owner.ratingAverage || 5.0}</span>
                <span style={{ color: 'var(--text-muted)' }}>({owner.reviewsCount || 15})</span>
              </div>
            </div>
          </div>

          <div
            className="badge badge-trust"
            style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
          >
            <ShieldCheck size={12} />
            <span>{owner.trustScore} Trust</span>
          </div>
        </div>

        <button
          className="btn btn-primary btn-sm"
          style={{ width: '100%', fontWeight: 700 }}
          onClick={() => openModal('skillDetail', skill)}
        >
          {isOwner ? 'Manage My Skill' : 'Request Repair / Service'}
        </button>
      </div>
    </div>
  );
}
