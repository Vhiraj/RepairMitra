// RepairMitra Storage Service, Haversine Distance & Trust Score Calculator
import {
  INITIAL_USERS,
  INITIAL_TOOLS,
  INITIAL_SKILLS,
  INITIAL_REQUESTS,
  INITIAL_MESSAGES,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'repairmitra_users',
  CURRENT_USER_ID: 'repairmitra_current_user_id',
  TOOLS: 'repairmitra_tools',
  SKILLS: 'repairmitra_skills',
  REQUESTS: 'repairmitra_requests',
  MESSAGES: 'repairmitra_messages',
  REVIEWS: 'repairmitra_reviews',
  NOTIFICATIONS: 'repairmitra_notifications',
  FAVORITES: 'repairmitra_favorites',
  USER_LOCATION: 'repairmitra_user_location',
  MAX_DISTANCE: 'repairmitra_max_distance',
  MODE_2G: 'repairmitra_mode_2g'
};

// Haversine formula to calculate distance in km between two lat/lng coordinates
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.5; // fallback average neighborhood distance
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

// Compute dynamic Trust Score (0 - 100)
export function computeTrustScore(user, completedExchangesCount, reviews) {
  let score = 40; // baseline community member

  // 1. Identity Verification (+35 points)
  if (user.isVerified) {
    score += 35;
  }

  // 2. Completed Exchanges (+2 points per exchange, max 15)
  const exchangePoints = Math.min(15, (completedExchangesCount || 0) * 2);
  score += exchangePoints;

  // 3. User Rating (5 stars = +10, 4 stars = +7, etc.)
  if (reviews && reviews.length > 0) {
    const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = totalRating / reviews.length;
    score += Math.round((avg / 5) * 10);
  } else if (user.ratingAverage) {
    score += Math.round((user.ratingAverage / 5) * 10);
  }

  return Math.min(100, Math.max(10, score));
}

export const StorageService = {
  get(key, defaultValue) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultValue;
    } catch (e) {
      console.warn('Storage read failed', e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  },

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.set(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      this.set(STORAGE_KEYS.CURRENT_USER_ID, 'user-1'); // Default Aarav Sharma
    }
    if (!localStorage.getItem(STORAGE_KEYS.TOOLS)) {
      this.set(STORAGE_KEYS.TOOLS, INITIAL_TOOLS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SKILLS)) {
      this.set(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      this.set(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
      this.set(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      this.set(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      this.set(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
      this.set(STORAGE_KEYS.FAVORITES, ['tool-1', 'skill-2']);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USER_LOCATION)) {
      this.set(STORAGE_KEYS.USER_LOCATION, {
        neighborhood: 'Indiranagar',
        lat: 12.9784,
        lng: 77.6408,
        postalCode: '560038'
      });
    }
    if (!localStorage.getItem(STORAGE_KEYS.MAX_DISTANCE)) {
      this.set(STORAGE_KEYS.MAX_DISTANCE, 10); // 10 km default
    }
  },

  resetAll() {
    localStorage.clear();
    this.init();
    window.location.reload();
  },

  KEYS: STORAGE_KEYS
};
