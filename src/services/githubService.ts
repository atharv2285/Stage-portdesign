import { Octokit } from '@octokit/rest';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings?.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = import.meta.env.VITE_REPLIT_CONNECTORS_HOSTNAME || process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = import.meta.env.VITE_REPL_IDENTITY 
    ? 'repl ' + import.meta.env.VITE_REPL_IDENTITY 
    : import.meta.env.VITE_WEB_REPL_RENEWAL 
    ? 'depl ' + import.meta.env.VITE_WEB_REPL_RENEWAL 
    : process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!hostname) {
    throw new Error('REPLIT_CONNECTORS_HOSTNAME not found. GitHub integration requires running in Replit environment.');
  }

  if (!xReplitToken) {
    throw new Error('Authentication token not found. Please make sure you are running in Replit.');
  }

  try {
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
      throw new Error('GitHub not connected. Please set up GitHub integration in the Replit sidebar.');
    }
    
    return accessToken;
  } catch (error: any) {
    console.error('GitHub access token error:', error);
    throw error;
  }
}

export async function getGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  languages_url: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface RepoDetails {
  repo: GitHubRepo;
  readme: string;
  languages: { [key: string]: number };
}

export async function searchUserRepos(username: string): Promise<GitHubRepo[]> {
  const octokit = await getGitHubClient();
  const { data } = await octokit.repos.listForUser({
    username,
    sort: 'updated',
    per_page: 30
  });
  return data as GitHubRepo[];
}

export async function getAuthenticatedUserRepos(): Promise<GitHubRepo[]> {
  const octokit = await getGitHubClient();
  const { data } = await octokit.repos.listForAuthenticatedUser({
    sort: 'updated',
    per_page: 100,
    visibility: 'all'
  });
  return data as GitHubRepo[];
}

export async function getRepoDetails(owner: string, repo: string): Promise<RepoDetails> {
  const octokit = await getGitHubClient();
  
  const [repoData, readmeData, languagesData] = await Promise.allSettled([
    octokit.repos.get({ owner, repo }),
    octokit.repos.getReadme({ owner, repo }),
    octokit.repos.listLanguages({ owner, repo })
  ]);

  const repository = repoData.status === 'fulfilled' ? repoData.value.data : null;
  const readme = readmeData.status === 'fulfilled' 
    ? atob(readmeData.value.data.content) 
    : 'No README available';
  const languages = languagesData.status === 'fulfilled' ? languagesData.value.data : {};

  if (!repository) {
    throw new Error('Repository not found');
  }

  return {
    repo: repository as GitHubRepo,
    readme,
    languages
  };
}
