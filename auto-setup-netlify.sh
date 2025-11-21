#!/bin/bash

# Automatic Netlify Setup Script
# Run this after: netlify login

set -e

echo "🌐 Netlify Automatic Setup"
echo "========================"
echo ""

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Check if logged in
if ! netlify status &> /dev/null; then
    echo "❌ Not logged in to Netlify"
    echo ""
    echo "Please run: netlify login"
    echo "Then run this script again: ./auto-setup-netlify.sh"
    exit 1
fi

echo "✅ Logged in to Netlify"
echo ""

# Check if site is linked
if [ ! -f .netlify/state.json ]; then
    echo "📎 Linking to Netlify site..."
    echo "Please select your site when prompted"
    netlify link
fi

echo ""
echo "⚙️  Setting environment variables..."
echo ""

# Get Railway backend URL (user needs to provide or we can try to detect)
RAILWAY_URL="${RAILWAY_URL:-https://web-production-97ce3.up.railway.app}"

echo "🔗 Setting NEXT_PUBLIC_API_URL..."
echo "   Using Railway URL: $RAILWAY_URL/api"
netlify env:set NEXT_PUBLIC_API_URL "$RAILWAY_URL/api" 2>&1 | grep -v "warning" || echo "   (may already be set)"

echo "🔧 Setting NODE_ENV=production..."
netlify env:set NODE_ENV production 2>&1 | grep -v "warning" || echo "   (may already be set)"

echo ""
echo "📊 Current environment variables:"
netlify env:list 2>&1 | grep -E "(NEXT_PUBLIC_API_URL|NODE_ENV)" || echo "   (run 'netlify env:list' to see all)"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Note: If your Railway URL is different, update it:"
echo "   netlify env:set NEXT_PUBLIC_API_URL https://your-railway-url.railway.app/api"
echo ""
echo "🚀 Netlify will auto-redeploy with new variables"
echo ""

