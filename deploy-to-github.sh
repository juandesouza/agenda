#!/bin/bash

# Script to deploy to GitHub
# Run this after authenticating with GitHub CLI: gh auth login

echo "🚀 Deploying to GitHub..."

# Check if GitHub CLI is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ GitHub CLI not authenticated"
    echo "Please run: gh auth login"
    exit 1
fi

# Create repository and push
echo "📦 Creating GitHub repository..."
gh repo create agenda --public --source=. --remote=origin --push

if [ $? -eq 0 ]; then
    echo "✅ Successfully deployed to GitHub!"
    echo "📍 Repository URL: https://github.com/$(gh api user --jq .login)/agenda"
else
    echo "❌ Failed to create repository. It might already exist."
    echo "💡 Try: git remote add origin https://github.com/YOUR_USERNAME/agenda.git"
    echo "💡 Then: git push -u origin main"
fi

