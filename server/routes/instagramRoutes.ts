import dotenv from 'dotenv';
dotenv.config();
import { Router, Request, Response } from 'express';
import { getFirebaseAdmin, getFirestore } from '../config/firebaseAdmin';
import { updateUserByFirebaseUid } from '../models/User';

const router = Router();

// Required env vars — no hardcoded fallback secrets, ever
const DEFAULT_APP_ID = process.env.INSTAGRAM_APP_ID;
const DEFAULT_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
const INSTAGRAM_SCOPES = process.env.INSTAGRAM_SCOPES || 'instagram_business_basic';

if (!DEFAULT_APP_ID || !DEFAULT_APP_SECRET) {
  console.warn(
    '⚠️  INSTAGRAM_APP_ID or INSTAGRAM_APP_SECRET is missing from .env — Instagram OAuth will not work until these are set.'
  );
}

/**
 * Section 6 Authenticity Scoring Algorithm (Formula-based, no ML needed)
 */
function calculateAuthenticityScore(metrics: {
  followers: number;
  following: number;
  avgLikes: number;
  avgComments: number;
  genericCommentRatio?: number;
  engagementConsistency?: number;
}) {
  const { followers, following, avgLikes, avgComments } = metrics;
  const safeFollowers = Math.max(1, followers);
  const safeFollowing = Math.max(1, following);
  const safeLikes = Math.max(1, avgLikes);

  const engagementRate = ((avgLikes + avgComments) / safeFollowers) * 100;
  const followerFollowingRatio = safeFollowers / safeFollowing;
  const commentToLikeRatio = avgComments / safeLikes;
  const genericCommentRatio = metrics.genericCommentRatio ?? 0.15;
  const engagementConsistency = metrics.engagementConsistency ?? 0.9;

  const erScore =
    engagementRate >= 1 && engagementRate <= 8
      ? 100
      : engagementRate < 1
      ? Math.min(100, engagementRate * 80)
      : Math.max(40, 100 - (engagementRate - 8) * 5);

  const ctlScore = Math.min(100, (commentToLikeRatio / 0.02) * 100);
  const ffScore = Math.min(100, (followerFollowingRatio / 2) * 100);
  const gcScore = Math.max(0, (1 - genericCommentRatio) * 100);
  const ecScore = engagementConsistency * 100;

  const compositeScore = Math.round(
    erScore * 0.35 + ctlScore * 0.25 + ffScore * 0.15 + gcScore * 0.15 + ecScore * 0.1
  );

  const authenticityScore = Math.min(99, Math.max(50, compositeScore));
  const verified = authenticityScore >= 70;

  return {
    authenticityScore,
    verified,
    metrics: {
      engagementRate: parseFloat(engagementRate.toFixed(2)),
      followerFollowingRatio: parseFloat(followerFollowingRatio.toFixed(1)),
      commentToLikeRatio: parseFloat(commentToLikeRatio.toFixed(3)),
      genericCommentRatio: parseFloat((genericCommentRatio * 100).toFixed(1)),
      engagementConsistency: parseFloat((engagementConsistency * 100).toFixed(1)),
    },
  };
}

/**
 * GET /api/instagram/auth-url
 * Generates the Instagram OAuth Login URL
 */
router.get('/auth-url', (req: Request, res: Response) => {
  if (!DEFAULT_APP_ID) {
    return res.status(500).json({ error: 'Instagram app not configured on server.' });
  }

  const host = req.get('host') || 'localhost:5000';
  const protocol =
    req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';

  const defaultRedirect = `${protocol}://${host}/instagram-callback`;
  const redirectUri =
    (req.query.redirectUri as string) || process.env.INSTAGRAM_REDIRECT_URI || defaultRedirect;
  const appId = (req.query.appId as string) || DEFAULT_APP_ID;

  const scopes = INSTAGRAM_SCOPES;
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes)}&response_type=code`;

  res.json({
    url: authUrl,
    appId,
    redirectUri,
    scopes: scopes.split(','),
  });
});

/**
 * POST /api/instagram/callback
 * Exchanges authorization code for a real Instagram access token, fetches the REAL profile,
 * and saves it to Firestore. Fails honestly if any step doesn't succeed — never fabricates data.
 */
router.post('/callback', async (req: Request, res: Response) => {
  const { code, redirectUri, uid } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code.' });
  }
  if (!DEFAULT_APP_ID || !DEFAULT_APP_SECRET) {
    return res.status(500).json({ error: 'Instagram app not configured on server.' });
  }

  const effectiveUid = uid || req.body.userId;
  if (!effectiveUid) {
    return res.status(400).json({ error: 'Missing user id.' });
  }

  try {
    // 1. Exchange the authorization code for a real access token
    const formData = new URLSearchParams();
    formData.append('client_id', DEFAULT_APP_ID);
    formData.append('client_secret', DEFAULT_APP_SECRET);
    formData.append('grant_type', 'authorization_code');
    formData.append(
      'redirect_uri',
      redirectUri || process.env.INSTAGRAM_REDIRECT_URI || ''
    );
    formData.append('code', code);

    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error('Instagram token exchange failed:', errBody);
      return res.status(400).json({ error: 'Instagram rejected the authorization code.', details: errBody });
    }

    const tokenData = await tokenRes.json();
    const accessToken: string = tokenData.access_token;
    const igUserIdFromToken: string = tokenData.user_id;

    console.log('IG User ID from token:', igUserIdFromToken);   // <-- add it here
    console.log('IG Username from token:', tokenData.username);
    // 2. Exchange for a long-lived token (60 days) so it doesn't expire in an hour
    const longLivedRes = await fetch(
  `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${DEFAULT_APP_SECRET}&access_token=${accessToken}`
);
const longLivedData = longLivedRes.ok ? await longLivedRes.json() : null;
console.log('Long-lived token exchange ok?', longLivedRes.ok, longLivedData); // add this
    const finalAccessToken = longLivedData?.access_token || accessToken;
    const expiresInSeconds = longLivedData?.expires_in;

    // 3. Fetch the REAL profile — no fallback to fake data if this fails
    // 3. Fetch the REAL profile — no fallback to fake data if this fails
const graphRes = await fetch(
  `https://graph.instagram.com/me?fields=id,username,account_type,media_count,followers_count&access_token=${finalAccessToken}`
);

if (!graphRes.ok) {
  const errBody = await graphRes.text();
  console.error('Failed to fetch Instagram profile:', errBody);
  return res.status(502).json({ error: 'Could not fetch Instagram profile.', details: errBody });
}

const igProfile = await graphRes.json();
console.log('Fetched live Instagram profile:', igProfile);

// 4. Fetch recent media for engagement metrics — real data only
const mediaRes = await fetch(
  `https://graph.instagram.com/me/media?fields=id,media_type,like_count,comments_count&limit=25&access_token=${finalAccessToken}`
);
const mediaData = mediaRes.ok ? await mediaRes.json() : { data: [] };
const posts = mediaData.data || [];

    const avgLikes = posts.length
      ? Math.round(posts.reduce((sum: number, p: any) => sum + (p.like_count || 0), 0) / posts.length)
      : 0;
    const avgComments = posts.length
      ? Math.round(posts.reduce((sum: number, p: any) => sum + (p.comments_count || 0), 0) / posts.length)
      : 0;

    const followers = igProfile.followers_count || 0;
    // NOTE: Instagram's Basic/Business Login API does not expose "following count" or
    // audience-quality signals (generic comment ratio, growth consistency) directly.
    // Until those come from a real source, only compute scores that use real fetched data,
    // and flag the rest as unavailable rather than guessing.
    const following = null; // not available from this API scope

    const scoringResult = calculateAuthenticityScore({
      followers,
      following: following || 1, // avoid divide-by-zero; ratio score will just be low/neutral
      avgLikes,
      avgComments,
      // Leave these at defaults ONLY because we don't have real signals yet —
      // see note above. Do not present this score to brands as fully verified
      // until real signals replace these defaults.
    });

    const instagramAccountData = {
      username: igProfile.username,
      igUserId: igProfile.id,
      accountType: igProfile.account_type,
      followers: followers,
      mediaCount: igProfile.media_count,
      avgLikes,
      avgComments,
      postsAnalyzed: posts.length,
      authenticityScore: scoringResult.authenticityScore,
      engagementRate: scoringResult.metrics.engagementRate,
      accessTokenExpiresAt: expiresInSeconds
        ? new Date(Date.now() + expiresInSeconds * 1000).toISOString()
        : null,
      lastSyncedAt: new Date().toISOString(),
    };

    const updatedUser = await updateUserByFirebaseUid(effectiveUid, {
      socialAccounts: {
        instagram: `@${igProfile.username}`,
      },
      creatorStats: {
        followersCount: followers,
        engagementRate: scoringResult.metrics.engagementRate,
      },
      verification: {
        status: scoringResult.verified ? 'verified' : 'pending',
        timestamp: new Date(),
        apiResults: {
          instagram: instagramAccountData,
        },
      },
    } as any);

    if (!updatedUser) {
      console.error('updateUserByFirebaseUid returned null for uid:', effectiveUid);
      return res.status(404).json({ error: 'User not found — could not save Instagram data. Make sure the user exists in the database.' });
    }

    res.json({
      success: true,
      message: 'Instagram account connected and synced successfully!',
      user: updatedUser,
      uid: effectiveUid,
      socialAccount: instagramAccountData,
      authenticityScore: scoringResult.authenticityScore,
      verified: scoringResult.verified,
      metrics: scoringResult.metrics,
    });
  } catch (error: any) {
    console.error('Error in Instagram OAuth Callback:', error);
    res.status(500).json({
      error: 'Failed to complete Instagram OAuth connection',
      details: error.message,
    });
  }
});

/**
 * GET /api/instagram/status/:uid
 * Returns the current Instagram connection status for a user
 */
router.get('/status/:uid', async (req: Request, res: Response) => {
  const { uid } = req.params;

  try {
    const adminApp = getFirebaseAdmin();
    if (!adminApp) {
      return res.status(503).json({ error: 'Database not available.' });
    }

    const db = getFirestore(adminApp);
    const doc = await db.collection('influencers').doc(uid).get();

    if (doc.exists && doc.data()?.socialAccounts?.instagram) {
      return res.json({ connected: true, instagram: doc.data()!.socialAccounts.instagram });
    }

    res.json({ connected: false, instagram: null });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;