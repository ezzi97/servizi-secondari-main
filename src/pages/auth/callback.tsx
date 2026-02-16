import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/contexts/auth-context';

// ----------------------------------------------------------------------

export default function AuthCallbackPage() {
  const router = useRouter();
  const { loginWithToken } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase appends tokens as a URL hash fragment:
        // #access_token=...&refresh_token=...&token_type=bearer&...
        const hash = window.location.hash.substring(1); // remove the '#'
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');

        if (!accessToken) {
          // Check for error in the hash
          const errorDesc = params.get('error_description') || params.get('error');
          throw new Error(errorDesc || 'Nessun token ricevuto. Riprova il login.');
        }

        await loginWithToken(accessToken);

        // Check if this callback came from email verification
        const searchParams = new URLSearchParams(window.location.search);
        const isEmailConfirm = searchParams.get('type') === 'email_confirm';

        router.push(isEmailConfirm ? '/dashboard?verified=true' : '/dashboard');
      } catch (err: any) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Errore durante il login con Google');
        // Redirect to login after a delay
        setTimeout(() => router.push('/sign-in'), 3000);
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      {error ? (
        <>
          <Alert severity="error" sx={{ maxWidth: 400 }}>
            {error}
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Reindirizzamento al login...
          </Typography>
        </>
      ) : (
        <>
          <CircularProgress />
          <Typography variant="body1">Accesso in corso...</Typography>
        </>
      )}
    </Box>
  );
}
