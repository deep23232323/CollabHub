import express, { Response } from 'express';
import jwt from 'jsonwebtoken';
import { getFirebaseAdmin, getAuth } from '../config/firebaseAdmin';
import { findOrCreateUser, findUserById } from '../models/User';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = express.Router();

// 1. Google Auth Endpoint
router.post('/google', async (req: express.Request, res: Response) => {
  try {
    console.log("entered")
    const { idToken, user: bodyUser } = req.body;

    // Default user parameters (can be overridden by token or body user)
    let firebaseUid = bodyUser?.uid || bodyUser?.firebaseUid || 'user_' + Date.now();
    let email = bodyUser?.email || bodyUser?.displayName?.toLowerCase().replace(/\s+/g, '') + '@gmail.com' || 'google.creator@influencerpulse.io';
    let name = bodyUser?.displayName || bodyUser?.name || 'Google Creator';
    let avatar = bodyUser?.photoURL || bodyUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';

    if (idToken && typeof idToken === 'string' && !idToken.startsWith('mock_')) {
      try {
        const adminApp = getFirebaseAdmin();
        if (adminApp) {
          const decodedToken = await getAuth(adminApp).verifyIdToken(idToken);
          firebaseUid = decodedToken.uid || firebaseUid;
          email = decodedToken.email || `${firebaseUid}@firebase.user`;
          name = decodedToken.name || decodedToken.email?.split('@')[0] || name;
          avatar = decodedToken.picture || avatar;
        }
      } catch (verErr: any) {
        console.warn('Firebase Admin verification notice:', verErr?.message);
        try {
          const decoded = jwt.decode(idToken) as any;
          if (decoded && typeof decoded === 'object') {
            firebaseUid = decoded.sub || decoded.user_id || firebaseUid;
            email = decoded.email || email;
            name = decoded.name || email.split('@')[0] || name;
            avatar = decoded.picture || avatar;
          }
        } catch (decErr) {
          console.warn('Could not decode JWT payload, proceeding with client info');
        }
      }
    }

    // Find or create user in MongoDB / Memory Store
    const user = await findOrCreateUser({
      email,
      name,
      avatar,
      firebaseUid
    });

    console.log(" user", user)
    // Create Application JWT
    const jwtSecret = process.env.JWT_SECRET || 'creatorpulse_super_secret_jwt_key_2026';
    const appToken = jwt.sign(
      {
        id: user.id || user._id,
        email: user.email,
        fullName: user.fullName,
        profilePhoto: user.profilePhoto,
        role: user.role,
        firebaseUid: user.firebaseUid
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Set HTTP-Only Cookie
    res.cookie('token', appToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.json({
      success: true,
      message: 'Google login successful',
      token: appToken,
      user
    });
 } catch (error: any) {
  console.error('Google Auth Route Error:', error);
  return res.status(500).json({ success: false, error: error?.message || 'Google login failed' });
}
});

// 1b. Demo Instant Login Endpoint (for easy preview testing)
router.post('/demo', async (req: express.Request, res: Response) => {
  try {
    const { role = 'creator' } = req.body;
    const email = `demo_${role}@creatorpulse.io`;
    const name = role === 'brand' ? 'Nike Sponsor' : role === 'agency' ? 'Pulse Talent Agency' : 'Sarah Jenkins';
    const avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
    const firebaseUid = `demo_${role}_uid_12345`;

    const user = await findOrCreateUser({
      email,
      name,
      avatar,
      firebaseUid
    });

    const jwtSecret = process.env.JWT_SECRET || 'creatorpulse_super_secret_jwt_key_2026';
    const appToken = jwt.sign(
      {
        id: user.id || user._id,
        email: user.email,
        fullName: user.fullName,
        profilePhoto: user.profilePhoto,
        role: user.role,
        firebaseUid: user.firebaseUid
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.cookie('token', appToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      message: 'Demo login successful',
      token: appToken,
      user
    });
  } catch (error: any) {
    console.error('Demo Login Error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Demo login failed' });
  }
});

// 2. Get Current Authenticated User
router.get('/me', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const freshUser = await findUserById(req.user.id);
    return res.json({
      success: true,
      user: freshUser || req.user
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// 2b. Update Creator Profile (Allows updating personal info, locks Instagram synced stats)
router.put('/profile', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userId = req.user.id || req.user.firebaseUid;
    const {
      fullName,
      phone,
      country,
      city,
      language,
      dateOfBirth,
      gender,
      bio,
      category,
      collaborationRates,
      profilePhoto,
      coverPhoto
    } = req.body;

    // Build update object only with safe editable fields
    const editableData: Record<string, any> = {};
    if (fullName !== undefined) editableData.fullName = fullName;
    if (phone !== undefined) editableData.phone = phone;
    if (country !== undefined) editableData.country = country;
    if (city !== undefined) editableData.city = city;
    if (language !== undefined) editableData.language = language;
    if (dateOfBirth !== undefined) editableData.dateOfBirth = dateOfBirth;
    if (gender !== undefined) editableData.gender = gender;
    if (bio !== undefined) editableData.bio = bio;
    if (category !== undefined) editableData.category = category;
    if (collaborationRates !== undefined) editableData.collaborationRates = collaborationRates;
    if (profilePhoto !== undefined) editableData.profilePhoto = profilePhoto;
    if (coverPhoto !== undefined) editableData.coverPhoto = coverPhoto;

    const { updateUserAnywhere } = await import('../models/User');
    const updatedUser = await updateUserAnywhere(userId, editableData);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ error: 'Failed to update user profile', details: error.message });
  }
});

// 3. Logout Endpoint
router.post('/logout', (req: express.Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  return res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router;
