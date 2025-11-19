# GitHub Actions Deployment Setup

This guide explains how to configure GitHub Actions for automatic deployment.

## 🚀 Available Workflows

### 1. **CI Workflow** (`.github/workflows/ci.yml`)
- Runs on every push and pull request
- Lints code
- Builds the Next.js app
- Ensures code quality before deployment

### 2. **Deploy to Netlify** (`.github/workflows/deploy.yml`)
- Automatically deploys frontend to Netlify on push to main
- Can be triggered manually via GitHub Actions UI
- Requires Netlify secrets configured

### 3. **Full Deployment Pipeline** (`.github/workflows/full-deploy.yml`)
- Complete CI/CD pipeline
- Runs tests, builds, and deploys
- Most comprehensive option

## 📋 Setup Instructions

### Step 1: Configure Netlify Secrets

1. **Get Netlify Auth Token:**
   - Go to https://app.netlify.com/user/applications
   - Click "New access token"
   - Give it a name (e.g., "GitHub Actions")
   - Copy the token

2. **Get Netlify Site ID:**
   - Go to your Netlify site dashboard
   - Go to Site settings → General
   - Copy the "Site ID"

3. **Add Secrets to GitHub:**
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add these secrets:
     - `NETLIFY_AUTH_TOKEN`: Your Netlify access token
     - `NETLIFY_SITE_ID`: Your Netlify site ID
     - `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., `https://your-backend.railway.app/api`)

### Step 2: Connect Netlify to GitHub (Alternative)

If you prefer Netlify's built-in deployment:

1. Go to Netlify dashboard
2. Add new site → Import from Git
3. Connect your GitHub repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Environment variables:
     - `NEXT_PUBLIC_API_URL`: Your backend URL
     - `NODE_ENV`: `production`

This will auto-deploy on every push to main.

### Step 3: (Optional) Backend Deployment

For automatic backend deployment to Railway:

1. **Get Railway Token:**
   - Install Railway CLI: `npm install -g @railway/cli`
   - Login: `railway login`
   - Get token: `railway whoami`

2. **Add to GitHub Secrets:**
   - `RAILWAY_TOKEN`: Your Railway token

3. **Configure Railway:**
   - Create a new project on Railway
   - Connect your GitHub repository
   - Set environment variables in Railway dashboard

## 🔄 How It Works

### Automatic Deployment Flow:

```
Push to main branch
    ↓
GitHub Actions triggers
    ↓
Run CI (lint + build)
    ↓
Deploy to Netlify
    ↓
Site is live! 🎉
```

### Manual Deployment:

1. Go to GitHub repository → Actions tab
2. Select "Deploy to Netlify" workflow
3. Click "Run workflow"
4. Select branch and click "Run"

## 🔍 Monitoring Deployments

- **GitHub Actions:** Repository → Actions tab
- **Netlify:** Netlify dashboard → Deploys
- **Status Badge:** Add to README.md:
  ```markdown
  ![Deploy](https://github.com/YOUR_USERNAME/agenda/workflows/Deploy%20to%20Netlify/badge.svg)
  ```

## 🛠️ Troubleshooting

### Deployment Fails

1. **Check GitHub Actions logs:**
   - Go to Actions tab
   - Click on failed workflow
   - Review error messages

2. **Common Issues:**
   - Missing secrets: Ensure all required secrets are set
   - Build errors: Check Next.js build logs
   - Netlify auth: Verify token is valid

### Build Fails

- Check `npm run build` works locally
- Verify environment variables are set correctly
- Check Next.js configuration

### Secrets Not Working

- Ensure secrets are named exactly as shown
- Secrets are case-sensitive
- Restart workflow after adding secrets

## 📝 Environment Variables Reference

### Required for Deployment:

| Variable | Description | Where to Set |
|----------|-------------|--------------|
| `NETLIFY_AUTH_TOKEN` | Netlify API token | GitHub Secrets |
| `NETLIFY_SITE_ID` | Your Netlify site ID | GitHub Secrets |
| `NEXT_PUBLIC_API_URL` | Backend API URL | GitHub Secrets + Netlify |

### Optional:

| Variable | Description | Default |
|----------|-------------|---------|
| `RAILWAY_TOKEN` | Railway deployment token | - |
| `NODE_ENV` | Environment mode | `production` |

## ✅ Verification

After setup:

1. Make a small change to your code
2. Commit and push to main
3. Check GitHub Actions tab
4. Verify deployment succeeded
5. Check Netlify dashboard for new deploy
6. Visit your site to confirm changes are live

---

**Your deployment is now automated!** Every push to main will automatically deploy to Netlify. 🚀

