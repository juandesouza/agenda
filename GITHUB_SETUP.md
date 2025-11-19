# GitHub Repository Setup

Your code has been committed locally. To push to GitHub:

## Option 1: Using GitHub CLI (if installed)

```bash
gh repo create agenda --public --source=. --remote=origin --push
```

## Option 2: Manual Setup

1. Go to https://github.com/new
2. Create a new repository named "agenda" (or your preferred name)
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Copy the repository URL
5. Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/agenda.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Option 3: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/agenda.git
git branch -M main
git push -u origin main
```

## After Pushing

Your repository will be available at:
https://github.com/YOUR_USERNAME/agenda
