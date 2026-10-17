// RepairMitra SQLite Database & Schema Initialization
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'repairmitra.db');
const db = new sqlite3.Database(DB_PATH);

// Promisified helpers for clean async/await
db.getAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.allAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

db.runAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// Initialize schema
async function initDatabase() {
  await db.runAsync('PRAGMA foreign_keys = ON;');

  // 1. Users Table
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT UNIQUE,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar TEXT,
      phone_encrypted TEXT,
      location TEXT,
      neighborhood TEXT,
      lat REAL,
      lng REAL,
      is_verified INTEGER DEFAULT 0,
      verification_doc_type TEXT,
      verified_date TEXT,
      trust_score INTEGER DEFAULT 50,
      rating_average REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 0,
      member_since TEXT,
      role TEXT DEFAULT 'user',
      bio TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migration: Ensure username column exists
  try {
    await db.runAsync('ALTER TABLE users ADD COLUMN username TEXT;');
  } catch (e) {
    // Column already exists
  }

  // 2. Tools Table (Lending Equipment)
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS tools (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      condition TEXT DEFAULT 'Excellent',
      deposit REAL DEFAULT 0,
      rental_fee REAL DEFAULT 0,
      pricing_type TEXT DEFAULT 'daily',
      is_available INTEGER DEFAULT 1,
      location TEXT,
      neighborhood TEXT,
      lat REAL,
      lng REAL,
      images TEXT,
      terms TEXT,
      safety_guidelines TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 3. Skills Table (Peer Services & Repair Skills)
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      title TEXT NOT NULL,
      service_type TEXT NOT NULL,
      description TEXT,
      pricing_type TEXT DEFAULT 'hourly',
      price REAL DEFAULT 0,
      availability TEXT,
      location TEXT,
      neighborhood TEXT,
      lat REAL,
      lng REAL,
      experience_years INTEGER DEFAULT 1,
      completed_jobs INTEGER DEFAULT 0,
      images TEXT,
      skills_included TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 4. Requests / Bookings Table (Transaction Ledger)
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY,
      listing_id TEXT NOT NULL,
      listing_type TEXT NOT NULL,
      listing_title TEXT NOT NULL,
      listing_image TEXT,
      borrower_id TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      pickup_time_slot TEXT,
      days_count INTEGER DEFAULT 1,
      project_scope TEXT,
      status TEXT DEFAULT 'pending',
      total_cost REAL DEFAULT 0,
      deposit REAL DEFAULT 0,
      exact_pickup_address TEXT,
      pickup_time_notes TEXT,
      reviewed_by_borrower INTEGER DEFAULT 0,
      reviewed_by_owner INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (borrower_id) REFERENCES users(id),
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );
  `);

  // Migration: Ensure pickup_time_slot exists
  try {
    await db.runAsync('ALTER TABLE requests ADD COLUMN pickup_time_slot TEXT;');
  } catch (e) {
    // Column already exists
  }

  // 5. In-App Chat Messages Table
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      request_id TEXT NOT NULL,
      from_user_id TEXT NOT NULL,
      to_user_id TEXT NOT NULL,
      text TEXT NOT NULL,
      is_system_alert INTEGER DEFAULT 0,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (request_id) REFERENCES requests(id),
      FOREIGN KEY (from_user_id) REFERENCES users(id),
      FOREIGN KEY (to_user_id) REFERENCES users(id)
    );
  `);

  // 6. Reviews Table
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      request_id TEXT NOT NULL,
      reviewer_id TEXT NOT NULL,
      reviewer_name TEXT NOT NULL,
      reviewer_avatar TEXT,
      reviewee_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reviewer_id) REFERENCES users(id),
      FOREIGN KEY (reviewee_id) REFERENCES users(id)
    );
  `);

  // 7. Notifications Table
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      reference_id TEXT,
      is_read INTEGER DEFAULT 0,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  console.log('[SQLite] Schema initialized successfully at:', DB_PATH);
  await seedInitialData();
}

// Seed bot accounts and initial tools/skills
async function seedInitialData() {
  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('password123', salt);

  // 1. Seed Bot Accounts
  const botAccounts = [
    {
      id: 'bot-1',
      name: 'Community Tool Custodian',
      username: 'bot_lender',
      email: 'toolkeeper@repairmitra.local',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      phone_encrypted: '+91 98000 •••••',
      location: 'Indiranagar 100ft Road, Bangalore',
      neighborhood: 'Indiranagar',
      lat: 12.9719,
      lng: 77.6412,
      is_verified: 1,
      verification_doc_type: 'Community Custodian',
      verified_date: '2026-01-01',
      trust_score: 98,
      rating_average: 5.0,
      reviews_count: 42,
      member_since: 'Jan 2026',
      role: 'seller',
      bio: 'Community equipment custodian. Maintains heavy-duty drills, saws, and home maintenance tools.'
    },
    {
      id: 'bot-2',
      name: 'Neighborhood Artisan Bot',
      username: 'bot_artisan',
      email: 'artisan@repairmitra.local',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      phone_encrypted: '+91 98111 •••••',
      location: 'Koramangala 4th Block, Bangalore',
      neighborhood: 'Koramangala',
      lat: 12.9345,
      lng: 77.6264,
      is_verified: 1,
      verification_doc_type: 'Certified Specialist',
      verified_date: '2026-01-01',
      trust_score: 96,
      rating_average: 4.9,
      reviews_count: 38,
      member_since: 'Jan 2026',
      role: 'artisan',
      bio: 'Certified repair specialist for carpentry, plumbing, and electrical switchboard diagnostics.'
    },
    {
      id: 'bot-3',
      name: 'Platform Operator Bot',
      username: 'admin',
      email: 'admin@repairmitra.local',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      phone_encrypted: '+91 99999 •••••',
      location: 'Indiranagar, Bangalore',
      neighborhood: 'Indiranagar',
      lat: 12.9784,
      lng: 77.6408,
      is_verified: 1,
      verification_doc_type: 'System Admin',
      verified_date: '2026-01-01',
      trust_score: 100,
      rating_average: 5.0,
      reviews_count: 60,
      member_since: 'Jan 2026',
      role: 'admin',
      bio: 'RepairMitra automated platform administrator and community safety monitor.'
    }
  ];

  for (const b of botAccounts) {
    const existing = await db.getAsync('SELECT id FROM users WHERE id = ? OR email = ? OR username = ?', [b.id, b.email, b.username]);
    if (!existing) {
      await db.runAsync(
        `INSERT INTO users (id, name, username, email, password_hash, avatar, phone_encrypted, location, neighborhood, lat, lng, is_verified, verification_doc_type, verified_date, trust_score, rating_average, reviews_count, member_since, role, bio)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          b.id,
          b.name,
          b.username,
          b.email,
          defaultPasswordHash,
          b.avatar,
          b.phone_encrypted,
          b.location,
          b.neighborhood,
          b.lat,
          b.lng,
          b.is_verified,
          b.verification_doc_type,
          b.verified_date,
          b.trust_score,
          b.rating_average,
          b.reviews_count,
          b.member_since,
          b.role,
          b.bio
        ]
      );
    } else {
      await db.runAsync(
        `UPDATE users SET username = ?, password_hash = ? WHERE id = ? OR email = ?`,
        [b.username, defaultPasswordHash, b.id, b.email]
      );
    }
  }

  // 2. Check and Seed Tools
  const toolCount = await db.getAsync('SELECT COUNT(*) as count FROM tools');
  if (!toolCount || toolCount.count === 0) {
    const initialTools = [
      {
        id: 'tool-1',
        owner_id: 'bot-1',
        title: 'Bosch Professional 18V Cordless Drill & Impact Driver Combo',
        category: 'Power Tools',
        description: 'Heavy duty cordless brushless drill with 2x 4.0Ah batteries, quick charger, and 32-piece titanium screwdriver bit set. Ideal for masonry drilling, shelf mounting, and furniture assembly.',
        condition: 'Like New',
        deposit: 500,
        rental_fee: 150,
        is_available: 1,
        location: 'Indiranagar 100ft Rd',
        neighborhood: 'Indiranagar',
        lat: 12.9719,
        lng: 77.6412,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&auto=format&fit=crop&q=80'
        ]),
        terms: 'Please return clean and fully charged. Safety glasses included.',
        safety_guidelines: 'Wear safety goggles. Do not operate in wet conditions.',
        tags: JSON.stringify(['Drill', 'Bosch', 'Cordless', 'Impact Driver'])
      },
      {
        id: 'tool-2',
        owner_id: 'bot-1',
        title: 'DeWalt 7-1/4" Circular Saw with Precision 24T Carbide Blade',
        category: 'Woodworking',
        description: 'High-torque 15 Amp motor with electric brake. Perfect for framing, cross cuts, plywood trimming, and deck building.',
        condition: 'Excellent',
        deposit: 800,
        rental_fee: 200,
        is_available: 1,
        location: 'Indiranagar 100ft Rd',
        neighborhood: 'Indiranagar',
        lat: 12.9719,
        lng: 77.6412,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=700&auto=format&fit=crop&q=80'
        ]),
        terms: 'Experienced woodworkers preferred. Ear and eye protection mandatory.',
        safety_guidelines: 'Always clamp workpiece securely before cutting.',
        tags: JSON.stringify(['Saw', 'Woodworking', 'DeWalt', 'Cutting'])
      },
      {
        id: 'tool-3',
        owner_id: 'bot-1',
        title: 'Karcher K4 Power Control High-Pressure Washer (130 Bar)',
        category: 'Cleaning & Washers',
        description: '130 bar pressure washer with Vario Power spray lance, Dirt Blaster turbo nozzle, and detergent suction hose.',
        condition: 'Like New',
        deposit: 600,
        rental_fee: 250,
        is_available: 1,
        location: 'Indiranagar 12th Main',
        neighborhood: 'Indiranagar',
        lat: 12.9784,
        lng: 77.6408,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=700&auto=format&fit=crop&q=80'
        ]),
        terms: 'Connect to standard garden tap with steady water supply. Do not run dry.',
        safety_guidelines: 'Never point jet at people or electrical fixtures.',
        tags: JSON.stringify(['Pressure Washer', 'Karcher', 'Cleaning', 'Patio'])
      },
      {
        id: 'tool-4',
        owner_id: 'bot-1',
        title: 'Weller Digital Soldering Station & Desoldering Pump Kit',
        category: 'Electronics & Soldering',
        description: 'Precision 70W temperature-controlled soldering station (100°C to 450°C). Comes with lead-free solder roll and ESD tweezers.',
        condition: 'Like New',
        deposit: 300,
        rental_fee: 100,
        is_available: 1,
        location: 'Koramangala 4th Block',
        neighborhood: 'Koramangala',
        lat: 12.9345,
        lng: 77.6264,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=700&auto=format&fit=crop&q=80'
        ]),
        terms: 'Keep soldering tip tinned. Work in well-ventilated space.',
        safety_guidelines: 'High temperature tip. Keep clear of flammable chemicals.',
        tags: JSON.stringify(['Soldering', 'Electronics', 'PCB', 'Weller'])
      },
      {
        id: 'tool-5',
        owner_id: 'bot-1',
        title: 'Stanley FatMax 12.5ft Heavy-Duty Telescopic Aluminium Ladder',
        category: 'Ladders & Safety',
        description: 'Compact collapsible aluminium ladder extending from 2.8ft up to 12.5ft (3.8m). Rated for 150kg load.',
        condition: 'Excellent',
        deposit: 400,
        rental_fee: 120,
        is_available: 1,
        location: 'Indiranagar 12th Main',
        neighborhood: 'Indiranagar',
        lat: 12.9784,
        lng: 77.6408,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=700&auto=format&fit=crop&q=80'
        ]),
        terms: 'Ensure all rungs click-lock securely before stepping on.',
        safety_guidelines: 'Maintain 3 points of contact when ascending/descending.',
        tags: JSON.stringify(['Ladder', 'Telescopic', 'Painting', 'Roof Access'])
      }
    ];

    for (const t of initialTools) {
      await db.runAsync(
        `INSERT INTO tools (id, owner_id, title, category, description, condition, deposit, rental_fee, is_available, location, neighborhood, lat, lng, images, terms, safety_guidelines, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          t.id,
          t.owner_id,
          t.title,
          t.category,
          t.description,
          t.condition,
          t.deposit,
          t.rental_fee,
          t.is_available,
          t.location,
          t.neighborhood,
          t.lat,
          t.lng,
          t.images,
          t.terms,
          t.safety_guidelines,
          t.tags
        ]
      );
    }
  } else {
    // Ensure existing tools point to valid bot owner
    await db.runAsync(`UPDATE tools SET owner_id = 'bot-1' WHERE owner_id NOT IN ('bot-1', 'bot-2', 'bot-3')`);
  }

  // 3. Check and Seed Skills
  const skillCount = await db.getAsync('SELECT COUNT(*) as count FROM skills');
  if (!skillCount || skillCount.count === 0) {
    const initialSkills = [
      {
        id: 'skill-1',
        owner_id: 'bot-2',
        title: 'Precision Furniture Assembly & Custom Wood Repair',
        service_type: 'Carpentry & Woodwork',
        description: 'Expert assembly of furniture, squeaky floorboard repairs, cabinet hinge realignment, and drawer slider replacement.',
        pricing_type: 'hourly',
        price: 350,
        availability: 'Mon - Sat (Evenings & Weekends)',
        location: 'Indiranagar & 5km radius',
        neighborhood: 'Indiranagar',
        lat: 12.9719,
        lng: 77.6412,
        experience_years: 12,
        completed_jobs: 48,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=700&auto=format&fit=crop&q=80'
        ]),
        skills_included: JSON.stringify(['Hinge Alignment', 'Furniture Assembly', 'Door Planing'])
      },
      {
        id: 'skill-2',
        owner_id: 'bot-2',
        title: 'Emergency Electrical Diagnostics & Smart Switchboard Setup',
        service_type: 'Electrical & Wiring',
        description: 'Prompt identification of tripping MCBs, neutral wire faults, earthing checks, ceiling fan balancing, and smart home automation switch upgrades.',
        pricing_type: 'fixed',
        price: 499,
        availability: 'All days, 8:00 AM - 8:00 PM',
        location: 'Koramangala & HSR Layout',
        neighborhood: 'Koramangala',
        lat: 12.9345,
        lng: 77.6264,
        experience_years: 8,
        completed_jobs: 39,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700&auto=format&fit=crop&q=80'
        ]),
        skills_included: JSON.stringify(['MCB Diagnostics', 'Smart Switches', 'Earthing Test'])
      },
      {
        id: 'skill-3',
        owner_id: 'bot-2',
        title: 'Plumbing Troubleshooting, Tap Cartridge & Flush Valve Overhaul',
        service_type: 'Plumbing & Leaks',
        description: 'Stopping continuous cistern running, replacing faulty ceramic disc tap valves, unclogging kitchen P-traps, and installing RO purifier adapters.',
        pricing_type: 'hourly',
        price: 300,
        availability: 'Weekends & Post 6:00 PM Weekdays',
        location: 'Indiranagar & Domlur',
        neighborhood: 'Indiranagar',
        lat: 12.9784,
        lng: 77.6408,
        experience_years: 6,
        completed_jobs: 21,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=700&auto=format&fit=crop&q=80'
        ]),
        skills_included: JSON.stringify(['Tap Cartridges', 'Flush Cisterns', 'Leak Detection'])
      }
    ];

    for (const s of initialSkills) {
      await db.runAsync(
        `INSERT INTO skills (id, owner_id, title, service_type, description, pricing_type, price, availability, location, neighborhood, lat, lng, experience_years, completed_jobs, images, skills_included)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          s.id,
          s.owner_id,
          s.title,
          s.service_type,
          s.description,
          s.pricing_type,
          s.price,
          s.availability,
          s.location,
          s.neighborhood,
          s.lat,
          s.lng,
          s.experience_years,
          s.completed_jobs,
          s.images,
          s.skills_included
        ]
      );
    }
  } else {
    await db.runAsync(`UPDATE skills SET owner_id = 'bot-2' WHERE owner_id NOT IN ('bot-1', 'bot-2', 'bot-3')`);
  }

  console.log('[SQLite] Database seeding verified.');
}

// Self-check
if (require.main === module) {
  (async () => {
    try {
      console.log('Connecting to RepairMitra SQLite database...');
      await initDatabase();
      const users = await db.allAsync('SELECT id, name, username, email, role FROM users');
      const tools = await db.allAsync('SELECT id, title, category, rental_fee FROM tools');
      const skills = await db.allAsync('SELECT id, title, service_type, price FROM skills');
      
      console.log('========================================================');
      console.log('   REPAIRMITRA SQLITE DATABASE STATUS: HEALTHY  ');
      console.log('========================================================');
      console.log(`Database File: ${DB_PATH}`);
      console.log(`Registered Members (${users.length}):`);
      users.forEach(u => console.log(`   - ${(u.username || 'user').padEnd(16)} | ${(u.name || '').padEnd(25)} | ${u.email}`));
      console.log(`Listed Tools: ${tools.length}`);
      console.log(`Listed Skills: ${skills.length}`);
      console.log('========================================================');
      process.exit(0);
    } catch (err) {
      console.error('Database error:', err);
      process.exit(1);
    }
  })();
}

module.exports = {
  db,
  initDatabase,
  seedInitialData
};
