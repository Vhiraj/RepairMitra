// RepairMitra Express REST API Server
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'repairmitra_super_secret_jwt_key_2026';

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize SQLite database on boot
initDatabase().catch(console.error);

// Helper: Trust Score calculator
function computeTrustScore(user, completedCount, userReviews) {
  let score = 40;
  if (user.is_verified || user.isVerified) score += 35;
  score += Math.min(15, (completedCount || 0) * 2);
  if (userReviews && userReviews.length > 0) {
    const total = userReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = total / userReviews.length;
    score += Math.round((avg / 5) * 10);
  } else if (user.rating_average || user.ratingAverage) {
    score += Math.round(((user.rating_average || user.ratingAverage) / 5) * 10);
  }
  return Math.min(100, Math.max(10, score));
}

// -------------------------------------------------------------
// BACKEND STATUS & DATABASE EXPLORER DASHBOARD
// -------------------------------------------------------------

// GET /api - JSON Service Discovery & Health Status
app.get('/api', async (req, res) => {
  try {
    const users = await db.allAsync('SELECT COUNT(*) as count FROM users');
    const tools = await db.allAsync('SELECT COUNT(*) as count FROM tools');
    const skills = await db.allAsync('SELECT COUNT(*) as count FROM skills');
    const requests = await db.allAsync('SELECT COUNT(*) as count FROM requests');
    const reviews = await db.allAsync('SELECT COUNT(*) as count FROM reviews');
    const messages = await db.allAsync('SELECT COUNT(*) as count FROM messages');

    res.json({
      service: 'RepairMitra Express REST API Server',
      status: 'online',
      port: PORT,
      database: 'SQLite3',
      dbPath: 'server/repairmitra.db',
      timestamp: new Date().toISOString(),
      counts: {
        users: users[0]?.count || 0,
        tools: tools[0]?.count || 0,
        skills: skills[0]?.count || 0,
        requests: requests[0]?.count || 0,
        reviews: reviews[0]?.count || 0,
        messages: messages[0]?.count || 0
      },
      endpoints: {
        auth: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/users', 'GET /api/auth/me'],
        tools: ['GET /api/tools', 'GET /api/tools/:id', 'POST /api/tools', 'PUT /api/tools/:id', 'DELETE /api/tools/:id'],
        skills: ['GET /api/skills', 'GET /api/skills/:id', 'POST /api/skills', 'PUT /api/skills/:id', 'DELETE /api/skills/:id'],
        requests: ['GET /api/requests', 'POST /api/requests', 'PUT /api/requests/:id/status'],
        messages: ['GET /api/messages', 'POST /api/messages'],
        reviews: ['GET /api/reviews', 'POST /api/reviews'],
        admin: ['GET /api/admin/stats']
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch server status', details: err.message });
  }
});

// GET / - Visual Interactive Backend & Database Explorer Dashboard
app.get('/', async (req, res) => {
  try {
    const users = await db.allAsync('SELECT id, name, email, role, is_verified, trust_score, location FROM users') || [];
    const tools = await db.allAsync('SELECT id, title, category, rental_fee, is_available FROM tools') || [];
    const skills = await db.allAsync('SELECT id, title, service_type, price FROM skills') || [];
    const requests = await db.allAsync('SELECT id, listing_title, status, total_cost, start_date FROM requests') || [];
    const reviews = await db.allAsync('SELECT id, rating, comment FROM reviews') || [];
    const messages = await db.allAsync('SELECT id FROM messages') || [];

    const buyerCount = users.filter(u => u.role === 'buyer' || u.role === 'user').length;
    const sellerCount = users.filter(u => u.role === 'seller').length;
    const artisanCount = users.filter(u => u.role === 'artisan').length;
    const adminCount = users.filter(u => u.role === 'admin').length;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RepairMitra Backend API & Database Explorer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090e17;
      --card-bg: rgba(18, 25, 41, 0.85);
      --card-border: rgba(255, 255, 255, 0.08);
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --emerald: #10b981;
      --emerald-glow: rgba(16, 185, 129, 0.2);
      --indigo: #6366f1;
      --indigo-glow: rgba(99, 102, 241, 0.2);
      --amber: #f59e0b;
      --cyan: #06b6d4;
      --rose: #f43f5e;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, var(--bg) 60%);
      color: var(--text);
      min-height: 100vh;
      padding: 2.5rem 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .container {
      width: 100%;
      max-width: 1200px;
    }
    header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--card-border);
    }
    .logo-group {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .logo-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      box-shadow: 0 0 25px var(--emerald-glow);
    }
    .logo-title h1 {
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ffffff 40%, #a7f3d0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .logo-title p {
      font-size: 0.9rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.3); }
    }
    .btn-frontend {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.25rem;
      border-radius: 10px;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 4px 15px var(--indigo-glow);
      transition: all 0.2s ease;
    }
    .btn-frontend:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2.5rem;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.25rem;
      backdrop-filter: blur(12px);
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .stat-card:hover {
      transform: translateY(-3px);
      border-color: rgba(255, 255, 255, 0.2);
    }
    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--text-muted);
      font-size: 0.82rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.75rem;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 0.35rem;
    }
    .stat-meta {
      font-size: 0.78rem;
      color: var(--text-muted);
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.75rem;
      margin-bottom: 2.5rem;
    }
    @media (max-width: 900px) {
      .grid-2 { grid-template-columns: 1fr; }
    }
    .panel {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 18px;
      padding: 1.75rem;
      backdrop-filter: blur(12px);
    }
    .panel-title {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }
    .badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-buyer { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
    .badge-seller { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge-artisan { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .badge-admin { background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3); }
    .table-container {
      overflow-x: auto;
      max-height: 280px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
      text-align: left;
    }
    th {
      padding: 0.75rem 0.5rem;
      color: var(--text-muted);
      border-bottom: 1px solid var(--card-border);
      font-weight: 600;
      position: sticky;
      top: 0;
      background: #111726;
    }
    td {
      padding: 0.75rem 0.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: #e2e8f0;
    }
    tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }
    .api-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin-bottom: 1.25rem;
    }
    .btn-test {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--card-border);
      color: #e2e8f0;
      padding: 0.5rem 0.85rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }
    .btn-test:hover {
      background: rgba(99, 102, 241, 0.2);
      border-color: #6366f1;
      color: #ffffff;
    }
    .method-get { color: #34d399; font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; }
    .method-post { color: #60a5fa; font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; }
    .console-box {
      background: #05080f;
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #38bdf8;
      max-height: 240px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .endpoint-link {
      color: #818cf8;
      text-decoration: none;
      font-weight: 600;
      margin-left: 0.5rem;
    }
    .endpoint-link:hover { text-decoration: underline; }
    footer {
      margin-top: 2rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.82rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo-group">
        <div class="logo-icon">[RM]</div>
        <div class="logo-title">
          <h1>RepairMitra Backend Portal</h1>
          <p>Express REST API & SQLite3 Local Database</p>
        </div>
      </div>
      <div class="header-actions">
        <div class="status-pill">
          <div class="pulse-dot"></div>
          Server Live on Port ${PORT}
        </div>
        <a href="http://localhost:5173" target="_blank" class="btn-frontend">
          Open Frontend App
        </a>
      </div>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <span>Users</span>
          <span>SQLite</span>
        </div>
        <div class="stat-value">${users.length}</div>
        <div class="stat-meta">${sellerCount} Sellers · ${artisanCount} Artisans · ${buyerCount} Buyers</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span>Tools</span>
          <span>Catalog</span>
        </div>
        <div class="stat-value">${tools.length}</div>
        <div class="stat-meta">Lending equipment available</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span>Skills</span>
          <span>Services</span>
        </div>
        <div class="stat-value">${skills.length}</div>
        <div class="stat-meta">Artisan & repair skills listed</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span>Requests</span>
          <span>Ledger</span>
        </div>
        <div class="stat-value">${requests.length}</div>
        <div class="stat-meta">Active & completed exchanges</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span>Reviews</span>
          <span>Trust</span>
        </div>
        <div class="stat-value">${reviews.length}</div>
        <div class="stat-meta">Community ratings logged</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span>Messages</span>
          <span>Chat</span>
        </div>
        <div class="stat-value">${messages.length}</div>
        <div class="stat-meta">In-app communication logs</div>
      </div>
    </div>

    <div class="grid-2">
      <!-- Live API Tester Panel -->
      <div class="panel">
        <div class="panel-title">
          <span>⚡ Live API Endpoint Console</span>
          <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(Click to test)</span>
        </div>
        <div class="api-buttons">
          <button class="btn-test" onclick="testEndpoint('/api/tools')">
            <span class="method-get">GET</span> /api/tools
          </button>
          <button class="btn-test" onclick="testEndpoint('/api/skills')">
            <span class="method-get">GET</span> /api/skills
          </button>
          <button class="btn-test" onclick="testEndpoint('/api/auth/users')">
            <span class="method-get">GET</span> /api/auth/users
          </button>
          <button class="btn-test" onclick="testEndpoint('/api/requests')">
            <span class="method-get">GET</span> /api/requests
          </button>
          <button class="btn-test" onclick="testEndpoint('/api/admin/stats')">
            <span class="method-get">GET</span> /api/admin/stats
          </button>
          <button class="btn-test" onclick="testLogin('priya.patel@example.com', 'password123')">
            <span class="method-post">POST</span> Test Login (Priya)
          </button>
          <button class="btn-test" onclick="testLogin('admin@repairmitra.org', 'password123')">
            <span class="method-post">POST</span> Test Login (Admin)
          </button>
        </div>
        <div class="console-box" id="apiResponse">
// Select an endpoint above to view real-time SQLite data response...
// All REST API routes are fully operational.
        </div>
      </div>

      <!-- Community Members Table Panel -->
      <div class="panel">
        <div class="panel-title">
          <span>👥 Registered Users & Roles</span>
          <a href="/api/auth/users" target="_blank" class="endpoint-link">Raw JSON ↗</a>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Trust</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td>
                    <strong>${u.name}</strong><br>
                    <span style="font-size:0.75rem; color:var(--text-muted);">${u.email}</span>
                  </td>
                  <td>
                    <span class="badge badge-${u.role}">${u.role}</span>
                  </td>
                  <td>
                    <span style="color:#10b981; font-weight:700;">${u.trust_score || 50}</span>
                  </td>
                  <td style="font-size:0.8rem; color:var(--text-muted);">${u.location || 'Bangalore'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Quick Credentials Reference -->
    <div class="panel" style="margin-bottom: 2rem;">
      <div class="panel-title">
        <span>🔑 Demo Login Credentials (All passwords: <code style="color:#34d399; background:rgba(16,185,129,0.1); padding:2px 6px; border-radius:4px;">password123</code>)</span>
      </div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
        <div style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:10px; border:1px solid var(--card-border);">
          <span class="badge badge-artisan">Artisan / Technician</span>
          <p style="margin-top:0.5rem; font-weight:600;">Priya Patel</p>
          <p style="font-size:0.8rem; color:var(--text-muted);">priya.patel@example.com</p>
        </div>
        <div style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:10px; border:1px solid var(--card-border);">
          <span class="badge badge-seller">Tool Lender / Seller</span>
          <p style="margin-top:0.5rem; font-weight:600;">Rajesh Kumar</p>
          <p style="font-size:0.8rem; color:var(--text-muted);">rajesh.kumar@example.com</p>
        </div>
        <div style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:10px; border:1px solid var(--card-border);">
          <span class="badge badge-buyer">Borrower / Buyer</span>
          <p style="margin-top:0.5rem; font-weight:600;">Aarav Sharma</p>
          <p style="font-size:0.8rem; color:var(--text-muted);">aarav.sharma@example.com</p>
        </div>
        <div style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:10px; border:1px solid var(--card-border);">
          <span class="badge badge-admin">Admin</span>
          <p style="margin-top:0.5rem; font-weight:600;">Vikramaditya Rao</p>
          <p style="font-size:0.8rem; color:var(--text-muted);">admin@repairmitra.org</p>
        </div>
      </div>
    </div>

    <footer>
      <p>RepairMitra Hyperlocal Community Network · SQLite Database Active at <code>server/repairmitra.db</code></p>
    </footer>
  </div>

  <script>
    async function testEndpoint(path) {
      const box = document.getElementById('apiResponse');
      box.textContent = '// Fetching ' + path + '...';
      try {
        const res = await fetch(path);
        const data = await res.json();
        box.textContent = '// Status: ' + res.status + ' OK\\n' + JSON.stringify(data, null, 2);
      } catch (err) {
        box.textContent = '// Error fetching: ' + err.message;
      }
    }

    async function testLogin(email, password) {
      const box = document.getElementById('apiResponse');
      box.textContent = '// Testing POST /api/auth/login for ' + email + '...';
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        box.textContent = '// Login Response (Status ' + res.status + '):\\n' + JSON.stringify(data, null, 2);
      } catch (err) {
        box.textContent = '// Error during login: ' + err.message;
      }
    }
  </script>
</body>
</html>`;

    res.send(html);
  } catch (err) {
    res.status(500).send('<h1>Server Error</h1><pre>' + err.message + '</pre>');
  }
});

// -------------------------------------------------------------
// AUTHENTICATION & USER ENDPOINTS
// -------------------------------------------------------------

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, username, email, password, phone, location, neighborhood, role = 'user', bio } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = (username || cleanEmail.split('@')[0]).trim().toLowerCase();

    const existing = await db.getAsync(
      'SELECT id FROM users WHERE LOWER(email) = ? OR LOWER(username) = ?',
      [cleanEmail, cleanUsername]
    );
    if (existing) {
      return res.status(400).json({ error: 'A user with this email or username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = `user-${Date.now()}`;
    const avatar = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`;
    const phoneEncrypted = phone ? `${phone.substring(0, 7)}•••••` : '+91 98000 •••••';

    await db.runAsync(
      `INSERT INTO users (id, name, username, email, password_hash, avatar, phone_encrypted, location, neighborhood, lat, lng, is_verified, trust_score, rating_average, reviews_count, member_since, role, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 50, 5.0, 0, ?, ?, ?)`,
      [
        userId,
        name.trim(),
        cleanUsername,
        cleanEmail,
        passwordHash,
        avatar,
        phoneEncrypted,
        location || 'Indiranagar, Bangalore',
        neighborhood || 'Indiranagar',
        12.9784,
        77.6408,
        'Oct 2026',
        role,
        bio || 'Community member in tool and skill exchange network.'
      ]
    );

    const newUser = await db.getAsync('SELECT * FROM users WHERE id = ?', [userId]);
    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: formatUser(newUser) });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error registering user' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const identifier = (req.body.identifier || req.body.email || req.body.username || '').trim();
    const { password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required' });
    }

    const user = await db.getAsync(
      'SELECT * FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?)',
      [identifier, identifier]
    );
    if (!user) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: formatUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// GET /api/auth/users (Directory & demo switching)
app.get('/api/auth/users', async (req, res) => {
  try {
    const users = await db.allAsync('SELECT id, name, email, avatar, phone_encrypted, location, neighborhood, lat, lng, is_verified, verification_doc_type, verified_date, trust_score, rating_average, reviews_count, member_since, role, bio FROM users');
    res.json(users.map(formatUser));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/:id
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await db.getAsync('SELECT id, name, email, avatar, phone_encrypted, location, neighborhood, lat, lng, is_verified, verification_doc_type, verified_date, trust_score, rating_average, reviews_count, member_since, role, bio FROM users WHERE id = ?', [req.params.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(formatUser(user));
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// POST /api/users/:id/verify
app.post('/api/users/:id/verify', async (req, res) => {
  try {
    const { docType } = req.body;
    const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newTrustScore = Math.min(100, user.trust_score + 35);
    const today = new Date().toISOString().split('T')[0];

    await db.runAsync(
      `UPDATE users SET is_verified = 1, verification_doc_type = ?, verified_date = ?, trust_score = ? WHERE id = ?`,
      [docType || 'Government ID', today, newTrustScore, req.params.id]
    );

    const updated = await db.getAsync('SELECT * FROM users WHERE id = ?', [req.params.id]);
    res.json(formatUser(updated));
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// -------------------------------------------------------------
// TOOLS ENDPOINTS
// -------------------------------------------------------------

// GET /api/tools
app.get('/api/tools', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM tools ORDER BY created_at DESC';
    let params = [];

    const rows = await db.allAsync(query, params);
    const tools = rows.map(formatTool);
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tools' });
  }
});

// POST /api/tools
app.post('/api/tools', async (req, res) => {
  try {
    const {
      ownerId,
      title,
      category,
      description,
      condition = 'Excellent',
      deposit = 0,
      rentalFee = 0,
      location,
      neighborhood,
      lat = 12.9719,
      lng = 77.6412,
      images,
      terms,
      safetyGuidelines,
      tags
    } = req.body;

    const toolId = `tool-${Date.now()}`;
    const imagesStr = JSON.stringify(images || ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&auto=format&fit=crop&q=80']);
    const tagsStr = JSON.stringify(tags || [category]);

    await db.runAsync(
      `INSERT INTO tools (id, owner_id, title, category, description, condition, deposit, rental_fee, is_available, location, neighborhood, lat, lng, images, terms, safety_guidelines, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        toolId,
        ownerId,
        title,
        category,
        description,
        condition,
        deposit,
        rentalFee,
        location,
        neighborhood,
        lat,
        lng,
        imagesStr,
        terms,
        safetyGuidelines,
        tagsStr
      ]
    );

    const created = await db.getAsync('SELECT * FROM tools WHERE id = ?', [toolId]);
    res.status(201).json(formatTool(created));
  } catch (err) {
    console.error('Error creating tool:', err);
    res.status(500).json({ error: 'Failed to create tool' });
  }
});

// PATCH /api/tools/:id/availability
app.patch('/api/tools/:id/availability', async (req, res) => {
  try {
    const tool = await db.getAsync('SELECT * FROM tools WHERE id = ?', [req.params.id]);
    if (!tool) return res.status(404).json({ error: 'Tool not found' });

    const newStatus = tool.is_available ? 0 : 1;
    await db.runAsync('UPDATE tools SET is_available = ? WHERE id = ?', [newStatus, req.params.id]);
    res.json({ id: req.params.id, isAvailable: Boolean(newStatus) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle tool' });
  }
});

// DELETE /api/tools/:id
app.delete('/api/tools/:id', async (req, res) => {
  try {
    await db.runAsync('DELETE FROM tools WHERE id = ?', [req.params.id]);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete tool' });
  }
});

// -------------------------------------------------------------
// SKILLS ENDPOINTS
// -------------------------------------------------------------

// GET /api/skills
app.get('/api/skills', async (req, res) => {
  try {
    const rows = await db.allAsync('SELECT * FROM skills ORDER BY created_at DESC');
    res.json(rows.map(formatSkill));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// POST /api/skills
app.post('/api/skills', async (req, res) => {
  try {
    const {
      ownerId,
      title,
      serviceType,
      description,
      pricingType = 'hourly',
      price = 250,
      availability,
      location,
      neighborhood,
      lat = 12.9719,
      lng = 77.6412,
      experienceYears = 2,
      images,
      skillsIncluded
    } = req.body;

    const skillId = `skill-${Date.now()}`;
    const imagesStr = JSON.stringify(images || ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=700&auto=format&fit=crop&q=80']);
    const skillsIncludedStr = JSON.stringify(skillsIncluded || ['General Diagnostics']);

    await db.runAsync(
      `INSERT INTO skills (id, owner_id, title, service_type, description, pricing_type, price, availability, location, neighborhood, lat, lng, experience_years, completed_jobs, images, skills_included)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      [
        skillId,
        ownerId,
        title,
        serviceType,
        description,
        pricingType,
        price,
        availability,
        location,
        neighborhood,
        lat,
        lng,
        experienceYears,
        imagesStr,
        skillsIncludedStr
      ]
    );

    const created = await db.getAsync('SELECT * FROM skills WHERE id = ?', [skillId]);
    res.status(201).json(formatSkill(created));
  } catch (err) {
    console.error('Error creating skill:', err);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

// DELETE /api/skills/:id
app.delete('/api/skills/:id', async (req, res) => {
  try {
    await db.runAsync('DELETE FROM skills WHERE id = ?', [req.params.id]);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// -------------------------------------------------------------
// REQUESTS & BOOKINGS & HISTORY ENDPOINTS
// -------------------------------------------------------------

// GET /api/requests
app.get('/api/requests', async (req, res) => {
  try {
    const { userId } = req.query;
    let query = 'SELECT * FROM requests ORDER BY created_at DESC';
    let params = [];

    if (userId) {
      query = 'SELECT * FROM requests WHERE borrower_id = ? OR owner_id = ? ORDER BY created_at DESC';
      params = [userId, userId];
    }

    const rows = await db.allAsync(query, params);
    res.json(rows.map(formatRequest));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// POST /api/requests
app.post('/api/requests', async (req, res) => {
  try {
    const {
      listingId,
      listingType,
      listingTitle,
      listingImage,
      borrowerId,
      ownerId,
      startDate,
      endDate,
      serviceTimeSlot,
      pickupTimeSlot,
      daysCount = 1,
      projectScope,
      totalCost,
      deposit = 0
    } = req.body;

    const timeSlot = serviceTimeSlot || pickupTimeSlot || 'Flexible';
    const reqId = `req-${Date.now()}`;
    await db.runAsync(
      `INSERT INTO requests (id, listing_id, listing_type, listing_title, listing_image, borrower_id, owner_id, start_date, end_date, pickup_time_slot, days_count, project_scope, status, total_cost, deposit)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [
        reqId,
        listingId,
        listingType,
        listingTitle,
        listingImage,
        borrowerId,
        ownerId,
        startDate,
        endDate,
        timeSlot,
        daysCount,
        projectScope,
        totalCost,
        deposit
      ]
    );

    // Create notification for owner
    const borrower = await db.getAsync('SELECT name FROM users WHERE id = ?', [borrowerId]);
    const notifId = `notif-${Date.now()}`;
    await db.runAsync(
      `INSERT INTO notifications (id, user_id, title, message, type, reference_id)
       VALUES (?, ?, ?, ?, 'request_new', ?)`,
      [
        notifId,
        ownerId,
        'New Borrow or Service Request',
        `${borrower?.name || 'A neighbor'} requested "${listingTitle}" for ${startDate} (${timeSlot}).`,
        reqId
      ]
    );

    const created = await db.getAsync('SELECT * FROM requests WHERE id = ?', [reqId]);
    res.status(201).json(formatRequest(created));
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// PATCH /api/requests/:id/respond
app.patch('/api/requests/:id/respond', async (req, res) => {
  try {
    const { decision, notes } = req.body; // 'accept' or 'decline'
    const reqItem = await db.getAsync('SELECT * FROM requests WHERE id = ?', [req.params.id]);
    if (!reqItem) return res.status(404).json({ error: 'Request not found' });

    const owner = await db.getAsync('SELECT name, location FROM users WHERE id = ?', [reqItem.owner_id]);
    const newStatus = decision === 'accept' ? 'accepted' : 'declined';
    const exactAddress = decision === 'accept' ? `${owner?.location || 'Indiranagar'}, Landmark: Contact via in-app chat for gate code` : null;

    await db.runAsync(
      `UPDATE requests SET status = ?, exact_pickup_address = ?, pickup_time_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [newStatus, exactAddress, notes, req.params.id]
    );

    // Create notification for borrower
    const notifId = `notif-${Date.now()}`;
    await db.runAsync(
      `INSERT INTO notifications (id, user_id, title, message, type, reference_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        notifId,
        reqItem.borrower_id,
        decision === 'accept' ? 'Request Accepted' : 'Request Update',
        decision === 'accept'
          ? `${owner?.name} accepted your request for "${reqItem.listing_title}". Pickup details unlocked.`
          : `${owner?.name} was unable to fulfill your request.`,
        decision === 'accept' ? 'request_accepted' : 'request_declined',
        req.params.id
      ]
    );

    // Automated chat message
    const msgId = `msg-${Date.now()}`;
    await db.runAsync(
      `INSERT INTO messages (id, request_id, from_user_id, to_user_id, text, is_system_alert)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [
        msgId,
        req.params.id,
        reqItem.owner_id,
        reqItem.borrower_id,
        decision === 'accept'
          ? `Request accepted. Pickup address unlocked: ${owner?.location || 'Indiranagar'}. ${notes || ''}`
          : `Hello, sorry I will not be able to provide this on the requested dates. ${notes || ''}`
      ]
    );

    const updated = await db.getAsync('SELECT * FROM requests WHERE id = ?', [req.params.id]);
    res.json(formatRequest(updated));
  } catch (err) {
    console.error('Error responding to request:', err);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// PATCH /api/requests/:id/complete
app.patch('/api/requests/:id/complete', async (req, res) => {
  try {
    await db.runAsync(
      `UPDATE requests SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [req.params.id]
    );

    const reqItem = await db.getAsync('SELECT * FROM requests WHERE id = ?', [req.params.id]);

    // Recalculate trust scores for both borrower and owner
    for (const uid of [reqItem.borrower_id, reqItem.owner_id]) {
      const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [uid]);
      const completedRows = await db.getAsync(
        `SELECT COUNT(*) as count FROM requests WHERE status = 'completed' AND (borrower_id = ? OR owner_id = ?)`,
        [uid, uid]
      );
      const userRevs = await db.allAsync('SELECT rating FROM reviews WHERE reviewee_id = ?', [uid]);
      const newScore = computeTrustScore(user, completedRows.count, userRevs);
      await db.runAsync('UPDATE users SET trust_score = ? WHERE id = ?', [newScore, uid]);
    }

    res.json(formatRequest(reqItem));
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete request' });
  }
});

// DELETE /api/requests/:id
app.delete('/api/requests/:id', async (req, res) => {
  try {
    await db.runAsync('DELETE FROM messages WHERE request_id = ?', [req.params.id]);
    await db.runAsync('DELETE FROM notifications WHERE reference_id = ?', [req.params.id]);
    await db.runAsync('DELETE FROM requests WHERE id = ?', [req.params.id]);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    console.error('Error deleting request:', err);
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

// -------------------------------------------------------------
// MESSAGES & REVIEWS & NOTIFICATIONS ENDPOINTS
// -------------------------------------------------------------

// GET /api/messages
app.get('/api/messages', async (req, res) => {
  try {
    const { userId, requestId } = req.query;
    let query = 'SELECT * FROM messages';
    let params = [];
    if (requestId) {
      query += ' WHERE request_id = ? ORDER BY timestamp ASC';
      params.push(requestId);
    } else if (userId) {
      query += ' WHERE from_user_id = ? OR to_user_id = ? ORDER BY timestamp ASC';
      params.push(userId, userId);
    } else {
      query += ' ORDER BY timestamp ASC';
    }
    const rows = await db.allAsync(query, params);
    res.json(rows.map(formatMessage));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// GET /api/messages/:requestId
app.get('/api/messages/:requestId', async (req, res) => {
  try {
    const rows = await db.allAsync(
      'SELECT * FROM messages WHERE request_id = ? ORDER BY timestamp ASC',
      [req.params.requestId]
    );
    res.json(rows.map(formatMessage));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/messages
app.post('/api/messages', async (req, res) => {
  try {
    const { requestId, fromUserId, toUserId, text } = req.body;
    const msgId = `msg-${Date.now()}`;

    await db.runAsync(
      `INSERT INTO messages (id, request_id, from_user_id, to_user_id, text, is_system_alert)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [msgId, requestId, fromUserId, toUserId, text]
    );

    const fromUser = await db.getAsync('SELECT name FROM users WHERE id = ?', [fromUserId]);
    const notifId = `notif-${Date.now()}`;
    await db.runAsync(
      `INSERT INTO notifications (id, user_id, title, message, type, reference_id)
       VALUES (?, ?, ?, ?, 'message_new', ?)`,
      [
        notifId,
        toUserId,
        `Message from ${fromUser?.name || 'Neighbor'}`,
        text.length > 50 ? `${text.substring(0, 50)}...` : text,
        requestId
      ]
    );

    const created = await db.getAsync('SELECT * FROM messages WHERE id = ?', [msgId]);
    res.status(201).json(formatMessage(created));
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// GET /api/reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const { userId } = req.query;
    let query = 'SELECT * FROM reviews ORDER BY created_at DESC';
    let params = [];
    if (userId) {
      query = 'SELECT * FROM reviews WHERE reviewee_id = ? ORDER BY created_at DESC';
      params = [userId];
    }
    const rows = await db.allAsync(query, params);
    res.json(rows.map(formatReview));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews
app.post('/api/reviews', async (req, res) => {
  try {
    const { requestId, reviewerId, reviewerName, reviewerAvatar, revieweeId, rating, comment, tags } = req.body;
    const revId = `rev-${Date.now()}`;
    const tagsStr = JSON.stringify(tags || ['Recommended']);

    await db.runAsync(
      `INSERT INTO reviews (id, request_id, reviewer_id, reviewer_name, reviewer_avatar, reviewee_id, rating, comment, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [revId, requestId, reviewerId, reviewerName, reviewerAvatar, revieweeId, rating, comment, tagsStr]
    );

    // Update target user's ratings & trust score in SQLite
    const allRevs = await db.allAsync('SELECT rating FROM reviews WHERE reviewee_id = ?', [revieweeId]);
    const totalRating = allRevs.reduce((acc, r) => acc + r.rating, 0);
    const avg = Math.round((totalRating / allRevs.length) * 10) / 10;

    const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [revieweeId]);
    const completedRows = await db.getAsync(
      `SELECT COUNT(*) as count FROM requests WHERE status = 'completed' AND (borrower_id = ? OR owner_id = ?)`,
      [revieweeId, revieweeId]
    );
    const newTrustScore = computeTrustScore(user, completedRows.count, allRevs);

    await db.runAsync(
      `UPDATE users SET rating_average = ?, reviews_count = ?, trust_score = ? WHERE id = ?`,
      [avg, allRevs.length, newTrustScore, revieweeId]
    );

    const created = await db.getAsync('SELECT * FROM reviews WHERE id = ?', [revId]);
    res.status(201).json(formatReview(created));
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// GET /api/notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const { userId } = req.query;
    let query = 'SELECT * FROM notifications ORDER BY timestamp DESC';
    let params = [];
    if (userId) {
      query = 'SELECT * FROM notifications WHERE user_id = ? ORDER BY timestamp DESC';
      params = [userId];
    }
    const rows = await db.allAsync(query, params);
    res.json(rows.map(formatNotification));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PATCH /api/notifications/:id/read
app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    await db.runAsync('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notification read' });
  }
});

// POST /api/admin/reset-db
app.post('/api/admin/reset-db', async (req, res) => {
  try {
    await db.runAsync('DROP TABLE IF EXISTS notifications;');
    await db.runAsync('DROP TABLE IF EXISTS reviews;');
    await db.runAsync('DROP TABLE IF EXISTS messages;');
    await db.runAsync('DROP TABLE IF EXISTS requests;');
    await db.runAsync('DROP TABLE IF EXISTS skills;');
    await db.runAsync('DROP TABLE IF EXISTS tools;');
    await db.runAsync('DROP TABLE IF EXISTS users;');
    await initDatabase();
    res.json({ success: true, message: 'Database reset to default seed state' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

// GET /api/admin/stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const toolCount = await db.getAsync('SELECT COUNT(*) as count FROM tools');
    const skillCount = await db.getAsync('SELECT COUNT(*) as count FROM skills');
    const userCount = await db.getAsync('SELECT COUNT(*) as count FROM users');
    const activeReqs = await db.getAsync("SELECT COUNT(*) as count FROM requests WHERE status IN ('pending', 'accepted')");
    const completedReqs = await db.getAsync("SELECT COUNT(*) as count FROM requests WHERE status = 'completed'");

    res.json({
      toolsCount: toolCount.count,
      skillsCount: skillCount.count,
      usersCount: userCount.count,
      activeRequests: activeReqs.count,
      completedRequests: completedReqs.count,
      serverUptime: process.uptime()
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Helper formatting functions
function formatUser(u) {
  return {
    id: u.id,
    name: u.name,
    username: u.username || (u.email ? u.email.split('@')[0] : 'user'),
    email: u.email,
    avatar: u.avatar,
    phoneEncrypted: u.phone_encrypted,
    location: u.location,
    neighborhood: u.neighborhood,
    coordinates: { lat: u.lat, lng: u.lng },
    isVerified: Boolean(u.is_verified),
    verificationDocType: u.verification_doc_type,
    verifiedDate: u.verified_date,
    trustScore: u.trust_score,
    ratingAverage: u.rating_average,
    reviewsCount: u.reviews_count,
    memberSince: u.member_since,
    role: u.role,
    bio: u.bio
  };
}

function formatTool(t) {
  return {
    id: t.id,
    ownerId: t.owner_id,
    title: t.title,
    category: t.category,
    description: t.description,
    condition: t.condition,
    deposit: t.deposit,
    rentalFee: t.rental_fee,
    pricingType: t.pricing_type,
    isAvailable: Boolean(t.is_available),
    location: t.location,
    neighborhood: t.neighborhood,
    coordinates: { lat: t.lat, lng: t.lng },
    images: safeParseJSON(t.images, []),
    terms: t.terms,
    safetyGuidelines: t.safety_guidelines,
    tags: safeParseJSON(t.tags, []),
    createdAt: t.created_at
  };
}

function formatSkill(s) {
  return {
    id: s.id,
    ownerId: s.owner_id,
    title: s.title,
    serviceType: s.service_type,
    description: s.description,
    pricingType: s.pricing_type,
    price: s.price,
    availability: s.availability,
    location: s.location,
    neighborhood: s.neighborhood,
    coordinates: { lat: s.lat, lng: s.lng },
    experienceYears: s.experience_years,
    completedJobs: s.completed_jobs,
    images: safeParseJSON(s.images, []),
    skillsIncluded: safeParseJSON(s.skills_included, []),
    createdAt: s.created_at
  };
}

function formatRequest(r) {
  return {
    id: r.id,
    listingId: r.listing_id,
    listingType: r.listing_type,
    listingTitle: r.listing_title,
    listingImage: r.listing_image,
    borrowerId: r.borrower_id,
    ownerId: r.owner_id,
    startDate: r.start_date,
    endDate: r.end_date,
    pickupTimeSlot: r.pickup_time_slot || r.pickup_time_notes || 'Flexible',
    daysCount: r.days_count,
    projectScope: r.project_scope,
    status: r.status,
    totalCost: r.total_cost,
    deposit: r.deposit,
    exactPickupAddress: r.exact_pickup_address,
    pickupTimeNotes: r.pickup_time_notes,
    reviewedByBorrower: Boolean(r.reviewed_by_borrower),
    reviewedByOwner: Boolean(r.reviewed_by_owner),
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

function formatMessage(m) {
  return {
    id: m.id,
    requestId: m.request_id,
    fromUserId: m.from_user_id,
    toUserId: m.to_user_id,
    text: m.text,
    isSystemAlert: Boolean(m.is_system_alert),
    timestamp: m.timestamp
  };
}

function formatReview(r) {
  return {
    id: r.id,
    requestId: r.request_id,
    reviewerId: r.reviewer_id,
    reviewerName: r.reviewer_name,
    reviewerAvatar: r.reviewer_avatar,
    revieweeId: r.reviewee_id,
    rating: r.rating,
    comment: r.comment,
    tags: safeParseJSON(r.tags, []),
    createdAt: r.created_at
  };
}

function formatNotification(n) {
  return {
    id: n.id,
    userId: n.user_id,
    title: n.title,
    message: n.message,
    type: n.type,
    referenceId: n.reference_id,
    isRead: Boolean(n.is_read),
    timestamp: n.timestamp
  };
}

function safeParseJSON(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

// Serve production frontend bundle from dist if available
const path = require('path');
const fs = require('fs');
const distPath = path.join(__dirname, '..', 'dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`[Express] RepairMitra REST API server running on http://127.0.0.1:${PORT}`);
});

