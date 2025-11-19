# Deployment Guide

This guide covers deploying the Agenda PWA to Netlify (frontend) and setting up the backend server.

## Prerequisites

- MongoDB Atlas account with a cluster set up
- Netlify account (for frontend)
- Backend hosting service (Heroku, Railway, Render, etc.)

## Step 1: MongoDB Atlas Setup

1. **Create/Verify MongoDB Atlas Cluster:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Ensure you have a cluster created (free tier is fine)
   - Note your cluster connection string

2. **Configure Network Access:**
   - Go to "Network Access" → "Add IP Address"
   - For production: Add `0.0.0.0/0` to allow all IPs (or add your backend server's IP)
   - Click "Confirm"

3. **Create Database User:**
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Create a strong password and save it securely
   - Set user privileges to "Read and write to any database"

4. **Get Connection String:**
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with `agenda`

## Step 2: Backend Deployment

Deploy your Express server to a Node.js hosting platform. Examples:

### Option A: Railway

1. Go to [Railway](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_strong_jwt_secret_here
   NODE_ENV=production
   FRONTEND_URL=https://your-app.netlify.app
   PORT=5000
   ```
5. Deploy and note your Railway app URL

### Option B: Render

1. Go to [Render](https://render.com)
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Build command: `npm install`
5. Start command: `npm run server`
6. Add environment variables (same as Railway)
7. Deploy and note your Render service URL

### Option C: Heroku

1. Install Heroku CLI
2. Create a new app: `heroku create your-app-name`
3. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
   heroku config:set JWT_SECRET=your_strong_jwt_secret_here
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-app.netlify.app
   ```
4. Deploy: `git push heroku main`

## Step 3: Frontend Deployment (Netlify)

1. **Prepare for Deployment:**
   - Ensure your code is pushed to GitHub
   - Verify `next.config.js` is properly configured

2. **Deploy to Netlify:**
   - Go to [Netlify](https://www.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18` (or higher)

4. **Add Environment Variables:**
   - Go to Site settings → Environment variables
   - Add the following:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
     NODE_ENV=production
     ```
   - Replace `https://your-backend-url.com/api` with your actual backend API URL

5. **Deploy:**
   - Click "Deploy site"
   - Wait for the build to complete
   - Note your Netlify deployment URL (e.g., `https://your-app.netlify.app`)

6. **Update Backend CORS:**
   - Go back to your backend hosting platform
   - Update the `FRONTEND_URL` environment variable to your Netlify URL:
     ```
     FRONTEND_URL=https://your-app.netlify.app
     ```
   - Restart your backend server

7. **Update Frontend API URL (if needed):**
   - If your backend URL changed, update `NEXT_PUBLIC_API_URL` in Netlify
   - Trigger a new deployment

## Step 4: Verify Deployment

1. **Test Frontend:**
   - Visit your Netlify URL
   - Try registering a new user
   - Create an event
   - Verify data persists

2. **Test Backend:**
   - Visit `https://your-backend-url.com/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

3. **Check MongoDB Atlas:**
   - Go to MongoDB Atlas → Collections
   - Verify that data is being stored (users, events)

## Environment Variables Summary

### Backend (Production)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agenda?retryWrites=true&w=majority
JWT_SECRET=your_strong_jwt_secret_here
NODE_ENV=production
FRONTEND_URL=https://your-app.netlify.app
PORT=5000
```

### Frontend (Netlify)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NODE_ENV=production
```

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` in backend matches your Netlify URL exactly (including `https://`)
- Check that CORS is properly configured in `server/index.js`

### MongoDB Connection Errors
- Verify your MongoDB Atlas connection string is correct
- Check that your backend server's IP is whitelisted in MongoDB Atlas
- Ensure the database user password is correct

### API Not Responding
- Check your backend server logs
- Verify environment variables are set correctly
- Test the health endpoint: `https://your-backend-url.com/api/health`

### Frontend Build Errors
- Check Netlify build logs
- Verify all environment variables are set
- Ensure `NEXT_PUBLIC_API_URL` is set correctly

## Security Checklist

- [ ] Use strong, unique `JWT_SECRET` in production
- [ ] MongoDB Atlas database user has appropriate permissions
- [ ] Network access in MongoDB Atlas is properly configured
- [ ] HTTPS is enabled on both frontend and backend
- [ ] Environment variables are not committed to version control
- [ ] CORS is properly configured to only allow your frontend domain

## Next Steps

- Set up custom domain (optional)
- Configure SSL certificates (usually automatic)
- Set up monitoring and error tracking
- Configure backup strategy for MongoDB Atlas
- Set up CI/CD for automatic deployments

