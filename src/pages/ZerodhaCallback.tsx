import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const ZerodhaCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting to Zerodha Kite...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const requestToken = params.get('request_token');
        const error = params.get('error');
        const state = params.get('state');

        if (error) {
          throw new Error(error);
        }

        if (!requestToken) {
          throw new Error('No request token received from Zerodha');
        }

        setMessage('Exchanging request token...');
        const response = await fetch('/api/zerodha/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ requestToken }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to exchange token');
        }

        const { access_token, user_id } = await response.json();
        
        // Store access token in localStorage
        localStorage.setItem('zerodha_access_token', access_token);
        localStorage.setItem('zerodha_user_id', user_id);

        setStatus('success');
        setMessage(`Successfully connected as ${user_id}! Redirecting...`);

        // Notify parent window if opened via window.open
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ 
            type: 'ZERODHA_AUTH_SUCCESS',
            accessToken: access_token,
            userId: user_id
          }, '*');
        }

        setTimeout(() => {
          window.close() || navigate('/');
        }, 2000);
      } catch (error: any) {
        console.error('Zerodha OAuth error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to connect to Zerodha');
        
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
