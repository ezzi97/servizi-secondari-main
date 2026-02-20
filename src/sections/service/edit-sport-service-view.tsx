import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Alert, Stack, Typography, CircularProgress } from '@mui/material';

import { track } from '@vercel/analytics';

import { useRouter } from 'src/routes/hooks';

import { useToast } from 'src/hooks/use-toast';

import { serviceService } from 'src/services';

import { FormProvider } from 'src/components/hook-form';

import SportServiceForm, { sportServiceDefaultValues } from './sport-service-form';

export function EditSportServiceView() {
  const router = useRouter();
  const { id } = useParams();
  const { success: showSuccess, error: showError } = useToast();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serviceData, setServiceData] = useState<any>(null);

  const methods = useForm({
    defaultValues: { ...sportServiceDefaultValues, status: 'draft' },
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Submit handler: bypass validation, always send data to API
  const submitData = async () => {
    const data = methods.getValues();
    try {
      setSubmitting(true);
      setError('');
      const response = await serviceService.updateService(id!, data as any);

      if (!response.success) {
        throw new Error(response.message || 'Errore nell\'aggiornamento');
      }

      track('Service Edited', { type: 'sport', service_id: id ?? '' });
      showSuccess('Servizio aggiornato con successo');
      router.push('/tutti-servizi');
    } catch (exception: any) {
      console.error(exception);
      const msg = exception.message || 'Si è verificato un errore. Riprova più tardi.';
      setError(msg);
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // handleSubmit wraps submitData so it handles preventDefault for us.
  // Both onValid and onInvalid call submitData — we allow saving incomplete data.
  const onSubmit = methods.handleSubmit(
    async () => { await submitData(); },
    async () => { await submitData(); }
  );

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
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={4} sx={{ mb: 4, p: 4 }}>
        <Stack 
          direction="row" 
          alignItems="center" 
          justifyContent="center"
          sx={{ mb: 1 }}
        >
          <Typography variant="h4">Modifica Servizio Sportivo</Typography>
        </Stack>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <SportServiceForm isSubmitting={submitting} isEditMode />
      </Stack>
    </FormProvider>
  );
}
