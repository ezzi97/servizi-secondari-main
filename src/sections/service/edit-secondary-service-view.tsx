import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router-dom';

import { Alert, Stack, Typography, CircularProgress, Box } from '@mui/material';

// Import mock data first to fix import order
import { _users } from 'src/_mock';
import { useRouter } from 'src/routes/hooks';
import { FormProvider } from 'src/components/hook-form';
import SecondaryServiceForm, { SecondaryServiceSchema, secondaryServiceDefaultValues } from './secondary-service-form';

// Extended user type to include all the properties we need
interface ExtendedUserProps {
  id: string;
  name: string;
  visit: string;
  timestamp: string;
  status: string;
  avatarUrl: string;
  phone?: string;
  address?: string;
  date?: string;
  time?: string;
  pickupLocation?: string;
  destinationType?: string;
  pickupTime?: string;
  vehicle?: string;
  position?: string;
  equipment?: string[];
  difficulties?: string[];
  notes?: string;
}

export function EditSecondaryServiceView() {
  const router = useRouter();
  const { id } = useParams(); // Get the service ID from URL
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [serviceData, setServiceData] = useState<any>(null);

  const methods = useForm({
    resolver: yupResolver(SecondaryServiceSchema),
    defaultValues: secondaryServiceDefaultValues,
    mode: 'onChange',
  });

  // Fetch service data based on ID
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from an API
        // For now, we'll simulate with a timeout and mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Find the service in mock data
        const service = _users.find(user => user.id === id) as ExtendedUserProps;
        
        if (!service) {
          setError('Servizio non trovato');
          return;
        }
        
        // Transform the data to match the form structure
        const formattedData = {
          patientInfo: {
            name: service.name,
            phone: service.phone || '',
            address: service.address || '',
          },
          serviceInfo: {
            type: service.visit || '',
            date: service.date ? new Date(service.date) : null,
            time: service.time || '',
          },
          transportInfo: {
            pickupLocation: service.pickupLocation || '',
            destinationType: service.destinationType || '',
            pickupTime: service.pickupTime || '',
          },
          serviceDetails: {
            vehicle: service.vehicle || '',
            position: service.position || '',
            equipment: service.equipment || [],
            difficulties: service.difficulties || [],
            notes: service.notes || '',
          }
        };
        
        setServiceData(formattedData);
        
        // Reset form with the fetched data
        methods.reset(formattedData as any);
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
      console.log('UPDATED DATA', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/servizi');
    } catch (exception) {
      console.error(exception);
      setError('Si è verificato un errore. Riprova più tardi.');
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