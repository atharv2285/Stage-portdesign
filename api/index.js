// Vercel serverless function entry point
// This file is used only for Vercel deployments

import express from 'express';
import cors from 'cors';
import { Octokit } from '@octokit/rest';

const app = express();

app.use(cors());
app.use(express.json());

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const OAUTH_REDIRECT_URI = process.env.OAUTH_REDIRECT_URI || '';

// OAuth endpoints for universal GitHub authentication
// Note: In Vercel, /api/index.js handles all /api/* routes
app.get('/api/github/oauth/authorize', (req, res) => {
  const state = Math.random().toString(36).substring(7);
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(OAUTH_REDIRECT_URI)}&scope=repo,read:user,user:email&state=${state}`;
  res.json({ authUrl: githubAuthUrl, state });
});

app.post('/api/github/oauth/token', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: OAUTH_REDIRECT_URI
      })
    });

    const data = await tokenResponse.json();
    
    if (data.error) {
      return res.status(400).json({ error: data.error_description || data.error });
    }

    res.json({ access_token: data.access_token });
  } catch (error) {
    console.error('Failed to exchange token:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to exchange authorization code',
      details: error.toString()
    });
  }
});

// Updated repos endpoint to accept user token
app.get('/api/github/repos', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }
    
    const userToken = authHeader.substring(7);
    const octokit = new Octokit({ auth: userToken });
    
    const { data } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
      visibility: 'all'
    });
    res.json(data);
  } catch (error) {
    console.error('Failed to fetch repos:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch repositories',
      details: error.toString()
    });
  }
});

app.get('/api/github/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }
    
    const userToken = authHeader.substring(7);
    const octokit = new Octokit({ auth: userToken });
    
    const { data: user } = await octokit.users.getAuthenticated();
    res.json(user);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch user profile',
      details: error.toString()
    });
  }
});

app.get('/api/github/repos/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }
    
    const userToken = authHeader.substring(7);
    const octokit = new Octokit({ auth: userToken });
    
    const [repoData, readmeData, languagesData] = await Promise.allSettled([
      octokit.repos.get({ owner, repo }),
      octokit.repos.getReadme({ owner, repo }),
      octokit.repos.listLanguages({ owner, repo })
    ]);

    const repository = repoData.status === 'fulfilled' ? repoData.value.data : null;
    const readme = readmeData.status === 'fulfilled' 
      ? Buffer.from(readmeData.value.data.content, 'base64').toString('utf-8')
      : 'No README available';
    const languages = languagesData.status === 'fulfilled' ? languagesData.value.data : {};

    if (!repository) {
      return res.status(404).json({ error: 'Repository not found' });
    }

    res.json({
      repo: repository,
      readme,
      languages
    });
  } catch (error) {
    console.error('Failed to fetch repo details:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch repository details',
      details: error.toString()
    });
  }
});

// LeetCode API endpoint (no authentication required)
app.get('/api/leetcode/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            reputation
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
          contributions {
            points
          }
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch LeetCode data' });
    }

    const data = await response.json();
    
    if (!data.data?.matchedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(data.data.matchedUser);
  } catch (error) {
    console.error('LeetCode API error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch LeetCode stats' });
  }
});

// YouTube API endpoint (requires YOUTUBE_API_KEY)
app.get('/api/youtube/channel/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: 'YouTube API key not configured' });
    }

    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch YouTube data' });
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    res.json(data.items[0]);
  } catch (error) {
    console.error('YouTube API error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch YouTube stats' });
  }
});

// YouTube search endpoint
app.get('/api/youtube/search', async (req, res) => {
  try {
    const { query } = req.query;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: 'YouTube API key not configured' });
    }

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=5`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to search YouTube channels' });
    }

    const data = await response.json();
    res.json(data.items || []);
  } catch (error) {
    console.error('YouTube search error:', error);
    res.status(500).json({ error: error.message || 'Failed to search channels' });
  }
});

// LinkedIn API endpoint (requires RAPIDAPI_KEY)
app.post('/api/linkedin/profile', async (req, res) => {
  try {
    const { profileUrl } = req.body;
    const rapidApiKey = process.env.RAPIDAPI_KEY;

    if (!rapidApiKey) {
      return res.status(400).json({ error: 'RapidAPI key not configured' });
    }

    if (!profileUrl) {
      return res.status(400).json({ error: 'Profile URL is required' });
    }

    const response = await fetch(
      `https://fresh-linkedin-profile-data.p.rapidapi.com/get-profile-data-by-url?url=${encodeURIComponent(profileUrl)}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'fresh-linkedin-profile-data.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch LinkedIn data' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('LinkedIn API error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch LinkedIn profile' });
  }
});

// Codeforces API endpoint (no authentication required)
app.get('/api/codeforces/user/:handle', async (req, res) => {
  try {
    const { handle } = req.params;
    
    // Get user info
    const infoResponse = await fetch(
      `https://codeforces.com/api/user.info?handles=${handle}`
    );

    if (!infoResponse.ok) {
      const errorText = await infoResponse.text();
      console.error('Codeforces API error:', errorText);
      return res.status(500).json({ error: 'Failed to fetch Codeforces data' });
    }

    const infoData = await infoResponse.json();

    if (infoData.status !== 'OK') {
      return res.status(404).json({ error: infoData.comment || 'User not found' });
    }

    const user = infoData.result[0];

    // Get rating history
    const ratingResponse = await fetch(
      `https://codeforces.com/api/user.rating?handle=${handle}`
    );

    let totalContests = 0;
    if (ratingResponse.ok) {
      const ratingData = await ratingResponse.json();
      if (ratingData.status === 'OK') {
        totalContests = ratingData.result.length;
      }
    }

    res.json({
      ...user,
      totalContests,
    });
  } catch (error) {
    console.error('Codeforces API error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch Codeforces stats' });
  }
});

// Zerodha OAuth endpoints
app.get('/api/zerodha/oauth/authorize', (req, res) => {
  const apiKey = process.env.ZERODHA_API_KEY;
  
  if (!apiKey) {
    return res.status(400).json({ error: 'Zerodha API key not configured' });
  }

  // Zerodha callback URL - adjust based on environment
  const baseUrl = process.env.OAUTH_REDIRECT_URI 
    ? process.env.OAUTH_REDIRECT_URI.replace('/github-callback', '') 
    : 'http://localhost:5000';
  const zerodhaAuthUrl = `https://kite.zerodha.com/connect/login?api_key=${apiKey}&redirect_params=${encodeURIComponent(baseUrl + '/zerodha-callback')}`;
  
  res.json({ authUrl: zerodhaAuthUrl });
});

app.post('/api/zerodha/oauth/token', async (req, res) => {
  try {
    const { requestToken } = req.body;
    const apiKey = process.env.ZERODHA_API_KEY;
    const apiSecret = process.env.ZERODHA_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(400).json({ error: 'Zerodha API credentials not configured' });
    }

    if (!requestToken) {
      return res.status(400).json({ error: 'Request token is required' });
    }

    // Generate checksum: sha256(api_key + request_token + api_secret)
    const crypto = await import('crypto');
    const checksum = crypto.createHash('sha256')
      .update(apiKey + requestToken + apiSecret)
      .digest('hex');

    // Exchange request token for access token
    const tokenResponse = await fetch('https://api.kite.trade/session/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Kite-Version': '3'
      },
      body: new URLSearchParams({
        api_key: apiKey,
        request_token: requestToken,
        checksum: checksum
      })
    });

    const data = await tokenResponse.json();

    if (data.status === 'error') {
      return res.status(400).json({ error: data.message || 'Failed to get access token' });
    }

    res.json({ 
      access_token: data.data.access_token,
      user_id: data.data.user_id
    });
  } catch (error) {
    console.error('Zerodha token exchange error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to exchange token',
      details: error.toString()
    });
  }
});

// Zerodha endpoints
app.get('/api/zerodha/holdings', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!accessToken) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const response = await fetch('https://api.kite.trade/portfolio/holdings', {
      headers: {
        'Authorization': `token ${process.env.ZERODHA_API_KEY}:${accessToken}`,
        'X-Kite-Version': '3'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch holdings' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Zerodha holdings error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch holdings' });
  }
});

app.get('/api/zerodha/positions', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!accessToken) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const response = await fetch('https://api.kite.trade/portfolio/positions', {
      headers: {
        'Authorization': `token ${process.env.ZERODHA_API_KEY}:${accessToken}`,
        'X-Kite-Version': '3'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch positions' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Zerodha positions error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch positions' });
  }
});

// Market data endpoint
app.get('/api/market/indices', async (req, res) => {
  try {
    const indices = [
      { symbol: 'NIFTY 50', value: 22450.50, change: 125.30, changePercent: 0.56 },
      { symbol: 'SENSEX', value: 74250.25, change: 420.15, changePercent: 0.57 },
      { symbol: 'NIFTY BANK', value: 48320.80, change: -180.40, changePercent: -0.37 }
    ];
    
    res.json(indices);
  } catch (error) {
    console.error('Market indices error:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Company logo and info endpoint using Brandfetch (free API)
app.get('/api/company/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Company query parameter is required' });
    }

    const searchResponse = await fetch(
      `https://api.brandfetch.io/v2/search/${encodeURIComponent(query)}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!searchResponse.ok) {
      throw new Error(`Brandfetch search failed: ${searchResponse.statusText}`);
    }

    const results = await searchResponse.json();
    
    const companies = results.map((item) => ({
      name: item.name,
      domain: item.domain,
      icon: item.icon || `https://img.logo.dev/${item.domain}?token=pk_K9f7eo8kTJ6Z_hhQYR9LGQ`,
      description: item.description || '',
      industry: item.industry || ''
    }));

    res.json({ companies: companies.slice(0, 10) });
  } catch (error) {
    console.error('Company search failed:', error);
    res.status(500).json({ 
      error: 'Failed to search companies',
      details: error.message 
    });
  }
});

app.get('/api/company/logo', async (req, res) => {
  try {
    const { domain } = req.query;
    
    if (!domain || typeof domain !== 'string') {
      return res.status(400).json({ error: 'Domain parameter is required' });
    }

    const logoUrl = `https://img.logo.dev/${domain}?token=pk_K9f7eo8kTJ6Z_hhQYR9LGQ`;
    
    res.json({ logoUrl });
  } catch (error) {
    console.error('Logo fetch failed:', error);
    res.status(500).json({ 
      error: 'Failed to fetch company logo',
      details: error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Catch-all route for debugging
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Export the Express app for Vercel serverless functions
export default app;
