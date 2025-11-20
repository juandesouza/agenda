#!/bin/bash

# Railway Setup Script
# This script helps configure Railway environment variables

echo "🚂 Railway Setup Script"
echo "======================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found"
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Not logged in to Railway"
    echo "Please run: railway login"
    exit 1
fi

echo "✅ Railway CLI ready"
echo ""

# Generate JWT_SECRET
JWT_SECRET=$(openssl rand -base64 32)
echo "🔑 Generated JWT_SECRET: ${JWT_SECRET:0:20}..."
echo ""

# Check if linked to project
if [ ! -f .railway/project.json ]; then
    echo "📎 Linking to Railway project..."
    railway link
fi

echo "⚙️  Setting environment variables..."
echo ""

# Set JWT_SECRET
echo "Setting JWT_SECRET..."
railway variables set JWT_SECRET="$JWT_SECRET" 2>&1

# Set NODE_ENV
echo "Setting NODE_ENV=production..."
railway variables set NODE_ENV=production 2>&1

echo ""
echo "📋 Next steps:"
echo "1. In Railway dashboard, connect MongoDB service to your backend:"
echo "   • Go to your backend service"
echo "   • Variables → Reference Variable"
echo "   • Select MongoDB service"
echo "   • Select MONGO_URL or DATABASE_URL"
echo ""
echo "2. Set FRONTEND_URL (after Netlify deployment):"
echo "   railway variables set FRONTEND_URL=https://your-app.netlify.app"
echo ""
echo "3. Redeploy your service"
echo ""
echo "✅ JWT_SECRET and NODE_ENV are now set!"

