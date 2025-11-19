# Create GitHub Repository

Since you don't have the repository on GitHub yet, here are two ways to create it:

## Method 1: Using GitHub CLI (Easiest)

1. **Authenticate:**
   ```bash
   gh auth login
   ```
   - Follow the prompts
   - Choose GitHub.com
   - Choose your preferred authentication method (browser or token)

2. **Create and push:**
   ```bash
   ./deploy-to-github.sh
   ```
   
   OR manually:
   ```bash
   gh repo create agenda --public --source=. --remote=origin --push
   ```

## Method 2: Manual (No CLI)

1. **Create repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `agenda`
   - Description: "Full-stack multilingual PWA calendar"
   - Choose Public or Private
   - ⚠️ **DO NOT** check:
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license
   - Click "Create repository"

2. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/agenda.git
   git branch -M main
   git push -u origin main
   ```
   
   Replace `YOUR_USERNAME` with your actual GitHub username.

## Verify

After pushing, check:
- https://github.com/YOUR_USERNAME/agenda
- All your files should be there
- Ready to connect to Netlify!

---

**Quick Command (if GitHub CLI is authenticated):**
```bash
gh auth login && gh repo create agenda --public --source=. --remote=origin --push
```

