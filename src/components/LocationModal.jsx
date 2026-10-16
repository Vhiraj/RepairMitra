// RepairMitra LocationModal Component - Hyperlocal Proximity & Postal Code
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  MapPin,
  Navigation,
  Check,
  Search,
  Sparkles
} from 'lucide-react';
import { NEIGHBORHOODS } from '../data/mockData';

export default function LocationModal({ onClose }) {
  const { userLocation, setUserLocation, maxDistanceKm, setMaxDistanceKm } = useApp();

  const [searchTxt, setSearchTxt] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(userLocation.neighborhood);
  const [radius, setRadius] = useState(maxDistanceKm);
  const [isLocating, setIsLocating] = useState(false);

  const filteredNeighborhoods = NEIGHBORHOODS.filter(
    (n) =>
      n.name.toLowerCase().includes(searchTxt.toLowerCase()) ||
      n.postalCode.includes(searchTxt)
  );

  const handleSelectNeighborhood = (n) => {
    setSelectedNeighborhood(n.name);
    setUserLocation({
      neighborhood: n.name,
      lat: n.lat,
      lng: n.lng,
      postalCode: n.postalCode
    });
  };

  const handleSimulateGPS = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setUserLocation({
            neighborhood: 'Current GPS Location',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            postalCode: 'Nearby'
          });
          onClose();
        },
        () => {
          // Fallback to Indiranagar
          setTimeout(() => {
            setIsLocating(false);
            setUserLocation({
              neighborhood: 'Indiranagar (Auto-Detected)',
              lat: 12.9784,
              lng: 77.6408,
              postalCode: '560038'
            });
            onClose();
          }, 600);
        },
        { timeout: 3000 }
      );
    } else {
      setTimeout(() => {
        setIsLocating(false);
        onClose();
      }, 500);
    }
  };

  const handleSave = () => {
    setMaxDistanceKm(radius);
    onClose();
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
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              Set Your Neighborhood
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              "See people and gear nearby" — Solist / OLX Hyperlocal Matching
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* GPS Auto-detect button */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleSimulateGPS}
            style={{ width: '100%', marginBottom: '1.25rem', justifyContent: 'center', borderColor: 'var(--primary-400)', color: 'var(--primary-700)' }}
            disabled={isLocating}
          >
            <Navigation size={16} color="var(--primary-600)" />
            <span>{isLocating ? 'Acquiring GPS Signal...' : 'Use My Live Device GPS Location'}</span>
          </button>

          {/* Search Postal Code / Neighborhood */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search area or PIN code (e.g. 560038, Koramangala)"
              value={searchTxt}
              onChange={(e) => setSearchTxt(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          {/* Neighborhood list */}
          <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            {filteredNeighborhoods.map((n) => {
              const isSelected = selectedNeighborhood === n.name;
              return (
                <div
                  key={n.name}
                  onClick={() => handleSelectNeighborhood(n)}
                  style={{
                    padding: '0.65rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--primary-50)' : 'transparent',
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={15} color={isSelected ? 'var(--primary-600)' : 'var(--text-muted)'} />
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? 700 : 500, color: 'var(--text-main)' }}>
                        {n.name}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                        PIN {n.postalCode}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check size={16} color="var(--primary-600)" />}
                </div>
              );
            })}
          </div>

          {/* Search Radius Slider */}
          <div style={{ marginBottom: '1.5rem', background: 'var(--bg-page)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Search Distance Radius
              </span>
              <span className="badge badge-distance" style={{ fontSize: '0.8rem' }}>
                Within {radius} km
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-600)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              <span>Walking (1-2 km)</span>
              <span>Bicycle (5 km)</span>
              <span>Neighborhood (15 km)</span>
              <span>Metro (40 km)</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleSave}
            style={{ width: '100%', fontWeight: 800 }}
          >
            Apply Location & Radius
          </button>
        </div>
      </div>
    </div>
  );
}
