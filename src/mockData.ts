import { Creator, Campaign, Offer, Contract, EscrowTransaction, Message, CollabPost } from './types';

export const INITIAL_CREATORS: Creator[] = [
  {
    id: 'c1',
    name: 'Alex Rivera',
    handle: '@alexrivera_tech',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: 'Tech enthusiast, gadget reviewer & software developer sharing deep-dive tech setups and AI tool workflows.',
    location: 'San Francisco, USA',
    niche: ['Tech', 'Gadgets', 'AI', 'Software'],
    languages: ['English', 'Spanish'],
    totalFollowers: 680000,
    avgViews: 245000,
    engagementRate: 6.8,
    brandSafetyScore: 98,
    authenticityScore: 95,
    influenceScore: 91,
    pricePerPost: 3200,
    verified: true,
    platforms: [
      { platform: 'youtube', handle: 'AlexRiveraTech', followers: 420000, avgViews: 180000, engagementRate: 7.2, growthRate30d: 4.5, verified: true },
      { platform: 'instagram', handle: 'alexrivera_tech', followers: 180000, avgViews: 45000, engagementRate: 6.1, growthRate30d: 3.2, verified: true },
      { platform: 'tiktok', handle: '@alex_tech_reviews', followers: 80000, avgViews: 20000, engagementRate: 8.0, growthRate30d: 8.1, verified: false }
    ],
    audienceDemographics: {
      topCountries: [
        { country: 'United States', percentage: 58 },
        { country: 'United Kingdom', percentage: 14 },
        { country: 'Canada', percentage: 11 },
        { country: 'Germany', percentage: 8 },
        { country: 'Others', percentage: 9 }
      ],
      genderSplit: { male: 72, female: 26, other: 2 },
      ageDistribution: [
        { ageGroup: '18-24', percentage: 32 },
        { ageGroup: '25-34', percentage: 48 },
        { ageGroup: '35-44', percentage: 14 },
        { ageGroup: '45+', percentage: 6 }
      ]
    },
    pastBrands: ['Samsung', 'Sony', 'Notion', 'Logitech', 'Anker'],
    completedCampaigns: 42,
    rating: 4.9,
    reviewsCount: 38,
    portfolioSamples: [
      { title: 'The Ultimate AI Workspace 2026', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80', views: '450K', engagement: '8.4%', platform: 'YouTube' },
      { title: 'Samsung S26 Ultra vs iPhone 17 Pro', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80', views: '320K', engagement: '7.1%', platform: 'Instagram' }
    ],
    growthHistory: [
      { month: 'Jan', followers: 610000, engagement: 6.2 },
      { month: 'Feb', followers: 625000, engagement: 6.4 },
      { month: 'Mar', followers: 640000, engagement: 6.5 },
      { month: 'Apr', followers: 655000, engagement: 6.7 },
      { month: 'May', followers: 670000, engagement: 6.8 },
      { month: 'Jun', followers: 680000, engagement: 6.8 }
    ]
  },
  {
    id: 'c2',
    name: 'Sophia Chen',
    handle: '@sophiastyle',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    bio: 'Sustainable fashion curator, minimalist aesthetics, high-end street style lookbooks & capsule wardrobe styling.',
    location: 'New York, USA',
    niche: ['Fashion', 'Lifestyle', 'Beauty', 'Sustainability'],
    languages: ['English', 'Mandarin'],
    totalFollowers: 1250000,
    avgViews: 410000,
    engagementRate: 8.2,
    brandSafetyScore: 99,
    authenticityScore: 92,
    influenceScore: 94,
    pricePerPost: 5500,
    verified: true,
    platforms: [
      { platform: 'instagram', handle: 'sophiastyle', followers: 850000, avgViews: 280000, engagementRate: 8.5, growthRate30d: 5.1, verified: true },
      { platform: 'tiktok', handle: '@sophiastyle', followers: 400000, avgViews: 130000, engagementRate: 7.8, growthRate30d: 9.4, verified: true }
    ],
    audienceDemographics: {
      topCountries: [
        { country: 'United States', percentage: 62 },
        { country: 'France', percentage: 12 },
        { country: 'United Kingdom', percentage: 10 },
        { country: 'Australia', percentage: 8 },
        { country: 'Others', percentage: 8 }
      ],
      genderSplit: { male: 18, female: 80, other: 2 },
      ageDistribution: [
        { ageGroup: '18-24', percentage: 41 },
        { ageGroup: '25-34', percentage: 45 },
        { ageGroup: '35-44', percentage: 11 },
        { ageGroup: '45+', percentage: 3 }
      ]
    },
    pastBrands: ['Nike', 'Zara', 'Sephora', 'Glossier', 'Reform'],
    completedCampaigns: 65,
    rating: 5.0,
    reviewsCount: 52,
    portfolioSamples: [
      { title: 'Summer Capsule Wardrobe 2026', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&auto=format&fit=crop&q=80', views: '680K', engagement: '9.2%', platform: 'Instagram' },
      { title: 'Styling 5 Outfits for Paris Fashion Week', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80', views: '520K', engagement: '8.1%', platform: 'TikTok' }
    ],
    growthHistory: [
      { month: 'Jan', followers: 1100000, engagement: 7.8 },
      { month: 'Feb', followers: 1130000, engagement: 7.9 },
      { month: 'Mar', followers: 1170000, engagement: 8.0 },
      { month: 'Apr', followers: 1200000, engagement: 8.1 },
      { month: 'May', followers: 1230000, engagement: 8.2 },
      { month: 'Jun', followers: 1250000, engagement: 8.2 }
    ]
  },
  {
    id: 'c3',
    name: 'Marcus Vance',
    handle: '@marcusvance_fit',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    bio: 'Professional hybrid athlete & nutrition coach pushing human performance limits, high energy workout breakdowns.',
    location: 'Austin, Texas',
    niche: ['Fitness', 'Health', 'Sports', 'Wellness'],
    languages: ['English'],
    totalFollowers: 940000,
    avgViews: 310000,
    engagementRate: 7.4,
    brandSafetyScore: 96,
    authenticityScore: 89,
    influenceScore: 88,
    pricePerPost: 4000,
    verified: true,
    platforms: [
      { platform: 'youtube', handle: 'MarcusVanceFit', followers: 510000, avgViews: 210000, engagementRate: 7.8, growthRate30d: 3.8, verified: true },
      { platform: 'instagram', handle: 'marcusvance_fit', followers: 430000, avgViews: 100000, engagementRate: 7.1, growthRate30d: 4.1, verified: true }
    ],
    audienceDemographics: {
      topCountries: [
        { country: 'United States', percentage: 65 },
        { country: 'Canada', percentage: 15 },
        { country: 'Brazil', percentage: 8 },
        { country: 'United Kingdom', percentage: 7 },
        { country: 'Others', percentage: 5 }
      ],
      genderSplit: { male: 68, female: 30, other: 2 },
      ageDistribution: [
        { ageGroup: '18-24', percentage: 28 },
        { ageGroup: '25-34', percentage: 52 },
        { ageGroup: '35-44', percentage: 16 },
        { ageGroup: '45+', percentage: 4 }
      ]
    },
    pastBrands: ['Gymshark', 'MyProtein', 'Whoop', 'RedBull', 'Nike'],
    completedCampaigns: 31,
    rating: 4.8,
    reviewsCount: 29,
    portfolioSamples: [
      { title: '30-Day Hybrid Athlete Transformation', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80', views: '810K', engagement: '8.9%', platform: 'YouTube' }
    ],
    growthHistory: [
      { month: 'Jan', followers: 880000, engagement: 7.0 },
      { month: 'Feb', followers: 895000, engagement: 7.1 },
      { month: 'Mar', followers: 910000, engagement: 7.2 },
      { month: 'Apr', followers: 922000, engagement: 7.3 },
      { month: 'May', followers: 932000, engagement: 7.4 },
      { month: 'Jun', followers: 940000, engagement: 7.4 }
    ]
  },
  {
    id: 'c4',
    name: 'Elena Rostova',
    handle: '@elena_eats_travel',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    bio: 'Culinary explorer & luxury travel filmmaker documenting hidden street food gems and 5-star destination resorts globally.',
    location: 'London, UK',
    niche: ['Food', 'Travel', 'Luxury', 'Lifestyle'],
    languages: ['English', 'Italian', 'Russian'],
    totalFollowers: 1580000,
    avgViews: 580000,
    engagementRate: 9.1,
    brandSafetyScore: 97,
    authenticityScore: 94,
    influenceScore: 96,
    pricePerPost: 6800,
    verified: true,
    platforms: [
      { platform: 'tiktok', handle: '@elena_travels', followers: 920000, avgViews: 380000, engagementRate: 9.6, growthRate30d: 6.2, verified: true },
      { platform: 'youtube', handle: 'ElenaRostovaTravel', followers: 380000, avgViews: 140000, engagementRate: 8.8, growthRate30d: 4.8, verified: true },
      { platform: 'instagram', handle: 'elena_eats_travel', followers: 280000, avgViews: 60000, engagementRate: 8.2, growthRate30d: 3.5, verified: true }
    ],
    audienceDemographics: {
      topCountries: [
        { country: 'United Kingdom', percentage: 38 },
        { country: 'United States', percentage: 32 },
        { country: 'Italy', percentage: 12 },
        { country: 'UAE', percentage: 10 },
        { country: 'Others', percentage: 8 }
      ],
      genderSplit: { male: 35, female: 63, other: 2 },
      ageDistribution: [
        { ageGroup: '18-24', percentage: 35 },
        { ageGroup: '25-34', percentage: 46 },
        { ageGroup: '35-44', percentage: 14 },
        { ageGroup: '45+', percentage: 5 }
      ]
    },
    pastBrands: ['Emirates', 'Marriott', 'Nespresso', 'Airbnb', 'UberEats'],
    completedCampaigns: 58,
    rating: 4.95,
    reviewsCount: 48,
    portfolioSamples: [
      { title: 'Tokyo Hidden Ramen Alley Vlog', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=500&auto=format&fit=crop&q=80', views: '1.2M', engagement: '10.5%', platform: 'TikTok' }
    ],
    growthHistory: [
      { month: 'Jan', followers: 1350000, engagement: 8.6 },
      { month: 'Feb', followers: 1400000, engagement: 8.8 },
      { month: 'Mar', followers: 1450000, engagement: 8.9 },
      { month: 'Apr', followers: 1500000, engagement: 9.0 },
      { month: 'May', followers: 1540000, engagement: 9.1 },
      { month: 'Jun', followers: 1580000, engagement: 9.1 }
    ]
  },
  {
    id: 'c5',
    name: 'David Miller',
    handle: '@davidm_gaming',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'Twitch partner & esports commentator. PC building tips, live tournaments, competitive FPS breakdowns.',
    location: 'Toronto, Canada',
    niche: ['Gaming', 'Esports', 'PC Tech', 'Entertainment'],
    languages: ['English'],
    totalFollowers: 820000,
    avgViews: 190000,
    engagementRate: 8.9,
    brandSafetyScore: 92,
    authenticityScore: 96,
    influenceScore: 87,
    pricePerPost: 3800,
    verified: true,
    platforms: [
      { platform: 'twitch', handle: 'DavidMillerLive', followers: 480000, avgViews: 120000, engagementRate: 9.4, growthRate30d: 5.0, verified: true },
      { platform: 'youtube', handle: 'DavidMillerGaming', followers: 240000, avgViews: 50000, engagementRate: 8.2, growthRate30d: 3.1, verified: true },
      { platform: 'twitter', handle: '@davidm_gaming', followers: 100000, avgViews: 20000, engagementRate: 7.9, growthRate30d: 2.8, verified: true }
    ],
    audienceDemographics: {
      topCountries: [
        { country: 'United States', percentage: 52 },
        { country: 'Canada', percentage: 22 },
        { country: 'Germany', percentage: 10 },
        { country: 'Sweden', percentage: 8 },
        { country: 'Others', percentage: 8 }
      ],
      genderSplit: { male: 85, female: 13, other: 2 },
      ageDistribution: [
        { ageGroup: '18-24', percentage: 55 },
        { ageGroup: '25-34', percentage: 35 },
        { ageGroup: '35-44', percentage: 8 },
        { ageGroup: '45+', percentage: 2 }
      ]
    },
    pastBrands: ['Razer', 'Asus ROG', 'Monster Energy', 'Intel', 'Discord'],
    completedCampaigns: 39,
    rating: 4.85,
    reviewsCount: 33,
    portfolioSamples: [
      { title: '$10,000 Custom Liquid Cooled PC Build', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80', views: '540K', engagement: '9.8%', platform: 'Twitch' }
    ],
    growthHistory: [
      { month: 'Jan', followers: 750000, engagement: 8.2 },
      { month: 'Feb', followers: 765000, engagement: 8.4 },
      { month: 'Mar', followers: 780000, engagement: 8.5 },
      { month: 'Apr', followers: 795000, engagement: 8.7 },
      { month: 'May', followers: 810000, engagement: 8.8 },
      { month: 'Jun', followers: 820000, engagement: 8.9 }
    ]
  },
  {
    id: 'c6',
    name: 'Priya Sharma',
    handle: '@priyasharma_ai',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    bio: 'AI Researcher & Founder turned creator. Unpacking machine learning tools, SaaS growth strategies, and tech career insights on LinkedIn & YouTube.',
    location: 'San Francisco, USA',
    niche: ['AI', 'Software', 'Business', 'SaaS', 'Education'],
    languages: ['English', 'Hindi'],
    totalFollowers: 340000,
    avgViews: 95000,
    engagementRate: 11.2,
    brandSafetyScore: 100,
    authenticityScore: 98,
    influenceScore: 92,
    pricePerPost: 4500,
    verified: true,
    platforms: [
      { platform: 'linkedin', handle: 'priyasharma-ai', followers: 210000, avgViews: 65000, engagementRate: 12.1, growthRate30d: 8.4, verified: true },
      { platform: 'youtube', handle: 'PriyaSharmaAI', followers: 130000, avgViews: 30000, engagementRate: 9.8, growthRate30d: 6.0, verified: true }
    ],
    audienceDemographics: {
      topCountries: [
        { country: 'United States', percentage: 48 },
        { country: 'India', percentage: 28 },
        { country: 'United Kingdom', percentage: 12 },
        { country: 'Singapore', percentage: 6 },
        { country: 'Others', percentage: 6 }
      ],
      genderSplit: { male: 61, female: 37, other: 2 },
      ageDistribution: [
        { ageGroup: '18-24', percentage: 18 },
        { ageGroup: '25-34', percentage: 62 },
        { ageGroup: '35-44', percentage: 16 },
        { ageGroup: '45+', percentage: 4 }
      ]
    },
    pastBrands: ['Google Cloud', 'AWS', 'HubSpot', 'Linear', 'OpenAI'],
    completedCampaigns: 24,
    rating: 5.0,
    reviewsCount: 22,
    portfolioSamples: [
      { title: 'How We Scaled Our AI SaaS to $1M ARR', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=80', views: '280K', engagement: '13.4%', platform: 'LinkedIn' }
    ],
    growthHistory: [
      { month: 'Jan', followers: 240000, engagement: 10.1 },
      { month: 'Feb', followers: 260000, engagement: 10.4 },
      { month: 'Mar', followers: 280000, engagement: 10.7 },
      { month: 'Apr', followers: 300000, engagement: 10.9 },
      { month: 'May', followers: 320000, engagement: 11.1 },
      { month: 'Jun', followers: 340000, engagement: 11.2 }
    ]
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp1',
    brandId: 'b1',
    brandName: 'Nike',
    brandLogo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
    title: 'Air Max 2026 Innovation Showcase',
    category: 'Fashion & Fitness',
    budget: 50000,
    targetCountry: 'United States',
    targetGender: 'All',
    minFollowers: 500000,
    minEngagement: 6.0,
    platforms: ['instagram', 'tiktok'],
    deliverables: ['2 Instagram Reels', '3 TikTok Shorts', '1 Unboxing Story'],
    durationDays: 30,
    status: 'active',
    applicantsCount: 18,
    createdDate: '2026-07-15',
    description: 'We are launching the next-generation Air Max running sneakers with sustainable responsive foam. Looking for high-energy fitness, lifestyle, and fashion creators to highlight comfort and performance.'
  },
  {
    id: 'camp2',
    brandId: 'b2',
    brandName: 'Samsung',
    brandLogo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&auto=format&fit=crop&q=80',
    title: 'Galaxy S26 Ultra AI Productivity Challenge',
    category: 'Tech & Gadgets',
    budget: 75000,
    targetCountry: 'Global',
    targetGender: 'All',
    minFollowers: 300000,
    minEngagement: 5.5,
    platforms: ['youtube', 'instagram', 'linkedin'],
    deliverables: ['1 Dedicated YouTube Video', '2 Instagram Reels', '1 LinkedIn Tech Review'],
    durationDays: 45,
    status: 'active',
    applicantsCount: 29,
    createdDate: '2026-07-10',
    description: 'Seeking top tier tech and productivity creators to demonstrate the new multimodal AI features, zoom cameras, and real-time translation on the S26 Ultra flagship.'
  },
  {
    id: 'camp3',
    brandId: 'b3',
    brandName: 'boAt Audio',
    brandLogo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80',
    title: 'Summer Bass Head Headphones Launch',
    category: 'Audio & Lifestyle',
    budget: 30000,
    targetCountry: 'India & US',
    targetGender: 'All',
    minFollowers: 200000,
    minEngagement: 7.0,
    platforms: ['youtube', 'tiktok'],
    deliverables: ['1 YouTube Short', '2 TikTok Videos'],
    durationDays: 20,
    status: 'in_progress',
    applicantsCount: 12,
    createdDate: '2026-07-01',
    description: 'Promote our wireless active noise cancelling headphones with bass boost mode. Showcasing gym workouts, commuting, and travel.'
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off1',
    campaignId: 'camp1',
    campaignTitle: 'Air Max 2026 Innovation Showcase',
    brandId: 'b1',
    brandName: 'Nike',
    brandLogo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
    creatorId: 'c2',
    creatorName: 'Sophia Chen',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    amount: 5500,
    deliverables: ['2 Instagram Reels', '1 Story Set', '1 TikTok Video'],
    deadlineDays: 14,
    status: 'accepted',
    negotiationHistory: [
      { senderRole: 'brand', amount: 4800, deliverables: ['2 Instagram Reels', '1 Story Set'], timestamp: '2026-07-18 10:00', note: 'Initial Nike offer for Air Max Campaign' },
      { senderRole: 'creator', amount: 5500, deliverables: ['2 Instagram Reels', '1 Story Set', '1 TikTok Video'], timestamp: '2026-07-18 14:20', note: 'Can add 1 TikTok Video if amount is $5,500' },
      { senderRole: 'brand', amount: 5500, deliverables: ['2 Instagram Reels', '1 Story Set', '1 TikTok Video'], timestamp: '2026-07-19 09:15', note: 'Counter accepted! Generating agreement now.' }
    ],
    createdAt: '2026-07-18'
  },
  {
    id: 'off2',
    campaignId: 'camp2',
    campaignTitle: 'Galaxy S26 Ultra AI Productivity Challenge',
    brandId: 'b2',
    brandName: 'Samsung',
    brandLogo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&auto=format&fit=crop&q=80',
    creatorId: 'c1',
    creatorName: 'Alex Rivera',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    amount: 4200,
    deliverables: ['1 Dedicated YouTube Video', '1 Instagram Reel'],
    deadlineDays: 20,
    status: 'contract_generated',
    negotiationHistory: [
      { senderRole: 'brand', amount: 4200, deliverables: ['1 Dedicated YouTube Video', '1 Instagram Reel'], timestamp: '2026-07-20 11:30', note: 'Official offer for S26 Ultra video review.' }
    ],
    createdAt: '2026-07-20'
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'cnt1',
    offerId: 'off1',
    campaignTitle: 'Air Max 2026 Innovation Showcase',
    brandName: 'Nike Global Operations',
    creatorName: 'Sophia Chen',
    amount: 5500,
    deliverables: ['2 Instagram Reels featuring Air Max 2026', '1 Instagram Story Swipe-Up Link', '1 TikTok Style Video'],
    termsText: `COLLABORATION AGREEMENT
This agreement is made between Nike Global Operations ("Brand") and Sophia Chen ("Creator").

1. SCOPE OF WORK:
The Creator agrees to record, edit, and publish the following promotional deliverables:
- 2 Instagram Reels featuring Air Max 2026
- 1 Instagram Story set with official link
- 1 TikTok Style Video

2. COMPENSATION & ESCROW:
The Brand shall deposit $5,500 into the Platform Escrow account. Funds will be released upon Brand approval of submitted media drafts.

3. EXCLUSIVITY & IP:
The Creator shall not endorse competing sportswear footwear brands for 30 days following publication. Brand receives non-exclusive worldwide digital advertising rights for 90 days.

4. BRAND SAFETY:
Creator agrees content shall contain no profanity, violence, or political commentary.`,
    status: 'fully_signed',
    brandSigned: true,
    creatorSigned: true,
    brandSignDate: '2026-07-19 10:00',
    creatorSignDate: '2026-07-19 11:45',
    generatedAt: '2026-07-19'
  }
];

export const INITIAL_ESCROW: EscrowTransaction[] = [
  {
    id: 'esc1',
    campaignTitle: 'Air Max 2026 Innovation Showcase',
    brandName: 'Nike',
    creatorName: 'Sophia Chen',
    amount: 5500,
    status: 'held_in_escrow',
    fundedAt: '2026-07-19 10:05'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    conversationId: 'off1',
    senderId: 'b1',
    senderName: 'Nike Team',
    senderRole: 'brand',
    senderAvatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
    text: 'Hi Sophia! We loved your recent Paris lookbooks. We are excited to partner with you for the Air Max 2026 launch!',
    timestamp: '2026-07-18 10:02'
  },
  {
    id: 'm2',
    conversationId: 'off1',
    senderId: 'c2',
    senderName: 'Sophia Chen',
    senderRole: 'creator',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    text: 'Thank you! The Air Max design looks sleek. I submitted a small counter-offer including a TikTok short to increase reach.',
    timestamp: '2026-07-18 14:22'
  },
  {
    id: 'm3',
    conversationId: 'off1',
    senderId: 'b1',
    senderName: 'Nike Team',
    senderRole: 'brand',
    senderAvatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
    text: 'Counter approved! Money is deposited into Escrow. Please check the generated smart contract.',
    timestamp: '2026-07-19 09:16',
    attachment: {
      type: 'contract',
      title: 'Air Max 2026 Collaboration Agreement ($5,500)',
      meta: { contractId: 'cnt1' }
    }
  }
];

export const INITIAL_COLLAB_POSTS: CollabPost[] = [
  {
    id: 'post_1',
    authorId: 'c1',
    authorName: 'Alex Rivera',
    authorHandle: '@alexrivera_tech',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    authorNiche: 'Tech & AI',
    authorFollowers: 680000,
    authorLocation: 'San Francisco, USA',
    title: 'Looking for AI/SaaS Founder or Tech Creator for Podcast Dual-Stream',
    description: 'I am co-hosting a live YouTube & X Space episode discussing the future of agentic AI & developer tools in 2026. Looking for an energetic tech creator, developer advocate, or SaaS founder to join as a guest speaker. We will cross-post clips across both channels.',
    nicheCategory: 'Tech',
    targetPlatforms: ['YouTube', 'Podcast', 'Twitter'],
    followerRequirement: '50k+',
    collabType: 'Podcast Feature',
    compensationType: 'Equal Cross-Promo',
    estimatedValue: 'Cross-Promotion (240K avg views)',
    locationRequirement: 'Remote/Online',
    status: 'open',
    createdAt: '2026-08-04',
    requests: [
      {
        id: 'req_101',
        postId: 'post_1',
        applicantId: 'c3',
        applicantName: 'Marcus Vance',
        applicantHandle: '@marcus_vance_fitness',
        applicantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        applicantNiche: ['Tech', 'Fitness Tech'],
        applicantFollowers: 490000,
        pitchMessage: 'Hey Alex! I run a channel focused on smart wearables, biohacking AI & fitness SaaS. Would love to join for a segment on how AI is transforming fitness wearables!',
        proposedDate: '2026-08-15',
        collaborationValue: 'Equal YouTube & Instagram Cross-Promo',
        status: 'pending',
        createdAt: '2026-08-04 14:10'
      }
    ]
  },
  {
    id: 'post_2',
    authorId: 'c2',
    authorName: 'Sophia Chen',
    authorHandle: '@sophiastyle',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    authorNiche: 'Fashion & Lifestyle',
    authorFollowers: 1250000,
    authorLocation: 'New York, USA',
    title: 'NYC Street Style Lookbook Co-Creation & TikTok Swap',
    description: 'Planning a high-production NYC Autumn Street Style Lookbook video shoot in Soho. Looking for a fashion or luxury lifestyle creator in NYC to film a co-branded reel set and tag each other. Equipment and editor provided by my team!',
    nicheCategory: 'Fashion',
    targetPlatforms: ['Instagram', 'TikTok'],
    followerRequirement: '100k+',
    collabType: 'Co-Created Content',
    compensationType: 'Free Product Swap',
    estimatedValue: '$1,200 Production Value + Cross-Promo',
    locationRequirement: 'In-Person (New York City)',
    status: 'open',
    createdAt: '2026-08-03',
    requests: [
      {
        id: 'req_102',
        postId: 'post_2',
        applicantId: 'c4',
        applicantName: 'Maya Patel',
        applicantHandle: '@mayapatel_beauty',
        applicantAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
        applicantNiche: ['Beauty', 'Fashion'],
        applicantFollowers: 820000,
        pitchMessage: 'Hi Sophia! I live in Soho and would love to collaborate on the autumn lookbook shoot! I can also handle the glam/makeup setup for both of us.',
        proposedDate: '2026-08-12',
        collaborationValue: 'TikTok & Reel Tagging to 820k audience',
        status: 'pending',
        createdAt: '2026-08-04 09:30'
      }
    ]
  },
  {
    id: 'post_3',
    authorId: 'c3',
    authorName: 'Marcus Vance',
    authorHandle: '@marcus_vance_fitness',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    authorNiche: 'Fitness & Health',
    authorFollowers: 490000,
    authorLocation: 'Austin, USA',
    title: '30-Day Creator Fitness Challenge & Vlog Guest Swap',
    description: 'Launching a 30-Day Hybrid Athlete Transformation Challenge. Want to partner with an active lifestyle or gaming creator who wants to improve their fitness journey on camera. Great content series for YouTube!',
    nicheCategory: 'Fitness',
    targetPlatforms: ['YouTube', 'Instagram'],
    followerRequirement: '25k+',
    collabType: 'Cross-Promotion',
    compensationType: 'Paid Sponsorship',
    estimatedValue: '$800 Creator Stipend + Free Coaching',
    locationRequirement: 'Remote/Online',
    status: 'open',
    createdAt: '2026-08-02',
    requests: []
  },
  {
    id: 'post_4',
    authorId: 'c4',
    authorName: 'Maya Patel',
    authorHandle: '@mayapatel_beauty',
    authorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    authorNiche: 'Beauty & Skincare',
    authorFollowers: 820000,
    authorLocation: 'Los Angeles, USA',
    title: 'Clean Beauty Brand Testing & Live Unboxing Duel',
    description: 'Received a massive PR box of eco-certified organic skincare products. Looking for a fellow beauty enthusiast or dermatologist creator to host an unbiased live review and giveaway for our audiences!',
    nicheCategory: 'Beauty',
    targetPlatforms: ['Instagram', 'TikTok'],
    followerRequirement: '50k+',
    collabType: 'Guest Appearance',
    compensationType: 'Free Product Swap',
    estimatedValue: '$500 PR Skincare Kit',
    locationRequirement: 'Remote/Online',
    status: 'open',
    createdAt: '2026-08-01',
    requests: []
  }
]
export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app_1',
    campaignId: 'camp1',
    brandId: 'b1',
    creatorId: 'c1',
    initiatedBy: 'creator',
    status: 'pending',
    message: 'Hi Nike Team! I have 680k tech & active lifestyle followers. Would love to feature the Air Max 2026 foam tech in a high-production video reel.',
    creatorDecision: { accepted: true, decidedAt: '2026-08-01 10:00' },
    brandDecision: { accepted: null },
    contractId: null,
    createdAt: '2026-08-01 10:00',
    updatedAt: '2026-08-01 10:00',
    campaignTitle: 'Air Max 2026 Innovation Showcase',
    brandName: 'Nike',
    brandLogo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
    creatorName: 'Alex Rivera',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    budget: 50000,
    deliverables: ['2 Instagram Reels', '3 TikTok Shorts', '1 Unboxing Story']
  },
  {
    id: 'app_2',
    campaignId: 'camp2',
    brandId: 'b2',
    creatorId: 'c2',
    initiatedBy: 'brand',
    status: 'pending',
    message: 'We would love to invite you to present the Galaxy S26 Ultra design in your upcoming NYC lifestyle vlog series.',
    creatorDecision: { accepted: null },
    brandDecision: { accepted: true, decidedAt: '2026-08-01 09:00' },
    contractId: null,
    createdAt: '2026-08-01 09:00',
    updatedAt: '2026-08-01 09:00',
    campaignTitle: 'Galaxy S26 Ultra AI Productivity Challenge',
    brandName: 'Samsung',
    brandLogo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&auto=format&fit=crop&q=80',
    creatorName: 'Sophia Chen',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    budget: 75000,
    deliverables: ['1 Dedicated YouTube Video', '2 Instagram Reels']
  },
  {
    id: 'app_3',
    campaignId: 'camp1',
    brandId: 'b1',
    creatorId: 'c2',
    initiatedBy: 'creator',
    status: 'matched',
    message: 'Exclusive fashion lookbook featuring Air Max sneakers in NYC.',
    creatorDecision: { accepted: true, decidedAt: '2026-07-18 10:00' },
    brandDecision: { accepted: true, decidedAt: '2026-07-18 11:00' },
    contractId: 'cnt1',
    createdAt: '2026-07-18 10:00',
    updatedAt: '2026-07-18 11:00',
    campaignTitle: 'Air Max 2026 Innovation Showcase',
    brandName: 'Nike',
    brandLogo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
    creatorName: 'Sophia Chen',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    budget: 5500,
    deliverables: ['2 Instagram Reels', '1 Story Set', '1 TikTok Video']
  }
];


