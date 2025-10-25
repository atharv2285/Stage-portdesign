import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { githubAuthService } from '@/services/githubAuthService';
import { getAuthenticatedUser } from '@/services/githubService';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const GitHubCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting to GitHub...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const error = params.get('error');

        if (error) {
          throw new Error(error);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        setMessage('Exchanging authorization code...');
        await githubAuthService.exchangeCode(code);

        setMessage('Fetching your profile...');
        const user = await getAuthenticatedUser();
        githubAuthService.setUserInfo({
          login: user.login,
          name: user.name,
          avatar_url: user.avatar_url,
          html_url: user.html_url
        });

        setStatus('success');
        setMessage('Successfully connected to GitHub! Closing tab...');

        // Notify the parent window if opened via window.open
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: 'GITHUB_AUTH_SUCCESS' }, '*');
        }

        setTimeout(() => {
          window.close();
        }, 1500);
      } catch (error: any) {
        console.error('GitHub OAuth error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to connect to GitHub');
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 animate-spin text-primary" />
              <h2 className="text-2xl font-bold">Connecting...</h2>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500" />
              <h2 className="text-2xl font-bold text-green-600">Success!</h2>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500" />
              <h2 className="text-2xl font-bold text-red-600">Error</h2>
            </>
          )}
          <p className="text-muted-foreground">{message}</p>
        </div>
      </Card>
    </div>
  );
};
