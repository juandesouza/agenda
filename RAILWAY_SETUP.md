# Railway Setup - Fix Environment Variables

## Issue: Missing Environment Variables

Your Railway deployment needs these environment variables:

### 1. MongoDB Connection

Railway provides MongoDB connection via one of these variables:
- `MONGO_URL` (most common)
- `DATABASE_URL`
- `MONGODB_URI`

**To check/fix:**
1. Go to Railway dashboard
2. Click on your **MongoDB service**
3. Go to **Variables** tab
4. Look for connection string variable
5. Copy the variable name and value

### 2. Connect MongoDB to Backend Service

1. In Railway project, click on your **backend service**
2. Go to **Variables** tab
3. Click **"Reference Variable"**
4. Select your **MongoDB service**
5. Select the connection string variable (usually `MONGO_URL` or `DATABASE_URL`)
6. This will create a reference like `${{MongoDB.MONGO_URL}}`

### 3. Set JWT_SECRET

1. In your **backend service** → **Variables**
2. Click **"New Variable"**
3. Add:
   - **Name:** `JWT_SECRET`
   - **Value:** Generate a strong random string (you can use: `openssl rand -base64 32`)
4. Click **"Add"**

### 4. Set Other Variables

Add these to your backend service variables:

- `NODE_ENV` = `production`
- `FRONTEND_URL` = `https://your-netlify-app.netlify.app` (set after Netlify deployment)

### 5. Redeploy

After setting variables, Railway will auto-redeploy, or click **"Redeploy"**

## Quick Fix Commands (Railway CLI)

```bash
# Login
railway login

# Link to your project
railway link

# Set JWT_SECRET (generate a secure one)
railway variables set JWT_SECRET=$(openssl rand -base64 32)

# Set other variables
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://your-app.netlify.app

# Reference MongoDB connection (if not auto-connected)
# Go to Railway dashboard and use "Reference Variable" feature
```

## Verify

After redeploy, check logs:
- Should see: `✅ Connected to MongoDB`
- Should NOT see: `JWT_SECRET is not set` warning

