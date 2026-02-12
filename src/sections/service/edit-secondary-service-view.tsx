import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Alert, Stack, Typography, CircularProgress } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { serviceService } from 'src/services';

import { FormProvider } from 'src/components/hook-form';

import SecondaryServiceForm, { SecondaryServiceSchema, secondaryServiceDefaultValues } from './secondary-service-form';

export function EditSecondaryServiceView() {
  const router = useRouter();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [serviceData, setServiceData] = useState<any>(null);

  const methods = useForm({
    resolver: yupResolver(SecondaryServiceSchema),
    defaultValues: secondaryServiceDefaultValues,
    mode: 'onChange',
  });

  // Fetch service data from API
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);

        const response = await serviceService.getService(id!);

        if (!response.success || !response.data) {
          setError('Servizio non trovato');
          return;
        }

        const service = response.data;
        setServiceData(service);
        methods.reset(service as any);
      } catch (err) {
        console.error(err);
        setError('Errore nel caricamento dei dati');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServiceData();
    }
  }, [id, methods]);

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      setError('');
      const response = await serviceService.updateService(id!, data as any);

      if (!response.success) {
        throw new Error(response.message || 'Errore nell\'aggiornamento');
      }

      router.push('/servizi');
    } catch (exception: any) {
      console.error(exception);
      setError(exception.message || 'Si è verificato un errore. Riprova più tardi.');
    }
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !serviceData) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

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
            <Typography variant="h4">Modifica Servizio Secondario</Typography>
          </Stack>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <SecondaryServiceForm isSubmitting={methods.formState.isSubmitting} isEditMode />
        </Stack>
      </form>
    </FormProvider>
  );
}
