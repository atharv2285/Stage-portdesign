const GITHUB_TOKEN_KEY = 'github_access_token';
const GITHUB_USER_KEY = 'github_user';

export interface GitHubAuthUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
}

class GitHubAuthService {
  getToken(): string | null {
    return localStorage.getItem(GITHUB_TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(GITHUB_TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(GITHUB_TOKEN_KEY);
    localStorage.removeItem(GITHUB_USER_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async getUserInfo(): Promise<GitHubAuthUser | null> {
    const cached = localStorage.getItem(GITHUB_USER_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  }

  setUserInfo(user: GitHubAuthUser): void {
    localStorage.setItem(GITHUB_USER_KEY, JSON.stringify(user));
  }

  async startOAuth(): Promise<string> {
    const response = await fetch('/api/github/oauth/authorize');
    const { authUrl, state } = await response.json();
    
    sessionStorage.setItem('github_oauth_state', state);
    
    return authUrl;
  }

  async exchangeCode(code: string): Promise<string> {
    const response = await fetch('/api/github/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to exchange authorization code');
    }

    const { access_token } = await response.json();
    this.setToken(access_token);
    
    return access_token;
  }

  disconnect(): void {
    this.removeToken();
  }
}

export const githubAuthService = new GitHubAuthService();
