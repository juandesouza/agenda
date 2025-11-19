#!/bin/bash

# Script to add GitHub Actions workflows after granting workflow scope
# Run this after: gh auth refresh -h github.com -s workflow

echo "🚀 Adding GitHub Actions workflows..."

cd "$(dirname "$0")"

# Check if authenticated with workflow scope
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated. Run: gh auth login"
    exit 1
fi

# Try to push workflows
echo "📦 Pushing workflows to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Workflows successfully added!"
    echo "📍 View them at: https://github.com/juandesouza/agenda/tree/main/.github/workflows"
else
    echo "⚠️  Push failed. You may need to grant workflow scope:"
    echo "   gh auth refresh -h github.com -s workflow"
    echo ""
    echo "Or add workflows manually via GitHub web interface:"
    echo "   1. Go to: https://github.com/juandesouza/agenda"
    echo "   2. Click 'Add file' → 'Create new file'"
    echo "   3. Create: .github/workflows/ci.yml"
    echo "   4. Copy content from local file"
fi

