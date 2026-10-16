// RepairMitra SQLite Database & Schema Initialization (CommonJS)
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

  console.log('✅ SQLite Schema initialized successfully at:', DB_PATH);
  await seedInitialData();
}

// Seed pristine datasets if tables are empty
async function seedInitialData() {
  const userCount = await db.getAsync('SELECT COUNT(*) as count FROM users');
  if (userCount && userCount.count > 0) {
    return; // Already seeded
  }

  console.log('🌱 Seeding initial database records with hashed passwords...');
  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('password123', salt);

  // 1. Seed Users
  const users = [
    {
      id: 'user-1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      phone: '+91 98450 •••••',
      location: 'Indiranagar 12th Main, Bangalore',
      neighborhood: 'Indiranagar',
      lat: 12.9784,
      lng: 77.6408,
      is_verified: 1,
      doc_type: 'Aadhaar Card',
      doc_date: '2024-03-15',
      trust_score: 94,
      rating: 4.9,
      reviews_count: 18,
      member_since: 'Oct 2023',
      role: 'buyer',
      bio: 'Weekend DIY enthusiast and home woodworker. Believer in neighborhood sharing and reducing waste.'
    },
    {
      id: 'user-2',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      phone: '+91 98201 •••••',
      location: 'Indiranagar 100ft Road, Bangalore',
      neighborhood: 'Indiranagar',
      lat: 12.9719,
      lng: 77.6412,
      is_verified: 1,
      doc_type: 'Driving License',
      doc_date: '2023-11-10',
      trust_score: 98,
      rating: 5.0,
      reviews_count: 36,
      member_since: 'Aug 2023',
      role: 'seller',
      bio: 'Master carpenter and tool collector for 15+ years. Happy to lend pro-grade gear and guide first-time users on safety.'
    },
    {
      id: 'user-3',
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      phone: '+91 97112 •••••',
      location: 'Koramangala 4th Block, Bangalore',
      neighborhood: 'Koramangala',
      lat: 12.9345,
      lng: 77.6264,
      is_verified: 1,
      doc_type: 'Passport',
      doc_date: '2024-01-20',
      trust_score: 92,
      rating: 4.8,
      reviews_count: 24,
      member_since: 'Nov 2023',
      role: 'artisan',
      bio: 'Certified electrical engineer & appliance diagnostician. Specializing in safe rewiring and electronics repairs.'
    },
    {
      id: 'user-4',
      name: 'Vikramaditya Rao (Admin)',
      email: 'admin@repairmitra.org',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      phone: '+91 99000 •••••',
      location: 'Central Bangalore',
      neighborhood: 'Central Bangalore',
      lat: 12.9716,
      lng: 77.5946,
      is_verified: 1,
      doc_type: 'Official Government ID',
      doc_date: '2023-01-01',
      trust_score: 100,
      rating: 5.0,
      reviews_count: 52,
      member_since: 'Jan 2023',
      role: 'admin',
      bio: 'RepairMitra Community Safety & Verification Steward.'
    },
    {
      id: 'user-5',
      name: 'Sunita Nair',
      email: 'sunita.nair@example.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      phone: '+91 91234 •••••',
      location: 'HSR Layout Sector 2, Bangalore',
      neighborhood: 'HSR Layout',
      lat: 12.9121,
      lng: 77.6446,
      is_verified: 0,
      doc_type: null,
      doc_date: null,
      trust_score: 68,
      rating: 4.6,
      reviews_count: 5,
      member_since: 'Feb 2024',
      role: 'buyer',
      bio: 'Gardening & indoor plant lover. Frequently borrowing lawn care & trimming equipment.'
    }
  ];

  for (const u of users) {
    await db.runAsync(
      `INSERT INTO users (id, name, email, password_hash, avatar, phone_encrypted, location, neighborhood, lat, lng, is_verified, verification_doc_type, verified_date, trust_score, rating_average, reviews_count, member_since, role, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        u.id,
        u.name,
        u.email,
        defaultPasswordHash,
        u.avatar,
        u.phone,
        u.location,
        u.neighborhood,
        u.lat,
        u.lng,
        u.is_verified,
        u.doc_type,
        u.doc_date,
        u.trust_score,
        u.rating,
        u.reviews_count,
        u.member_since,
        u.role,
        u.bio
      ]
    );
  }

  // 2. Seed Tools
  const tools = [
    {
      id: 'tool-1',
      owner_id: 'user-2',
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
        'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=700&auto=format&fit=crop&q=80'
      ]),
      terms: 'Please return clean and fully charged. Safety glasses included.',
      safety_guidelines: 'Wear safety goggles. Do not operate in wet conditions.',
      tags: JSON.stringify(['Drill', 'Bosch', 'Cordless', 'Impact Driver'])
    },
    {
      id: 'tool-2',
      owner_id: 'user-2',
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
        'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=700&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700&auto=format&fit=crop&q=80'
      ]),
      terms: 'Experienced woodworkers preferred. Ear and eye protection mandatory.',
      safety_guidelines: 'Always clamp workpiece securely before cutting.',
      tags: JSON.stringify(['Saw', 'Woodworking', 'DeWalt', 'Cutting'])
    },
    {
      id: 'tool-3',
      owner_id: 'user-1',
      title: 'Kärcher K4 Power Control High-Pressure Washer (130 Bar)',
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
        'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=700&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=700&auto=format&fit=crop&q=80'
      ]),
      terms: 'Connect to standard garden tap with steady water supply. Do not run dry.',
      safety_guidelines: 'Never point jet at people or electrical fixtures.',
      tags: JSON.stringify(['Pressure Washer', 'Karcher', 'Cleaning', 'Patio'])
    },
    {
      id: 'tool-4',
      owner_id: 'user-3',
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
      owner_id: 'user-1',
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

  for (const t of tools) {
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

  // 3. Seed Skills
  const skills = [
    {
      id: 'skill-1',
      owner_id: 'user-2',
      title: 'Precision Furniture Assembly & Custom Wood Repair',
      service_type: 'Carpentry & Woodwork',
      description: 'Expert assembly of IKEA/Pepperfry furniture, squeaky floorboard repairs, cabinet hinge realignment, and drawer slider replacement.',
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
      owner_id: 'user-3',
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
      owner_id: 'user-1',
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

  for (const s of skills) {
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

  // 4. Seed Requests / History
  const requests = [
    {
      id: 'req-1',
      listing_id: 'tool-1',
      listing_type: 'tool',
      listing_title: 'Bosch Professional 18V Cordless Drill & Impact Driver Combo',
      listing_image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&auto=format&fit=crop&q=80',
      borrower_id: 'user-1',
      owner_id: 'user-2',
      start_date: '2024-10-18',
      end_date: '2024-10-20',
      days_count: 2,
      project_scope: 'Need to drill anchors into concrete living room wall to mount an IKEA floating shelf setup.',
      status: 'accepted',
      total_cost: 300,
      deposit: 500,
      exact_pickup_address: 'Flat 302, Green Glen Apartments, 12th Cross, 100ft Road, Indiranagar',
      pickup_time_notes: 'Ready for pickup from 9:30 AM tomorrow.'
    },
    {
      id: 'req-2',
      listing_id: 'tool-3',
      listing_type: 'tool',
      listing_title: 'Kärcher K4 Power Control High-Pressure Washer (130 Bar)',
      listing_image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=700&auto=format&fit=crop&q=80',
      borrower_id: 'user-5',
      owner_id: 'user-1',
      start_date: '2024-10-22',
      end_date: '2024-10-23',
      days_count: 1,
      project_scope: 'Diwali preparation: Deep cleaning the tiled balcony and car parking tiles.',
      status: 'pending',
      total_cost: 250,
      deposit: 600,
      exact_pickup_address: null,
      pickup_time_notes: null
    },
    {
      id: 'req-3',
      listing_id: 'skill-2',
      listing_type: 'skill',
      listing_title: 'Emergency Electrical Diagnostics & Smart Switchboard Setup',
      listing_image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700&auto=format&fit=crop&q=80',
      borrower_id: 'user-1',
      owner_id: 'user-3',
      start_date: '2024-10-10',
      end_date: '2024-10-10',
      days_count: 1,
      project_scope: 'Kitchen geyser tripping main MCB whenever heating turns on.',
      status: 'completed',
      total_cost: 499,
      deposit: 0,
      exact_pickup_address: 'House 44, 12th Main, Indiranagar',
      pickup_time_notes: 'Completed on site.'
    }
  ];

  for (const r of requests) {
    await db.runAsync(
      `INSERT INTO requests (id, listing_id, listing_type, listing_title, listing_image, borrower_id, owner_id, start_date, end_date, days_count, project_scope, status, total_cost, deposit, exact_pickup_address, pickup_time_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        r.id,
        r.listing_id,
        r.listing_type,
        r.listing_title,
        r.listing_image,
        r.borrower_id,
        r.owner_id,
        r.start_date,
        r.end_date,
        r.days_count,
        r.project_scope,
        r.status,
        r.total_cost,
        r.deposit,
        r.exact_pickup_address,
        r.pickup_time_notes
      ]
    );
  }

  // 5. Seed Messages
  const messages = [
    {
      id: 'msg-1',
      request_id: 'req-1',
      from_user_id: 'user-1',
      to_user_id: 'user-2',
      text: 'Hi Rajesh! I submitted a request for your Bosch drill combo for 2 days. Will need masonry bits #6 and #8 for concrete wall plugs.',
      is_system_alert: 0
    },
    {
      id: 'msg-2',
      request_id: 'req-1',
      from_user_id: 'user-2',
      to_user_id: 'user-1',
      text: 'Hello Aarav! Yes, the red case has genuine Bosch SDS 6mm and 8mm masonry drill bits. Request approved! You can pick it up tomorrow morning.',
      is_system_alert: 0
    },
    {
      id: 'msg-3',
      request_id: 'req-1',
      from_user_id: 'user-2',
      to_user_id: 'user-1',
      text: 'Pickup location unlocked: Flat 302, Green Glen Apts, 12th Cross Indiranagar.',
      is_system_alert: 1
    }
  ];

  for (const m of messages) {
    await db.runAsync(
      `INSERT INTO messages (id, request_id, from_user_id, to_user_id, text, is_system_alert)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [m.id, m.request_id, m.from_user_id, m.to_user_id, m.text, m.is_system_alert]
    );
  }

  // 6. Seed Reviews
  const reviews = [
    {
      id: 'rev-1',
      request_id: 'req-3',
      reviewer_id: 'user-1',
      reviewer_name: 'Aarav Sharma',
      reviewer_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      reviewee_id: 'user-3',
      rating: 5,
      comment: 'Priya identified the geyser thermostat short circuit in just 15 minutes! Very knowledgeable, followed all safety earthing tests. Highly recommend her electrical expertise.',
      tags: JSON.stringify(['Punctual', 'Expert Diagnostics', 'Safety First'])
    },
    {
      id: 'rev-2',
      request_id: 'req-3',
      reviewer_id: 'user-3',
      reviewer_name: 'Priya Patel',
      reviewer_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      reviewee_id: 'user-1',
      rating: 5,
      comment: 'Aarav was a pleasure to work with. Had the work area clear, prompt payment, and very welcoming neighbor.',
      tags: JSON.stringify(['Prompt Payment', 'Polite', 'Clear Instructions'])
    }
  ];

  for (const rev of reviews) {
    await db.runAsync(
      `INSERT INTO reviews (id, request_id, reviewer_id, reviewer_name, reviewer_avatar, reviewee_id, rating, comment, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        rev.id,
        rev.request_id,
        rev.reviewer_id,
        rev.reviewer_name,
        rev.reviewer_avatar,
        rev.reviewee_id,
        rev.rating,
        rev.comment,
        rev.tags
      ]
    );
  }

  // 7. Seed Notifications
  const notifications = [
    {
      id: 'notif-1',
      user_id: 'user-1',
      title: 'Request Accepted! 🎉',
      message: 'Rajesh accepted your request for Bosch Cordless Drill Combo. Pickup details now unlocked.',
      type: 'request_accepted',
      reference_id: 'req-1',
      is_read: 0
    },
    {
      id: 'notif-2',
      user_id: 'user-1',
      title: 'New Borrow Request 📬',
      message: 'Sunita requested to borrow your Kärcher Pressure Washer for Oct 22-23.',
      type: 'request_new',
      reference_id: 'req-2',
      is_read: 0
    }
  ];

  for (const n of notifications) {
    await db.runAsync(
      `INSERT INTO notifications (id, user_id, title, message, type, reference_id, is_read)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [n.id, n.user_id, n.title, n.message, n.type, n.reference_id, n.is_read]
    );
  }

  console.log('✅ Initial database seeding completed!');
}

// If executed directly (e.g. node server/db.cjs), run self-check and print diagnostics
if (require.main === module) {
  (async () => {
    try {
      console.log('🔍 Connecting to RepairMitra SQLite database...');
      await initDatabase();
      const users = await db.allAsync('SELECT id, name, email, role FROM users');
      const tools = await db.allAsync('SELECT id, title, category, rental_fee FROM tools');
      const skills = await db.allAsync('SELECT id, title, service_type, price FROM skills');
      const requests = await db.allAsync('SELECT id, status, total_cost FROM requests');
      const reviews = await db.allAsync('SELECT id, rating FROM reviews');
      
      console.log('========================================================');
      console.log('   🛠️  REPAIRMITRA SQLITE DATABASE STATUS: HEALTHY  ');
      console.log('========================================================');
      console.log(`📁 Database File: ${DB_PATH}`);
      console.log(`👥 Registered Community Members (${users.length}):`);
      users.forEach(u => console.log(`   - ${u.name.padEnd(20)} | ${u.email.padEnd(26)} | Role: ${u.role}`));
      console.log(`🔧 Listed Tools (${tools.length}):`);
      tools.slice(0, 4).forEach(t => console.log(`   - ${t.title} [${t.category}] - ₹${t.rental_fee}/day`));
      console.log(`🛠️ Listed Skills (${skills.length}):`);
      skills.slice(0, 4).forEach(s => console.log(`   - ${s.title} [${s.service_type}] - ₹${s.price}`));
      console.log(`📋 Active/Completed Requests: ${requests.length}`);
      console.log(`⭐ Community Reviews Recorded: ${reviews.length}`);
      console.log('========================================================');
      console.log('🚀 Start the full API server: npm run server');
      console.log('🌐 Start full app (Backend + Frontend): npm run dev');
      console.log('========================================================');
      process.exit(0);
    } catch (err) {
      console.error('❌ Database error:', err);
      process.exit(1);
    }
  })();
}

module.exports = {
  db,
  initDatabase,
  seedInitialData
};

