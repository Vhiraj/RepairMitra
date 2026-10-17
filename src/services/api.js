// RepairMitra API Client - Connects Frontend to SQLite/Express Backend
const API_BASE = '/api';

export const api = {
  // Auth
  async login(identifier, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async getUsers() {
    const res = await fetch(`${API_BASE}/auth/users`);
    if (!res.ok) throw new Error('Failed to load users');
    return res.json();
  },

  async getUser(id) {
    const res = await fetch(`${API_BASE}/users/${id}`);
    if (!res.ok) throw new Error('User not found');
    return res.json();
  },

  async verifyUser(id, docType) {
    const res = await fetch(`${API_BASE}/users/${id}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docType })
    });
    if (!res.ok) throw new Error('Verification failed');
    return res.json();
  },

  // Tools
  async getTools() {
    const res = await fetch(`${API_BASE}/tools`);
    if (!res.ok) throw new Error('Failed to fetch tools');
    return res.json();
  },

  async createTool(toolData) {
    const res = await fetch(`${API_BASE}/tools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toolData)
    });
    if (!res.ok) throw new Error('Failed to create tool listing');
    return res.json();
  },

  async toggleToolAvailability(id) {
    const res = await fetch(`${API_BASE}/tools/${id}/availability`, {
      method: 'PATCH'
    });
    if (!res.ok) throw new Error('Failed to update tool');
    return res.json();
  },

  async deleteTool(id) {
    const res = await fetch(`${API_BASE}/tools/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete tool');
    return res.json();
  },

  // Skills
  async getSkills() {
    const res = await fetch(`${API_BASE}/skills`);
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
  },

  async createSkill(skillData) {
    const res = await fetch(`${API_BASE}/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skillData)
    });
    if (!res.ok) throw new Error('Failed to offer skill');
    return res.json();
  },

  async deleteSkill(id) {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete skill');
    return res.json();
  },

  // Requests / Bookings / History
  async getRequests(userId) {
    const url = userId ? `${API_BASE}/requests?userId=${userId}` : `${API_BASE}/requests`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch requests');
    return res.json();
  },

  async createRequest(reqData) {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqData)
    });
    if (!res.ok) throw new Error('Failed to create request');
    return res.json();
  },

  async respondRequest(id, decision, notes) {
    const res = await fetch(`${API_BASE}/requests/${id}/respond`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, notes })
    });
    if (!res.ok) throw new Error('Failed to respond to request');
    return res.json();
  },

  async completeRequest(id) {
    const res = await fetch(`${API_BASE}/requests/${id}/complete`, {
      method: 'PATCH'
    });
    if (!res.ok) throw new Error('Failed to complete request');
    return res.json();
  },

  async deleteRequest(id) {
    const res = await fetch(`${API_BASE}/requests/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete request');
    return res.json();
  },

  // Messages
  async getAllMessages(userId) {
    const url = userId ? `${API_BASE}/messages?userId=${userId}` : `${API_BASE}/messages`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async getMessages(requestId) {
    const res = await fetch(`${API_BASE}/messages/${requestId}`);
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async sendMessage(msgData) {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msgData)
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  // Reviews
  async getReviews(userId) {
    const url = userId ? `${API_BASE}/reviews?userId=${userId}` : `${API_BASE}/reviews`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },

  async createReview(reviewData) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },

  // Notifications
  async getNotifications(userId) {
    const url = userId ? `${API_BASE}/notifications?userId=${userId}` : `${API_BASE}/notifications`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationRead(id) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH'
    });
    return res.json();
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`);
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return res.json();
  },

  async resetDatabase() {
    const res = await fetch(`${API_BASE}/admin/reset-db`, {
      method: 'POST'
    });
    return res.json();
  }
};
