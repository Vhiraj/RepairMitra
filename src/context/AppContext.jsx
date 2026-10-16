// RepairMitra App Context - Connected to SQLite / Express REST Backend
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { StorageService, calculateDistanceKm, computeTrustScore } from '../services/storage';

const AppContext = createContext();

export function AppProvider({ children }) {
  StorageService.init();

  const [users, setUsers] = useState(() =>
    StorageService.get(StorageService.KEYS.USERS, [])
  );
  const [currentUser, setCurrentUser] = useState(() => {
    const cachedUsers = StorageService.get(StorageService.KEYS.USERS, []);
    const cachedId = StorageService.get(StorageService.KEYS.CURRENT_USER_ID, 'user-1');
    return cachedUsers.find((u) => u.id === cachedId) || cachedUsers[0] || null;
  });

  const [tools, setTools] = useState(() =>
    StorageService.get(StorageService.KEYS.TOOLS, [])
  );
  const [skills, setSkills] = useState(() =>
    StorageService.get(StorageService.KEYS.SKILLS, [])
  );
  const [requests, setRequests] = useState(() =>
    StorageService.get(StorageService.KEYS.REQUESTS, [])
  );
  const [messages, setMessages] = useState(() =>
    StorageService.get(StorageService.KEYS.MESSAGES, [])
  );
  const [reviews, setReviews] = useState(() =>
    StorageService.get(StorageService.KEYS.REVIEWS, [])
  );
  const [notifications, setNotifications] = useState(() =>
    StorageService.get(StorageService.KEYS.NOTIFICATIONS, [])
  );
  const [favorites, setFavorites] = useState(() =>
    StorageService.get(StorageService.KEYS.FAVORITES, ['tool-1', 'skill-2'])
  );

  const [userLocation, setUserLocationState] = useState(() =>
    StorageService.get(StorageService.KEYS.USER_LOCATION, {
      neighborhood: 'Indiranagar',
      lat: 12.9784,
      lng: 77.6408,
      postalCode: '560038'
    })
  );
  const [maxDistanceKm, setMaxDistanceKmState] = useState(() =>
    StorageService.get(StorageService.KEYS.MAX_DISTANCE, 15)
  );
  const [is2GMode, setIs2GModeState] = useState(() =>
    StorageService.get(StorageService.KEYS.MODE_2G, false)
  );

  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('proximity');
  const [listingTypeFilter, setListingTypeFilter] = useState('all');
  const [activeModal, setActiveModal] = useState(null); // { type, data }
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Fetch live datasets from SQLite / Express backend on startup
  const fetchBackendData = async () => {
    try {
      const [backendUsers, backendTools, backendSkills, backendRequests, backendReviews, backendNotifs] =
        await Promise.all([
          api.getUsers(),
          api.getTools(),
          api.getSkills(),
          api.getRequests(),
          api.getReviews(),
          api.getNotifications()
        ]);

      setUsers(backendUsers);
      setTools(backendTools);
      setSkills(backendSkills);
      setRequests(backendRequests);
      setReviews(backendReviews);
      setNotifications(backendNotifs);
      setIsBackendConnected(true);

      // Match current user
      if (currentUser) {
        const found = backendUsers.find((u) => u.id === currentUser.id);
        if (found) setCurrentUser(found);
        else setCurrentUser(backendUsers[0]);
      } else {
        setCurrentUser(backendUsers[0]);
      }

      // Sync local storage mirror
      StorageService.set(StorageService.KEYS.USERS, backendUsers);
      StorageService.set(StorageService.KEYS.TOOLS, backendTools);
      StorageService.set(StorageService.KEYS.SKILLS, backendSkills);
      StorageService.set(StorageService.KEYS.REQUESTS, backendRequests);
    } catch (err) {
      console.warn('Backend server currently starting, using local cache:', err.message);
      setIsBackendConnected(false);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  // Sync state back to local cache
  useEffect(() => {
    if (currentUser) {
      StorageService.set(StorageService.KEYS.CURRENT_USER_ID, currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    StorageService.set(StorageService.KEYS.FAVORITES, favorites);
  }, [favorites]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (is2GMode) {
      document.body.classList.add('mode-2g');
    } else {
      document.body.classList.remove('mode-2g');
    }
  }, [is2GMode]);

  // Auth: Login with Email & Password
  const loginUser = async (email, password) => {
    try {
      const res = await api.login(email, password);
      setCurrentUser(res.user);
      localStorage.setItem('repairmitra_token', res.token);
      await fetchBackendData();
      return res.user;
    } catch (err) {
      // Fallback
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setCurrentUser(found);
        return found;
      }
      throw err;
    }
  };

  // Auth: Register new user
  const registerUser = async (data) => {
    try {
      const res = await api.register(data);
      setCurrentUser(res.user);
      localStorage.setItem('repairmitra_token', res.token);
      await fetchBackendData();
      return res.user;
    } catch (err) {
      const newU = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        phoneEncrypted: data.phone ? `${data.phone.substring(0, 7)}•••••` : '+91 98000 •••••',
        location: data.location || 'Indiranagar, Bangalore',
        neighborhood: data.neighborhood || 'Indiranagar',
        coordinates: { lat: 12.9784, lng: 77.6408 },
        isVerified: false,
        trustScore: 50,
        ratingAverage: 5.0,
        reviewsCount: 0,
        memberSince: 'Oct 2026',
        role: data.role || 'user',
        bio: data.bio || 'New neighbor'
      };
      setUsers((prev) => [newU, ...prev]);
      setCurrentUser(newU);
      return newU;
    }
  };

  // Switch demo account
  const switchUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  // Location & Radius
  const setUserLocation = (loc) => {
    setUserLocationState(loc);
    StorageService.set(StorageService.KEYS.USER_LOCATION, loc);
  };

  const setMaxDistanceKm = (km) => {
    setMaxDistanceKmState(km);
    StorageService.set(StorageService.KEYS.MAX_DISTANCE, km);
  };

  const toggle2GMode = () => {
    setIs2GModeState((prev) => {
      const next = !prev;
      StorageService.set(StorageService.KEYS.MODE_2G, next);
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const getListingDistance = (item) => {
    if (!item.coordinates || !userLocation) return 1.5;
    return calculateDistanceKm(
      userLocation.lat,
      userLocation.lng,
      item.coordinates.lat,
      item.coordinates.lng
    );
  };

  const openModal = (type, data = null) => {
    setActiveModal({ type, data });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Post Tool Listing
  const postTool = async (toolData) => {
    try {
      const payload = {
        ownerId: currentUser.id,
        title: toolData.title,
        category: toolData.category,
        description: toolData.description,
        condition: toolData.condition || 'Excellent',
        deposit: Number(toolData.deposit) || 0,
        rentalFee: Number(toolData.rentalFee) || 0,
        location: toolData.location || currentUser.location,
        neighborhood: toolData.neighborhood || currentUser.neighborhood,
        lat: currentUser.coordinates?.lat || 12.9719,
        lng: currentUser.coordinates?.lng || 77.6412,
        images: toolData.images,
        terms: toolData.terms,
        safetyGuidelines: toolData.safetyGuidelines
      };
      const created = await api.createTool(payload);
      setTools((prev) => [created, ...prev]);
      closeModal();
      return created;
    } catch (err) {
      // Local fallback
      const localTool = {
        id: `tool-${Date.now()}`,
        ownerId: currentUser.id,
        ...toolData,
        isAvailable: true,
        coordinates: currentUser.coordinates || { lat: 12.9719, lng: 77.6412 },
        createdAt: new Date().toISOString()
      };
      setTools((prev) => [localTool, ...prev]);
      closeModal();
      return localTool;
    }
  };

  // Post Skill Listing
  const postSkill = async (skillData) => {
    try {
      const payload = {
        ownerId: currentUser.id,
        title: skillData.title,
        serviceType: skillData.serviceType,
        description: skillData.description,
        pricingType: skillData.pricingType || 'hourly',
        price: Number(skillData.price) || 250,
        availability: skillData.availability,
        location: skillData.location || currentUser.location,
        neighborhood: skillData.neighborhood || currentUser.neighborhood,
        lat: currentUser.coordinates?.lat || 12.9719,
        lng: currentUser.coordinates?.lng || 77.6412,
        experienceYears: Number(skillData.experienceYears) || 2,
        images: skillData.images,
        skillsIncluded: skillData.skillsIncluded
      };
      const created = await api.createSkill(payload);
      setSkills((prev) => [created, ...prev]);
      closeModal();
      return created;
    } catch (err) {
      const localSkill = {
        id: `skill-${Date.now()}`,
        ownerId: currentUser.id,
        ...skillData,
        coordinates: currentUser.coordinates || { lat: 12.9719, lng: 77.6412 },
        completedJobs: 0,
        createdAt: new Date().toISOString()
      };
      setSkills((prev) => [localSkill, ...prev]);
      closeModal();
      return localSkill;
    }
  };

  // Toggle item availability
  const toggleItemAvailability = async (id, type) => {
    if (type === 'tool') {
      try {
        await api.toggleToolAvailability(id);
      } catch (e) {
        console.warn('API error, toggling locally:', e);
      }
      setTools((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isAvailable: !t.isAvailable } : t))
      );
    }
  };

  // Create Request / Booking
  const createRequest = async (data) => {
    try {
      const payload = {
        listingId: data.listingId,
        listingType: data.listingType,
        listingTitle: data.listingTitle,
        listingImage: data.listingImage,
        borrowerId: currentUser.id,
        ownerId: data.ownerId,
        startDate: data.startDate,
        endDate: data.endDate,
        daysCount: data.daysCount || 1,
        projectScope: data.projectScope,
        totalCost: data.totalCost,
        deposit: data.deposit || 0
      };
      const created = await api.createRequest(payload);
      setRequests((prev) => [created, ...prev]);

      const notif = {
        id: `notif-${Date.now()}`,
        userId: data.ownerId,
        title: 'New Borrow / Service Request 📬',
        message: `${currentUser.name} requested "${data.listingTitle}" for ${data.startDate}.`,
        type: 'request_new',
        referenceId: created.id,
        isRead: false,
        timestamp: new Date().toISOString()
      };
      setNotifications((prev) => [notif, ...prev]);
      closeModal();
      return created;
    } catch (err) {
      const localReq = {
        id: `req-${Date.now()}`,
        ...data,
        borrowerId: currentUser.id,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setRequests((prev) => [localReq, ...prev]);
      closeModal();
      return localReq;
    }
  };

  // Owner responds: Accept or Decline
  const respondToRequest = async (requestId, decision, responseNotes = '') => {
    try {
      const updated = await api.respondRequest(requestId, decision, responseNotes);
      setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
    } catch (err) {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId) {
            return {
              ...r,
              status: decision === 'accept' ? 'accepted' : 'declined',
              exactPickupAddress:
                decision === 'accept' ? 'Indiranagar 100ft Road (Landmark: Opp. Toit)' : null,
              pickupTimeNotes: responseNotes
            };
          }
          return r;
        })
      );
    }

    const req = requests.find((r) => r.id === requestId);
    if (req) {
      const notif = {
        id: `notif-${Date.now()}`,
        userId: req.borrowerId,
        title: decision === 'accept' ? 'Request Accepted! 🎉' : 'Request Update',
        message:
          decision === 'accept'
            ? `Your request for "${req.listingTitle}" was accepted. Pickup address unlocked!`
            : `Your request was declined.`,
        type: decision === 'accept' ? 'request_accepted' : 'request_declined',
        referenceId: requestId,
        isRead: false,
        timestamp: new Date().toISOString()
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  // Complete Request
  const completeRequest = async (requestId) => {
    try {
      const updated = await api.completeRequest(requestId);
      setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
    } catch (err) {
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'completed' } : r))
      );
    }

    const req = requests.find((r) => r.id === requestId);
    if (req) {
      const otherUserId = currentUser.id === req.borrowerId ? req.ownerId : req.borrowerId;
      openModal('review', { requestId, revieweeId: otherUserId, requestTitle: req.listingTitle });
    }
  };

  // Submit Review
  const submitReview = async ({ requestId, revieweeId, rating, comment, tags }) => {
    try {
      const payload = {
        requestId,
        reviewerId: currentUser.id,
        reviewerName: currentUser.name,
        reviewerAvatar: currentUser.avatar,
        revieweeId,
        rating: Number(rating),
        comment,
        tags: tags || ['Trustworthy']
      };
      const created = await api.createReview(payload);
      setReviews((prev) => [created, ...prev]);
      await fetchBackendData();
    } catch (err) {
      const localRev = {
        id: `rev-${Date.now()}`,
        requestId,
        reviewerId: currentUser.id,
        reviewerName: currentUser.name,
        reviewerAvatar: currentUser.avatar,
        revieweeId,
        rating: Number(rating),
        comment,
        tags,
        createdAt: new Date().toISOString()
      };
      setReviews((prev) => [localRev, ...prev]);
    }
    closeModal();
  };

  // Chat message
  const sendMessage = async (requestId, text) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    const toUserId = currentUser.id === req.borrowerId ? req.ownerId : req.borrowerId;

    try {
      const created = await api.sendMessage({
        requestId,
        fromUserId: currentUser.id,
        toUserId,
        text
      });
      setMessages((prev) => [...prev, created]);
    } catch (err) {
      const localMsg = {
        id: `msg-${Date.now()}`,
        requestId,
        fromUserId: currentUser.id,
        toUserId,
        text,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, localMsg]);
    }
  };

  // Identity Verification
  const verifyIdentity = async (userId, docType, docNumber) => {
    try {
      const updatedUser = await api.verifyUser(userId, docType);
      setCurrentUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
    } catch (err) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isVerified: true, trustScore: Math.min(100, u.trustScore + 35) } : u))
      );
      if (currentUser.id === userId) {
        setCurrentUser((prev) => ({ ...prev, isVerified: true, trustScore: Math.min(100, prev.trustScore + 35) }));
      }
    }
    closeModal();
  };

  const markNotificationRead = async (id) => {
    try {
      await api.markNotificationRead(id);
    } catch (e) {}
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, isRead: true } : n))
    );
  };

  const adminDeleteListing = async (id, type) => {
    try {
      if (type === 'tool') await api.deleteTool(id);
      else await api.deleteSkill(id);
    } catch (e) {}

    if (type === 'tool') setTools((prev) => prev.filter((t) => t.id !== id));
    else setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const adminToggleVerifyUser = async (userId) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    try {
      await api.verifyUser(userId, 'Admin Verified');
    } catch (e) {}
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isVerified: !u.isVerified, trustScore: u.isVerified ? u.trustScore - 30 : Math.min(100, u.trustScore + 35) } : u))
    );
  };

  const resetAllData = async () => {
    try {
      await api.resetDatabase();
    } catch (e) {}
    StorageService.resetAll();
  };

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        loginUser,
        registerUser,
        switchUser,
        tools,
        skills,
        requests,
        messages,
        reviews,
        notifications,
        favorites,
        toggleFavorite,
        userLocation,
        setUserLocation,
        maxDistanceKm,
        setMaxDistanceKm,
        getListingDistance,
        is2GMode,
        toggle2GMode,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        listingTypeFilter,
        setListingTypeFilter,
        activeModal,
        openModal,
        closeModal,
        postTool,
        postSkill,
        toggleItemAvailability,
        createRequest,
        respondToRequest,
        completeRequest,
        submitReview,
        sendMessage,
        verifyIdentity,
        markNotificationRead,
        markAllNotificationsRead,
        adminDeleteListing,
        adminToggleVerifyUser,
        resetAllData,
        isBackendConnected
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
