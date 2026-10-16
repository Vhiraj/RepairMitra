// RepairMitra PostListingModal Component
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Wrench,
  Sparkles,
  Camera,
  MapPin,
  ShieldAlert,
  Plus,
  Trash2,
  DollarSign
} from 'lucide-react';
import { TOOL_CATEGORIES, SKILL_CATEGORIES } from '../data/mockData';

export default function PostListingModal({ initialTab = 'tool', onClose }) {
  const { postTool, postSkill, currentUser, userLocation } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab); // 'tool' | 'skill'

  // Tool Form State
  const [toolTitle, setToolTitle] = useState('');
  const [toolCategory, setToolCategory] = useState(TOOL_CATEGORIES[1]);
  const [toolDescription, setToolDescription] = useState('');
  const [toolCondition, setToolCondition] = useState('Excellent');
  const [toolDeposit, setToolDeposit] = useState('300');
  const [toolRentalFee, setToolRentalFee] = useState('120');
  const [toolImages, setToolImages] = useState([
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&auto=format&fit=crop&q=80'
  ]);
  const [toolTerms, setToolTerms] = useState('Please handle with care and return clean and fully charged.');
  const [toolSafety, setToolSafety] = useState('Wear safety glasses and gloves when operating.');

  // Skill Form State
  const [skillTitle, setSkillTitle] = useState('');
  const [skillCategory, setSkillCategory] = useState(SKILL_CATEGORIES[1]);
  const [skillDescription, setSkillDescription] = useState('');
  const [skillPricingType, setSkillPricingType] = useState('hourly');
  const [skillPrice, setSkillPrice] = useState('300');
  const [skillAvailability, setSkillAvailability] = useState('Weekdays & Weekends (Flexible)');
  const [skillExpYears, setSkillExpYears] = useState('5');
  const [skillImages, setSkillImages] = useState([
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=700&auto=format&fit=crop&q=80'
  ]);
  const [skillItemTag, setSkillItemTag] = useState('');
  const [skillIncluded, setSkillIncluded] = useState(['General Diagnostics', 'Precision Fitting']);

  // Preset image suggestions for fast testing
  const sampleImages = {
    drill: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&auto=format&fit=crop&q=80',
    saw: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=700&auto=format&fit=crop&q=80',
    washer: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=700&auto=format&fit=crop&q=80',
    soldering: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=700&auto=format&fit=crop&q=80',
    carpentry: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=700&auto=format&fit=crop&q=80',
    electrical: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700&auto=format&fit=crop&q=80',
    plumbing: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=700&auto=format&fit=crop&q=80'
  };

  const handleToolSubmit = (e) => {
    e.preventDefault();
    if (!toolTitle.trim()) {
      alert('Please provide a title for your tool.');
      return;
    }

    postTool({
      title: toolTitle,
      category: toolCategory,
      description: toolDescription,
      condition: toolCondition,
      deposit: Number(toolDeposit) || 0,
      rentalFee: Number(toolRentalFee) || 0,
      images: toolImages,
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

    postSkill({
      title: skillTitle,
      serviceType: skillCategory,
      description: skillDescription,
      pricingType: skillPricingType,
      price: Number(skillPrice) || 200,
      availability: skillAvailability,
      experienceYears: Number(skillExpYears) || 3,
      skillsIncluded: skillIncluded,
      images: skillImages,
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
              Create a Hyperlocal Listing
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Listing in <strong style={{ color: 'var(--primary-700)' }}>{currentUser.neighborhood}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                display: 'flex',
                background: 'var(--bg-page)',
                padding: '0.2rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <button
                type="button"
                className={`btn btn-sm ${activeTab === 'tool' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('tool')}
                style={{ padding: '0.3rem 0.75rem' }}
              >
                🧰 List a Tool
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeTab === 'skill' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('skill')}
                style={{ padding: '0.3rem 0.75rem' }}
              >
                👨‍🔧 Offer a Skill
              </button>
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

        {/* Modal Content */}
        <div style={{ padding: '1.5rem' }}>
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

              {/* Photo presets / URL */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Photo Preset (or custom photo URL)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setToolImages([sampleImages.drill])}
                  >
                    Drill Photo
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setToolImages([sampleImages.saw])}
                  >
                    Circular Saw
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setToolImages([sampleImages.washer])}
                  >
                    Pressure Washer
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setToolImages([sampleImages.soldering])}
                  >
                    Soldering Kit
                  </button>
                </div>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://..."
                  value={toolImages[0] || ''}
                  onChange={(e) => setToolImages([e.target.value])}
                />
                {toolImages[0] && (
                  <div style={{ marginTop: '0.5rem', height: '120px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                    <img src={toolImages[0]} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              {/* Pricing & Deposit */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Daily Rental Rate (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    className="input-field"
                    value={toolRentalFee}
                    onChange={(e) => setToolRentalFee(e.target.value)}
                    placeholder="0 for free community share"
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Enter 0 for free neighbor sharing</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Refundable Deposit (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    className="input-field"
                    value={toolDeposit}
                    onChange={(e) => setToolDeposit(e.target.value)}
                    placeholder="e.g. 500"
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Returned when tool is brought back safely</span>
                </div>
              </div>

              {/* Safety Instructions */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Safety Guidelines & Usage Terms
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={toolSafety}
                  onChange={(e) => setToolSafety(e.target.value)}
                  placeholder="e.g. Mandatory eye protection; keep cord away from blade"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', fontWeight: 800 }}>
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

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', fontWeight: 800 }}>
                Publish Skill to {currentUser.neighborhood}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
