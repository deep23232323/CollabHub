export type UserRole = 'brand' | 'creator' | 'agency' | 'admin';

export interface SocialPlatformData {
  platform: 'instagram' | 'youtube' | 'tiktok' | 'twitch' | 'twitter' | 'linkedin';
  handle: string;
  followers: number;
  avgViews: number;
  engagementRate: number;
  growthRate30d: number;
  verified: boolean;
}

export interface AudienceDemographics {
  topCountries: { country: string; percentage: number }[];
  genderSplit: { male: number; female: number; other: number };
  ageDistribution: { ageGroup: string; percentage: number }[];
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  location: string;
  niche: string[];
  languages: string[];
  totalFollowers: number;
  avgViews: number;
  engagementRate: number;
  brandSafetyScore: number; // 0 - 100
  authenticityScore: number; // 0 - 100 (Fake follower detection)
  influenceScore: number; // 0 - 100
  pricePerPost: number;
  verified: boolean;
  platforms: SocialPlatformData[];
  audienceDemographics: AudienceDemographics;
  pastBrands: string[];
  completedCampaigns: number;
  rating: number; // 1 - 5
  reviewsCount: number;
  portfolioSamples: { title: string; image: string; views: string; engagement: string; platform: string }[];
  growthHistory: { month: string; followers: number; engagement: number }[];
}

export interface Campaign {
  id: string;
  brandId: string;
  brandName: string;
  brandLogo: string;
  title: string;
  category: string;
  budget: number;
  targetCountry: string;
  targetGender: string;
  minFollowers: number;
  minEngagement: number;
  platforms: string[];
  deliverables: string[];
  durationDays: number;
  status: 'draft' | 'active' | 'in_progress' | 'completed';
  applicantsCount: number;
  createdDate: string;
  description: string;
}

export interface Offer {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandId: string;
  brandName: string;
  brandLogo: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  amount: number;
  deliverables: string[];
  deadlineDays: number;
  status: 'pending' | 'countered' | 'accepted' | 'rejected' | 'contract_generated' | 'completed';
  negotiationHistory: {
    senderRole: 'brand' | 'creator';
    amount: number;
    deliverables: string[];
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
}

export interface Contract {
  id: string;
  offerId: string;
  campaignTitle: string;
  brandName: string;
  creatorName: string;
  amount: number;
  deliverables: string[];
  termsText: string;
  status: 'pending_signatures' | 'fully_signed' | 'fulfilled';
  brandSigned: boolean;
  creatorSigned: boolean;
  brandSignDate?: string;
  creatorSignDate?: string;
  generatedAt: string;
}

export interface EscrowTransaction {
  id: string;
  campaignTitle: string;
  brandName: string;
  creatorName: string;
  amount: number;
  status: 'funded' | 'held_in_escrow' | 'released' | 'disputed';
  fundedAt: string;
  releasedAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  text: string;
  timestamp: string;
  attachment?: {
    type: 'contract' | 'image' | 'video' | 'offer';
    title: string;
    url?: string;
    meta?: any;
  };
}

export interface DeliverableSubmission {
  id: string;
  offerId: string;
  creatorId: string;
  mediaUrl: string;
  captionText: string;
  submittedAt: string;
  aiModerationStatus: 'pending' | 'passed' | 'revision_required';
  aiModerationNotes?: string[];
  brandApprovalStatus: 'pending' | 'approved' | 'revision_requested';
}

export interface AIMatchRequest {
  brandGoal: string;
  niche: string;
  targetCountry: string;
  minFollowers: number;
  minEngagement: number;
  budget: number;
}

export interface AIMatchResult {
  creators: {
    creatorId: string;
    similarityScore: number;
    audienceMatchPercent: number;
    estimatedReach: string;
    predictedROI: string;
    matchReason: string;
  }[];
  summary: string;
}

export interface CollabRequest {
  id: string;
  postId: string;
  applicantId: string;
  applicantName: string;
  applicantHandle: string;
  applicantAvatar: string;
  applicantNiche: string[];
  applicantFollowers: number;
  pitchMessage: string;
  proposedDate?: string;
  collaborationValue: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  responseNote?: string;
}

export interface CollabPost {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorNiche: string;
  authorFollowers: number;
  authorLocation: string;
  title: string;
  description: string;
  nicheCategory: string;
  targetPlatforms: string[];
  followerRequirement: string;
  collabType: 'Cross-Promotion' | 'Co-Created Content' | 'Guest Appearance' | 'Podcast Feature' | 'Shoutout Swap';
  compensationType: 'Paid Sponsorship' | 'Revenue Share' | 'Free Product Swap' | 'Equal Cross-Promo';
  estimatedValue: string;
  locationRequirement: string;
  status: 'open' | 'in_collaboration' | 'closed';
  createdAt: string;
  requests: CollabRequest[];
}

export interface InstagramTokenResponse {
  access_token: string;
  user_id: string;
  permissions?: string[];
}

export interface InstagramLongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface InstagramProfile {
  id: string;
  username: string;
  account_type: 'BUSINESS' | 'MEDIA_CREATOR' | 'PERSONAL';
  media_count: number;
  followers_count?: number;
}

export interface InstagramMediaItem {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

export interface InstagramMediaResponse {
  data: InstagramMediaItem[];
}

export interface InstagramMetrics {
  avgLikes: number;
  avgComments: number;
  engagementRate: string;
  postsAnalyzed: number;
}

export interface InstagramFetchResult {
  profile: InstagramProfile;
  metrics: InstagramMetrics;
  recentPosts: InstagramMediaItem[];
}

export interface SocialVerificationItem {
  verified: boolean;
  verifiedAt?: string;
  method?: 'oauth' | 'bio_code';
  code?: string;
}

export interface SocialVerificationMap {
  instagram?: SocialVerificationItem;
  youtube?: SocialVerificationItem;
  tiktok?: SocialVerificationItem;
  twitter?: SocialVerificationItem;
}

export interface Application {
  id: string;
  campaignId: string;
  brandId: string;
  creatorId: string;
  initiatedBy: 'creator' | 'brand';
  status: 'pending' | 'creatorAccepted' | 'brandAccepted' | 'matched' | 'rejectedByCreator' | 'rejectedByBrand';
  message: string;
  creatorDecision: { accepted: boolean | null; decidedAt?: string };
  brandDecision: { accepted: boolean | null; decidedAt?: string };
  contractId?: string | null;
  createdAt: string;
  updatedAt: string;

  // Metadata properties for UI convenience
  campaignTitle?: string;
  brandName?: string;
  brandLogo?: string;
  creatorName?: string;
  creatorAvatar?: string;
  budget?: number;
  deliverables?: string[];
}