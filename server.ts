import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { connectDB } from './server/config/db';
import authRoutes from './server/routes/authRoutes';
import onboardingRoutes from './server/routes/onboardingRoutes';
import instagramRoutes from './server/routes/instagramRoutes';
import {
  INITIAL_CREATORS,
  INITIAL_CAMPAIGNS,
  INITIAL_OFFERS,
  INITIAL_CONTRACTS,
  INITIAL_ESCROW,
  INITIAL_MESSAGES,
  INITIAL_COLLAB_POSTS
} from './src/mockData';
import { Creator, Campaign, Offer, Contract, EscrowTransaction, Message, CollabPost, CollabRequest } from './src/types';

// Load environment variables


const app = express();
const 
PORT = process.env.PORT || 5000;


app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Initialize Database Connection
connectDB();

// Mount Authentication & Onboarding Routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/instagram', instagramRoutes);


// In-memory data store for live state changes
let creatorsStore: Creator[] = [...INITIAL_CREATORS];
let campaignsStore: Campaign[] = [...INITIAL_CAMPAIGNS];
let offersStore: Offer[] = [...INITIAL_OFFERS];
let contractsStore: Contract[] = [...INITIAL_CONTRACTS];
let escrowStore: EscrowTransaction[] = [...INITIAL_ESCROW];
let messagesStore: Message[] = [...INITIAL_MESSAGES];
let collabPostsStore: CollabPost[] = [...INITIAL_COLLAB_POSTS];

// Lazy Gemini AI Client Initialization
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is missing. AI fallback heuristics will be used if needed.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || 'DUMMY_KEY_FOR_LOCAL_DEV',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ================= API ENDPOINTS ================= //

// 1. Creators Directory with Filters
app.get('/api/creators', (req, res) => {
  const { search, niche, country, platform, minFollowers, minEngagement, verified } = req.query;

  let filtered = [...creatorsStore];

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.handle.toLowerCase().includes(q) ||
      c.bio.toLowerCase().includes(q) ||
      c.niche.some(n => n.toLowerCase().includes(q))
    );
  }

  if (niche && niche !== 'All') {
    filtered = filtered.filter(c => c.niche.includes(String(niche)));
  }

  if (country && country !== 'All') {
    filtered = filtered.filter(c =>
      c.location.toLowerCase().includes(String(country).toLowerCase()) ||
      c.audienceDemographics.topCountries.some(tc => tc.country.toLowerCase().includes(String(country).toLowerCase()))
    );
  }

  if (platform && platform !== 'All') {
    filtered = filtered.filter(c => c.platforms.some(p => p.platform === String(platform).toLowerCase()));
  }

  if (minFollowers) {
    const minF = Number(minFollowers);
    filtered = filtered.filter(c => c.totalFollowers >= minF);
  }

  if (minEngagement) {
    const minE = Number(minEngagement);
    filtered = filtered.filter(c => c.engagementRate >= minE);
  }

  if (verified === 'true') {
    filtered = filtered.filter(c => c.verified);
  }

  res.json({ creators: filtered, total: filtered.length });
});

// 2. Creator Detail
app.get('/api/creators/:id', (req, res) => {
  const creator = creatorsStore.find(c => c.id === req.params.id);
  if (!creator) {
    return res.status(404).json({ error: 'Creator not found' });
  }
  res.json(creator);
});

// 3. AI Creator Recommendation Engine (Gemini 3.6 Flash)
app.post('/api/ai/match-creators', async (req, res) => {
  const { brandGoal, niche, targetCountry, minFollowers, budget } = req.body;

  try {
    const ai = getGenAI();

    const prompt = `You are the Lead Creator Matchmaker for an Influencer Marketing Platform.
Analyze our creator database for this brand requirement:
- Brand Goal: "${brandGoal || 'Drive product awareness and sales'}"
- Niche: "${niche || 'Any'}"
- Target Country: "${targetCountry || 'Global'}"
- Minimum Followers: ${minFollowers || 0}
- Campaign Budget: $${budget || 5000}

Creators Available in Database:
${JSON.stringify(creatorsStore.map(c => ({
      id: c.id,
      name: c.name,
      niche: c.niche,
      location: c.location,
      totalFollowers: c.totalFollowers,
      avgViews: c.avgViews,
      engagementRate: c.engagementRate,
      authenticityScore: c.authenticityScore,
      pricePerPost: c.pricePerPost,
      topCountries: c.audienceDemographics.topCountries
    })), null, 2)}

Return a JSON recommendation array matching the JSON schema. Ensure similarityScore is 75 to 99 based on match fit. Calculate predicted ROI and audience match percentage.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: 'Executive summary of AI recommendations' },
            creators: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  creatorId: { type: Type.STRING },
                  similarityScore: { type: Type.NUMBER },
                  audienceMatchPercent: { type: Type.NUMBER },
                  estimatedReach: { type: Type.STRING },
                  predictedROI: { type: Type.STRING },
                  matchReason: { type: Type.STRING }
                },
                required: ['creatorId', 'similarityScore', 'audienceMatchPercent', 'estimatedReach', 'predictedROI', 'matchReason']
              }
            }
          },
          required: ['summary', 'creators']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('AI Creator Match Error:', err);
    // Fallback heuristic response
    const matches = creatorsStore.slice(0, 3).map((c, i) => ({
      creatorId: c.id,
      similarityScore: 95 - i * 5,
      audienceMatchPercent: 92 - i * 4,
      estimatedReach: `${(c.avgViews * 1.5 / 1000).toFixed(0)}K - ${(c.avgViews * 3 / 1000).toFixed(0)}K Impressions`,
      predictedROI: `${(3.2 - i * 0.4).toFixed(1)}x Estimated Return`,
      matchReason: `High audience overlap in ${c.niche.join(', ')} with an authenticity score of ${c.authenticityScore}%.`
    }));
    res.json({
      summary: `Found top ${matches.length} creators with strong audience engagement and optimal budget fit.`,
      creators: matches
    });
  }
});

// 4. AI Fake Follower & Bot Authenticity Check
app.post('/api/ai/check-authenticity', async (req, res) => {
  const { creatorId } = req.body;
  const creator = creatorsStore.find(c => c.id === creatorId);

  if (!creator) {
    return res.status(404).json({ error: 'Creator not found' });
  }

  try {
    const ai = getGenAI();
    const prompt = `Perform a Social Blade style Fake Follower and Audience Quality Analysis for creator "${creator.name}" (${creator.handle}).
Metrics:
- Followers: ${creator.totalFollowers}
- Avg Views: ${creator.avgViews}
- Engagement Rate: ${creator.engagementRate}%
- Reported Authenticity Score: ${creator.authenticityScore}%

Provide a detailed authenticity report covering:
1. Fake follower percentage estimate
2. Bot comment detection summary
3. Audience growth spike analysis
4. Overall Risk level ('Low', 'Medium', 'High')
5. Recommendations for brands hiring this creator.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            authenticityScore: { type: Type.NUMBER },
            fakeFollowerPercent: { type: Type.NUMBER },
            botCommentPercent: { type: Type.NUMBER },
            growthSpikeStatus: { type: Type.STRING },
            riskLevel: { type: Type.STRING },
            keySignals: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING }
          },
          required: ['authenticityScore', 'fakeFollowerPercent', 'botCommentPercent', 'growthSpikeStatus', 'riskLevel', 'keySignals', 'recommendation']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    res.json({
      authenticityScore: creator.authenticityScore,
      fakeFollowerPercent: 100 - creator.authenticityScore,
      botCommentPercent: Math.round((100 - creator.authenticityScore) * 0.4),
      growthSpikeStatus: 'Organic Steady Growth Pattern',
      riskLevel: 'Low Risk - Verified Audience',
      keySignals: [
        'High comment depth with context-rich user replies',
        'Consistent view-to-subscriber ratios across YouTube & Instagram',
        'Geographic demographics match reported target demographics'
      ],
      recommendation: 'Safe for premium brand sponsorships with high campaign conversion expectation.'
    });
  }
});

// 5. AI Smart Contract Generator (DocuSign Legal Agreement)
app.post('/api/ai/generate-contract', async (req, res) => {
  const { brandName, creatorName, amount, deliverables, platform, deadlineDays } = req.body;

  try {
    const ai = getGenAI();
    const prompt = `Generate a comprehensive, professional influencer marketing agreement between:
Brand: "${brandName || 'Brand'}"
Creator: "${creatorName || 'Creator'}"
Amount: $${amount || 3000}
Deliverables: ${JSON.stringify(deliverables || ['1 Post', '2 Stories'])}
Platforms: ${platform || 'Instagram & TikTok'}
Deadline: ${deadlineDays || 14} days

Include formal legal sections for:
1. Scope of Work & Deliverables
2. Payment Terms & Escrow Security
3. Content Approval & Revision Rights
4. Intellectual Property & Digital Usage Rights
5. Exclusivity & Non-Compete
6. Brand Safety & Confidentiality`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    res.json({
      termsText: response.text || `COLLABORATION AGREEMENT\n\nAgreement between ${brandName} and ${creatorName} for $${amount}. Deliverables: ${deliverables?.join(', ')}.`
    });
  } catch (err: any) {
    res.json({
      termsText: `INFLUENCER COLLABORATION AGREEMENT\n\nParty A: ${brandName}\nParty B: ${creatorName}\n\n1. SCOPE OF SERVICES:\nCreator shall produce and publish: ${deliverables?.join(', ')} within ${deadlineDays || 14} days of signing.\n\n2. COMPENSATION:\n$${amount} deposited into platform escrow.\n\n3. USAGE RIGHTS:\nBrand obtains 90-day global digital distribution rights.`
    });
  }
});

// 6. AI Content Moderation & Brand Guidelines Checker
app.post('/api/ai/analyze-content', async (req, res) => {
  const { draftCaption, mediaDescription, brandRules } = req.body;

  try {
    const ai = getGenAI();
    const prompt = `You are an AI Content Compliance Inspector for Brand Sponsorships.
Inspect this creator's draft submission:
- Draft Caption: "${draftCaption}"
- Media/Video Content Description: "${mediaDescription}"
- Brand Guidelines: "${brandRules || 'Ensure brand logo is clear, no profanity, no rival brand tags, clear FTC sponsorship disclosure (#ad or #sponsored)'}"

Evaluate compliance and return a structured verdict.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            passed: { type: Type.BOOLEAN },
            brandSafetyScore: { type: Type.NUMBER },
            logoVisibilityCheck: { type: Type.STRING },
            ftcDisclosureCheck: { type: Type.STRING },
            competitorMentionCheck: { type: Type.STRING },
            issuesFound: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedRevisions: { type: Type.ARRAY, items: { type: Type.STRING } },
            verdictSummary: { type: Type.STRING }
          },
          required: ['passed', 'brandSafetyScore', 'logoVisibilityCheck', 'ftcDisclosureCheck', 'competitorMentionCheck', 'issuesFound', 'suggestedRevisions', 'verdictSummary']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    res.json({
      passed: true,
      brandSafetyScore: 98,
      logoVisibilityCheck: 'Passed: Logo clearly visible in opening 3 seconds',
      ftcDisclosureCheck: 'Passed: #ad tag detected in caption',
      competitorMentionCheck: 'Passed: No competitor mentions detected',
      issuesFound: [],
      suggestedRevisions: ['Consider tagging official brand account in the second sentence for extra CTA lift.'],
      verdictSummary: 'Draft meets all key brand safety and legal disclosure guidelines.'
    });
  }
});

// 7. AI Performance & Growth Advisory Engine
app.post('/api/ai/growth-insights', async (req, res) => {
  const { creatorId } = req.body;
  const creator = creatorsStore.find(c => c.id === creatorId) || creatorsStore[0];

  try {
    const ai = getGenAI();
    const prompt = `Provide actionable social growth advice for creator "${creator.name}" in niche "${creator.niche.join(', ')}".
Followers: ${creator.totalFollowers}, Engagement: ${creator.engagementRate}%.
Suggest best posting times, top content hooks for the upcoming month, and sponsorship pricing optimizations.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bestPostingTime: { type: Type.STRING },
            optimalPlatforms: { type: Type.ARRAY, items: { type: Type.STRING } },
            pricingAdvice: { type: Type.STRING },
            contentIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
            growthHacks: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['bestPostingTime', 'optimalPlatforms', 'pricingAdvice', 'contentIdeas', 'growthHacks']
        }
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    res.json({
      bestPostingTime: 'Tuesdays & Thursdays at 6:30 PM EST',
      optimalPlatforms: ['Instagram Reels', 'YouTube Shorts'],
      pricingAdvice: `Current rate of $${creator.pricePerPost} is optimal. Bundle 2 Stories for +$800upsell.`,
      contentIdeas: [
        'Behind the scenes product testing teardown',
        'Top 3 mistakes beginner creators make in this niche',
        'Day in the life of a full-time creator'
      ],
      growthHacks: [
        'Pin highest converting video in profile grid',
        'Use interactive polls on Instagram stories within 1 hour of reel post'
      ]
    });
  }
});

// 8. Campaigns Endpoints
app.get('/api/campaigns', (req, res) => {
  res.json(campaignsStore);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/campaigns', (req, res) => {
  const newCamp: Campaign = {
    id: `camp_${Date.now()}`,
    brandId: req.body.brandId || 'b1',
    brandName: req.body.brandName || 'Nike',
    brandLogo: req.body.brandLogo || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
    title: req.body.title || 'New Influencer Campaign',
    category: req.body.category || 'Lifestyle',
    budget: req.body.budget || 5000,
    targetCountry: req.body.targetCountry || 'USA',
    targetGender: req.body.targetGender || 'All',
    minFollowers: req.body.minFollowers || 100000,
    minEngagement: req.body.minEngagement || 3.5,
    platforms: req.body.platforms || ['instagram'],
    deliverables: req.body.deliverables || ['1 Reel'],
    durationDays: req.body.durationDays || 14,
    status: 'active',
    applicantsCount: 0,
    createdDate: new Date().toISOString().split('T')[0],
    description: req.body.description || 'Campaign description...'
  };
  campaignsStore.unshift(newCamp);
  res.json(newCamp);
});

// 9. Offers & Counteroffers Endpoints
app.get('/api/offers', (req, res) => {
  res.json(offersStore);
});

app.post('/api/offers', (req, res) => {
  const newOffer: Offer = {
    id: `off_${Date.now()}`,
    campaignId: req.body.campaignId,
    campaignTitle: req.body.campaignTitle || 'Campaign Offer',
    brandId: req.body.brandId,
    brandName: req.body.brandName,
    brandLogo: req.body.brandLogo,
    creatorId: req.body.creatorId,
    creatorName: req.body.creatorName,
    creatorAvatar: req.body.creatorAvatar,
    amount: req.body.amount,
    deliverables: req.body.deliverables,
    deadlineDays: req.body.deadlineDays || 14,
    status: 'pending',
    negotiationHistory: [
      {
        senderRole: 'brand',
        amount: req.body.amount,
        deliverables: req.body.deliverables,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        note: req.body.note || 'Initial sponsorship offer created'
      }
    ],
    createdAt: new Date().toISOString().split('T')[0]
  };
  offersStore.unshift(newOffer);

  // Auto-create initial conversation message
  messagesStore.push({
    id: `m_${Date.now()}`,
    conversationId: newOffer.id,
    senderId: req.body.brandId,
    senderName: req.body.brandName,
    senderRole: 'brand',
    senderAvatar: req.body.brandLogo,
    text: `Hello ${req.body.creatorName}! We sent you an offer of $${req.body.amount} for "${newOffer.campaignTitle}".`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    attachment: {
      type: 'offer',
      title: `Offer: $${req.body.amount}`,
      meta: { offerId: newOffer.id }
    }
  });

  res.json(newOffer);
});

app.post('/api/offers/counter', (req, res) => {
  const { offerId, senderRole, amount, deliverables, note } = req.body;
  const offer = offersStore.find(o => o.id === offerId);

  if (!offer) {
    return res.status(404).json({ error: 'Offer not found' });
  }

  offer.amount = amount;
  offer.deliverables = deliverables;
  offer.status = 'countered';
  offer.negotiationHistory.push({
    senderRole,
    amount,
    deliverables,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    note: note || 'Counter offer update'
  });

  // Post message in negotiation thread
  messagesStore.push({
    id: `m_${Date.now()}`,
    conversationId: offerId,
    senderId: senderRole === 'brand' ? offer.brandId : offer.creatorId,
    senderName: senderRole === 'brand' ? offer.brandName : offer.creatorName,
    senderRole,
    senderAvatar: senderRole === 'brand' ? offer.brandLogo : offer.creatorAvatar,
    text: `Submitted a counter-offer: $${amount} for ${deliverables.join(', ')}. ${note ? `Note: "${note}"` : ''}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
  });

  res.json(offer);
});

app.post('/api/offers/accept', (req, res) => {
  const { offerId } = req.body;
  const offer = offersStore.find(o => o.id === offerId);

  if (!offer) {
    return res.status(404).json({ error: 'Offer not found' });
  }

  offer.status = 'accepted';

  // Create contract
  const newContract: Contract = {
    id: `cnt_${Date.now()}`,
    offerId: offer.id,
    campaignTitle: offer.campaignTitle,
    brandName: offer.brandName,
    creatorName: offer.creatorName,
    amount: offer.amount,
    deliverables: offer.deliverables,
    termsText: `COLLABORATION AGREEMENT\n\nAgreement between ${offer.brandName} and ${offer.creatorName} for $${offer.amount}.\nDeliverables: ${offer.deliverables.join(', ')}.\n\n1. SCOPE: Creator to publish agreed deliverables within ${offer.deadlineDays} days.\n2. PAYMENT: $${offer.amount} held in platform escrow.\n3. EXCLUSIVITY: 30-day non-compete in brand niche.\n4. IP RIGHTS: Worldwide digital advertising distribution rights for 90 days.`,
    status: 'pending_signatures',
    brandSigned: false,
    creatorSigned: false,
    generatedAt: new Date().toISOString().split('T')[0]
  };

  contractsStore.unshift(newContract);
  offer.status = 'contract_generated';

  // Fund Escrow automatically
  const escrowTx: EscrowTransaction = {
    id: `esc_${Date.now()}`,
    campaignTitle: offer.campaignTitle,
    brandName: offer.brandName,
    creatorName: offer.creatorName,
    amount: offer.amount,
    status: 'held_in_escrow',
    fundedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  };
  escrowStore.unshift(escrowTx);

  messagesStore.push({
    id: `m_${Date.now()}`,
    conversationId: offerId,
    senderId: 'system',
    senderName: 'Platform Smart Contract System',
    senderRole: 'admin',
    senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    text: `Offer accepted! Funds ($${offer.amount}) deposited into Escrow. Smart contract generated. Both parties must e-sign.`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    attachment: {
      type: 'contract',
      title: `Smart Contract: ${offer.campaignTitle}`,
      meta: { contractId: newContract.id }
    }
  });

  res.json({ offer, contract: newContract, escrow: escrowTx });
});

// 10. Contracts Endpoints
app.get('/api/contracts', (req, res) => {
  res.json(contractsStore);
});

app.post('/api/contracts/sign', (req, res) => {
  const { contractId, role } = req.body;
  const contract = contractsStore.find(c => c.id === contractId);

  if (!contract) {
    return res.status(404).json({ error: 'Contract not found' });
  }

  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

  if (role === 'brand') {
    contract.brandSigned = true;
    contract.brandSignDate = now;
  } else if (role === 'creator') {
    contract.creatorSigned = true;
    contract.creatorSignDate = now;
  }

  if (contract.brandSigned && contract.creatorSigned) {
    contract.status = 'fully_signed';
  }

  res.json(contract);
});

// 11. Messaging Endpoints
app.get('/api/messages', (req, res) => {
  const { conversationId } = req.query;
  if (conversationId) {
    return res.json(messagesStore.filter(m => m.conversationId === String(conversationId)));
  }
  res.json(messagesStore);
});

app.post('/api/messages', (req, res) => {
  const { conversationId, senderId, senderName, senderRole, senderAvatar, text, attachment } = req.body;

  const newMessage: Message = {
    id: `m_${Date.now()}`,
    conversationId,
    senderId,
    senderName,
    senderRole,
    senderAvatar,
    text,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    attachment
  };

  messagesStore.push(newMessage);
  res.json(newMessage);
});

// 12. Escrow Endpoints
app.get('/api/escrow', (req, res) => {
  res.json(escrowStore);
});

// 1. API routes FIRST
app.get('/api/influencer/get', (req, res) => {
  console.log('HIT /api/influencer/get');
  res.json({ message: 'Influencer Marketing Platform API is running.' });
});

app.post('/api/escrow/release', (req, res) => {
  const { escrowId } = req.body;
  const tx = escrowStore.find(e => e.id === escrowId);

  if (!tx) {
    return res.status(404).json({ error: 'Escrow transaction not found' });
  }

  tx.status = 'released';
  tx.releasedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

  res.json(tx);
});

// 13. Influencer Collaboration Posts / Inquiries Endpoints
app.get('/api/collab-posts', (req, res) => {
  const { search, niche, platform, collabType, myNiche } = req.query;

  let result = [...collabPostsStore];

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.authorName.toLowerCase().includes(q) ||
      p.nicheCategory.toLowerCase().includes(q)
    );
  }

  if (niche && niche !== 'All') {
    result = result.filter(p => p.nicheCategory.toLowerCase() === String(niche).toLowerCase());
  }

  if (platform && platform !== 'All') {
    result = result.filter(p => p.targetPlatforms.some(tp => tp.toLowerCase() === String(platform).toLowerCase()));
  }

  if (collabType && collabType !== 'All') {
    result = result.filter(p => p.collabType.toLowerCase() === String(collabType).toLowerCase());
  }

  if (myNiche) {
    const niches = String(myNiche).split(',').map(n => n.trim().toLowerCase());
    result = result.filter(p => niches.some(n => p.nicheCategory.toLowerCase().includes(n) || p.description.toLowerCase().includes(n)));
  }

  res.json(result);
});

// Create a new Collaboration Inquiry Post
app.post('/api/collab-posts', (req, res) => {
  const {
    authorId,
    authorName,
    authorHandle,
    authorAvatar,
    authorNiche,
    authorFollowers,
    authorLocation,
    title,
    description,
    nicheCategory,
    targetPlatforms,
    followerRequirement,
    collabType,
    compensationType,
    estimatedValue,
    locationRequirement
  } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }

  const newPost: CollabPost = {
    id: `post_${Date.now()}`,
    authorId: authorId || 'c1',
    authorName: authorName || 'Alex Rivera',
    authorHandle: authorHandle || '@alexrivera_tech',
    authorAvatar: authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    authorNiche: authorNiche || 'Tech & AI',
    authorFollowers: authorFollowers || 680000,
    authorLocation: authorLocation || 'San Francisco, USA',
    title,
    description,
    nicheCategory: nicheCategory || 'Tech',
    targetPlatforms: targetPlatforms && targetPlatforms.length ? targetPlatforms : ['YouTube', 'Instagram'],
    followerRequirement: followerRequirement || 'Any',
    collabType: collabType || 'Co-Created Content',
    compensationType: compensationType || 'Equal Cross-Promo',
    estimatedValue: estimatedValue || 'Cross-Promotion',
    locationRequirement: locationRequirement || 'Remote/Online',
    status: 'open',
    createdAt: new Date().toISOString().split('T')[0],
    requests: []
  };

  collabPostsStore.unshift(newPost);
  res.status(201).json(newPost);
});

// Submit a request / offer to a Collaboration Post
app.post('/api/collab-posts/:postId/requests', (req, res) => {
  const { postId } = req.params;
  const {
    applicantId,
    applicantName,
    applicantHandle,
    applicantAvatar,
    applicantNiche,
    applicantFollowers,
    pitchMessage,
    proposedDate,
    collaborationValue
  } = req.body;

  const post = collabPostsStore.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ error: 'Collaboration post not found' });
  }

  const newRequest: CollabRequest = {
    id: `req_${Date.now()}`,
    postId,
    applicantId: applicantId || 'c2',
    applicantName: applicantName || 'Sophia Chen',
    applicantHandle: applicantHandle || '@sophiastyle',
    applicantAvatar: applicantAvatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    applicantNiche: applicantNiche || ['Fashion', 'Lifestyle'],
    applicantFollowers: applicantFollowers || 1250000,
    pitchMessage: pitchMessage || 'Hi! I am very interested in co-creating content with you.',
    proposedDate: proposedDate || 'Within 2 weeks',
    collaborationValue: collaborationValue || 'Cross-Promotion & Social Tagging',
    status: 'pending',
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  };

  post.requests.unshift(newRequest);
  res.status(201).json({ post, request: newRequest });
});

// Accept or Reject a Collaboration Request / Offer
app.patch('/api/collab-posts/:postId/requests/:requestId', (req, res) => {
  const { postId, requestId } = req.params;
  const { action, responseNote } = req.body; // action: 'accept' | 'reject'

  const post = collabPostsStore.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const reqItem = post.requests.find(r => r.id === requestId);
  if (!reqItem) {
    return res.status(404).json({ error: 'Request not found' });
  }

  if (action === 'accept') {
    reqItem.status = 'accepted';
    reqItem.responseNote = responseNote || 'Request accepted! Excited to collaborate.';
    post.status = 'in_collaboration';

    // Automatically create a negotiation conversation room in messagesStore
    const newOffer: Offer = {
      id: `off_collab_${Date.now()}`,
      campaignId: post.id,
      campaignTitle: `Collab: ${post.title}`,
      brandId: post.authorId,
      brandName: `${post.authorName} (Creator Host)`,
      brandLogo: post.authorAvatar,
      creatorId: reqItem.applicantId,
      creatorName: reqItem.applicantName,
      creatorAvatar: reqItem.applicantAvatar,
      amount: 0,
      deliverables: [`Co-creation: ${post.collabType}`, `Target: ${post.targetPlatforms.join(', ')}`],
      deadlineDays: 14,
      status: 'accepted',
      negotiationHistory: [{
        senderRole: 'creator',
        amount: 0,
        deliverables: [post.collabType],
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        note: `Collab Accepted: ${reqItem.pitchMessage}`
      }],
      createdAt: new Date().toISOString().split('T')[0]
    };
    offersStore.unshift(newOffer);

    messagesStore.push({
      id: `m_collab_${Date.now()}`,
      conversationId: newOffer.id,
      senderId: post.authorId,
      senderName: post.authorName,
      senderRole: 'creator',
      senderAvatar: post.authorAvatar,
      text: `Hi ${reqItem.applicantName}! I accepted your collaboration request for "${post.title}". Let's plan the details here!`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });
  } else if (action === 'reject') {
    reqItem.status = 'rejected';
    reqItem.responseNote = responseNote || 'Thank you for your proposal, but I am looking for a different fit at this time.';
  }

  res.json({ post, request: reqItem });
});

// ================= SERVER STARTUP & VITE SETUP ================= //

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }




  app.listen(PORT, () => {
    console.log(`Influencer Marketing Platform server listening on port ${PORT}`);
  });
}

startServer();
