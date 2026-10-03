export interface OnboardingUser {
  id?: string;
  _id?: string;
  firebaseUid: string;
  email: string;
  role: 'brand' | 'creator' | 'agency' | 'admin';
  isVerified: boolean;
  onboardingCompleted: boolean;
  status: 'active' | 'suspended' | 'pending';

  fullName: string;
  username: string;
  bio?: string;
  phone?: string;
  country?: string;
  city?: string;
  language?: string;
  profilePhoto?: string;
  coverPhoto?: string;
  gender?: string;
  dateOfBirth?: string;

  category?: string;
  collaborationInterests?: string[];
  preferredBrands?: string[];
  collaborationRates?: {
    post?: number;
    reel?: number;
    story?: number;
    video?: number;
  };
  portfolioLinks?: string[];

  socialAccounts?: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };

  creatorStats?: {
    followersCount?: number;
    subscribersCount?: number;
    engagementRate?: number;
    avgViews?: number;
    audienceCountry?: string;
    audienceGender?: string;
    audienceAge?: string;
    niche?: string[];
  };

  verification?: {
    status: 'unverified' | 'pending' | 'verified' | 'failed';
    timestamp?: string;
    apiResults?: any;
    notes?: string;
  };

  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface AuthContextType {
  user: OnboardingUser | null;
  loading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserInState: (updatedUser: OnboardingUser) => void;
}
