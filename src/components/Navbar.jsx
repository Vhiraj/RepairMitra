// RepairMitra Navbar Component
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wrench,
  Search,
  MapPin,
  Crosshair,
  PlusCircle,
  Bell,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Inbox,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  ChevronDown,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function Navbar() {
  const {
    currentUser,
    logoutUser,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    userLocation,
    detectLocation,
    isLocating,
    maxDistanceKm,
    is2GMode,
    toggle2GMode,
    theme,
    toggleTheme,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    openModal,
    requests,
    favorites
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userNotifications = notifications.filter(
    (n) => currentUser && n.userId === currentUser.id
  );
  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  const pendingIncomingCount = requests.filter(
    (r) => currentUser && r.ownerId === currentUser.id && r.status === 'pending'
  ).length;

  const handlePostClick = () => {
    if (!currentUser) {
      openModal('auth', 'login');
    } else {
      openModal('postChoice');
    }
  };

  const handleTabClick = (tab) => {
    if ((tab === 'requests' || tab === 'history') && !currentUser) {
      openModal('auth', 'login');
      return;
    }
    setActiveTab(tab);
  };

  return (
    <header
      className="glass-nav"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 0.2s ease'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.25rem',
          gap: '1rem'
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('explore')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: '2.4rem',
              height: '2.4rem',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Wrench size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                Repair<span style={{ color: 'var(--primary-600)' }}>Mitra</span>
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
              Skill & Tool Exchange Network
            </p>
          </div>
        </div>

        {/* Location Selector & Live GPS Detection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div
            onClick={() => openModal('location')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.75rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              color: 'var(--text-main)',
              transition: 'all 0.15s ease'
            }}
            title="Click to set neighborhood or search radius"
          >
            <MapPin size={14} color="var(--primary-600)" />
            <span style={{ fontWeight: 600 }}>{userLocation.neighborhood || 'Select Area'}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>({maxDistanceKm}km)</span>
            <ChevronDown size={13} color="var(--text-muted)" />
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={detectLocation}
            disabled={isLocating}
            title="Detect my current location via device GPS"
            style={{ padding: '0.4rem 0.55rem' }}
          >
            <Crosshair size={14} color="var(--primary-600)" />
            <span style={{ fontSize: '0.72rem' }}>{isLocating ? 'Locating...' : 'Detect'}</span>
          </button>
        </div>

        {/* Search input in header */}
        <div style={{ position: 'relative', flex: '1', maxWidth: '300px' }} className="nav-search-box">
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Search tools, repairs, drills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '2.1rem',
              fontSize: '0.8rem',
              height: '2.3rem',
              borderRadius: 'var(--radius-sm)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.6rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.75rem'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button
            className={`btn btn-sm ${activeTab === 'explore' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleTabClick('explore')}
          >
            Explore
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'tools' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleTabClick('tools')}
          >
            Tools
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'skills' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleTabClick('skills')}
          >
            Skills
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'saved' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleTabClick('saved')}
            title="Saved for later"
          >
            <Bookmark size={13} />
            <span>Saved ({favorites.length})</span>
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'requests' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleTabClick('requests')}
            style={{ position: 'relative' }}
          >
            <Inbox size={13} />
            <span>Requests</span>
            {pendingIncomingCount > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.65rem',
                  padding: '1px 5px',
                  fontWeight: 700,
                  marginLeft: '0.2rem'
                }}
              >
                {pendingIncomingCount}
              </span>
            )}
          </button>
          {currentUser && (
            <button
              className={`btn btn-sm ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleTabClick('history')}
            >
              <Clock size={13} />
              <span>History</span>
            </button>
          )}
          {currentUser?.role === 'admin' && (
            <button
              className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleTabClick('admin')}
              style={{ color: '#0d9488', borderColor: '#99f6e4' }}
            >
              <ShieldCheck size={13} />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Actions & Utilities */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Post Listing Button */}
          <button
            className="btn btn-primary btn-sm"
            onClick={handlePostClick}
            style={{ gap: '0.35rem' }}
          >
            <PlusCircle size={15} />
            <span>Post Listing</span>
          </button>

          {/* 2G Mode toggle */}
          <button
            onClick={toggle2GMode}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '0.4rem 0.55rem',
              color: is2GMode ? '#d97706' : 'var(--text-muted)'
            }}
            title={is2GMode ? 'Disable 2G Low Bandwidth Mode' : 'Enable 2G Low Bandwidth Mode for weak connections'}
          >
            {is2GMode ? <WifiOff size={15} /> : <Wifi size={15} />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem 0.55rem', color: 'var(--text-muted)' }}
            title="Toggle Dark / Light Mode"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Notifications Dropdown (when logged in) */}
          {currentUser && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowUserMenu(false);
                }}
                className="btn btn-secondary btn-sm"
                style={{ position: 'relative', padding: '0.4rem 0.55rem' }}
                title="Notifications"
              >
                <Bell size={15} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-3px',
                      right: '-3px',
                      background: '#ef4444',
                      color: '#fff',
                      borderRadius: 'var(--radius-xs)',
                      padding: '1px 4px',
                      fontSize: '0.62rem',
                      fontWeight: 700
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '2.6rem',
                    width: '320px',
                    maxHeight: '380px',
                    overflowY: 'auto',
                    padding: '0.75rem',
                    zIndex: 200,
                    boxShadow: 'var(--shadow-xl)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {userNotifications.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                      No notifications yet
                    </p>
                  ) : (
                    userNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          setActiveTab('requests');
                          setShowNotifMenu(false);
                        }}
                        style={{
                          padding: '0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          background: notif.isRead ? 'transparent' : 'var(--primary-50)',
                          marginBottom: '0.35rem',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--text-main)' }}>
                            {notif.title}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Authentication State: Logged In vs Unauthenticated Guest */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.25rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  cursor: 'pointer'
                }}
                title="Account menu"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{ width: '26px', height: '26px', borderRadius: '4px', objectFit: 'cover' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--primary-700)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <ShieldCheck size={10} /> {currentUser.trustScore} Trust
                  </span>
                </div>
                <ChevronDown size={13} color="var(--text-muted)" />
              </div>

              {showUserMenu && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '2.6rem',
                    width: '240px',
                    padding: '0.75rem',
                    zIndex: 200,
                    boxShadow: 'var(--shadow-xl)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-color)' }}>
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{currentUser.name}</span>
                        {currentUser.isVerified && <CheckCircle2 size={13} color="#3b82f6" />}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentUser.email}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', justifyContent: 'flex-start' }}
                      onClick={() => {
                        openModal('profile', currentUser);
                        setShowUserMenu(false);
                      }}
                    >
                      View Profile
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      style={{ width: '100%', justifyContent: 'flex-start', gap: '0.4rem' }}
                      onClick={() => {
                        logoutUser();
                        setShowUserMenu(false);
                      }}
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => openModal('auth', 'login')}
                style={{ gap: '0.3rem' }}
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => openModal('auth', 'register')}
                style={{ gap: '0.3rem' }}
              >
                <UserPlus size={13} />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
