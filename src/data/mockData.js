// RepairMitra Mock Database & Preloaded Datasets

export const INITIAL_USERS = [
  {
    id: 'user-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    phoneEncrypted: '+91 98450 •••••',
    location: 'Indiranagar 12th Main, Bangalore',
    neighborhood: 'Indiranagar',
    coordinates: { lat: 12.9784, lng: 77.6408 },
    isVerified: true,
    verificationDocType: 'Aadhaar Card',
    verifiedDate: '2024-03-15',
    trustScore: 94,
    ratingAverage: 4.9,
    reviewsCount: 18,
    memberSince: 'Oct 2023',
    role: 'user',
    bio: 'Weekend DIY enthusiast and home woodworker. Strong advocate of the neighborhood circular economy!'
  },
  {
    id: 'user-2',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    phoneEncrypted: '+91 98201 •••••',
    location: 'Indiranagar 100ft Road, Bangalore',
    neighborhood: 'Indiranagar',
    coordinates: { lat: 12.9719, lng: 77.6412 },
    isVerified: true,
    verificationDocType: 'Driving License',
    verifiedDate: '2023-11-10',
    trustScore: 98,
    ratingAverage: 5.0,
    reviewsCount: 36,
    memberSince: 'Aug 2023',
    role: 'user',
    bio: 'Master carpenter and tool collector for 15+ years. Happy to lend pro-grade gear and guide first-time users on safety.'
  },
  {
    id: 'user-3',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    phoneEncrypted: '+91 97112 •••••',
    location: 'Koramangala 4th Block, Bangalore',
    neighborhood: 'Koramangala',
    coordinates: { lat: 12.9345, lng: 77.6264 },
    isVerified: true,
    verificationDocType: 'Passport',
    verifiedDate: '2024-01-20',
    trustScore: 92,
    ratingAverage: 4.8,
    reviewsCount: 24,
    memberSince: 'Nov 2023',
    role: 'user',
    bio: 'Certified electrical engineer & appliance diagnostician. Specializing in safe rewiring and electronics repairs.'
  },
  {
    id: 'user-4',
    name: 'Vikramaditya Rao (Admin)',
    email: 'admin@repairmitra.org',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    phoneEncrypted: '+91 99000 •••••',
    location: 'MG Road / Central, Bangalore',
    neighborhood: 'Central Bangalore',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    isVerified: true,
    verificationDocType: 'Official Government ID',
    verifiedDate: '2023-01-01',
    trustScore: 100,
    ratingAverage: 5.0,
    reviewsCount: 52,
    memberSince: 'Jan 2023',
    role: 'admin',
    bio: 'RepairMitra Community Safety & Verification Steward. Keeping local sharing safe, verified, and friendly.'
  },
  {
    id: 'user-5',
    name: 'Sunita Nair',
    email: 'sunita.nair@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    phoneEncrypted: '+91 91234 •••••',
    location: 'HSR Layout Sector 2, Bangalore',
    neighborhood: 'HSR Layout',
    coordinates: { lat: 12.9121, lng: 77.6446 },
    isVerified: false,
    trustScore: 68,
    ratingAverage: 4.6,
    reviewsCount: 5,
    memberSince: 'Feb 2024',
    role: 'user',
    bio: 'Gardening & indoor plant lover. Frequently borrowing lawn care & trimming equipment.'
  }
];

export const TOOL_CATEGORIES = [
  'All Tools',
  'Power Tools',
  'Woodworking',
  'Hand Tools',
  'Gardening & Outdoor',
  'Cleaning & Washers',
  'Automotive & Bike',
  'Ladders & Safety',
  'Electronics & Soldering'
];

export const SKILL_CATEGORIES = [
  'All Skills',
  'Carpentry & Woodwork',
  'Plumbing & Leaks',
  'Electrical & Wiring',
  'Appliance Repair',
  'Tailoring & Sewing',
  'Masonry & Tile Work',
  'Garden Landscaping'
];

export const NEIGHBORHOODS = [
  { name: 'Indiranagar', lat: 12.9784, lng: 77.6408, postalCode: '560038' },
  { name: 'Koramangala', lat: 12.9345, lng: 77.6264, postalCode: '560034' },
  { name: 'HSR Layout', lat: 12.9121, lng: 77.6446, postalCode: '560102' },
  { name: 'Whitefield', lat: 12.9698, lng: 77.7499, postalCode: '560066' },
  { name: 'Jayanagar', lat: 12.9308, lng: 77.5838, postalCode: '560011' },
  { name: 'Malleshwaram', lat: 13.0031, lng: 77.5643, postalCode: '560003' }
];

export const INITIAL_TOOLS = [
  {
    id: 'tool-1',
    ownerId: 'user-2',
    title: 'Bosch Professional 18V Cordless Drill & Impact Driver Combo',
    category: 'Power Tools',
    description: 'Heavy duty cordless brushless drill with 2x 4.0Ah batteries, quick charger, and 32-piece titanium screwdriver bit set. Ideal for masonry drilling, shelf mounting, and furniture assembly.',
    condition: 'Like New',
    deposit: 500,
    rentalFee: 150, // per day in INR
    pricingType: 'daily',
    isAvailable: true,
    location: 'Indiranagar 100ft Rd',
    neighborhood: 'Indiranagar',
    coordinates: { lat: 12.9719, lng: 77.6412 },
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=700&auto=format&fit=crop&q=80'
    ],
    terms: 'Please return clean and fully charged. Safety glasses included in the carrying case.',
    safetyGuidelines: 'Wear safety goggles. Do not operate in wet conditions.',
    tags: ['Drill', 'Bosch', 'Cordless', 'Impact Driver'],
    createdAt: '2024-03-01'
  },
  {
    id: 'tool-2',
    ownerId: 'user-2',
    title: 'DeWalt 7-1/4" Circular Saw with Precision 24T Carbide Blade',
    category: 'Woodworking',
    description: 'High-torque 15 Amp motor with electric brake. Perfect for framing, cross cuts, plywood trimming, and deck building. Includes rip fence and dust port adapter.',
    condition: 'Excellent',
    deposit: 800,
    rentalFee: 200,
    pricingType: 'daily',
    isAvailable: true,
    location: 'Indiranagar 100ft Rd',
    neighborhood: 'Indiranagar',
    coordinates: { lat: 12.9719, lng: 77.6412 },
    images: [
      'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700&auto=format&fit=crop&q=80'
    ],
    terms: 'Experienced woodworkers preferred. Ear and eye protection mandatory.',
    safetyGuidelines: 'Always clamp workpiece securely before cutting.',
    tags: ['Saw', 'Woodworking', 'DeWalt', 'Cutting'],
    createdAt: '2024-03-05'
  },
  {
    id: 'tool-3',
    ownerId: 'user-1',
    title: 'Kärcher K4 Power Control High-Pressure Washer (130 Bar)',
    category: 'Cleaning & Washers',
    description: '130 bar pressure washer with Vario Power spray lance, Dirt Blaster turbo nozzle, and detergent suction hose. Great for patio slabs, driveway moss, car washing, and compound walls.',
    condition: 'Like New',
    deposit: 600,
    rentalFee: 250,
    pricingType: 'daily',
    isAvailable: true,
    location: 'Indiranagar 12th Main',
    neighborhood: 'Indiranagar',
    coordinates: { lat: 12.9784, lng: 77.6408 },
    images: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=700&auto=format&fit=crop&q=80'
    ],
    terms: 'Connect to standard garden tap with steady water supply. Do not run dry.',
    safetyGuidelines: 'Never point jet at people, pets, or electrical fixtures.',
    tags: ['Pressure Washer', 'Karcher', 'Cleaning', 'Patio'],
    createdAt: '2024-03-10'
  },
  {
    id: 'tool-4',
    ownerId: 'user-3',
    title: 'Weller Digital Soldering Station & Desoldering Pump Kit',
    category: 'Electronics & Soldering',
    description: 'Precision 70W temperature-controlled soldering station (100°C to 450°C). Comes with lead-free solder roll, brass tip cleaner, ESD tweezers, and heat gun.',
    condition: 'Like New',
    deposit: 300,
    rentalFee: 100,
    pricingType: 'daily',
    isAvailable: true,
    location: 'Koramangala 4th Block',
    neighborhood: 'Koramangala',
    coordinates: { lat: 12.9345, lng: 77.6264 },
    images: [
      'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1597424214717-380d0d8beeb7?w=700&auto=format&fit=crop&q=80'
    ],
    terms: 'Keep soldering tip tinned. Work in well-ventilated space.',
    safetyGuidelines: 'High temperature tip. Keep clear of flammable chemicals.',
    tags: ['Soldering', 'Electronics', 'PCB', 'Weller'],
    createdAt: '2024-03-12'
  },
  {
    id: 'tool-5',
    ownerId: 'user-1',
    title: 'Stanley FatMax 12.5ft Heavy-Duty Telescopic Aluminium Ladder',
    category: 'Ladders & Safety',
    description: 'Compact collapsible aluminium ladder extending from 2.8ft up to 12.5ft (3.8m). Rated for 150kg load with non-slip rubber rungs and single-button retraction.',
    condition: 'Excellent',
    deposit: 400,
    rentalFee: 120,
    pricingType: 'daily',
    isAvailable: true,
    location: 'Indiranagar 12th Main',
    neighborhood: 'Indiranagar',
    coordinates: { lat: 12.9784, lng: 77.6408 },
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=700&auto=format&fit=crop&q=80'
    ],
    terms: 'Ensure all rungs click-lock securely before stepping on.',
    safetyGuidelines: 'Maintain 3 points of contact when ascending/descending.',
    tags: ['Ladder', 'Telescopic', 'Painting', 'Roof Access'],
    createdAt: '2024-03-14'
  },
  {
    id: 'tool-6',
    ownerId: 'user-5',
    title: 'Bosch UniversalGrassCut Cordless Lawn Edge Trimmer',
    category: 'Gardening & Outdoor',
    description: 'Ergonomic 18V lawn trimmer with semi-automatic line spool and tilting head for neat path edging. Includes two 2.5Ah Power-for-All batteries.',
    condition: 'Good',
    deposit: 350,
    rentalFee: 110,
    pricingType: 'daily',
    isAvailable: true,
    location: 'HSR Layout Sector 2',
    neighborhood: 'HSR Layout',
    coordinates: { lat: 12.9121, lng: 77.6446 },
    images: [
      'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558904541-efa8c4a08931?w=700&auto=format&fit=crop&q=80'
    ],
    terms: 'Wipe grass clippings before returning. Extra spool cord provided.',
    safetyGuidelines: 'Wear closed-toe shoes and safety glasses while trimming.',
    tags: ['Gardening', 'Trimmer', 'Lawn', 'Bosch'],
    createdAt: '2024-03-18'
  },
  {
    id: 'tool-7',
    ownerId: 'user-2',
    title: 'Makita 5" Random Orbital Disc Sander with Dust Bag',
    category: 'Woodworking',
    description: '300W high-speed random orbit sander delivering swirl-free finishes on tables, cabinets, and doors. Includes 10 sanding discs (80, 120, 240 grit).',
    condition: 'Like New',
    deposit: 350,
    rentalFee: 130,
    pricingType: 'daily',
    isAvailable: true,
    location: 'Indiranagar 100ft Rd',
    neighborhood: 'Indiranagar',
    coordinates: { lat: 12.9719, lng: 77.6412 },
    images: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=700&auto=format&fit=crop&q=80'
    ],
    terms: 'Empty dust collector bag before returning.',
    safetyGuidelines: 'Wear N95 dust mask while sanding wood or painted surfaces.',
    tags: ['Sander', 'Makita', 'Refinishing', 'Woodworking'],
    createdAt: '2024-03-20'
  },
  {
    id: 'tool-8',
    ownerId: 'user-3',
    title: 'Fluke 117 Electricians True RMS Digital Multimeter',
    category: 'Hand Tools',
    description: 'Compact True RMS digital multimeter with VoltAlert non-contact voltage detector, LoZ ghost voltage prevention, and silicone safety test leads.',
    condition: 'Like New',
    deposit: 500,
    rentalFee: 140,
    pricingType: 'daily',
    isAvailable: true,
    location: 'Koramangala 4th Block',
    neighborhood: 'Koramangala',
    coordinates: { lat: 12.9345, lng: 77.6264 },
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=700&auto=format&fit=crop&q=80'
    ],
    terms: 'Do not measure currents exceeding device fuse rating.',
    safetyGuidelines: 'Verify zero voltage before touching any open electrical lines.',
    tags: ['Multimeter', 'Fluke', 'Electrical', 'Voltage Tester'],
    createdAt: '2024-03-22'
  }
];

export const INITIAL_SKILLS = [
  {
    id: 'skill-1',
    ownerId: 'user-2',
    title: 'Precision Furniture Assembly & Custom Wood Repair',
    serviceType: 'Carpentry & Woodwork',
    description: 'Expert assembly of IKEA/Pepperfry/UrbanLadder furniture, squeaky floorboard repairs, cabinet hinge realignment, wooden door planing, and drawer slider replacement.',
    pricingType: 'hourly',
    price: 350, // INR per hour
    availability: 'Mon - Sat (Evenings & Weekends)',
    location: 'Indiranagar & 5km radius',
    neighborhood: 'Indiranagar',
    coordinates: { lat: 12.9719, lng: 77.6412 },
    experienceYears: 12,
    completedJobs: 48,
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?w=700&auto=format&fit=crop&q=80'
    ],
    skillsIncluded: ['Hinge Alignment', 'Furniture Assembly', 'Door Planing', 'Varnish Touchups'],
    createdAt: '2024-02-15'
  },
  {
    id: 'skill-2',
    ownerId: 'user-3',
    title: 'Emergency Electrical Diagnostics & Smart Switchboard Setup',
    serviceType: 'Electrical & Wiring',
    description: 'Prompt identification of tripping MCBs, neutral wire faults, earthing checks, ceiling fan balancing, inverter wiring, and smart home automation switch upgrades.',
    pricingType: 'fixed',
    price: 499, // Base visit + inspection
    availability: 'All days, 8:00 AM - 8:00 PM',
    location: 'Koramangala & HSR Layout',
    neighborhood: 'Koramangala',
    coordinates: { lat: 12.9345, lng: 77.6264 },
    experienceYears: 8,
    completedJobs: 39,
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=700&auto=format&fit=crop&q=80'
    ],
    skillsIncluded: ['MCB Diagnostics', 'Smart Switches', 'Earthing Test', 'Wiring Overhaul'],
    createdAt: '2024-02-20'
  },
  {
    id: 'skill-3',
    ownerId: 'user-1',
    title: 'Plumbing Troubleshooting, Tap Cartridge & Flush Valve Overhaul',
    serviceType: 'Plumbing & Leaks',
    description: 'Stopping continuous cistern running, replacing faulty ceramic disc tap valves, unclogging kitchen P-traps, installing RO purifier adapters, and washing machine inlet valves.',
    pricingType: 'hourly',
    price: 300,
    availability: 'Weekends & Post 6:00 PM Weekdays',
    location: 'Indiranagar & Domlur',
    neighborhood: 'Indiranagar',
    coordinates: { lat: 12.9784, lng: 77.6408 },
    experienceYears: 6,
    completedJobs: 21,
    images: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542013936693-884638332954?w=700&auto=format&fit=crop&q=80'
    ],
    skillsIncluded: ['Tap Cartridges', 'Flush Cisterns', 'Leak Detection', 'P-Trap Cleaning'],
    createdAt: '2024-03-01'
  },
  {
    id: 'skill-4',
    ownerId: 'user-5',
    title: 'Balcony Garden Revamp, Drip Irrigation & Soil Conditioning',
    serviceType: 'Garden Landscaping',
    description: 'Setup of automatic micro-drip watering systems for apartment balconies, organic pest control (neem spray), repotting root-bound monsteras and seasonal flowering plants.',
    pricingType: 'hourly',
    price: 280,
    availability: 'Saturday & Sunday Mornings',
    location: 'HSR Layout & Bellandur',
    neighborhood: 'HSR Layout',
    coordinates: { lat: 12.9121, lng: 77.6446 },
    experienceYears: 5,
    completedJobs: 17,
    images: [
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=700&auto=format&fit=crop&q=80'
    ],
    skillsIncluded: ['Drip Irrigation', 'Soil Repotting', 'Pruning', 'Organic Pest Spray'],
    createdAt: '2024-03-08'
  }
];

export const INITIAL_REQUESTS = [
  {
    id: 'req-1',
    listingId: 'tool-1',
    listingType: 'tool',
    listingTitle: 'Bosch Professional 18V Cordless Drill & Impact Driver Combo',
    listingImage: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&auto=format&fit=crop&q=80',
    borrowerId: 'user-1', // Aarav
    ownerId: 'user-2', // Rajesh
    startDate: '2024-10-18',
    endDate: '2024-10-20',
    daysCount: 2,
    projectScope: 'Need to drill anchors into concrete living room wall to mount an IKEA floating shelf setup.',
    status: 'accepted', // Active loan
    totalCost: 300,
    deposit: 500,
    exactPickupAddress: 'Flat 302, Green Glen Apartments, 12th Cross, 100ft Road, Indiranagar, Bangalore (Opposite Toit)',
    pickupTimeNotes: 'Ready for pickup from 9:30 AM tomorrow. Ring doorbell 302.',
    createdAt: '2024-10-16T14:30:00Z',
    updatedAt: '2024-10-16T15:10:00Z'
  },
  {
    id: 'req-2',
    listingId: 'tool-3',
    listingType: 'tool',
    listingTitle: 'Kärcher K4 Power Control High-Pressure Washer (130 Bar)',
    listingImage: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=700&auto=format&fit=crop&q=80',
    borrowerId: 'user-5', // Sunita
    ownerId: 'user-1', // Aarav
    startDate: '2024-10-22',
    endDate: '2024-10-23',
    daysCount: 1,
    projectScope: 'Diwali preparation: Deep cleaning the tiled balcony and car parking tiles.',
    status: 'pending',
    totalCost: 250,
    deposit: 600,
    exactPickupAddress: null, // Hidden until accepted!
    pickupTimeNotes: null,
    createdAt: '2024-10-16T18:00:00Z',
    updatedAt: '2024-10-16T18:00:00Z'
  },
  {
    id: 'req-3',
    listingId: 'skill-2',
    listingType: 'skill',
    listingTitle: 'Emergency Electrical Diagnostics & Smart Switchboard Setup',
    listingImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700&auto=format&fit=crop&q=80',
    borrowerId: 'user-1', // Aarav
    ownerId: 'user-3', // Priya
    startDate: '2024-10-10',
    endDate: '2024-10-10',
    daysCount: 1,
    projectScope: 'Kitchen geyser tripping main MCB whenever heating turns on.',
    status: 'completed',
    totalCost: 499,
    deposit: 0,
    exactPickupAddress: 'House 44, 12th Main, Indiranagar',
    pickupTimeNotes: 'Completed on site.',
    reviewedByBorrower: true,
    reviewedByOwner: true,
    createdAt: '2024-10-09T10:00:00Z',
    updatedAt: '2024-10-10T16:30:00Z'
  }
];

export const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    requestId: 'req-1',
    fromUserId: 'user-1',
    toUserId: 'user-2',
    text: 'Hi Rajesh! I submitted a request for your Bosch drill combo for 2 days. Will need masonry bits #6 and #8 for concrete wall plugs.',
    timestamp: '2024-10-16T14:32:00Z'
  },
  {
    id: 'msg-2',
    requestId: 'req-1',
    fromUserId: 'user-2',
    toUserId: 'user-1',
    text: 'Hello Aarav! Yes, the red case has genuine Bosch SDS 6mm and 8mm masonry drill bits. Request approved! You can pick it up tomorrow morning.',
    timestamp: '2024-10-16T15:10:00Z'
  },
  {
    id: 'msg-3',
    requestId: 'req-1',
    fromUserId: 'user-2',
    toUserId: 'user-1',
    text: 'Pickup location unlocked: Flat 302, Green Glen Apts, 12th Cross Indiranagar. Call the intercom upon reaching gate.',
    isSystemAlert: true,
    timestamp: '2024-10-16T15:10:05Z'
  },
  {
    id: 'msg-4',
    requestId: 'req-1',
    fromUserId: 'user-1',
    toUserId: 'user-2',
    text: 'Awesome, see you tomorrow around 10am. Thanks a lot!',
    timestamp: '2024-10-16T15:15:00Z'
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    requestId: 'req-3',
    reviewerId: 'user-1',
    reviewerName: 'Aarav Sharma',
    reviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    revieweeId: 'user-3',
    rating: 5,
    comment: 'Priya identified the geyser thermostat short circuit in just 15 minutes! Very knowledgeable, followed all safety earthing tests. Highly recommend her electrical expertise.',
    tags: ['Punctual', 'Expert Diagnostics', 'Safety First'],
    createdAt: '2024-10-10T17:00:00Z'
  },
  {
    id: 'rev-2',
    requestId: 'req-3',
    reviewerId: 'user-3',
    reviewerName: 'Priya Patel',
    reviewerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    revieweeId: 'user-1',
    rating: 5,
    comment: 'Aarav was a pleasure to work with. Had the work area clear, prompt payment, and very welcoming neighbor.',
    tags: ['Prompt Payment', 'Polite', 'Clear Instructions'],
    createdAt: '2024-10-10T17:15:00Z'
  },
  {
    id: 'rev-3',
    requestId: 'req-historical-1',
    reviewerId: 'user-5',
    reviewerName: 'Sunita Nair',
    reviewerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    revieweeId: 'user-2',
    rating: 5,
    comment: 'Rajesh lent me his orbital sander. It was in pristine condition and he even took the time to show me proper grit progression. A true master and neighbor.',
    tags: ['Tool in Top Condition', 'Helpful Advice', 'Generous Neighbor'],
    createdAt: '2024-09-28T11:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    userId: 'user-1',
    title: 'Request Accepted! 🎉',
    message: 'Rajesh accepted your request for Bosch Cordless Drill Combo. Pickup details now unlocked.',
    type: 'request_accepted',
    referenceId: 'req-1',
    isRead: false,
    timestamp: '2024-10-16T15:10:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    title: 'New Borrow Request 📬',
    message: 'Sunita requested to borrow your Kärcher Pressure Washer for Oct 22-23.',
    type: 'request_new',
    referenceId: 'req-2',
    isRead: false,
    timestamp: '2024-10-16T18:00:00Z'
  },
  {
    id: 'notif-3',
    userId: 'user-2',
    title: 'Upcoming Return Reminder ⏰',
    message: 'Bosch Cordless Drill is scheduled to be returned by Aarav on Oct 20.',
    type: 'return_reminder',
    referenceId: 'req-1',
    isRead: true,
    timestamp: '2024-10-16T12:00:00Z'
  }
];
