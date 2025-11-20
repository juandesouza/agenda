# 🚨 Railway Deployment Fix

## Current Issues

1. ❌ JWT_SECRET not set
2. ❌ MongoDB connection not found

## Quick Fix (Choose One Method)

### Method 1: Railway Dashboard (Easiest)

1. **Set JWT_SECRET:**
   - Go to Railway → Your backend service
   - Click **"Variables"** tab
   - Click **"New Variable"**
   - Name: `JWT_SECRET`
   - Value: Generate one:
     ```bash
     openssl rand -base64 32
     ```
   - Or use: `J6tgT1l0AGg/CWBE6C7PlqbuZNAzOX/VHdQtfyXoLTw=`
   - Click **"Add"**

2. **Connect MongoDB:**
   - Still in backend service → **Variables** tab
   - Click **"Reference Variable"** button
   - In the popup:
     - **Service:** Select your MongoDB service
     - **Variable:** Select `MONGO_URL` (or `DATABASE_URL` if MONGO_URL doesn't exist)
   - Click **"Add"**
   - This creates a reference like: `${{MongoDB.MONGO_URL}}`

3. **Set NODE_ENV:**
   - Add variable: `NODE_ENV` = `production`

4. **Redeploy:**
   - Railway will auto-redeploy
   - Or click **"Redeploy"** button

### Method 2: Railway CLI

```bash
# Install CLI (if not installed)
npm install -g @railway/cli

# Login
railway login

# Link to project (if not linked)
railway link

# Set variables
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set NODE_ENV=production

# For MongoDB, you still need to use dashboard:
# Go to Variables → Reference Variable → Select MongoDB service
```

### Method 3: Use Setup Script

```bash
./setup-railway.sh
```

Then manually connect MongoDB via dashboard (step 2 in Method 1).

## Verify MongoDB Service Exists

1. In Railway project, check if you have a MongoDB service
2. If not, add it:
   - Click **"+ New"**
   - Select **"Database"** → **"MongoDB"**
   - Railway will create it

## Check Variables After Setup

After setting variables, check logs should show:
- ✅ `✅ Connected to MongoDB`
- ✅ No `JWT_SECRET is not set` warning

## Common Issues

### "MongoDB service not found"
- Add MongoDB service first (Database → MongoDB)
- Then reference it in backend service

### "Reference Variable not working"
- Make sure MongoDB service is in the same Railway project
- Try using the variable name directly (copy from MongoDB service → Variables)

### "Still getting errors after setup"
- Check Railway logs for exact error
- Verify variables are set: Service → Variables tab
- Make sure you're looking at the correct service (backend, not MongoDB)

---

**After fixing, your backend should start successfully!** 🎉

