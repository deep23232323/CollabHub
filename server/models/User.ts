import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISocialAccount {
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export interface ICreatorStats {
  followersCount?: number;
  subscribersCount?: number;
  engagementRate?: number;
  avgViews?: number;
  audienceCountry?: string;
  audienceGender?: string;
  audienceAge?: string;
  niche?: string[];
}

export interface IVerificationData {
  status: 'unverified' | 'pending' | 'verified' | 'failed';
  timestamp?: Date;
  apiResults?: any;
  notes?: string;
}

export interface IUser {
  id?: string;
  _id?: string;
  firebaseUid: string;
  email: string;
  provider?: string;
  role: 'brand' | 'creator' | 'agency' | 'admin';
  isVerified: boolean;
  onboardingCompleted: boolean;
  status: 'active' | 'suspended' | 'pending';
  
  // Personal
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

  // Onboarding metadata
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

  // Socials
  socialAccounts?: ISocialAccount;

  // Stats
  creatorStats?: ICreatorStats;

  // Verification
  verification?: IVerificationData;

  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export interface IUserDocument extends Document {
  firebaseUid: string;
  email: string;
  provider: string;
  role: 'brand' | 'creator' | 'agency' | 'admin';
  isVerified: boolean;
  onboardingCompleted: boolean;
  status: 'active' | 'suspended' | 'pending';

  fullName: string;
  username: string;
  bio: string;
  phone: string;
  country: string;
  city: string;
  language: string;
  profilePhoto: string;
  coverPhoto: string;
  gender: string;
  dateOfBirth: string;

  category: string;
  collaborationInterests: string[];
  preferredBrands: string[];
  collaborationRates: {
    post: number;
    reel: number;
    story: number;
    video: number;
  };
  portfolioLinks: string[];

  socialAccounts: ISocialAccount;
  creatorStats: ICreatorStats;
  verification: IVerificationData;

  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
}

const UserSchema: Schema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    provider: { type: String, default: 'google.com' },
    role: { type: String, enum: ['brand', 'creator', 'agency', 'admin'], default: 'creator' },
    isVerified: { type: Boolean, default: false },
    onboardingCompleted: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'suspended', 'pending'], default: 'active' },

    fullName: { type: String, default: '' },
    username: { type: String, default: '' },
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    country: { type: String, default: '' },
    city: { type: String, default: '' },
    language: { type: String, default: 'English' },
    profilePhoto: { type: String, default: '' },
    coverPhoto: { type: String, default: '' },
    gender: { type: String, default: '' },
    dateOfBirth: { type: String, default: '' },

    category: { type: String, default: 'Lifestyle' },
    collaborationInterests: { type: [String], default: [] },
    preferredBrands: { type: [String], default: [] },
    collaborationRates: {
      post: { type: Number, default: 0 },
      reel: { type: Number, default: 0 },
      story: { type: Number, default: 0 },
      video: { type: Number, default: 0 }
    },
    portfolioLinks: { type: [String], default: [] },

    socialAccounts: {
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' }
    },

    creatorStats: {
      followersCount: { type: Number, default: 0 },
      subscribersCount: { type: Number, default: 0 },
      engagementRate: { type: Number, default: 0 },
      avgViews: { type: Number, default: 0 },
      audienceCountry: { type: String, default: 'United States' },
      audienceGender: { type: String, default: '55% Female / 45% Male' },
      audienceAge: { type: String, default: '18-34' },
      niche: { type: [String], default: ['Lifestyle'] }
    },

    verification: {
      status: { type: String, enum: ['unverified', 'pending', 'verified', 'failed'], default: 'unverified' },
      timestamp: { type: Date },
      apiResults: { type: Schema.Types.Mixed, default: {} },
      notes: { type: String, default: '' }
    },

    lastLogin: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const UserModel: Model<IUserDocument> = (mongoose.models.User as Model<IUserDocument>) || mongoose.model<IUserDocument>('User', UserSchema);

// In-Memory store for fast fallback when MongoDB server is offline
const memoryUsersStore: Map<string, IUser> = new Map();

function docToUser(doc: IUserDocument): IUser {
  const idStr = doc._id ? doc._id.toString() : ((doc as any).id || `usr_${Date.now()}`);
  return {
    id: idStr,
    _id: idStr,
    firebaseUid: doc.firebaseUid,
    email: doc.email,
    provider: doc.provider,
    role: doc.role,
    isVerified: doc.isVerified,
    onboardingCompleted: doc.onboardingCompleted,
    status: doc.status,
    fullName: doc.fullName,
    username: doc.username,
    bio: doc.bio,
    phone: doc.phone,
    country: doc.country,
    city: doc.city,
    language: doc.language,
    profilePhoto: doc.profilePhoto,
    coverPhoto: doc.coverPhoto,
    gender: doc.gender,
    dateOfBirth: doc.dateOfBirth,
    category: doc.category,
    collaborationInterests: doc.collaborationInterests,
    preferredBrands: doc.preferredBrands,
    collaborationRates: doc.collaborationRates,
    portfolioLinks: doc.portfolioLinks,
    socialAccounts: doc.socialAccounts,
    creatorStats: doc.creatorStats,
    verification: doc.verification,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    lastLogin: doc.lastLogin
  };
}

export async function findOrCreateUser({
  email,
  name,
  avatar,
  firebaseUid,
  provider = 'google.com'
}: {
  email: string;
  name: string;
  avatar?: string;
  firebaseUid: string;
  provider?: string;
}): Promise<IUser> {
  const now = new Date();
  
  if (mongoose.connection.readyState === 1) {
    try {
      let user = await UserModel.findOne({
        $or: [{ firebaseUid: firebaseUid }, { email: email }]
      } as any);

      if (!user) {
        const generatedUsername = (email.split('@')[0] || 'creator') + Math.floor(1000 + Math.random() * 9000);
        user = await UserModel.create({
          email,
          fullName: name,
          username: generatedUsername,
          profilePhoto: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          firebaseUid,
          provider,
          role: 'creator',
          onboardingCompleted: false,
          isVerified: false,
          status: 'active',
          lastLogin: now
        });
      } else {
        if (name && (!user.fullName || user.fullName === 'Google User')) user.fullName = name;
        if (avatar && !user.profilePhoto) user.profilePhoto = avatar;
        user.lastLogin = now;
        await user.save();
      }
      console.log("saved")
      return docToUser(user);
    } catch (err) {
      console.warn('Mongoose query failed, using in-memory store fallback:', err);
    }
  }

  // Fallback to memory store
  let existing = memoryUsersStore.get(email) || Array.from(memoryUsersStore.values()).find(u => u.firebaseUid === firebaseUid);
  if (!existing) {
    const generatedUsername = (email.split('@')[0] || 'creator') + Math.floor(1000 + Math.random() * 9000);
    existing = {
      id: `usr_${Date.now()}`,
      _id: `usr_${Date.now()}`,
      email,
      fullName: name,
      username: generatedUsername,
      profilePhoto: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      firebaseUid,
      provider,
      role: 'creator',
      onboardingCompleted: false,
      isVerified: false,
      status: 'active',
      socialAccounts: { instagram: '', youtube: '', tiktok: '', twitter: '', linkedin: '', website: '' },
      creatorStats: { followersCount: 0, subscribersCount: 0, engagementRate: 0, avgViews: 0, niche: ['Lifestyle'] },
      verification: { status: 'unverified' },
      createdAt: now,
      updatedAt: now,
      lastLogin: now
    };
    memoryUsersStore.set(email, existing);
  } else {
    existing.fullName = name || existing.fullName;
    if (avatar) existing.profilePhoto = avatar;
    existing.lastLogin = now;
    existing.updatedAt = now;
  }

  return existing;
}

export async function findUserById(id: string): Promise<IUser | null> {
  if (!id) return null;
  if (mongoose.connection.readyState === 1) {
    try {
      const isObjId = mongoose.Types.ObjectId.isValid(id);
      const query = isObjId
        ? { $or: [{ _id: id }, { firebaseUid: id }, { email: id }] }
        : { $or: [{ firebaseUid: id }, { email: id }] };
      const u = await UserModel.findOne(query as any);
      if (u) return docToUser(u);
    } catch (e) {
      console.warn('Mongoose findUserById failed:', e);
    }
  }

  for (const user of memoryUsersStore.values()) {
    if (user.id === id || user._id === id || user.email === id || user.firebaseUid === id) return user;
  }
  return null;
}

export async function findUserByFirebaseUid(firebaseUid: string): Promise<IUser | null> {
  return findUserById(firebaseUid);
}

export async function updateUserAnywhere(
  idOrUid: string,
  updateData: Partial<IUser>
): Promise<IUser | null> {
  if (!idOrUid) return null;
  if (mongoose.connection.readyState === 1) {
    try {
      const isObjId = mongoose.Types.ObjectId.isValid(idOrUid);
      const query = isObjId
        ? { $or: [{ _id: idOrUid }, { firebaseUid: idOrUid }, { email: idOrUid }] }
        : { $or: [{ firebaseUid: idOrUid }, { email: idOrUid }] };

      const updateFields: Record<string, any> = {};
      for (const [key, val] of Object.entries(updateData)) {
        if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
          for (const [subKey, subVal] of Object.entries(val)) {
            updateFields[`${key}.${subKey}`] = subVal;
          }
        } else {
          updateFields[key] = val;
        }
      }

      const u = await UserModel.findOneAndUpdate(
        query as any,
        { $set: updateFields },
        { returnDocument: 'after' }
      );
      if (u) return docToUser(u);
    } catch (e) {
      console.warn('Mongoose updateUserAnywhere failed:', e);
    }
  }

  // Fallback: in-memory store
  const user = await findUserById(idOrUid);
  if (user) {
    if (updateData.socialAccounts) {
      user.socialAccounts = { ...user.socialAccounts, ...updateData.socialAccounts };
    }
    if (updateData.creatorStats) {
      user.creatorStats = { ...user.creatorStats, ...updateData.creatorStats };
    }
    if (updateData.verification) {
      user.verification = { ...user.verification, ...updateData.verification };
    }
    Object.assign(user, updateData, {
      socialAccounts: user.socialAccounts,
      creatorStats: user.creatorStats,
      verification: user.verification,
      updatedAt: new Date()
    });
    if (user.email) memoryUsersStore.set(user.email, user);
    return user;
  }
  return null;
}

export async function updateUserByFirebaseUid(
  firebaseUid: string,
  updateData: Partial<IUser>
): Promise<IUser | null> {
  return updateUserAnywhere(firebaseUid, updateData);
}

export async function updateUserProfile(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
  return updateUserAnywhere(id, updateData);
}

