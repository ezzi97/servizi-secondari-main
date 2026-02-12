import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { RouterLink } from 'src/routes/components';

import { useAppTheme } from 'src/hooks/use-theme-mode';

import { FormProvider, RHFTextField } from 'src/components/hook-form';

export default function ForgotPasswordView() {
  const { mode } = useAppTheme();
  
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const ResetSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email è obbligatorio')
      .email('Email deve essere un indirizzo email valido'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetSchema),
    defaultValues: { email: '' },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError('');
      // Add your password reset logic here
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setEmailSent(true);
      reset();
      
    } catch (exception) {
      console.error(exception);
      setError('Si è verificato un errore. Riprova più tardi.');
    }
  });

  const renderForm = (
    <Stack spacing={3}>
      {!emailSent && (
        <RHFTextField 
          name="email" 
          label="Email" 
          placeholder="esempio@email.com"
        />
      )}

      {!emailSent && (
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
          Invia email di recupero
        </LoadingButton>
      )}
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ minHeight: 1 }}>
        <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
          <Typography variant="h4">Password dimenticata?</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Inserisci l&apos;email associata al tuo account e ti invieremo un link per reimpostare la password
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {emailSent ? (
          <Alert severity="success" sx={{ mb: 3 }}>
            Abbiamo inviato un link per reimpostare la password all&apos;indirizzo email fornito
          </Alert>
        ) : (
          renderForm
        )}

        <Link
          component={RouterLink}
          href="/"
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