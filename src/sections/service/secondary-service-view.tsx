import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, Stack, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { FormProvider } from 'src/components/hook-form';

import SecondaryServiceForm, { SecondaryServiceSchema, secondaryServiceDefaultValues } from './secondary-service-form';

export function SecondaryServiceView() {
  const router = useRouter();
  const [error, setError] = useState('');

  const methods = useForm({
    resolver: yupResolver(SecondaryServiceSchema),
    defaultValues: secondaryServiceDefaultValues,
    mode: 'onChange',
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      setError('');
      console.log('DATA', data);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      router.push('/servizi');
    } catch (exception) {
      console.error(exception);
      setError('Si è verificato un errore. Riprova più tardi.');
    }
  });

  return (
    <FormProvider methods={methods}>
      <form onSubmit={onSubmit}>
      <Stack spacing={4} sx={{ mb: 4, p: 4 }}>
            <Stack 
            direction="row" 
            alignItems="center" 
            justifyContent="center"
            sx={{ mb: 1 }}
        >
        <Typography variant="h4">Nuovo Servizio Secondario</Typography>
        </Stack>
        
        {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
            {error}
        </Alert>
        )}
        <SecondaryServiceForm isSubmitting={methods.formState.isSubmitting} />
        </Stack>
      </form>
    </FormProvider>
  );
} 