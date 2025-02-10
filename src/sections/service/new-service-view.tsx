import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'src/routes/hooks';
import { useAppTheme } from 'src/hooks/use-theme-mode';
import { FormProvider } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import SportServiceForm from './sport-service-form';
import SecondaryServiceForm, { SecondaryServiceSchema, secondaryServiceDefaultValues, SECONDARY_STEPS } from './secondary-service-form';

// Service Categories
const SERVICE_CATEGORIES = [
  { 
    value: 'secondary', 
    label: 'Servizi Secondari',
    icon: 'lineicons:ambulance',
    description: 'Servizi di trasporto sanitario secondario',
    color: '#2196F3', // blue
  },
  { 
    value: 'sport', 
    label: 'Servizi Sportivi',
    icon: 'solar:basketball-bold',
    description: 'Servizi per eventi sportivi',
    color: '#4CAF50', // green
  },
] as const;

export default function NewServiceView() {
  const router = useRouter();
  const { mode } = useAppTheme();
  
  const [error, setError] = useState('');
  const [serviceCategory, setServiceCategory] = useState<'secondary' | 'sport' | ''>('');
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const methods = useForm({
    resolver: yupResolver(SecondaryServiceSchema),
    defaultValues: secondaryServiceDefaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError('');
      // Add your service creation logic here
      console.log('DATA', data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push('/services');
    } catch (exception) {
      console.error(exception);
      setError('Si è verificato un errore. Riprova più tardi.');
    }
  });

  const handleCategorySelect = (value: 'secondary' | 'sport') => {
    setServiceCategory(value);
    setActiveStep(0);
  };

  const renderServiceSelection = () => (
    <Card sx={{ p: { xs: 2, sm: 4 } }}>
      <Stack spacing={3}>
        <Typography variant="h4" sx={{ textAlign: 'center' }}>
          Seleziona il tipo di servizio
        </Typography>
        
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Scegli il tipo di servizio che desideri creare
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            },
          }}
        >
          {SERVICE_CATEGORIES.map((category) => (
            <Card
              key={category.value}
              sx={{
                p: 3,
                cursor: 'pointer',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                transform: serviceCategory === category.value ? 'scale(1.02)' : 'scale(1)',
                bgcolor: 'background.paper',
                border: (themed) => `solid 1px ${alpha(themed.palette.grey[500], 0.12)}`,
                ...(serviceCategory === category.value && {
                  borderColor: category.color,
                  boxShadow: (themed) => `0 8px 16px 0 ${alpha(category.color, 0.16)}`,
                }),
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: (themed) => `0 8px 16px 0 ${alpha(themed.palette.grey[500], 0.16)}`,
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
              }}
              onClick={() => handleCategorySelect(category.value)}
            >
              <Stack
                spacing={2.5}
                alignItems="center"
                sx={{
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: '50%',
                    bgcolor: (themed) => alpha(themed.palette.primary.main, 0.08),
                    ...(serviceCategory === category.value && {
                      bgcolor: 'primary.main',
                    }),
                  }}
                >
                  <Iconify
                    icon={category.icon}
                    width={32}
                    sx={{
                      color: (themed) => 
                        serviceCategory === category.value 
                          ? 'common.white'
                          : themed.palette.primary.main,
                    }}
                  />
                </Box>

                <Stack spacing={0.5}>
                  <Typography variant="h6">{category.label}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {category.description}
                  </Typography>
                </Stack>
              </Stack>

              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  ...(serviceCategory !== category.value && {
                    display: 'none',
                  }),
                }}
              >
                <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'primary.main' }} />
              </Box>
            </Card>
          ))}
        </Box>
      </Stack>
    </Card>
  );

  const renderBackToSelection = () => (
    <Button 
      color="inherit" 
      onClick={() => setServiceCategory('')}
      startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
      sx={{ 
        mb: 3,
        py: 1.5,
        width: { xs: '100%', sm: 'auto' },
        borderRadius: 1,
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
        '&:hover': {
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16),
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Tipo di servizio:
        </Typography>
        <Typography variant="subtitle2">
          {SERVICE_CATEGORIES.find(c => c.value === serviceCategory)?.label}
        </Typography>
      </Stack>
    </Button>
  );

  const renderContent = () => {
    if (!serviceCategory) {
      return renderServiceSelection();
    }

    if (serviceCategory === 'sport') {
      return (
        <>
          {renderBackToSelection()}
          <SportServiceForm />
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="flex-end"
            sx={{ mt: 4 }}
          >
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => router.back()}
            >
              Annulla
            </Button>
            <LoadingButton
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
              Crea servizio
            </LoadingButton>
          </Stack>
        </>
      );
    }

    return (
      <>
        {renderBackToSelection()}
        <Stack spacing={4}>
          <SecondaryServiceForm 
            activeStep={activeStep}
            onNext={handleNext}
            onBack={handleBack}
            isLastStep={activeStep === SECONDARY_STEPS.length - 1}
            errors={methods.formState.errors}
            currentStepValid={Object.keys(methods.formState.errors).length === 0}
            isSubmitting={isSubmitting}
          />
        </Stack>
      </>
    );
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={4} sx={{ mb: 4, p: 4 }}>
        <Stack 
          direction="row" 
          alignItems="center" 
          justifyContent="center"
          sx={{ mb: 1 }}
        >
          <Typography variant="h4">Nuovo Servizio</Typography>
        </Stack>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {renderContent()}
      </Stack>
    </FormProvider>
  );
} 