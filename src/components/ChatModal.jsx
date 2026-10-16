// RepairMitra ChatModal Component - In-App Privacy Protected Coordination
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Send,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCheck,
  AlertCircle
} from 'lucide-react';

export default function ChatModal({ data, onClose }) {
  const { requestId, otherParty, reqTitle } = data;
  const { currentUser, messages, sendMessage } = useApp();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);

  // Filter messages for this request
  const requestMessages = messages.filter((m) => m.requestId === requestId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [requestMessages]);

  const handleSend = (textToSend = null) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    sendMessage(requestId, text.trim());
    if (!textToSend) setInputVal('');
  };

  // Quick Action Shortcuts
  const quickActions = [
    '📍 Share gate code & flat number',
    '⏰ Confirming pickup at 10:00 AM',
    '✅ Received tool safely, thank you!',
    '🔔 Reminder: return planned for tomorrow evening'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '580px', height: '620px', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src={otherParty.avatar}
              alt={otherParty.name}
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{otherParty.name}</span>
                {otherParty.isVerified && <span className="badge badge-verified" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>Verified</span>}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Re: {reqTitle ? (reqTitle.length > 32 ? reqTitle.substring(0, 32) + '...' : reqTitle) : 'Exchange'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="badge badge-trust" style={{ fontSize: '0.7rem' }}>
              🛡️ {otherParty.trustScore} Trust
            </div>
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

        {/* Privacy Banner */}
        <div
          style={{
            background: 'rgba(13, 148, 136, 0.08)',
            padding: '0.4rem 1rem',
            fontSize: '0.72rem',
            color: 'var(--primary-800)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            borderBottom: '1px solid rgba(13, 148, 136, 0.15)'
          }}
        >
          <ShieldCheck size={14} color="var(--primary-600)" />
          <span>In-app messaging protects personal phone numbers. Never share financial passwords or off-platform payment links.</span>
        </div>

        {/* Message Log */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          {requestMessages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>
              <p style={{ fontSize: '0.85rem' }}>Say hello to coordinate pick-up times, tool check, or project scope!</p>
            </div>
          ) : (
            requestMessages.map((msg) => {
              const isMine = msg.fromUserId === currentUser.id;
              const isSystem = msg.isSystemAlert;

              if (isSystem) {
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: 'center',
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#065f46',
                      padding: '0.4rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      maxWidth: '90%',
                      textAlign: 'center',
                      fontWeight: 600
                    }}
                  >
                    {msg.text}
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isMine ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMine ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      padding: '0.65rem 0.95rem',
                      borderRadius: isMine ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      background: isMine
                        ? 'linear-gradient(135deg, var(--primary-600), var(--primary-700))'
                        : 'var(--bg-card)',
                      color: isMine ? '#ffffff' : 'var(--text-main)',
                      border: isMine ? 'none' : '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-sm)',
                      fontSize: '0.85rem',
                      lineHeight: 1.45,
                      wordBreak: 'break-word'
                    }}
                  >
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div
          style={{
            padding: '0.4rem 1rem',
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-page)'
          }}
        >
          {quickActions.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(pill)}
              style={{
                fontSize: '0.7rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                padding: '0.2rem 0.6rem',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                color: 'var(--text-main)'
              }}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            padding: '0.85rem 1rem',
            display: 'flex',
            gap: '0.5rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-card)'
          }}
        >
          <input
            type="text"
            className="input-field"
            placeholder="Type your message to neighbor..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            style={{ borderRadius: 'var(--radius-full)', height: '2.5rem' }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ borderRadius: 'var(--radius-full)', width: '2.5rem', height: '2.5rem', padding: 0 }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
