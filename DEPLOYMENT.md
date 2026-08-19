# GlowGraph Deployment Guide

Complete guide to deploying GlowGraph locally and to production.

## Local Development (Docker)

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (optional, for direct local development)
- OpenAI API key
- Firebase project (optional, for auth features)

### Quick Start

1. **Clone and configure:**
   ```bash
   cd glowgraph
   cp .env.example .env
   ```

2. **Update .env with your credentials:**
   ```bash
   OPENAI_API_KEY=sk-...
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
   FIREBASE_CLIENT_EMAIL=your-service-account@...
   VITE_FIREBASE_CONFIG='{"apiKey":"...","projectId":"...","authDomain":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}'
   ```

3. **Start Docker services:**
   ```bash
   docker-compose up
   ```

   This starts:
   - **Frontend** on `http://localhost:3000`
   - **API** on `http://localhost:5000`
   - **MongoDB** on `localhost:27017`
   - **Redis** on `localhost:6379`

4. **Seed products (one-time):**
   ```bash
   # In another terminal
   npm run seed --prefix server
   ```

5. **Generate embeddings (one-time, requires OpenAI API key):**
   ```bash
   npm run embed --prefix server
   ```

   This creates `./vector-index/` with the HNSWLIB index.

6. **Access the app:**
   - Open `http://localhost:3000` in browser
   - Browse products, chat with assistant, add to cart
   - Login with Firebase email/Google

### Local Development (Without Docker)

If you prefer running services locally:

**Backend:**
```bash
# Start MongoDB locally (e.g., via Homebrew or Docker)
mongod

# Start Redis locally (e.g., via Homebrew or Docker)
redis-server

# Install and start API
cd server
npm install
npm run dev          # Runs on :5000
```

**Frontend:**
```bash
cd client
npm install
npm run dev          # Runs on :3000, proxies to :5000
```

## Production Deployment

### Option 1: Docker Hub + Cloud Run / AWS ECS

1. **Build images:**
   ```bash
   docker build -t glowgraph-api ./server
   docker build -t glowgraph-client ./client
   ```

2. **Push to Docker Hub:**
   ```bash
   docker tag glowgraph-api your-dockerhub/glowgraph-api:latest
   docker tag glowgraph-client your-dockerhub/glowgraph-client:latest
   docker push your-dockerhub/glowgraph-api:latest
   docker push your-dockerhub/glowgraph-client:latest
   ```

3. **Deploy to Google Cloud Run:**
   ```bash
   gcloud run deploy glowgraph-api \
     --image your-dockerhub/glowgraph-api:latest \
     --platform managed \
     --region us-central1 \
     --set-env-vars MONGODB_URI=$MONGODB_URI,REDIS_URL=$REDIS_URL,OPENAI_API_KEY=$OPENAI_API_KEY

   gcloud run deploy glowgraph-client \
     --image your-dockerhub/glowgraph-client:latest \
     --platform managed \
     --region us-central1 \
     --set-env-vars VITE_API_URL=https://glowgraph-api-xxx.run.app/api
   ```

### Option 2: Vercel (Frontend) + Railway/Heroku (Backend)

**Frontend to Vercel:**
```bash
npm install -g vercel
cd client
vercel --prod
```

**Backend to Railway/Heroku:**
```bash
# Railway
railway link
railway up

# Or Heroku
heroku login
heroku create glowgraph-api
git push heroku main
```

### Option 3: Self-Hosted (VPS)

**Prerequisites:**
- VPS with Docker & Docker Compose
- Domain name + SSL certificate (Nginx reverse proxy)
- MongoDB cluster (e.g., MongoDB Atlas) or local MongoDB
- Redis cluster or local Redis

**Steps:**
1. SSH into VPS
2. Clone repository
3. Update `.env` with production credentials
4. Set up Nginx reverse proxy:
   ```nginx
   upstream api {
     server api:5000;
   }
   upstream client {
     server client:3000;
   }
   
   server {
     listen 80;
     server_name yourdomain.com;
     
     location /api {
       proxy_pass http://api;
       proxy_set_header Host $host;
     }
     
     location / {
       proxy_pass http://client;
       proxy_set_header Host $host;
     }
   }
   ```
5. Run `docker-compose up -d` (detached mode)

## Environment Variables

### Backend (.env)

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/glowgraph
REDIS_URL=redis://user:pass@redis.example.com:6379
OPENAI_API_KEY=sk-...
FIREBASE_PROJECT_ID=project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
FIREBASE_CLIENT_EMAIL=service-account@...
LOG_LEVEL=info
```

### Frontend (.env)

```bash
VITE_API_URL=https://api.yourdomain.com/api
VITE_FIREBASE_CONFIG='{"apiKey":"...","projectId":"...",...}'
```

## Database Setup

### MongoDB

**Local:**
```bash
# Via Docker
docker run -d -p 27017:27017 --name mongodb mongo:6.0

# Or via Homebrew (macOS)
brew install mongodb-community
brew services start mongodb-community
```

**Cloud (MongoDB Atlas):**
1. Create cluster at atlas.mongodb.com
2. Create database user + API key
3. Whitelist IP addresses
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/glowgraph`

### Redis

**Local:**
```bash
# Via Docker
docker run -d -p 6379:6379 --name redis redis:7-alpine

# Or via Homebrew (macOS)
brew install redis
brew services start redis
```

**Cloud (Upstash / Redis Cloud):**
1. Create cluster
2. Get connection string: `redis://user:pass@host:port`

## Seeding & Initialization

### First-Time Setup

```bash
# 1. Seed 60 products
npm run seed --prefix server

# 2. Generate embeddings (requires OpenAI API key)
npm run embed --prefix server

# 3. Verify health check
curl http://localhost:5000/api/health

# 4. Open frontend
open http://localhost:3000
```

### Verify Setup

```bash
# Check MongoDB
curl http://localhost:5000/api/products

# Check chat endpoint
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'

# Check vector search
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"hydration","topK":5}'
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :5000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
docker ps | grep mongo

# Check logs
docker logs <mongodb-container-id>

# Verify connection string
echo $MONGODB_URI
```

### Redis Connection Failed

```bash
# Check if Redis is running
docker ps | grep redis

# Test connection
redis-cli ping  # Should return PONG
```

### Embeddings Not Found

```bash
# Check if vector index exists
ls -la ./vector-index/

# If missing, regenerate
npm run embed --prefix server
```

### Firebase Auth Not Working

1. Verify Firebase credentials in .env
2. Check Firebase console for enabled auth methods
3. Verify Google OAuth redirect URIs match your domain
4. Test token verification: `curl http://localhost:5000/api/user/profile -H "Authorization: Bearer <token>"`

## Monitoring & Logs

### Docker

```bash
# View logs
docker-compose logs -f api
docker-compose logs -f client
docker-compose logs -f mongo

# View services
docker-compose ps

# Stop services
docker-compose down
```

### Application

- API logs go to stdout (check Docker logs)
- Frontend errors in browser console (F12)
- Vector index creation logged to stdout during `npm run embed`

## Performance Optimization

### Backend

- **Vector store**: Loads on startup, cached in memory (~100ms per request)
- **MongoDB**: Ensure indexes on `range`, `category`, `concerns`, `price`
- **Redis**: Session cache reduces database queries
- **OpenAI**: Batch requests if possible, use `gpt-4o-mini` (cheaper than `gpt-4`)

### Frontend

- **Lazy loading**: React Router code splitting (built-in with Vite)
- **Caching**: Browser cache headers for static assets
- **Tailwind**: Purges unused CSS in production build

### Database

- **MongoDB indexes**: Already created in Product schema
- **Connection pooling**: MongoDB driver handles automatically
- **TTL index**: Set on ChatSession for auto-cleanup

## Security

### Best Practices

1. **Environment variables**: Never commit .env; use CI/CD secrets
2. **Firebase rules**: Set Firestore/Realtime DB rules if used
3. **CORS**: Currently allows all origins; restrict in production
4. **Rate limiting**: Not implemented in MVP; add in production
5. **Input validation**: All endpoints validate user input
6. **HTTPS**: Always use SSL/TLS in production

### Update CORS in Production

**server/src/index.js:**
```javascript
const allowedOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
```

## Backup & Recovery

### MongoDB

```bash
# Export database
mongodump --uri="mongodb://..." --db=glowgraph --out=backup/

# Import database
mongorestore --uri="mongodb://..." backup/glowgraph/
```

### Redis

```bash
# Create snapshot
redis-cli BGSAVE

# Restore from snapshot
# (if using persistent Redis, automatic on restart)
```

## Scaling Considerations

- **Stateless API**: Can run multiple instances behind load balancer
- **Vector store**: Currently in-memory; for multi-instance, persist to disk or use external service
- **Session cache**: Redis can be shared across instances
- **Database**: Use managed MongoDB Atlas / Redis Cloud for reliability

## CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy

on: [push]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build API
        run: docker build -t glowgraph-api ./server
      
      - name: Build Client
        run: docker build -t glowgraph-client ./client
      
      - name: Push to Docker Hub
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push glowgraph-api
          docker push glowgraph-client
      
      - name: Deploy to Cloud Run
        run: |
          gcloud auth configure-docker
          gcloud run deploy glowgraph-api --image glowgraph-api:latest
          gcloud run deploy glowgraph-client --image glowgraph-client:latest
```

## Support

For issues, check:
1. Docker logs: `docker-compose logs -f`
2. Environment variables: Ensure all required vars are set
3. Network: Verify services can communicate (check container IPs)
4. Database: Ensure MongoDB/Redis are running and accessible
5. API keys: Verify OpenAI and Firebase credentials are correct
