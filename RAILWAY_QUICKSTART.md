# 🚀 Railway Quick Start

Deploy backend + database to Railway in 3 steps:

## Option 1: Railway Dashboard (Easiest)

1. **Go to:** https://railway.app
2. **New Project** → **Deploy from GitHub repo** → Select `agenda`
3. **Add MongoDB:**
   - Click "+ New" → "Database" → "MongoDB"
   - Railway auto-connects it
4. **Set Variables:**
   - Service → Variables → Add:
     - `JWT_SECRET`: Your secret
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: Your Netlify URL (set later)
5. **Deploy:** Automatic on push, or click "Deploy"
6. **Get URL:** Service → Settings → Domains → Copy URL

**Done!** Your backend URL: `https://your-app.railway.app`

## Option 2: Railway CLI

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Add MongoDB (auto-sets MONGODB_URI)
railway add mongodb

# Set variables
railway variables set JWT_SECRET=your_secret
railway variables set NODE_ENV=production

# Deploy
railway up
```

## 🔗 Next: Update Netlify

After Railway deployment:

1. **Copy Railway URL:** `https://your-app.railway.app`
2. **Update Netlify:**
   - Environment variable: `NEXT_PUBLIC_API_URL=https://your-app.railway.app/api`
3. **Update Railway:**
   - Variable: `FRONTEND_URL=https://your-netlify-app.netlify.app`

**That's it!** Everything connected. 🎉

See `RAILWAY_DEPLOYMENT.md` for detailed instructions.

