import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Instagram, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../store/slices/userSlice';

interface ConnectInstagramStepProps {
  userId: string;
  onConnected?: () => void; // called when connection succeeds, so parent can advance the wizard
}

type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error';

export default function ConnectInstagramStep({ userId, onConnected }: ConnectInstagramStepProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch();

  // Check for redirect result when this component mounts (after coming back from Instagram)
  useEffect(() => {
    const connected = searchParams.get('ig_connected');
    const error = searchParams.get('ig_error');

    if (connected === 'true') {
      setStatus('connected');
      onConnected?.();
      // Clean the URL so refresh doesn't re-trigger this
      searchParams.delete('ig_connected');
      setSearchParams(searchParams, { replace: true });
      // Clean up the stashed uid
      localStorage.removeItem('ig_connect_uid');
    }

    if (error) {
      setStatus('error');
      setErrorMessage(
        error === 'access_denied'
          ? 'You need to approve access to connect your Instagram account.'
          : 'Something went wrong connecting your account. Please try again.'
      );
      searchParams.delete('ig_error');
      setSearchParams(searchParams, { replace: true });
    }
  }, []);

  // Listen for postMessage from the popup window (if opened as popup)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'INSTAGRAM_CONNECTED') {
        setStatus('connected');
        if (event.data?.data?.user) {
          dispatch(updateUserInfo(event.data.data.user));
        }
        onConnected?.();
        localStorage.removeItem('ig_connect_uid');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [dispatch, onConnected]);

  const handleConnect = async () => {
    setStatus('connecting');
    console.log('Connecting Instagram for userId:', userId);

    // Always use the frontend origin for the callback — Instagram must redirect back
    // to the frontend, not the backend API server.
    const frontendOrigin = window.location.origin;
    const callbackUri = `${frontendOrigin}/instagram-callback`;

    try {
      const res = await fetch(`/api/instagram/auth-url?redirectUri=${encodeURIComponent(callbackUri)}`);
      const data = await res.json();

      if (!data.url) {
        console.error('No auth URL returned:', data);
        setStatus('error');
        setErrorMessage('Could not get Instagram auth URL. Please try again.');
        return;
      }

      // Stash userId so InstagramCallbackPage can retrieve it after the OAuth redirect
      localStorage.setItem('ig_connect_uid', userId);
      localStorage.setItem('ig_redirect_uri', callbackUri);

      window.location.href = data.url;
    } catch (err) {
      console.error('Failed to get Instagram auth URL:', err);
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-tr from-pink-500 to-orange-400">
          <Instagram className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Connect Instagram</h3>
          <p className="text-sm text-gray-500">Verify your followers and content stats</p>
        </div>
      </div>

      {status === 'connected' ? (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-lg p-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">Instagram connected successfully!</span>
        </div>
      ) : status === 'error' ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3">
            <XCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{errorMessage}</span>
          </div>
          <button
            onClick={handleConnect}
            className="w-full py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
          >
            Try again
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={status === 'connecting'}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-orange-400 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {status === 'connecting' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirecting to Instagram...
            </>
          ) : (
            <>
              <Instagram className="w-4 h-4" />
              Connect Instagram
            </>
          )}
        </button>
      )}
    </div>
  );
}