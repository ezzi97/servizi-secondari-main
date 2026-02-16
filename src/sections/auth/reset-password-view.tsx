import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { RouterLink } from 'src/routes/components';

import { useAppTheme } from 'src/hooks/use-theme-mode';

import { authService } from 'src/services';

import { Iconify } from 'src/components/iconify';
import { FormProvider, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function ResetPasswordView() {
  const { mode } = useAppTheme();

  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  // Extract the access_token from the URL hash on mount
  // Supabase appends: #access_token=...&token_type=bearer&type=recovery
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const type = params.get('type');

    if (accessToken && type === 'recovery') {
      setToken(accessToken);
    } else {
      setInvalidLink(true);
    }
  }, []);

  const ResetSchema = Yup.object().shape({
    password: Yup.string()
      .required('La nuova password è obbligatoria')
      .min(6, 'La password deve essere di almeno 6 caratteri'),
    confirmPassword: Yup.string()
      .required('Conferma la password')
      .oneOf([Yup.ref('password')], 'Le password non corrispondono'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError('');
      const response = await authService.resetPassword(token, data.password);

      if (!response.success) {
        throw new Error(response.message || 'Errore durante il reset della password');
      }

      setSuccess(true);
    } catch (exception: any) {
      console.error(exception);
      setError(exception.message || 'Si è verificato un errore. Riprova più tardi.');
    }
  });

  if (invalidLink) {
    return (
      <Stack spacing={3} sx={{ minHeight: 1 }}>
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h4">Link non valido</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Il link di recupero password non è valido o è scaduto. Richiedi un nuovo link.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Link
            component={RouterLink}
            href="/forgot-password"
            color="inherit"
            variant="subtitle2"
          >
            Richiedi nuovo link
          </Link>

          <Link
            component={RouterLink}
            href="/sign-in"
            color="inherit"
            variant="subtitle2"
          >
            Torna al login
          </Link>
        </Stack>
      </Stack>
    );
  }

  if (success) {
    return (
      <Stack spacing={3} sx={{ minHeight: 1 }}>
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h4">Password reimpostata</Typography>
        </Stack>

        <Alert severity="success" sx={{ mb: 3 }}>
          La tua password è stata reimpostata con successo. Ora puoi accedere con la nuova password.
        </Alert>

        <Link
          component={RouterLink}
          href="/sign-in"
          color="inherit"
          variant="subtitle2"
          sx={{
            mx: 'auto',
            alignItems: 'center',
            display: 'inline-flex',
          }}
        >
          <Box component="span">Vai al login</Box>
        </Link>
      </Stack>
    );
  }

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ minHeight: 1 }}>
        <Stack spacing={2} sx={{ mb: 5 }}>
          <Typography variant="h4">Reimposta la password</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Inserisci la tua nuova password
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          <RHFTextField
            name="password"
            label="Nuova password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <RHFTextField
            name="confirmPassword"
            label="Conferma password"
            type={showConfirmPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    <Iconify icon={showConfirmPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{
              bgcolor: mode === 'light' ? 'grey.800' : 'grey.50',
              color: mode === 'light' ? 'common.white' : 'grey.800',
              '&:hover': {
                bgcolor: mode === 'light' ? 'grey.700' : 'grey.200',
              },
            }}
          >
            Reimposta password
          </LoadingButton>
        </Stack>

        <Link
          component={RouterLink}
          href="/sign-in"
          color="inherit"
          variant="subtitle2"
          sx={{
            mt: 3,
            mx: 'auto',
            alignItems: 'center',
            display: 'inline-flex',
          }}
        >
          <Box component="span" sx={{ ml: 1 }}>Torna al login</Box>
        </Link>
      </Stack>
    </FormProvider>
  );
}
