import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useAppTheme } from 'src/hooks/use-theme-mode';

import { Iconify } from 'src/components/iconify';
import { FormProvider, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const { mode } = useAppTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email è obbligatorio')
      .email('Email deve essere un indirizzo email valido'),
    password: Yup.string().required('Password è obbligatorio'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError('');
      // Add your sign-in logic here
      console.log('DATA', data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push('/dashboard');
    } catch (exception: any) {
      console.error(exception);
      setError(exception.message);
    }
  });

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <RHFTextField 
        name="email" 
        label="Email" 
        placeholder="hello@gmail.com"
      />

      <Link 
        variant="body2" 
        color="inherit" 
        component={RouterLink}
        href="/forgot-password"
        sx={{ mb: 1.5, mt: 1 }}
      >
        Hai dimenticato la password?
      </Link>

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
        sx={{ mb: 3 }}
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
        Accedi
      </LoadingButton>
    </Box>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h4">Accedi</Typography>
        <Typography variant="body2" color="text.secondary">
          Non hai ancora un account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }} component={RouterLink} href="/sign-up">
            Crea un account
          </Link>
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {renderForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Oppure
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
    </FormProvider>
  );
}
