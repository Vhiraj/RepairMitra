// RepairMitra Legal & Privacy Modals
import React from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';

export function PrivacyPolicyModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '680px', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} color="var(--primary-600)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              Privacy Policy
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            Last revised: October 2026. This Privacy Policy explains how RepairMitra collects, utilizes, and protects information when you participate in our peer-to-peer equipment and service sharing platform.
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>1. Information We Collect</h3>
          <p>
            We collect account credentials (username, email, hashed passwords), user-submitted listing details, general neighborhood GPS coordinates for proximity sorting, and transaction coordination records.
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>2. Phone Number & Address Privacy</h3>
          <p>
            Your exact residential address and personal telephone number are never made public. Exact pickup details are only unlocked to the confirmed counterparty once an exchange request is formally accepted by the owner.
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>3. Data Storage & Security</h3>
          <p>
            User authentication credentials are encrypted using industry-standard bcrypt hashing. Listings, requests, and messages are stored in our secure database. We do not sell or monetize personal browsing information.
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>4. Intra-App Messaging</h3>
          <p>
            All borrower-to-owner communications are conducted in-app to prevent external spam or unsolicited contact. Users may cancel requests or delete listings at any time.
          </p>

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary btn-sm" onClick={onClose}>
              Close & Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TermsModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '680px', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--primary-600)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              Terms and Conditions
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            Effective date: October 2026. By accessing RepairMitra, you agree to adhere to these community terms and conditions.
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>1. Equipment Safety and Inspection</h3>
          <p>
            Borrowers agree to inspect all tools prior to taking possession and to follow standard manufacturer safety instructions. Tools must be returned in the same condition as received, cleaned and ready for the next neighbor.
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>2. Direct Peer Transactions</h3>
          <p>
            RepairMitra facilitates neighborly coordination. Lenders and service providers are independent community members. Users must agree upon rental rates, service scopes, and security deposits prior to handoff.
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>3. Security Deposits & Timely Returns</h3>
          <p>
            Refundable deposits (if specified by the tool owner) are returned upon verification of equipment condition. Late returns without prior communication may impact your neighbor trust score.
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>4. Code of Conduct</h3>
          <p>
            Harassment, fraudulent listings, dangerous equipment modifications, or off-platform harassment will result in immediate suspension and removal by moderators.
          </p>

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary btn-sm" onClick={onClose}>
              Accept & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
