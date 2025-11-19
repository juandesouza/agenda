# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (REQUIRED - local MongoDB is no longer supported)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Backend (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agenda?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Production (for Netlify deployment)
FRONTEND_URL=https://your-app.netlify.app
```

**Important**: 
- `MONGODB_URI` is **REQUIRED** in production. In development, if not set, the app will use in-memory MongoDB (data will be lost on restart).
- Replace the MongoDB URI with your actual MongoDB Atlas connection string.
- For production deployment, set `FRONTEND_URL` to your Netlify deployment URL.

### 3. Generate PWA Icons

You need to create PWA icons in the `public/icons/` directory. Required sizes:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

You can use online tools like [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator) or create them manually.

### 4. Run the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 5. Production Build

```bash
# Build frontend
npm run build

# Start production servers
npm start  # Frontend
npm run server  # Backend
```

## MongoDB Setup

### MongoDB Atlas (REQUIRED)

The application now uses MongoDB Atlas exclusively. Local MongoDB is no longer supported.

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier is available)
3. Create a database user:
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Create a strong password and save it
4. Whitelist IP addresses:
   - Go to "Network Access" → "Add IP Address"
   - For development: Add your current IP or use `0.0.0.0/0` (allows all IPs - use with caution)
   - For production: Add your server's IP address or use `0.0.0.0/0` if your server IP changes
5. Get your connection string:
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with `agenda` (or your preferred database name)
   - Add it to your `.env` file as `MONGODB_URI`

**Example connection string:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/agenda?retryWrites=true&w=majority
```

### Development Fallback

If `MONGODB_URI` is not set in development, the app will automatically use in-memory MongoDB. **Note:** Data will be lost when the server restarts. Always set `MONGODB_URI` for persistent data storage.

## Features

- ✅ User authentication (register/login)
- ✅ JWT token-based security
- ✅ Full calendar views (month, week, day)
- ✅ Event CRUD operations
- ✅ Multilingual support (5 languages)
- ✅ PWA capabilities
- ✅ Responsive design
- ✅ Color-coded events per user

## Deployment to Netlify

### Frontend Deployment (Netlify)

1. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18.x or higher

2. **Environment Variables (in Netlify Dashboard):**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api-url.com/api
   NODE_ENV=production
   ```

3. **Backend Deployment:**
   - Deploy your Express server to a platform like:
     - Heroku
     - Railway
     - Render
     - DigitalOcean App Platform
     - Or any Node.js hosting service

4. **Backend Environment Variables:**
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_production_jwt_secret
   PORT=5000 (or your platform's assigned port)
   NODE_ENV=production
   FRONTEND_URL=https://your-app.netlify.app
   ```

5. **Update Frontend API URL:**
   - After deploying the backend, update `NEXT_PUBLIC_API_URL` in Netlify to point to your backend URL

### Important Notes for Production

- **MongoDB Atlas:** Ensure your MongoDB Atlas cluster allows connections from your backend server's IP address
- **CORS:** The `FRONTEND_URL` environment variable must match your Netlify deployment URL exactly
- **Security:** Use strong, unique values for `JWT_SECRET` in production
- **HTTPS:** Both frontend and backend should use HTTPS in production

## Troubleshooting

### MongoDB Connection Issues

- Verify your MongoDB Atlas connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas Network Access
- Ensure the database user password in the connection string is correct
- Check MongoDB Atlas cluster status (ensure it's not paused)
- In production, verify your server's IP is whitelisted in MongoDB Atlas

### Port Already in Use

- Change `PORT` in `.env` for backend
- Change Next.js port: `npm run dev -- -p 3001`

### Service Worker Not Registering

- Ensure you're accessing via `http://localhost` (not `127.0.0.1`)
- Check browser console for errors
- Clear browser cache and reload

## Next Steps

1. Customize the color scheme in `tailwind.config.ts`
2. Add more event types or categories
3. Implement push notifications for event reminders
4. Add event sharing capabilities
5. Implement recurring events

