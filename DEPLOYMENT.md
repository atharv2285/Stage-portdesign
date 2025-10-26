# Portfolio Deployment Guide

This guide explains how to deploy your portfolio application to **Vercel**, **Render**, or **Railway**. All three platforms support free tiers and work with the universal GitHub OAuth setup.

---

## 🎯 Overview

Your portfolio is structured as a **monorepo** containing:
- **Frontend**: React + Vite (builds to `/dist` folder)
- **Backend**: Express.js API server
- **APIs**: GitHub, LeetCode, Codeforces, YouTube, LinkedIn, Zerodha, Brandfetch

The application uses **universal GitHub OAuth** that works on any hosting platform.

---

## 📋 Prerequisites

Before deploying, you need:

### 1. GitHub OAuth App

Create a GitHub OAuth application at https://github.com/settings/developers

**For Vercel:**
- **Homepage URL**: `https://your-app-name.vercel.app`
- **Authorization callback URL**: `https://your-app-name.vercel.app/github-callback`

**For Render:**
- **Homepage URL**: `https://your-app-name.onrender.com`
- **Authorization callback URL**: `https://your-app-name.onrender.com/github-callback`

**For Railway:**
- **Homepage URL**: `https://your-app-name.up.railway.app`
- **Authorization callback URL**: `https://your-app-name.up.railway.app/github-callback`

Save your:
- `Client ID`
- `Client Secret`

### 2. Optional API Keys

- **YouTube API Key**: Get from [Google Cloud Console](https://console.cloud.google.com) (free)
- **RapidAPI Key**: For LinkedIn integration (optional, has free tier)
- **Zerodha API Key**: For investment portfolio (optional)

---

## 🚀 Deployment Options

---

## Option 1: Deploy to Vercel (Serverless)

Vercel is the **easiest** option with automatic deployments from GitHub.

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Deploy via GitHub (Recommended)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/new)
3. Click **Import Project**
4. Select your GitHub repository
5. Vercel will auto-detect settings (no configuration needed!)
6. Click **Deploy**

### Step 3: Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
OAUTH_REDIRECT_URI=https://your-app-name.vercel.app/github-callback
YOUTUBE_API_KEY=your_youtube_api_key (optional)
RAPIDAPI_KEY=your_rapidapi_key (optional)
ZERODHA_API_KEY=your_zerodha_api_key (optional)
```

### Step 4: Redeploy

After adding environment variables, trigger a new deployment:
- Push a commit to GitHub, OR
- Click **Redeploy** in Vercel Dashboard

**Done!** Your app is live at `https://your-app-name.vercel.app`

---

## Option 2: Deploy to Render

Render is great for **full-stack apps** and offers a generous free tier.

### Step 1: Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Select your repository

### Step 2: Configure Build Settings

Render will auto-detect Node.js. Configure:

- **Name**: `portfolio-app`
- **Environment**: `Node`
- **Branch**: `main`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: `Free`

### Step 3: Add Environment Variables

In Render Dashboard → Environment tab, add:

```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
OAUTH_REDIRECT_URI=https://portfolio-app.onrender.com/github-callback
YOUTUBE_API_KEY=your_youtube_api_key (optional)
RAPIDAPI_KEY=your_rapidapi_key (optional)
ZERODHA_API_KEY=your_zerodha_api_key (optional)
NODE_ENV=production
```

### Step 4: Deploy

Click **Create Web Service**. Render will:
1. Install dependencies
2. Build your React app
3. Start the Express server

**Important**: Free tier apps spin down after 15 minutes of inactivity. First request may take 30-60 seconds.

**Done!** Your app is live at `https://portfolio-app.onrender.com`

---

## Option 3: Deploy to Railway

Railway offers the **best performance** on free tier with no spin-down.

### Step 1: Install Railway CLI (Optional)

```bash
npm i -g @railway/cli
railway login
```

### Step 2: Deploy via GitHub

1. Go to [Railway Dashboard](https://railway.app/new)
2. Click **Deploy from GitHub**
3. Select your repository
4. Railway auto-detects Node.js

### Step 3: Configure Settings

Railway automatically:
- Runs `npm install && npm run build`
- Starts with `npm start`
- Assigns a public URL

### Step 4: Add Environment Variables

In Railway Dashboard → Variables tab, add:

```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
OAUTH_REDIRECT_URI=https://your-app-name.up.railway.app/github-callback
YOUTUBE_API_KEY=your_youtube_api_key (optional)
RAPIDAPI_KEY=your_rapidapi_key (optional)
ZERODHA_API_KEY=your_zerodha_api_key (optional)
NODE_ENV=production
```

### Step 5: Redeploy

Railway automatically redeploys on environment variable changes.

**Done!** Your app is live at `https://your-app-name.up.railway.app`

---

## 🔧 How It Works

### Vercel Architecture (Serverless)

```
User Request → Vercel Edge Network
                ├── /api/* → Serverless Function (api/index.js)
                └── /* → Static React App (dist/)
```

- Backend runs as **serverless functions** (`api/index.js`)
- Frontend served as **static files** from `/dist`
- Cold starts: ~100-300ms

### Render/Railway Architecture (Always-On)

```
User Request → Render/Railway Server
                ├── Express Server (server/index.js)
                ├── /api/* → API Routes
                └── /* → Static React Files (dist/)
```

- Backend runs as a **traditional Node.js server**
- Frontend served by Express from `/dist`
- No cold starts (Railway), cold starts on Render free tier

---

## 🧪 Testing Your Deployment

### 1. Check Backend Health

```bash
curl https://your-app.vercel.app/health
# Should return: {"status":"ok","message":"Backend server is running"}
```

### 2. Test GitHub OAuth

1. Visit your deployed app
2. Click "Import from GitHub"
3. Authorize GitHub app
4. You should see your repositories

### 3. Test Other APIs

- **LeetCode**: Add your username in Profiles tab
- **Codeforces**: Add handle in Profiles tab
- **YouTube**: Add channel ID (requires API key)

---

## 🐛 Troubleshooting

### Issue: "Authorization token required" on GitHub

**Solution**: Make sure you've:
1. Created GitHub OAuth app with correct callback URL
2. Added `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to environment variables
3. Set `OAUTH_REDIRECT_URI` to match your deployed URL

### Issue: API endpoints return 404

**Vercel**: Make sure `vercel.json` exists with correct routing config
**Render/Railway**: Check that server is listening on `0.0.0.0` not `localhost`

### Issue: Changes not appearing

**Vercel**: Trigger new deployment from dashboard
**Render/Railway**: Push new commit to GitHub (auto-deploys)

### Issue: Build fails

Check build logs for errors. Common fixes:
- Ensure all dependencies are in `dependencies` (not `devDependencies`)
- Node.js version compatibility (use 18.x or 20.x)

### Issue: Server crashes immediately

**Check environment variables**: Missing required vars like `PORT` on some platforms

---

## 🎨 Custom Domains

All three platforms support custom domains:

### Vercel
1. Dashboard → Settings → Domains
2. Add your domain
3. Configure DNS records as shown

### Render
1. Dashboard → Settings → Custom Domain
2. Add domain
3. Update CNAME record

### Railway
1. Dashboard → Settings → Domains
2. Add custom domain
3. Point DNS to Railway

---

## 💰 Cost Comparison (Free Tiers)

| Platform | Build Minutes | Bandwidth | Cold Starts | Best For |
|----------|--------------|-----------|-------------|----------|
| **Vercel** | 6000 min/month | 100GB/month | Yes (~100ms) | Static sites, serverless APIs |
| **Render** | 750 hours | Unlimited | Yes (~30-60s) | Full-stack apps |
| **Railway** | $5 credit/month | No limit | No | Always-on apps, best performance |

---

## 📦 What Gets Deployed

```
Production Bundle:
├── dist/                 # Built React app (HTML, CSS, JS)
├── server/index.js       # Compiled Express server (Render/Railway)
├── api/index.js         # Serverless function (Vercel only)
├── package.json         # Dependencies
├── node_modules/        # Installed packages
└── vercel.json          # Vercel config (Vercel only)
```

---

## 🔐 Security Notes

1. **Never commit secrets** to GitHub
2. Always use environment variables for API keys
3. Keep `GITHUB_CLIENT_SECRET` private
4. Rotate API keys if accidentally exposed
5. Use HTTPS for production (all platforms provide free SSL)

---

## 🚀 Continuous Deployment

All platforms support **automatic deployments**:

1. Push to GitHub main branch
2. Platform detects changes
3. Runs build automatically
4. Deploys new version
5. Zero downtime!

---

## 📞 Support

- **Vercel**: https://vercel.com/docs
- **Render**: https://render.com/docs
- **Railway**: https://docs.railway.app

---

**Congratulations!** Your portfolio is now live and accessible worldwide! 🎉

Choose the platform that best fits your needs:
- **Vercel**: Easiest, best for static + serverless
- **Render**: Traditional hosting, great free tier
- **Railway**: Best performance, no cold starts
