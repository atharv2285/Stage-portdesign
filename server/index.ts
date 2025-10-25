import express from 'express';
import cors from 'cors';
import { Octokit } from '@octokit/rest';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const OAUTH_REDIRECT_URI = process.env.OAUTH_REDIRECT_URI || 'http://localhost:5000/github-callback';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings?.settings?.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    const cachedToken = connectionSettings.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;
    if (cachedToken) {
      return cachedToken;
    }
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  if (!hostname) {
    throw new Error('REPLIT_CONNECTORS_HOSTNAME not found');
  }

  const response = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub connection: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  connectionSettings = data.items?.[0];

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected. Please set up GitHub integration.');
  }
  
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

// OAuth endpoints for universal GitHub authentication
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
  } catch (error: any) {
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
    let octokit;
    
    // Try user-provided token first
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const userToken = authHeader.substring(7);
      octokit = new Octokit({ auth: userToken });
    } else {
      // Fall back to Replit connector if available
      octokit = await getUncachableGitHubClient();
    }
    
    const { data } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
      visibility: 'all'
    });
    res.json(data);
  } catch (error: any) {
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
    let octokit;
    
    // Try user-provided token first
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const userToken = authHeader.substring(7);
      octokit = new Octokit({ auth: userToken });
    } else {
      // Fall back to Replit connector if available
      octokit = await getUncachableGitHubClient();
    }
    
    const { data: user } = await octokit.users.getAuthenticated();
    res.json(user);
  } catch (error: any) {
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
    let octokit;
    
    // Try user-provided token first
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const userToken = authHeader.substring(7);
      octokit = new Octokit({ auth: userToken });
    } else {
      // Fall back to Replit connector if available
      octokit = await getUncachableGitHubClient();
    }
    
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
    console.error('YouTube API error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch YouTube stats' });
  }
});

// YouTube search endpoint (to find channel by name)
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

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query as string)}&key=${apiKey}&maxResults=5`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to search YouTube channels' });
    }

    const data = await response.json();
    res.json(data.items || []);
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
    console.error('Codeforces API error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch Codeforces stats' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
