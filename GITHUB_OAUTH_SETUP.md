# GitHub OAuth Setup Guide

This portfolio application uses GitHub OAuth to allow users to connect their GitHub accounts and import repositories. This works on any hosting platform (Vercel, Replit, etc.).

## Setup Steps

###1. Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in the details:
   - **Application name**: Your Portfolio (or any name you prefer)
   - **Homepage URL**: 
     - Development: `http://localhost:5000`
     - Production (Vercel): `https://your-domain.vercel.app`
   - **Authorization callback URL**:
     - Development: `http://localhost:5000/github-callback`
     - Production (Vercel): `https://your-domain.vercel.app/github-callback`
4. Click "Register application"
5. You'll get a **Client ID** - copy this
6. Click "Generate a new client secret" and copy the **Client Secret**

### 2. Configure Environment Variables

Create a `.env` file in your project root with the following:

```env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
OAUTH_REDIRECT_URI=http://localhost:5000/github-callback
```

For **Vercel deployment**, add these as environment variables in your Vercel project settings and update the `OAUTH_REDIRECT_URI` to your production URL.

### 3. Update for Production

When deploying to Vercel:
1. Go to your Vercel project settings
2. Add environment variables:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `OAUTH_REDIRECT_URI` (set to `https://your-domain.vercel.app/github-callback`)
3. Redeploy your application

## How It Works

1. Users click "Connect GitHub" in the Add Project dialog
2. They're redirected to GitHub to authorize the app
3. GitHub redirects back with an authorization code
4. The code is exchanged for an access token (handled securely by your backend)
5. The token is stored in localStorage (client-side only)
6. Users can now import their repositories

## Security Notes

- **Client Secret** stays on the server (never exposed to frontend)
- **Access tokens** are stored in user's browser localStorage
- Each user connects their own GitHub account
- Tokens are used only for API calls to GitHub

## Permissions

The OAuth app requests these scopes:
- `repo` - Access to repositories
- `read:user` - Read user profile information  
- `user:email` - Access to user email
