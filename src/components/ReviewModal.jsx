// RepairMitra ReviewModal Component - Post Exchange Rating & Trust Feedback
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  Sparkles,
  Heart,
  CheckCircle2
} from 'lucide-react';

export default function ReviewModal({ data, onClose }) {
  const { requestId, revieweeId, requestTitle } = data;
  const { users, submitReview } = useApp();

  const reviewee = users.find((u) => u.id === revieweeId) || {
    name: 'Neighbor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  };

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Punctual', 'Tool in Top Condition']);

  const availableTags = [
    'Punctual',
    'Tool in Top Condition',
    'Clear Instructions',
    'Friendly Neighbor',
    'Skillful Workmanship',
    'Clean Return',
    'Recommended'
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitReview({
      requestId,
      revieweeId,
      rating,
      comment: comment.trim() || 'Great experience sharing gear with this neighbor! Highly recommended.',
      tags: selectedTags
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '480px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            Leave Review & Trust Rating
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {/* Target user preview */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <img
              src={reviewee.avatar}
              alt={reviewee.name}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.5rem' }}
            />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.2rem', color: 'var(--text-main)' }}>
              How was your exchange with {reviewee.name}?
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Regarding: <em>{requestTitle || 'Recent Tool / Skill Exchange'}</em>
            </p>
          </div>

          {/* Star selector */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem'
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={32}
                  fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
                  color={(hoverRating || rating) >= star ? '#f59e0b' : '#cbd5e1'}
                />
              </button>
            ))}
          </div>

          {/* Quick tags */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              What went especially well?
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      border: isSelected ? '1px solid var(--primary-600)' : '1px solid var(--border-color)',
                      background: isSelected ? 'var(--primary-50)' : 'var(--bg-card)',
                      color: isSelected ? 'var(--primary-700)' : 'var(--text-main)',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Written Feedback for the Community
            </label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="e.g. Returned the drill in clean condition with all drill bits accounted for. Very polite neighbor!"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', fontWeight: 800 }}
          >
            Submit Review & Update Trust Score
          </button>
        </form>
      </div>
    </div>
  );
}
