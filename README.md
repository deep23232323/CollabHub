# CreatorPulse

**A trust-first influencer collaboration platform.** Brands and creators discover each other, post campaigns, negotiate in real-time chat, and lock in a contract once both sides agree. Creators verify their Instagram accounts through the Instagram Graph API, so brands know the profiles they work with are real.

🔗 **Live app:** [creator-pulseg.ai.studio](https://creator-pulseg.ai.studio/dashboard)

---

## Screenshots

| | |
|---|---|
| ![Screenshot 1](images/2.png) | ![Screenshot 2](images/1.png) |
| ![Screenshot 3](images/3.png) | ![Screenshot 4](images/4.png) |
| ![Screenshot 5](images/5.png) | |

---

## Features

- 🔐 **Google Login with Firebase Authentication**: one-click sign-in for brands and creators, with secure server-side session cookies.
- ✅ **Instagram Account Verification**: creators connect Instagram via the Meta / Instagram Graph API (OAuth). Verified creators get a trust badge and real profile data (username, followers, media).
- 📣 **Collaborations & Campaigns**: brands can post campaigns, and creators can also create collaboration offers.
- 🙋 **Interest & Approval Flow**: creators (or brands) express interest, and the other party approves or declines.
- 💬 **Real-time Negotiation Chat**: once there's mutual interest, both sides can negotiate budget, deliverables and timelines live.
- 📝 **Contract Generation**: when both sides agree, a contract is created automatically from the agreed terms.
- 🤖 **AI Assistance (Gemini)**: AI-powered help via the Gemini API (e.g. drafting briefs, suggestions).
- 👤 **Role-based Dashboards**: separate experiences for Brands and Creators.

---

## How It Works

```
Sign in (Google)  →  Choose role (Brand / Creator)
        │
        ▼
Creator verifies Instagram (Graph API)  →  Trust badge
        │
        ▼
Brand/Creator posts a Campaign or Collab
        │
        ▼
Other side shows interest  →  Poster approves
        │
        ▼
Real-time chat: negotiate terms
        │
        ▼
Both parties agree  →  Contract created
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React |
| Backend | Node.js + Express (port `5000`) |
| Auth | Firebase Authentication (Google) + Firebase Admin SDK, session cookies / JWT |
| Database | Firebase / MongoDB (optional, via `MONGODB_URI`) |
| Social Verification | Instagram / Meta Graph API |
| AI | Google Gemini API |
| Dev tunnelling | ngrok (HTTPS callback for Instagram OAuth) |

> Adjust this table if your stack differs.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Firebase](https://console.firebase.google.com/) project with **Google** sign-in enabled
- A [Meta for Developers](https://developers.facebook.com/) app with Instagram API access
- A [Gemini API key](https://aistudio.google.com/app/apikey)
- (Optional) A MongoDB database
- (Local development) An [ngrok](https://ngrok.com/) account, since Meta requires an HTTPS redirect URI

### 1. Clone & install

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root (see the reference below). **Never commit this file.**

```dotenv
# ─────────────────────────────────────────────
# Firebase Client Public Config (Frontend)
# ─────────────────────────────────────────────
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# ─────────────────────────────────────────────
# Firebase Admin SDK Private Credentials (Server)
# ─────────────────────────────────────────────
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Session Cookies
JWT_SECRET=

# ─────────────────────────────────────────────
# Optional MongoDB Connection String
# ─────────────────────────────────────────────
MONGODB_URI=

# ─────────────────────────────────────────────
# Instagram / Meta Graph API OAuth Credentials
# ─────────────────────────────────────────────
META_APP_SECRET=
INSTAGRAM_APP_ID=
INSTAGRAM_APP_SECRET=
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_REDIRECT_URI=
INSTAGRAM_SCOPES=

# ─────────────────────────────────────────────
# AI
# ─────────────────────────────────────────────
GEMINI_API_KEY=

# ─────────────────────────────────────────────
# App / Server
# ─────────────────────────────────────────────
FRONTEND_URL=
PORT=5000

# Frontend (Vite reads VITE_ prefixed vars)
VITE_BACKEND_URL=

# Dev tunnelling
NGROK_TOKEN=
```

### Environment variable reference

| Variable | Description |
|---|---|
| `VITE_FIREBASE_*` | Public Firebase web config from *Project settings → General → Your apps*. Safe for the frontend. |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Service account credentials from *Project settings → Service accounts → Generate new private key*. **Server only.** Keep the `\n` line breaks in the private key and wrap it in quotes. |
| `JWT_SECRET` | Long random string used to sign session cookies / tokens. |
| `MONGODB_URI` | Optional MongoDB connection string. |
| `META_APP_SECRET` | App secret of your Meta app. |
| `INSTAGRAM_APP_ID` / `INSTAGRAM_APP_SECRET` | Instagram app credentials from your Meta app dashboard. |
| `INSTAGRAM_ACCESS_TOKEN` | Optional long-lived token for server-side/testing calls. Creators' tokens are obtained through OAuth. |
| `INSTAGRAM_REDIRECT_URI` | OAuth callback URL, e.g. `https://<your-ngrok-domain>/api/instagram/callback`. Must exactly match what's set in the Meta dashboard. |
| `INSTAGRAM_SCOPES` | Comma-separated permissions requested during OAuth (e.g. `instagram_business_basic`). |
| `GEMINI_API_KEY` | Google Gemini API key. |
| `FRONTEND_URL` | URL where the frontend runs (used for CORS and redirects), e.g. `http://localhost:5173`. |
| `PORT` | Backend port (default `5000`). |
| `VITE_BACKEND_URL` | Backend base URL used by the frontend, e.g. `http://localhost:5000`. |
| `NGROK_TOKEN` | ngrok auth token for exposing localhost over HTTPS. |

### 3. Set up Firebase

1. Create a Firebase project and add a **Web app**.
2. Enable **Authentication → Sign-in method → Google**.
3. Add your domains (e.g. `localhost`, your deployed domain) under **Authentication → Settings → Authorized domains**.
4. Generate a service account key and copy its values into the server env variables.

### 4. Set up Instagram verification (Meta Graph API)

1. Create an app at [developers.facebook.com](https://developers.facebook.com/) and add the **Instagram** product.
2. Add your creator accounts as testers while the app is in development mode (the Instagram account should be a Professional: Business or Creator account).
3. Under the Instagram OAuth settings, add your **redirect URI** (use your ngrok HTTPS URL locally).
4. Copy the App ID and App Secret into `.env`.
5. Submit for **App Review** to request advanced permissions before going live to the public.

### 5. Run locally

Start an HTTPS tunnel (needed for the Instagram OAuth callback):

```bash
ngrok config add-authtoken $NGROK_TOKEN
ngrok http 5000
```

Update `INSTAGRAM_REDIRECT_URI` (and the Meta dashboard) with the ngrok URL, then start the app:

```bash
npm run dev
```

- Frontend → `http://localhost:5173`
- Backend → `http://localhost:5000`

---

## Project Structure

> Update to match your actual folders.

```
.
├── images/              # README screenshots (1.png – 5.png)
├── src/                 # Frontend (Vite + React)
├── server/              # Backend (Express, Firebase Admin, Instagram OAuth)
├── .env                 # Local secrets (not committed)
├── package.json
└── README.md
```

---

## Security Notes

- **Never commit `.env`.** Add it to `.gitignore`.
- The `FIREBASE_PRIVATE_KEY`, `JWT_SECRET`, `META_APP_SECRET`, `INSTAGRAM_APP_SECRET`, `INSTAGRAM_ACCESS_TOKEN` and `GEMINI_API_KEY` are server-side secrets. Never expose them with a `VITE_` prefix.
- If any secret has ever been pasted publicly or committed, **rotate it immediately**.
- Use HTTPS in production and set cookies as `HttpOnly`, `Secure`, `SameSite`.

---

## Roadmap

- [ ] E-signature for contracts
- [ ] Payments & escrow
- [ ] Campaign analytics from Instagram insights
- [ ] Ratings & reviews after completed collaborations
- [ ] Notifications (email / push)

---

## Contributing

Contributions are welcome! Fork the repo, create a feature branch, and open a pull request.

## License

Distributed under the MIT License. See `LICENSE` for details.

---

<p align="center">Built with ❤️ to make brand–creator collaborations transparent and trustworthy.</p>
