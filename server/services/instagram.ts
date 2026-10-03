import axios from 'axios';
import {
  InstagramProfile,
  InstagramMediaResponse,
  InstagramFetchResult,
} from '../../src/types';

export async function fetchInstagramData(
  igUserId: string,
  accessToken: string
): Promise<InstagramFetchResult> {
  const profileRes = await axios.get<InstagramProfile>(
    `https://graph.instagram.com/${igUserId}`,
    {
      params: {
        fields: 'id,username,account_type,media_count', // dropped followers_count
        access_token: accessToken,
      },
    }
  );

  const mediaRes = await axios.get<InstagramMediaResponse>(
    `https://graph.instagram.com/${igUserId}/media`,
    {
      params: {
        fields: 'id,media_type,timestamp,like_count,comments_count',
        access_token: accessToken,
        limit: 25,
      },
    }
  );

  const posts = mediaRes.data.data || [];
  const avgLikes =
    posts.reduce((sum, p) => sum + (p.like_count || 0), 0) / (posts.length || 1);
  const avgComments =
    posts.reduce((sum, p) => sum + (p.comments_count || 0), 0) / (posts.length || 1);
  
  // followers_count unavailable without instagram_business_manage_insights permission
  const followers = profileRes.data.followers_count || 0; // will be 0 for now
  const engagementRate = followers ? ((avgLikes + avgComments) / followers) * 100 : 0;

  return {
    profile: profileRes.data,
    metrics: {
      avgLikes: Math.round(avgLikes),
      avgComments: Math.round(avgComments),
      engagementRate: engagementRate.toFixed(2),
      postsAnalyzed: posts.length,
    },
    recentPosts: posts,
  };
}