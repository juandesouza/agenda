# Railway Deployment Guide

Complete guide to deploy your backend and database to Railway.

## 🚀 Quick Deploy (5 minutes)

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway

```bash
railway login
```

### Step 3: Initialize Project

```bash
railway init
```

### Step 4: Add MongoDB Database

```bash
railway add mongodb
```

This automatically:
- Creates a MongoDB database
- Sets `MONGODB_URI` environment variable
- Connects it to your service

### Step 5: Set Environment Variables

```bash
railway variables set JWT_SECRET=your_jwt_secret_here
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://your-app.netlify.app
```

### Step 6: Deploy

```bash
railway up
```

That's it! Railway will:
- Build your app
- Deploy your backend
- Connect to MongoDB
- Give you a URL like: `https://your-app.railway.app`

## 📋 Detailed Steps

### Via Railway Dashboard

1. **Go to Railway:**
   - Visit https://railway.app
   - Sign up/login with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `agenda` repository

3. **Add MongoDB Service:**
   - In your project, click "+ New"
   - Select "Database" → "MongoDB"
   - Railway automatically creates and connects it

4. **Configure Service:**
   - Railway auto-detects it's a Node.js app
   - Root directory: `/` (or leave default)
   - Build command: (auto-detected)
   - Start command: `npm run server`

5. **Set Environment Variables:**
   - Go to your service → Variables
   - Add:
     ```
     JWT_SECRET=your_jwt_secret_here
     NODE_ENV=production
     FRONTEND_URL=https://your-app.netlify.app
     ```
   - Note: `MONGODB_URI` is automatically set by Railway when you add MongoDB

6. **Deploy:**
   - Railway automatically deploys on every push to main
   - Or click "Deploy" manually

7. **Get Your Backend URL:**
   - Go to your service → Settings → Domains
   - Copy your Railway URL (e.g., `https://agenda-production.up.railway.app`)
   - This is your backend API URL!

## 🔗 Connect Frontend

After deployment, update Netlify:

1. **Get Backend URL:**
   - Railway service → Settings → Domains
   - Copy the URL (e.g., `https://agenda-production.up.railway.app`)

2. **Update Netlify Environment Variables:**
   - Go to Netlify → Site settings → Environment variables
   - Update:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
     ```

3. **Update Railway CORS:**
   - Railway → Your service → Variables
   - Update `FRONTEND_URL` to your Netlify URL

## 🔄 Automatic Deployments

Railway automatically deploys when you push to GitHub:
- Push to `main` branch → Auto-deploy
- No manual steps needed!

## 📊 Environment Variables Reference

| Variable | Source | Description |
|----------|--------|-------------|
| `MONGODB_URI` | Railway (auto) | MongoDB connection string |
| `JWT_SECRET` | You set | JWT signing secret |
| `NODE_ENV` | You set | `production` |
| `FRONTEND_URL` | You set | Your Netlify URL |
| `PORT` | Railway (auto) | Server port |

## ✅ Verification

1. **Check Backend:**
   - Visit: `https://your-backend.railway.app/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

2. **Check Database:**
   - Railway → MongoDB service → Data
   - Should show your collections (users, events)

3. **Test Frontend:**
   - Visit your Netlify URL
   - Register a user
   - Create an event
   - Verify it saves to Railway MongoDB

## 🛠️ Troubleshooting

### Deployment Fails
- Check Railway logs: Service → Deployments → View logs
- Verify `package.json` has `server` script
- Check environment variables are set

### Database Connection Fails
- Verify MongoDB service is added
- Check `MONGODB_URI` is set (Railway sets this automatically)
- View MongoDB service logs

### CORS Errors
- Verify `FRONTEND_URL` matches your Netlify URL exactly
- Check Railway service logs for CORS errors

## 💰 Pricing

- Railway offers free tier with $5 credit/month
- MongoDB included in free tier
- Perfect for development and small projects

---

**Your backend and database are now on Railway!** 🎉

