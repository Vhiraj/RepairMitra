// RepairMitra RequestsView Component - Incoming & Outgoing Requests Hub
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Inbox,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  MapPin,
  Star,
  ShieldCheck,
  AlertCircle,
  Calendar,
  RotateCcw,
  Check
} from 'lucide-react';

export default function RequestsView() {
  const {
    currentUser,
    users,
    requests,
    respondToRequest,
    completeRequest,
    openModal,
    createRequest
  } = useApp();

  const [filterType, setFilterType] = useState('incoming'); // 'incoming' | 'outgoing'
  const [responseNotes, setResponseNotes] = useState('');
  const [activeReqIdForNotes, setActiveReqIdForNotes] = useState(null);

  // Incoming: Requests for items owned by currentUser
  const incoming = requests.filter((r) => r.ownerId === currentUser.id);

  // Outgoing: Requests made by currentUser
  const outgoing = requests.filter((r) => r.borrowerId === currentUser.id);

  const displayedList = filterType === 'incoming' ? incoming : outgoing;

  const handleAcceptWithNotes = (reqId) => {
    respondToRequest(reqId, 'accept', responseNotes);
    setActiveReqIdForNotes(null);
    setResponseNotes('');
  };

  const handleDeclineWithNotes = (reqId) => {
    respondToRequest(reqId, 'decline', responseNotes);
    setActiveReqIdForNotes(null);
    setResponseNotes('');
  };

  const handleReorder = (prevReq) => {
    const today = new Date().toISOString().split('T')[0];
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + (prevReq.daysCount || 2));
    const nextStr = nextDate.toISOString().split('T')[0];

    createRequest({
      listingId: prevReq.listingId,
      listingType: prevReq.listingType,
      listingTitle: prevReq.listingTitle,
      listingImage: prevReq.listingImage,
      ownerId: prevReq.ownerId,
      startDate: today,
      endDate: nextStr,
      daysCount: prevReq.daysCount || 1,
      projectScope: `Re-order: ${prevReq.projectScope}`,
      totalCost: prevReq.totalCost,
      deposit: prevReq.deposit
    });
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Title & Tabs */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            Exchanges & Request Hub
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
            Manage lending requests from neighbors and track your borrowed tools & repair jobs.
          </p>
        </div>

        {/* Tab switchers */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-page)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <button
            className={`btn btn-sm ${filterType === 'incoming' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType('incoming')}
            style={{ position: 'relative' }}
          >
            <Inbox size={15} />
            <span>Incoming to Me ({incoming.length})</span>
            {incoming.filter((r) => r.status === 'pending').length > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: '50%',
                  fontSize: '0.65rem',
                  padding: '1px 6px',
                  fontWeight: 700
                }}
              >
                {incoming.filter((r) => r.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            className={`btn btn-sm ${filterType === 'outgoing' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType('outgoing')}
          >
            <Send size={15} />
            <span>My Borrow Requests ({outgoing.length})</span>
          </button>
        </div>
      </div>

      {/* Requests List */}
      {displayedList.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '3rem 1.5rem',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}
        >
          <Inbox size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            {filterType === 'incoming' ? 'No incoming requests yet' : 'No active borrow requests'}
          </h3>
          <p style={{ fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            {filterType === 'incoming'
              ? 'When neighbors in your area want to borrow your listed tools or hire your repair skills, requests will show up here.'
              : 'Browse nearby tools or repair skills in your neighborhood and submit a request to start sharing.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {displayedList.map((req) => {
            const otherPartyId = filterType === 'incoming' ? req.borrowerId : req.ownerId;
            const otherParty = users.find((u) => u.id === otherPartyId) || {
              name: 'Neighbor',
              trustScore: 85,
              ratingAverage: 5.0,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
            };

            const isPending = req.status === 'pending';
            const isAccepted = req.status === 'accepted';
            const isCompleted = req.status === 'completed';
            const isDeclined = req.status === 'declined';

            return (
              <div
                key={req.id}
                className="glass-panel"
                style={{
                  padding: '1.25rem 1.5rem',
                  borderLeft: isAccepted
                    ? '4px solid #10b981'
                    : isPending
                    ? '4px solid #f59e0b'
                    : isCompleted
                    ? '4px solid #3b82f6'
                    : '4px solid #94a3b8'
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img
                      src={req.listingImage}
                      alt={req.listingTitle}
                      style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="badge badge-category" style={{ fontSize: '0.68rem' }}>
                          {req.listingType === 'tool' ? '🧰 Tool' : '👨‍🔧 Service'}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0.2rem 0', color: 'var(--text-main)' }}>
                        {req.listingTitle}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={13} />
                        <span>
                          {req.startDate} {req.endDate && req.endDate !== req.startDate ? `to ${req.endDate}` : ''} ({req.daysCount} days)
                        </span>
                        <span>•</span>
                        <strong style={{ color: 'var(--primary-700)' }}>₹{req.totalCost}</strong>
                        {req.deposit > 0 && <span style={{ fontSize: '0.75rem' }}>(+₹{req.deposit} deposit)</span>}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isPending && <span className="badge badge-pending">⏳ Pending Response</span>}
                    {isAccepted && <span className="badge badge-available">✓ Accepted / Active Loan</span>}
                    {isCompleted && <span className="badge badge-verified">★ Completed & Returned</span>}
                    {isDeclined && <span className="badge badge-unavailable">✕ Declined</span>}
                  </div>
                </div>

                {/* Requester or Owner Details Strip */}
                <div
                  style={{
                    background: 'var(--bg-page)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <img
                      src={otherParty.avatar}
                      alt={otherParty.name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {filterType === 'incoming' ? `Borrower: ${otherParty.name}` : `Owner: ${otherParty.name}`}
                        </span>
                        {otherParty.isVerified && <CheckCircle2 size={14} color="#3b82f6" />}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span style={{ color: '#f59e0b', fontWeight: 700 }}>★ {otherParty.ratingAverage || 5.0}</span>
                        <span>•</span>
                        <span>{otherParty.neighborhood || 'Neighbor'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="badge badge-trust" style={{ fontSize: '0.72rem' }}>
                    🛡️ {otherParty.trustScore} Trust Score
                  </div>
                </div>

                {/* Scope / Notes */}
                <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                    Project Scope / Requirement:
                  </span>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontStyle: 'italic', background: 'var(--bg-card)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    "{req.projectScope}"
                  </p>
                </div>

                {/* If Accepted: Exact Pick-up address unlocked! */}
                {isAccepted && (
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1rem',
                      marginBottom: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#065f46', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                      <MapPin size={16} />
                      <span>Exact Pick-up Address (Unlocked for this transaction):</span>
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-main)', fontWeight: 600 }}>
                      {req.exactPickupAddress || 'Flat 302, Green Glen Apartments, 12th Cross, 100ft Road, Indiranagar'}
                    </div>
                    {req.pickupTimeNotes && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Notes: {req.pickupTimeNotes}
                      </div>
                    )}
                  </div>
                )}

                {/* Inline response notes input for Accept/Decline */}
                {activeReqIdForNotes === req.id && (
                  <div style={{ marginBottom: '1rem', background: 'var(--bg-card)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-300)' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      Add Pickup Instruction or Note:
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Call my intercom at the gate; tool is sanitized."
                      value={responseNotes}
                      onChange={(e) => setResponseNotes(e.target.value)}
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleAcceptWithNotes(req.id)}
                        className="btn btn-primary btn-sm"
                        style={{ background: '#10b981' }}
                      >
                        Confirm Accept
                      </button>
                      <button
                        onClick={() => handleDeclineWithNotes(req.id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Confirm Decline
                      </button>
                      <button
                        onClick={() => setActiveReqIdForNotes(null)}
                        className="btn btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* In-app Chat Button */}
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openModal('chat', { requestId: req.id, otherParty, reqTitle: req.listingTitle })}
                    >
                      <MessageSquare size={14} />
                      <span>Coordinate in Chat</span>
                    </button>

                    {/* Re-order button for outgoing completed */}
                    {filterType === 'outgoing' && (isCompleted || isDeclined) && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleReorder(req)}
                        title="Quickly borrow or request this again with pre-filled scope"
                      >
                        <RotateCcw size={14} />
                        <span>Borrow Again (1-Click)</span>
                      </button>
                    )}
                  </div>

                  {/* Incoming: Owner Actions */}
                  {filterType === 'incoming' && isPending && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ background: '#10b981', borderColor: '#10b981' }}
                        onClick={() => {
                          setActiveReqIdForNotes(req.id);
                          setResponseNotes('Ready for pickup tomorrow morning.');
                        }}
                      >
                        <CheckCircle2 size={15} />
                        <span>Accept Request</span>
                      </button>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          setActiveReqIdForNotes(req.id);
                          setResponseNotes('Sorry, currently not available on these dates.');
                        }}
                      >
                        <XCircle size={15} />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}

                  {/* Active exchange: Mark as Completed */}
                  {isAccepted && (
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)' }}
                      onClick={() => completeRequest(req.id)}
                    >
                      <Check size={14} />
                      <span>Mark Job Done / Item Returned</span>
                    </button>
                  )}

                  {/* Completed: Review Prompt */}
                  {isCompleted && (
                    <div>
                      {((filterType === 'outgoing' && !req.reviewedByBorrower) ||
                        (filterType === 'incoming' && !req.reviewedByOwner)) ? (
                        <button
                          className="btn btn-accent btn-sm"
                          onClick={() =>
                            openModal('review', {
                              requestId: req.id,
                              revieweeId: otherPartyId,
                              requestTitle: req.listingTitle
                            })
                          }
                        >
                          <Star size={14} fill="#fff" />
                          <span>Rate & Review Neighbor</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                          ✓ Reviewed & Trust Score Updated
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
