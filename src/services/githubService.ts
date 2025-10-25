
export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  homepage: string | null;
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

export async function getAuthenticatedUserRepos(): Promise<GitHubRepo[]> {
  const response = await fetch('/api/github/repos');
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to fetch repositories' }));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data as GitHubRepo[];
}

export async function getRepoDetails(owner: string, repo: string): Promise<RepoDetails> {
  const response = await fetch(`/api/github/repos/${owner}/${repo}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to fetch repository details' }));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data as RepoDetails;
}
