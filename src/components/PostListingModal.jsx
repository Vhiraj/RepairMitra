// RepairMitra PostListingModal Component
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Wrench,
  Hammer,
  Upload,
  AlertCircle,
  Plus,
  Trash2,
  LogIn
} from 'lucide-react';
import { TOOL_CATEGORIES, SKILL_CATEGORIES } from '../data/mockData';

export default function PostListingModal({ initialTab = 'tool', onClose }) {
  const { postTool, postSkill, currentUser, userLocation, openModal } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab); // 'tool' | 'skill'

  // Tool Form State
  const [toolTitle, setToolTitle] = useState('');
  const [toolCategory, setToolCategory] = useState(TOOL_CATEGORIES[1]);
  const [toolDescription, setToolDescription] = useState('');
  const [toolCondition, setToolCondition] = useState('Excellent');
  const [toolDeposit, setToolDeposit] = useState('300');
  const [toolRentalFee, setToolRentalFee] = useState('120');
  const [toolImages, setToolImages] = useState([]);
  const [toolTerms, setToolTerms] = useState('Please handle with care and return clean and fully charged.');
  const [toolSafety, setToolSafety] = useState('Wear safety glasses and gloves when operating.');
  const [toolUploadError, setToolUploadError] = useState('');
  const [toolFileSizeKb, setToolFileSizeKb] = useState(0);

  // Skill Form State
  const [skillTitle, setSkillTitle] = useState('');
  const [skillCategory, setSkillCategory] = useState(SKILL_CATEGORIES[1]);
  const [skillDescription, setSkillDescription] = useState('');
  const [skillPricingType, setSkillPricingType] = useState('hourly');
  const [skillPrice, setSkillPrice] = useState('300');
  const [skillAvailability, setSkillAvailability] = useState('Weekdays & Weekends (Flexible)');
  const [skillExpYears, setSkillExpYears] = useState('5');
  const [skillImages, setSkillImages] = useState([]);
  const [skillItemTag, setSkillItemTag] = useState('');
  const [skillIncluded, setSkillIncluded] = useState(['General Diagnostics', 'Precision Fitting']);
  const [skillUploadError, setSkillUploadError] = useState('');
  const [skillFileSizeKb, setSkillFileSizeKb] = useState(0);

  // Handle PNG Thumbnail Upload (Max 500 KB limit)
  const handleImageFileChange = (e, isSkill = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setError = isSkill ? setSkillUploadError : setToolUploadError;
    const setImages = isSkill ? setSkillImages : setToolImages;
    const setSize = isSkill ? setSkillFileSizeKb : setToolFileSizeKb;

    setError('');

    // Validate PNG format
    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
    if (!isPng) {
      setError('Only PNG format images are allowed. Please select a .png file.');
      return;
    }

    // Validate 500 KB limit (500 * 1024 = 512000 bytes)
    const maxBytes = 500 * 1024;
    if (file.size > maxBytes) {
      setError(`File is too large (${Math.round(file.size / 1024)} KB). Maximum allowed size is 500 KB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImages([reader.result]);
      setSize(Math.round(file.size / 1024));
    };
    reader.onerror = () => {
      setError('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleToolSubmit = (e) => {
    e.preventDefault();
    if (!toolTitle.trim()) {
      alert('Please provide a title for your tool.');
      return;
    }

    const imagesToSave = toolImages.length > 0
      ? toolImages
      : ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&auto=format&fit=crop&q=80'];

    postTool({
      title: toolTitle,
      category: toolCategory,
      description: toolDescription,
      condition: toolCondition,
      deposit: Number(toolDeposit) || 0,
      rentalFee: Number(toolRentalFee) || 0,
      images: imagesToSave,
      terms: toolTerms,
      safetyGuidelines: toolSafety,
      location: currentUser.location,
      neighborhood: currentUser.neighborhood
    });
  };

  const handleSkillSubmit = (e) => {
    e.preventDefault();
    if (!skillTitle.trim()) {
      alert('Please provide a title for your skill.');
      return;
    }

    const imagesToSave = skillImages.length > 0
      ? skillImages
      : ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=700&auto=format&fit=crop&q=80'];

    postSkill({
      title: skillTitle,
      serviceType: skillCategory,
      description: skillDescription,
      pricingType: skillPricingType,
      price: Number(skillPrice) || 200,
      availability: skillAvailability,
      experienceYears: Number(skillExpYears) || 3,
      skillsIncluded: skillIncluded,
      images: imagesToSave,
      location: currentUser.location,
      neighborhood: currentUser.neighborhood
    });
  };

  const addSkillTag = () => {
    if (skillItemTag.trim() && !skillIncluded.includes(skillItemTag.trim())) {
      setSkillIncluded([...skillIncluded, skillItemTag.trim()]);
      setSkillItemTag('');
    }
  };

  const removeSkillTag = (tagToRemove) => {
    setSkillIncluded(skillIncluded.filter((t) => t !== tagToRemove));
  };

  // If not logged in, prompt user to sign in
  if (!currentUser) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content"
          style={{ maxWidth: '440px', padding: '2rem', textAlign: 'center' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <LogIn size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            Sign In Required
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            You must be logged in to post a tool for lending or offer a repair skill to neighbors.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => {
                onClose();
                openModal('auth', 'login');
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Tab switcher */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              Create a Listing
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Posting as {currentUser.name} in {currentUser.neighborhood || userLocation.neighborhood}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-page)' }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              background: activeTab === 'tool' ? 'var(--bg-card)' : 'transparent',
              fontWeight: activeTab === 'tool' ? 700 : 500,
              color: activeTab === 'tool' ? 'var(--primary-700)' : 'var(--text-muted)',
              borderBottom: activeTab === 'tool' ? '2px solid var(--primary-600)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem'
            }}
            onClick={() => setActiveTab('tool')}
          >
            <Wrench size={15} />
            <span>Lend Equipment / Tool</span>
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              background: activeTab === 'skill' ? 'var(--bg-card)' : 'transparent',
              fontWeight: activeTab === 'skill' ? 700 : 500,
              color: activeTab === 'skill' ? 'var(--primary-700)' : 'var(--text-muted)',
              borderBottom: activeTab === 'skill' ? '2px solid var(--primary-600)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem'
            }}
            onClick={() => setActiveTab('skill')}
          >
            <Hammer size={15} />
            <span>Offer a Repair Skill</span>
          </button>
        </div>

        <div style={{ padding: '1.5rem', maxHeight: '78vh', overflowY: 'auto' }}>
          {activeTab === 'tool' ? (
            /* TOOL LISTING FORM */
            <form onSubmit={handleToolSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Tool Title *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Bosch 18V Cordless Hammer Drill + 20 Masonry Bits"
                  value={toolTitle}
                  onChange={(e) => setToolTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Category *
                  </label>
                  <select
                    className="input-field"
                    value={toolCategory}
                    onChange={(e) => setToolCategory(e.target.value)}
                  >
                    {TOOL_CATEGORIES.filter((c) => c !== 'All Tools').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Condition *
                  </label>
                  <select
                    className="input-field"
                    value={toolCondition}
                    onChange={(e) => setToolCondition(e.target.value)}
                  >
                    <option value="Like New">Like New (Mint)</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good (Working fine)</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Description & What's Included *
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Describe motor power, included accessories, batteries, carrying case..."
                  value={toolDescription}
                  onChange={(e) => setToolDescription(e.target.value)}
                  required
                />
              </div>

              {/* Thumbnail PNG Upload (Max 500 KB) */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Thumbnail Photo (PNG format, max 500 KB)
                </label>
                <div
                  style={{
                    border: '2px dashed var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1.25rem',
                    textAlign: 'center',
                    background: 'var(--bg-page)',
                    position: 'relative'
                  }}
                >
                  <input
                    type="file"
                    accept="image/png"
                    onChange={(e) => handleImageFileChange(e, false)}
                    id="tool-png-upload"
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="tool-png-upload"
                    style={{
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      color: 'var(--text-main)'
                    }}
                  >
                    <Upload size={15} color="var(--primary-600)" />
                    <span>Select PNG Thumbnail File</span>
                  </label>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBotton: 0 }}>
                    Must be PNG image under 500 KB. Thumbnail will be stored directly in database.
                  </p>
                </div>

                {toolUploadError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b91c1c', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                    <AlertCircle size={14} />
                    <span>{toolUploadError}</span>
                  </div>
                )}

                {toolImages.length > 0 && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-card)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <img
                      src={toolImages[0]}
                      alt="Thumbnail Preview"
                      style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                        PNG Thumbnail Ready
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Size: {toolFileSizeKb || '< 500'} KB
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        setToolImages([]);
                        setToolFileSizeKb(0);
                      }}
                      style={{ padding: '0.3rem 0.6rem' }}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Pricing & Deposit */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Daily Rental Fee (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    className="input-field"
                    value={toolRentalFee}
                    onChange={(e) => setToolRentalFee(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Set to 0 for free community sharing</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    className="input-field"
                    value={toolDeposit}
                    onChange={(e) => setToolDeposit(e.target.value)}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Auto-refunded upon clean return</span>
                </div>
              </div>

              {/* Terms & Safety */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Care Terms & Borrowing Rules
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={toolTerms}
                  onChange={(e) => setToolTerms(e.target.value)}
                  placeholder="e.g. Return clean and battery fully charged; indoors only"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Safety Instructions
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={toolSafety}
                  onChange={(e) => setToolSafety(e.target.value)}
                  placeholder="e.g. Mandatory eye protection; keep cord away from blade"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', fontWeight: 700 }}>
                Publish Tool Listing to {currentUser.neighborhood}
              </button>
            </form>
          ) : (
            /* SKILL LISTING FORM */
            <form onSubmit={handleSkillSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Skill / Service Title *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Emergency Tap & Flush Leak Repairs; Basin Cartridge Swaps"
                  value={skillTitle}
                  onChange={(e) => setSkillTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Service Category *
                  </label>
                  <select
                    className="input-field"
                    value={skillCategory}
                    onChange={(e) => setSkillCategory(e.target.value)}
                  >
                    {SKILL_CATEGORIES.filter((c) => c !== 'All Skills').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="input-field"
                    value={skillExpYears}
                    onChange={(e) => setSkillExpYears(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Description of Expertise *
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Detail your background, typical tasks you fix, tools you bring along..."
                  value={skillDescription}
                  onChange={(e) => setSkillDescription(e.target.value)}
                  required
                />
              </div>

              {/* Thumbnail PNG Upload (Max 500 KB) */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Thumbnail Photo (PNG format, max 500 KB)
                </label>
                <div
                  style={{
                    border: '2px dashed var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1.25rem',
                    textAlign: 'center',
                    background: 'var(--bg-page)',
                    position: 'relative'
                  }}
                >
                  <input
                    type="file"
                    accept="image/png"
                    onChange={(e) => handleImageFileChange(e, true)}
                    id="skill-png-upload"
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="skill-png-upload"
                    style={{
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      color: 'var(--text-main)'
                    }}
                  >
                    <Upload size={15} color="var(--primary-600)" />
                    <span>Select PNG Thumbnail File</span>
                  </label>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: 0 }}>
                    Must be PNG image under 500 KB. Thumbnail will be stored directly in database.
                  </p>
                </div>

                {skillUploadError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b91c1c', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                    <AlertCircle size={14} />
                    <span>{skillUploadError}</span>
                  </div>
                )}

                {skillImages.length > 0 && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-card)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <img
                      src={skillImages[0]}
                      alt="Thumbnail Preview"
                      style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                        PNG Thumbnail Ready
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Size: {skillFileSizeKb || '< 500'} KB
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        setSkillImages([]);
                        setSkillFileSizeKb(0);
                      }}
                      style={{ padding: '0.3rem 0.6rem' }}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Pricing Model *
                  </label>
                  <select
                    className="input-field"
                    value={skillPricingType}
                    onChange={(e) => setSkillPricingType(e.target.value)}
                  >
                    <option value="hourly">Hourly Rate (₹/hr)</option>
                    <option value="fixed">Fixed Visit / Base Charge (₹)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    className="input-field"
                    value={skillPrice}
                    onChange={(e) => setSkillPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Availability */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Availability Schedule
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={skillAvailability}
                  onChange={(e) => setSkillAvailability(e.target.value)}
                  placeholder="e.g. Mon-Sat Post 6 PM, Sunday All Day"
                />
              </div>

              {/* Key Skills Tags */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Key Capabilities / Tasks
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Solder Joint, Wall Tile Cut"
                    value={skillItemTag}
                    onChange={(e) => setSkillItemTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkillTag();
                      }
                    }}
                  />
                  <button type="button" onClick={addSkillTag} className="btn btn-secondary btn-sm">
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {skillIncluded.map((tag) => (
                    <span
                      key={tag}
                      className="badge badge-category"
                      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => removeSkillTag(tag)}
                      title="Click to remove"
                    >
                      {tag} ✕
                    </span>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', fontWeight: 700 }}>
                Publish Skill to {currentUser.neighborhood}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
