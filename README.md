# 🛠️ RepairMitra - Hyperlocal Skill & Tool Exchange Network

> **A peer-to-peer neighborhood sharing network that connects residents to borrow physical equipment and hire local repair skills without middlemen.**

![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.2-blue.svg)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg)
![Express](https://img.shields.io/badge/Express-5.3-black.svg)
![SQLite3](https://img.shields.io/badge/SQLite-3-003B57.svg)
![Low--Bandwidth](https://img.shields.io/badge/2G%20Mode-Enabled-emerald.svg)

---

## 🌟 Overview

**RepairMitra** is a decentralized, hyperlocal sharing platform built for apartment communities and urban residential neighborhoods across India. It addresses the reality that the average power drill is used for less than 15 minutes across its lifespan, while local artisans (carpenters, plumbers, electricians) lose 25–40% of their earnings to intermediary aggregators.

By blending the classifieds simplicity of OLX with the community ideals of modern tool libraries, RepairMitra creates a zero-intermediary circular economy where neighbors can share equipment and hire skilled craftspeople on foot or bicycle.

---

## ✨ Key Features

### 🧰 1. Dual-Sided Hyperlocal Marketplace
- **Lend & Borrow Tools**: Circular saws, impact drills, pressure washers, telescopic ladders, and soldering stations.
- **Hire Community Skills**: Certified artisans offering carpentry, emergency electrical repairs, and plumbing overhauls.

### 🛡️ 2. Algorithmic Dynamic Trust Score (10–100 Points)
Objective, peer-governed trust calculation that deters theft and damage:
$$\text{Trust Score} = \text{Base (40)} + \text{Aadhaar Verification (+35)} + \text{Completed Exchanges (up to +15)} + \text{Star Ratings (up to +10)}$$

### 📍 3. Haversine Proximity Engine & Two-Step Geoprivacy
- Real-time spherical surface distance filtering from **1 km to 25 km**.
- **Geoprivacy Protection**: Exact house/flat pickup address remains strictly hidden until the owner explicitly clicks **"Accept Request"**.

### 💼 4. Transaction Lifecycle & Simulated Escrow
- 6-stage finite state machine: `Pending` $\rightarrow$ `Accepted` $\rightarrow$ `In Use` $\rightarrow$ `Returned` $\rightarrow$ `Completed` $\rightarrow$ `Reviewed`.
- Transparent security deposit handling with virtual escrow holding and auto-refund upon verified return.

### 💬 5. Context-Bound In-Platform Chat
- Direct peer messaging tied directly to individual transaction requests.
- Automatic phone number masking (`+91 98450 •••••`) and real-time safety advisories.

### ⚡ 6. Low-Bandwidth (2G) Resilient Mode
- 1-click toggle engineered for basement parking lots, elevator lobbies, and construction sites.
- Strips heavy CSS blurs and animations, delivering a **92.1% reduction in asset payload** (< 38 KB initial weight).

### 🖥️ 7. Embedded Visual Backend Portal (`http://localhost:5000/`)
- Real-time interactive Express & SQLite control panel.
- Live metric cards, table previews, and a 1-click interactive API testing console right in your browser.

---

## 🏛️ System Architecture

```
React 19 SPA (Vite 8)  ──[ Proxy /api ]──>  Express 5 REST API (Port 5000)
    │                                              │
    ├── AppContext Store                           ├── JWT Auth & Bcryptjs Hashing
    ├── Proximity & Haversine Filters              ├── Trust Score Calculator Engine
    └── LocalStorage Fallbacks                     └── SQLite3 File Database (repairmitra.db)
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) `>= 18.x` (Recommended: Node 20 or 22)
- `npm` `>= 9.x`

### 1. Clone & Install
```bash
git clone https://github.com/Vhiraj/RepairMitra.git
cd RepairMitra
npm install
```

### 2. Run the Full Application (Backend + Frontend)
```bash
npm run dev
```
> This starts both the **Express REST API** (on `http://localhost:5000`) and the **Vite React Frontend** (on `http://localhost:5173`) concurrently.

### 3. Open in Browser
- **Frontend Web Application**: [http://localhost:5173/](http://localhost:5173/)
- **Backend API & SQLite Explorer**: [http://localhost:5000/](http://localhost:5000/)

---

## 👥 Demo Accounts

All pre-seeded demo accounts use the standard password: `password123`

| Persona | Role | Email | Trust Score | Verified Document |
| :--- | :--- | :--- | :--- | :--- |
| **Aarav Sharma** | Borrower (`buyer`) | `aarav.sharma@example.com` | **94** | Aadhaar Card |
| **Rajesh Kumar** | Tool Lender (`seller`) | `rajesh.kumar@example.com` | **98** | Aadhaar Card |
| **Priya Patel** | Electrician/Artisan (`artisan`) | `priya.patel@example.com` | **96** | Aadhaar Card |
| **Vikramaditya Rao** | Platform Admin (`admin`) | `admin@repairmitra.org` | **100** | Platform Head |

---

## 📁 Repository Directory Structure

```
RepairMitra/
├── server/
│   ├── db.js               # SQLite3 database connection, schema & seed engine
│   ├── db.cjs              # CommonJS database entrypoint
│   ├── index.js            # Express 5 REST API & Visual Dashboard portal
│   ├── index.cjs           # CommonJS API server entrypoint
│   ├── package.json        # Server-isolated CommonJS package configuration
│   └── repairmitra.db      # Local SQLite database file
├── src/
│   ├── components/         # 14 Modular UI Components & Dialogs
│   │   ├── AdminDashboard.jsx
│   │   ├── AuthModal.jsx
│   │   ├── ChatModal.jsx
│   │   ├── HeroBanner.jsx
│   │   ├── ListingDetailModal.jsx
│   │   ├── LocationModal.jsx
│   │   ├── Navbar.jsx
│   │   ├── PostListingModal.jsx
│   │   ├── ProfileView.jsx
│   │   ├── RequestsView.jsx
│   │   ├── ReviewModal.jsx
│   │   ├── SkillCard.jsx
│   │   ├── ToolCard.jsx
│   │   └── VerificationModal.jsx
│   ├── context/
│   │   └── AppContext.jsx  # Global application state, proximity & sync dispatcher
│   ├── services/
│   │   ├── api.js          # REST client communicating with port 5000
│   │   └── storage.js      # LocalStorage caching engine
│   ├── data/
│   │   └── mockData.js     # Default fallback datasets
│   ├── App.jsx             # Main application switcher
│   └── index.css           # Design tokens, glassmorphism & 2G mode utilities
├── index.html              # HTML5 entrypoint with SEO metadata
├── vite.config.js          # Vite configuration with /api reverse proxy
└── package.json            # Root configuration and run scripts
```

---

## 🔌 Core REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Visual interactive backend portal and API testbed |
| `GET` | `/api` | Service health, table counts, and endpoint catalog |
| `POST` | `/api/auth/register` | Register new user with hashed password & role |
| `POST` | `/api/auth/login` | Authenticate user; returns 7-day JWT token |
| `GET` | `/api/auth/users` | List community members, verification & trust scores |
| `GET` | `/api/tools` | Browse lending tools with category & keyword filters |
| `POST` | `/api/tools` | Publish a new equipment listing with security deposit |
| `GET` | `/api/skills` | Browse artisan services by category and experience |
| `POST` | `/api/skills` | Publish a new repair or trade skill listing |
| `GET` | `/api/requests` | Fetch borrow and hire transactions by user |
| `POST` | `/api/requests` | Create borrow request with deposit & duration calculation |
| `PUT` | `/api/requests/:id/status`| Transition transaction status (Accept, Handover, Return) |
| `GET` | `/api/messages` | Fetch transaction-bound conversation threads |
| `POST` | `/api/messages` | Send in-platform direct message |
| `POST` | `/api/reviews` | Submit double-blind star rating and review tags |
| `GET` | `/api/admin/stats` | Platform metrics, gross volume & verification queue |

---

## 📜 Available Scripts

- `npm run dev` - Starts **both** the backend REST API server and Vite frontend concurrently.
- `npm run server` - Runs only the backend Express API server on port `5000`.
- `npm run dev:frontend` - Runs only the Vite frontend dev server on port `5173`.
- `npm run db:check` - Connects to `repairmitra.db` and logs table counts and diagnostics.
- `npm run build` - Builds production bundle into `dist/`.

---

## 📄 License

This project is licensed under the **MIT License**.
