# 🚀 GitHub Actions Quick Start

Your repository now has automated deployment set up! Here's how to activate it:

## ⚡ Quick Setup (5 minutes)

### 1. Get Netlify Credentials

**Netlify Auth Token:**
1. Go to https://app.netlify.com/user/applications
2. Click "New access token"
3. Name it "GitHub Actions"
4. Copy the token

**Netlify Site ID:**
1. Go to your Netlify site (or create one)
2. Site settings → General
3. Copy "Site ID"

### 2. Add GitHub Secrets

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add these 3 secrets:

```
NETLIFY_AUTH_TOKEN = [Your Netlify token]
NETLIFY_SITE_ID = [Your Netlify site ID]
NEXT_PUBLIC_API_URL = [Your backend URL, e.g., https://your-backend.railway.app/api]
```

### 3. That's It! 🎉

Now every time you push to `main`, GitHub Actions will:
- ✅ Run tests and linting
- ✅ Build your Next.js app
- ✅ Automatically deploy to Netlify

## 📋 Available Workflows

| Workflow | When It Runs | What It Does |
|----------|--------------|--------------|
| **CI** | Every push/PR | Lints and builds code |
| **Deploy to Netlify** | Push to main | Deploys frontend to Netlify |
| **Full Deployment** | Push to main | Complete CI/CD pipeline |

## 🔍 Check Status

- **View workflows:** GitHub repo → **Actions** tab
- **View deployments:** Netlify dashboard

## 🛠️ Manual Deployment

Want to deploy manually?

1. Go to **Actions** tab
2. Select **"Deploy to Netlify"**
3. Click **"Run workflow"**
4. Select branch → **Run**

## 📚 Full Documentation

See `.github/DEPLOYMENT_SETUP.md` for detailed instructions.

---

**Need help?** Check the GitHub Actions logs in the Actions tab for error messages.

