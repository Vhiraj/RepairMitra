// RepairMitra VerificationModal Component - Trust & Safety Identity Check
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Upload,
  Lock,
  Sparkles,
  Award
} from 'lucide-react';

export default function VerificationModal({ onClose }) {
  const { currentUser, verifyIdentity } = useApp();

  const [docType, setDocType] = useState('Aadhaar Card');
  const [docNumber, setDocNumber] = useState('XXXX-XXXX-4921');
  const [selfieCaptured, setSelfieCaptured] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      verifyIdentity(currentUser.id, docType, docNumber);
      setIsProcessing(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '520px' }}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6'
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Neighbor Identity Verification
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Build trust & unlock borrowing high-value power gear
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          {currentUser.isVerified && !success ? (
            /* Already Verified View */
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: '#10b981'
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                You are a Verified Neighbor!
              </h4>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Your identity was successfully verified via <strong>{currentUser.verificationDocType || 'Government ID'}</strong> on {currentUser.verifiedDate || '2024-03-15'}.
              </p>

              <div
                style={{
                  background: 'var(--bg-page)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-around',
                  marginBottom: '1.5rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                    🛡️ {currentUser.trustScore}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Trust Score</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#3b82f6' }}>
                    Active
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Verified Badge</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                    Full
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Lending Access</div>
                </div>
              </div>

              <button className="btn btn-secondary" onClick={onClose} style={{ width: '100%' }}>
                Close
              </button>
            </div>
          ) : success ? (
            /* Just Verified Success View */
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: '#fff',
                  boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Sparkles size={32} />
              </div>

              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                Verification Complete!
              </h4>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                You have earned the <strong>Verified Neighbor Badge</strong>. Your trust score has been boosted to <strong>🛡️ {currentUser.trustScore}</strong>!
              </p>

              <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
                Start Exploring Verified Listings
              </button>
            </div>
          ) : (
            /* Verification Form */
            <form onSubmit={handleVerify}>
              {/* Trust Score Benefit info */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-main)',
                  display: 'flex',
                  gap: '0.65rem',
                  alignItems: 'center'
                }}
              >
                <Award size={20} color="#3b82f6" style={{ flexShrink: 0 }} />
                <span>
                  <strong>+35 Trust Points:</strong> Verified members get 3x higher approval rates for power equipment and zero deposit waivers from trusted neighbors.
                </span>
              </div>

              {/* Step 1: Document */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Select ID Document
                </label>
                <select
                  className="input-field"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                >
                  <option value="Aadhaar Card">Aadhaar Card (UIDAI)</option>
                  <option value="Driving License">Driving License (State Transport)</option>
                  <option value="Passport">Passport</option>
                  <option value="Voter ID">Voter ID Card</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Document Identification Number
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. 5432-8765-9012"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  required
                />
              </div>

              {/* Step 2: Selfie Simulation */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Live Face Match (Selfie)
                </label>
                <div
                  style={{
                    border: '2px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    textAlign: 'center',
                    background: 'var(--bg-page)',
                    position: 'relative'
                  }}
                >
                  {selfieCaptured ? (
                    <div>
                      <div
                        style={{
                          width: '72px',
                          height: '72px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          margin: '0 auto 0.5rem',
                          border: '2px solid #10b981'
                        }}
                      >
                        <img
                          src={currentUser.avatar}
                          alt="Selfie"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                        ✓ Liveness & Facial Geometry Verified
                      </span>
                      <br />
                      <button
                        type="button"
                        onClick={() => setSelfieCaptured(false)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.72rem', cursor: 'pointer', marginTop: '0.25rem' }}
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Camera size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600, margin: '0 0 0.5rem' }}>
                        Take a quick live photo to match with {docType}
                      </p>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelfieCaptured(true)}
                      >
                        <Camera size={14} />
                        <span>Simulate Camera Capture</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                <Lock size={13} />
                <span>Documents are encrypted with AES-256 and never shared with other users.</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', fontWeight: 800 }}
                disabled={isProcessing}
              >
                {isProcessing ? 'Verifying with Government Registry...' : 'Submit & Verify My Profile'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
