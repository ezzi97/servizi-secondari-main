import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

import { useAppTheme } from 'src/hooks/use-theme-mode';
import { Iconify } from 'src/components/iconify';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function SignUpView() {
  const { mode } = useAppTheme();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [error, setError] = useState('');
  
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (registrationSuccess && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (registrationSuccess && countdown === 0) {
      router.push('/');
    }
    return () => clearTimeout(timer);
  }, [registrationSuccess, countdown, router]);

  const SignUpSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('Nome è obbligatorio')
      .min(2, 'Nome deve essere almeno 2 caratteri'),
    lastName: Yup.string()
      .required('Cognome è obbligatorio')
      .min(2, 'Cognome deve essere almeno 2 caratteri'),
    email: Yup.string()
      .required('Email è obbligatorio')
      .email('Email deve essere un indirizzo email valido'),
    password: Yup.string()
      .required('Password è obbligatorio')
      .min(8, 'Password deve essere almeno 8 caratteri')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password deve contenere almeno una lettera maiuscola, una minuscola e un numero'
      ),
    confirmPassword: Yup.string()
      .required('Conferma password è obbligatorio')
      .oneOf([Yup.ref('password')], 'Le password non corrispondono'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(SignUpSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError('');
      setRegistrationSuccess(false);
      // Add your sign-up logic here
      console.log('DATA', data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setRegistrationSuccess(true);
      setCountdown(5);
      reset();
      
    } catch (exception) {
      console.error(exception);
      setError('Si è verificato un errore durante la registrazione. Riprova più tardi.');
      setRegistrationSuccess(false);
    }
  });

  const renderForm = (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="firstName" label="Nome" />
        <RHFTextField name="lastName" label="Cognome" />
      </Stack>

      <RHFTextField name="email" label="Email" />

      <RHFTextField
        name="password"
        label="Password"
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
        Crea account
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <Stack spacing={2.5}>
          <Typography variant="h4">Crea un account</Typography>

          <Stack direction="row" spacing={0.5}>
            <Typography variant="body2">Hai già un account?</Typography>

            <Link component={RouterLink} href="/" variant="subtitle2">
              Accedi
            </Link>
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {registrationSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Account creato con successo! Verrai reindirizzato al login in {countdown} secondi...
          </Alert>
        )}

        {renderForm}

        <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Oppure registrati con
          </Typography>
        </Divider>

        <Box gap={1} display="flex" justifyContent="center">
          <IconButton color="inherit">
            <Iconify icon="logos:google-icon" />
          </IconButton>
          <IconButton color="inherit">
            <Iconify icon="eva:github-fill" />
          </IconButton>
          <IconButton color="inherit">
            <Iconify icon="ri:twitter-x-fill" />
          </IconButton>
        </Box>
      </Stack>
    </FormProvider>
  );
} 