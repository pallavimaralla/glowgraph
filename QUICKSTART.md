# GlowGraph Quick Start (3 Minutes)

Get Verrà skincare storefront running locally in minutes.

## What You'll Get

- 🛍️ Browsable product catalog (60 unique Verrà products)
- 💬 AI-powered chat search ("something for dark spots under $30")
- 🛒 Shopping cart with Firebase login
- 🎨 Responsive Tailwind UI (mobile-friendly)
- ⚡ Real semantic search + LLM recommendations

## Prerequisites

- Docker & Docker Compose
- OpenAI API key (free tier OK: $5 credit)
- Optional: Firebase project for user auth

## 1️⃣ Get API Key

**OpenAI:**
1. Go to https://platform.openai.com/account/api-keys
2. Create new API key
3. Copy: `sk-...`

**Firebase (optional):**
1. Go to console.firebase.google.com
2. Create new project
3. Enable Email/Password auth + Google OAuth
4. Create web app, copy config

## 2️⃣ Clone & Configure

```bash
git clone <repo-url>
cd glowgraph

# Copy template
cp .env.example .env

# Edit .env with your keys
nano .env  # or open in editor
# Add:
# OPENAI_API_KEY=sk-...
# VITE_FIREBASE_CONFIG='{"apiKey":"...","projectId":"...",...}'
```

## 3️⃣ Start Docker

```bash
docker-compose up
```

**Wait for all services to be healthy:**
```
✅ client      ready on port 3000
✅ api         ready on port 5000
✅ mongodb     ready
✅ redis       ready
```

## 4️⃣ Seed Data (One-Time)

In **another terminal**:

```bash
npm run seed --prefix server      # ~2s
npm run embed --prefix server     # ~30s (generates embeddings)
```

## 5️⃣ Open App

**http://localhost:3000**

### Try It Out

**Browse:**
- Click on products → see 60 Verrà skincare items
- Use filters on left (range, category, price)

**Chat:**
- Click floating chat button (bottom-right)
- Type: `"something for dark spots under $25"`
- Assistant responds with 5 products + reasoning

**Add to Cart:**
- Click "Login" in navbar
- Sign up with email or Google
- Click "Add" on any product
- Go to Cart → view order summary

**That's it!** 🎉

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Docker stuck on startup | `docker-compose down && docker-compose up` |
| Port 3000/5000 in use | `lsof -i :3000` then `kill -9 <PID>` |
| Chat not working | Check OpenAI API key in `.env` |
| Cart requires login | Firebase optional; error expected without it |
| Products not loading | Run `npm run seed --prefix server` |
| Embeddings failed | Verify OpenAI API key + quota |

## Next Steps

- Read [README.md](README.md) for architecture overview
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Explore backend code in `server/src/`
- Modify products in `server/src/scripts/seed.js`
- Customize colors in `client/tailwind.config.js`

## File Structure

```
glowgraph/
├── docker-compose.yml    ← Start here
├── .env.example          ← Add your API keys
├── README.md             ← Full docs
├── DEPLOYMENT.md         ← Deploy to production
├── server/               ← Backend (Node/Express/OpenAI)
└── client/               ← Frontend (React/Vite)
```

## API Endpoints (Testing)

```bash
# Get products
curl http://localhost:5000/api/products

# Chat (no login needed)
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hydrating moisturizer under $20"}'

# Semantic search
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"something for oily skin","topK":5}'
```

## What's Running

| Service | Port | Purpose |
|---------|------|---------|
| Frontend | 3000 | React app (Vite dev server) |
| API | 5000 | Express backend |
| MongoDB | 27017 | Product + cart database |
| Redis | 6379 | Session cache |

All services communicate via Docker network.

## Need Help?

- 📖 Read the [README.md](README.md)
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for advanced setup
- 🐛 Check Docker logs: `docker-compose logs -f api`
- 💬 Browse backend code: `server/src/`

---

**That's it! Enjoy exploring Verrà.** 🌿✨
