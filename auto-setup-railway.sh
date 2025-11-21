#!/bin/bash

# Automatic Railway Setup Script
# Run this after: railway login

set -e

echo "🚂 Railway Automatic Setup"
echo "========================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway"
    echo ""
    echo "Please run: railway login"
    echo "Then run this script again: ./auto-setup-railway.sh"
    exit 1
fi

echo "✅ Logged in to Railway"
echo ""

# Link to project if not already linked
if [ ! -f .railway/project.json ]; then
    echo "📎 Linking to Railway project..."
    echo "Please select your project when prompted"
    railway link
fi

echo ""
echo "⚙️  Setting environment variables..."
echo ""

# Generate or use existing JWT_SECRET
JWT_SECRET="J6tgT1l0AGg/CWBE6C7PlqbuZNAzOX/VHdQtfyXoLTw="
echo "🔑 Setting JWT_SECRET..."
railway variables set JWT_SECRET="$JWT_SECRET" 2>&1 | grep -v "warning" || echo "   (may already be set)"

# Set NODE_ENV
echo "🔧 Setting NODE_ENV=production..."
railway variables set NODE_ENV=production 2>&1 | grep -v "warning" || echo "   (may already be set)"

echo ""
echo "📋 MongoDB Connection:"
echo "   ⚠️  MongoDB connection must be set via Railway dashboard:"
echo "   1. Go to Railway → Your backend service → Variables"
echo "   2. Click 'Reference Variable'"
echo "   3. Select your MongoDB service"
echo "   4. Select MONGO_URL or DATABASE_URL"
echo ""

# List current variables
echo "📊 Current environment variables:"
railway variables 2>&1 | grep -E "(JWT_SECRET|NODE_ENV|MONGO|DATABASE|FRONTEND)" || echo "   (run 'railway variables' to see all)"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Connect MongoDB via Railway dashboard (see above)"
echo "   2. Set FRONTEND_URL after Netlify deployment:"
echo "      railway variables set FRONTEND_URL=https://your-app.netlify.app"
echo "   3. Railway will auto-redeploy"
echo ""

