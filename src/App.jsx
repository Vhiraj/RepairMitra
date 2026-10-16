// RepairMitra - Skill & Tool Exchange Network Main Application
import React from 'react';
import './App.css';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ToolCard from './components/ToolCard';
import SkillCard from './components/SkillCard';
import ListingDetailModal from './components/ListingDetailModal';
import PostListingModal from './components/PostListingModal';
import RequestsView from './components/RequestsView';
import ChatModal from './components/ChatModal';
import VerificationModal from './components/VerificationModal';
import ReviewModal from './components/ReviewModal';
import LocationModal from './components/LocationModal';
import ProfileView from './components/ProfileView';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import { TOOL_CATEGORIES, SKILL_CATEGORIES } from './data/mockData';
import {
  Wrench,
  Search,
  MapPin,
  Sparkles,
  SlidersHorizontal,
  PlusCircle,
  Inbox,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Share2,
  ArrowRight
} from 'lucide-react';

function MainContent() {
  const {
    tools,
    skills,
    users,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    listingTypeFilter,
    setListingTypeFilter,
    sortBy,
    maxDistanceKm,
    getListingDistance,
    activeModal,
    openModal,
    closeModal,
    userLocation
  } = useApp();

  // Filter Tools
  const filteredTools = tools
    .filter((tool) => {
      // Distance filter
      const distance = getListingDistance(tool);
      if (distance > maxDistanceKm) return false;

      // Category filter
      if (selectedCategory !== 'All' && selectedCategory !== 'All Tools' && tool.category !== selectedCategory) {
        return false;
      }

      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = tool.title.toLowerCase().includes(q);
        const inDesc = tool.description.toLowerCase().includes(q);
        const inCat = tool.category.toLowerCase().includes(q);
        const inTag = tool.tags?.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inCat && !inTag) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'proximity') return getListingDistance(a) - getListingDistance(b);
      if (sortBy === 'price_low') return a.rentalFee - b.rentalFee;
      const ownerA = users.find((u) => u.id === a.ownerId);
      const ownerB = users.find((u) => u.id === b.ownerId);
      if (sortBy === 'trust') return (ownerB?.trustScore || 0) - (ownerA?.trustScore || 0);
      if (sortBy === 'rating') return (ownerB?.ratingAverage || 0) - (ownerA?.ratingAverage || 0);
      return 0;
    });

  // Filter Skills
  const filteredSkills = skills
    .filter((skill) => {
      const distance = getListingDistance(skill);
      if (distance > maxDistanceKm) return false;

      if (selectedCategory !== 'All' && selectedCategory !== 'All Skills' && skill.serviceType !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = skill.title.toLowerCase().includes(q);
        const inDesc = skill.description.toLowerCase().includes(q);
        const inType = skill.serviceType.toLowerCase().includes(q);
        const inInc = skill.skillsIncluded?.some((s) => s.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inType && !inInc) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'proximity') return getListingDistance(a) - getListingDistance(b);
      if (sortBy === 'price_low') return a.price - b.price;
      const ownerA = users.find((u) => u.id === a.ownerId);
      const ownerB = users.find((u) => u.id === b.ownerId);
      if (sortBy === 'trust') return (ownerB?.trustScore || 0) - (ownerA?.trustScore || 0);
      if (sortBy === 'rating') return (ownerB?.ratingAverage || 0) - (ownerA?.ratingAverage || 0);
      return 0;
    });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '1.5rem 0' }}>
        <div className="container">
          {/* TAB 1: EXPLORE / HOME DASHBOARD */}
          {activeTab === 'explore' && (
            <>
              <HeroBanner />

              {/* Category Filter Pills */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  overflowX: 'auto',
                  paddingBottom: '0.75rem',
                  marginBottom: '1.5rem'
                }}
              >
                <button
                  className={`btn btn-sm ${selectedCategory === 'All' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedCategory('All')}
                >
                  All Categories
                </button>
                {TOOL_CATEGORIES.filter((c) => c !== 'All Tools').map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setListingTypeFilter('tools');
                    }}
                  >
                    🧰 {cat}
                  </button>
                ))}
                {SKILL_CATEGORIES.filter((c) => c !== 'All Skills').map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setListingTypeFilter('skills');
                    }}
                  >
                    👨‍🔧 {cat}
                  </button>
                ))}
              </div>

              {/* Section Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Gear & Skills in {userLocation.neighborhood}
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Showing {filteredTools.length + filteredSkills.length} matches within {maxDistanceKm}km
                  </span>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => openModal('location')}
                >
                  <MapPin size={14} color="var(--primary-600)" />
                  <span>Change Distance</span>
                </button>
              </div>

              {/* Results Grid */}
              {filteredTools.length === 0 && filteredSkills.length === 0 ? (
                <div
                  className="glass-panel"
                  style={{
                    padding: '3rem 1.5rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)'
                  }}
                >
                  <Search size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    No listings found within {maxDistanceKm} km
                  </h3>
                  <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Try expanding your search radius slider or searching for a different tool.
                  </p>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setListingTypeFilter('all');
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="cards-grid">
                  {(listingTypeFilter === 'all' || listingTypeFilter === 'tools') &&
                    filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}

                  {(listingTypeFilter === 'all' || listingTypeFilter === 'skills') &&
                    filteredSkills.map((skill) => <SkillCard key={skill.id} skill={skill} />)}
                </div>
              )}
            </>
          )}

          {/* TAB 2: TOOLS ONLY BROWSE */}
          {activeTab === 'tools' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Browse Neighborhood Tools
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                    Borrow power tools, pressure washers, ladders, and saws directly from neighbors.
                  </p>
                </div>

                <button className="btn btn-primary btn-sm" onClick={() => openModal('postTool')}>
                  <PlusCircle size={15} /> Post a Tool
                </button>
              </div>

              {/* Categories */}
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                {TOOL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-sm ${selectedCategory === cat || (cat === 'All Tools' && selectedCategory === 'All') ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedCategory(cat === 'All Tools' ? 'All' : cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="cards-grid">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS & REPAIRS BROWSE */}
          {activeTab === 'skills' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Hire Skilled Neighbors & Repair Artisans
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                    Support local electricians, carpenters, plumbers, and tailors with transparent peer pricing.
                  </p>
                </div>

                <button className="btn btn-primary btn-sm" onClick={() => openModal('postSkill')}>
                  <PlusCircle size={15} /> Offer a Skill
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                {SKILL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-sm ${selectedCategory === cat || (cat === 'All Skills' && selectedCategory === 'All') ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedCategory(cat === 'All Skills' ? 'All' : cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="cards-grid">
                {filteredSkills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REQUESTS & EXCHANGE MANAGEMENT */}
          {activeTab === 'requests' && <RequestsView />}

          {/* TAB 5: PROFILE & TRANSACTION HISTORY */}
          {activeTab === 'history' && <ProfileView />}

          {/* TAB 6: ADMIN MODERATION */}
          {activeTab === 'admin' && <AdminDashboard />}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
          padding: '2.5rem 0 1.5rem',
          marginTop: 'auto'
        }}
      >
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Wrench size={16} />
                </div>
                <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  Repair<span style={{ color: 'var(--primary-600)' }}>Mitra</span>
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                A hyperlocal peer-to-peer marketplace where neighbours share equipment and repair skills without commercial intermediaries.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                Community Safety & Trust
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>✓ Mandatory ID & Selfie Verification</li>
                <li>✓ Privacy Protected In-App Chat</li>
                <li>✓ Dynamic Trust Score Engine (0-100)</li>
                <li>✓ Community Equipment Care Rules</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                Hyperlocal Coverage
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Active in Indiranagar, Koramangala, HSR Layout, Whitefield, and surrounding neighborhoods with automated radius discovery.
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>© 2024 RepairMitra Network • Peer-to-peer Tool Library & Skill Exchange</span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span>Privacy Guaranteed</span>
              <span>•</span>
              <span>Zero Intermediary Cut</span>
              <span>•</span>
              <span>Low-Bandwidth (2G) Ready</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS RENDERER */}
      {activeModal?.type === 'toolDetail' && (
        <ListingDetailModal listing={activeModal.data} type="tool" onClose={closeModal} />
      )}

      {activeModal?.type === 'skillDetail' && (
        <ListingDetailModal listing={activeModal.data} type="skill" onClose={closeModal} />
      )}

      {activeModal?.type === 'postChoice' && (
        <PostListingModal initialTab="tool" onClose={closeModal} />
      )}

      {activeModal?.type === 'postTool' && (
        <PostListingModal initialTab="tool" onClose={closeModal} />
      )}

      {activeModal?.type === 'postSkill' && (
        <PostListingModal initialTab="skill" onClose={closeModal} />
      )}

      {activeModal?.type === 'chat' && (
        <ChatModal data={activeModal.data} onClose={closeModal} />
      )}

      {activeModal?.type === 'verify' && (
        <VerificationModal onClose={closeModal} />
      )}

      {activeModal?.type === 'review' && (
        <ReviewModal data={activeModal.data} onClose={closeModal} />
      )}

      {activeModal?.type === 'location' && (
        <LocationModal onClose={closeModal} />
      )}

      {activeModal?.type === 'profile' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
            <ProfileView user={activeModal.data} />
          </div>
        </div>
      )}

      {activeModal?.type === 'auth' && (
        <AuthModal initialMode={activeModal.data || 'login'} onClose={closeModal} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
