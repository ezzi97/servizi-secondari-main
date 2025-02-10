import { Stack, Card, Typography, Box, MenuItem, RadioGroup, FormControlLabel, Radio, Checkbox, Button, useTheme, useMediaQuery, Alert, Divider, Grid, Stepper, Step, StepLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { RHFTextField } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { useFormContext } from 'react-hook-form';
import { Theme, alpha } from '@mui/material/styles';
import { useRouter } from 'src/routes/hooks';

// Constants (move these to a separate constants file if you prefer)
const TRANSPORT_TYPES = ['Ospedale', 'Casa', 'Centro medico', 'Clinica', 'Altro'];
const VEHICLES = ['Ambulanza', 'Auto medica', 'Pulmino', 'Auto'];
const POSITIONS = ['Seduto', 'Barella', 'Carrozzina'];
const EQUIPMENT = ['Ossigeno', 'Aspiratore', 'Monitor', 'Defibrillatore'];
const DIFFICULTIES = ['Scale', 'Peso', 'Spazi stretti', 'Ascensore non funzionante'];

// Constants for Secondary Service
const SECONDARY_STEPS = [
  'Paziente',
  'Servizio',
  'Trasporto',
  'Dettagli trasporto',
  'Note e altri dettagli',
  'Riepilogo'
];

const SecondaryServiceSchema = Yup.object().shape({
  // Patient section
  serviceDate: Yup.string().required('Data servizio è obbligatoria'),
  patientName: Yup.string().required('Nome e cognome sono obbligatori'),
  phoneNumber: Yup.string().required('Recapito telefonico è obbligatorio'),
  
  // Service section
  serviceType: Yup.string().required('Tipo di servizio è obbligatorio'),
  arrivalTime: Yup.string().required('Orario di arrivo è obbligatorio'),
  departureTime: Yup.string().required('Orario di partenza è obbligatorio'),
  
  // Pick up section
  pickupAddress: Yup.string().required('Indirizzo di partenza è obbligatorio'),
  pickupType: Yup.string().required('Tipo di luogo è obbligatorio'),
  pickupTime: Yup.string().required('Orario è obbligatorio'),
  
  // Drop off section
  dropoffAddress: Yup.string().required('Indirizzo di destinazione è obbligatorio'),
  dropoffType: Yup.string().required('Tipo di luogo è obbligatorio'),
  dropoffTime: Yup.string().required('Orario è obbligatorio'),
  
  // Transport section
  vehicle: Yup.string().required('Mezzo è obbligatorio'),
  equipment: Yup.array(),
  position: Yup.string().required('Posizione è obbligatoria'),
  difficulties: Yup.array(),
  
  // Additional info
  notes: Yup.string(),
  kilometers: Yup.number().min(0, 'I chilometri non possono essere negativi'),
  price: Yup.number().min(0, 'Il prezzo non può essere negativo'),
});

export const secondaryServiceDefaultValues = {
  serviceDate: '',
  patientName: '',
  phoneNumber: '',
  serviceType: '',
  arrivalTime: '',
  departureTime: '',
  pickupAddress: '',
  pickupType: '',
  pickupTime: '',
  dropoffAddress: '',
  dropoffType: '',
  dropoffTime: '',
  vehicle: '',
  equipment: [],
  position: '',
  difficulties: [],
  notes: '',
  kilometers: 0,
  price: 0,
};

export { SecondaryServiceSchema, SECONDARY_STEPS };

interface SecondaryServiceFormProps {
  activeStep: number;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
  isSubmitting: boolean;
  errors: Record<string, any>;
  currentStepValid: boolean;
}

function StepperContent({ activeStep }: { activeStep: number }) {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'));

  return (
    <Stack spacing={2}>
      {isMobile ? (
        // Mobile view: Two rows with 3 steps each
        <>
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{
              '& .MuiStepLabel-label': {
                typography: 'caption',
              },
            }}
          >
            {SECONDARY_STEPS.slice(0, 3).map((label, index) => (
              <Step key={label}>
                <StepLabel>{`${index + 1}. ${label}`}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Stepper 
            activeStep={Math.max(activeStep - 3, -1)} 
            alternativeLabel
            sx={{
              '& .MuiStepLabel-label': {
                typography: 'caption',
              },
            }}
          >
            {SECONDARY_STEPS.slice(3).map((label, index) => (
              <Step key={label}>
                <StepLabel>{`${index + 4}. ${label}`}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </>
      ) : (
        // Tablet/Desktop view: Single row
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          sx={{
            '& .MuiStepLabel-label': {
              typography: isTablet ? 'caption' : 'body2',
            },
          }}
        >
          {SECONDARY_STEPS.map((label, index) => (
            <Step key={label}>
              <StepLabel>{`${index + 1}. ${label}`}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
    </Stack>
  );
}

export default function SecondaryServiceForm({ 
  activeStep, 
  onNext, 
  onBack, 
  isLastStep,
  isSubmitting,
  errors,
  currentStepValid,
}: SecondaryServiceFormProps) {
  const methods = useFormContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Card sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={4}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1
                  }}
                >
                  <Iconify icon="solar:user-outline" width={24} />
                </Box>
                <Box>
                  <Typography variant="h6">Paziente</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                    Inserisci i dati del paziente che necessita del servizio
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={3} sx={{ pt: 1 }}>
                <RHFTextField
                  name="serviceDate"
                  label="Data servizio"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  helperText="Seleziona la data in cui verrà effettuato il servizio"
                  sx={{ '& .MuiFormHelperText-root': { mx: 0 } }}
                />
                <RHFTextField 
                  name="patientName" 
                  label="Cognome e Nome"
                  placeholder="es. Mario Rossi" 
                />
                <RHFTextField 
                  name="phoneNumber" 
                  label="Recapito telefonico"
                  placeholder="es. 333 1234567" 
                />
              </Stack>
            </Stack>
          </Card>
        );

      case 1:
        return (
          <Card sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={4}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1
                  }}
                >
                  <Iconify icon="solar:calendar-outline" width={24} />
                </Box>
                <Box>
                  <Typography variant="h6">Servizio</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                    Dettagli del servizio richiesto
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={3} sx={{ pt: 1 }}>
                <RHFTextField 
                  name="serviceType" 
                  label="Tipo di servizio"
                  placeholder="es. Trasporto programmato" 
                />
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  <RHFTextField
                    name="arrivalTime"
                    label="In sede alle ore"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                  />
                  <RHFTextField
                    name="departureTime"
                    label="Partenza sede alle ore"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Stack>
            </Stack>
          </Card>
        );

      case 2:
        return (
          <Card sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={4}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1
                  }}
                >
                  <Iconify icon="lineicons:ambulance" width={24} />
                </Box>
                <Box>
                  <Typography variant="h6">Trasporto</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                    Informazioni sul trasporto del paziente
                  </Typography>
                </Box>
              </Stack>

              <Stack divider={<Divider flexItem sx={{ my: 2 }} />}>
                {/* Pickup Section */}
                <Stack spacing={3}>
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                    Paziente trasportato da
                  </Typography>
                  <RHFTextField name="pickupAddress" label="Indirizzo" multiline rows={2} />
                  <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                    <RHFTextField name="pickupType" label="Tipo" select>
                      {TRANSPORT_TYPES.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </RHFTextField>
                    <RHFTextField
                      name="pickupTime"
                      label="Alle ore"
                      type="time"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                </Stack>

                {/* Dropoff Section */}
                <Stack spacing={3}>
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                    Paziente trasportato a
                  </Typography>
                  <RHFTextField name="dropoffAddress" label="Indirizzo" multiline rows={2} />
                  <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                    <RHFTextField name="dropoffType" label="Tipo">
                      {TRANSPORT_TYPES.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </RHFTextField>
                    <RHFTextField
                      name="dropoffTime"
                      label="Alle ore"
                      type="time"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Card>
        );

      case 3:
        return (
          <Card sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={4}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1
                  }}
                >
                  <Iconify icon="solar:info-square-outline" width={24} />
                </Box>
                <Box>
                  <Typography variant="h6">Dettagli Trasporto</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                    Specifiche del trasporto e presidi utilizzati
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={4}>
                <RHFTextField name="vehicle" label="Mezzo utilizzato" select>
                  {VEHICLES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </RHFTextField>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Presidi
                  </Typography>
                  <Stack 
                    spacing={1} 
                    direction={isMobile ? 'column' : 'row'}
                    sx={{
                      ...(isMobile && {
                        '& .MuiFormControlLabel-root': {
                          mx: 0,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          p: 1,
                          width: '100%',
                        },
                      }),
                    }}
                  >
                    {EQUIPMENT.map((item) => (
                      <FormControlLabel 
                        key={item} 
                        control={<Checkbox />} 
                        label={item}
                      />
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Paziente trasportato in
                  </Typography>
                  <RadioGroup name="position">
                    <Stack 
                      spacing={1} 
                      direction={isMobile ? 'column' : 'row'}
                      sx={{
                        ...(isMobile && {
                          '& .MuiFormControlLabel-root': {
                            mx: 0,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            p: 1,
                            width: '100%',
                          },
                        }),
                      }}
                    >
                      {POSITIONS.map((item) => (
                        <FormControlLabel 
                          key={item} 
                          value={item} 
                          control={<Radio />} 
                          label={item}
                        />
                      ))}
                    </Stack>
                  </RadioGroup>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Difficoltà nel servizio
                  </Typography>
                  <Stack 
                    spacing={1} 
                    direction={isMobile ? 'column' : 'row'}
                    sx={{
                      ...(isMobile && {
                        '& .MuiFormControlLabel-root': {
                          mx: 0,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          p: 1,
                          width: '100%',
                        },
                      }),
                    }}
                  >
                    {DIFFICULTIES.map((item) => (
                      <FormControlLabel 
                        key={item} 
                        control={<Checkbox />} 
                        label={item}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </Card>
        );

      case 4:
        return (
          <Card sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={4}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1
                  }}
                >
                  <Iconify icon="solar:notebook-outline" width={24} />
                </Box>
                <Box>
                  <Typography variant="h6">Note e altri dettagli</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                    Informazioni aggiuntive e dettagli del servizio
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={3}>
                <RHFTextField name="notes" label="Note" multiline rows={3} />
              </Stack>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <RHFTextField name="kilometers" label="Chilometri percorsi" type="number"
                InputProps={{
                  startAdornment: <Iconify icon="solar:map-arrow-square-bold" sx={{ color: 'text.disabled', mr: 1 }} />,
                }}/>
                <RHFTextField name="price" label="Prezzo del servizio" type="number"
                InputProps={{
                  startAdornment: <Iconify icon="solar:dollar-bold" sx={{ color: 'text.disabled', mr: 1 }} />,
                }}/>
              </Stack>
            </Stack>
          </Card>
        );

      case 5:
        return (
          <Card sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="h6">Riepilogo del servizio</Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  Verifica i dati inseriti prima di creare il servizio
                </Typography>
              </Box>

              <Stack spacing={3} divider={<Divider flexItem />}>
                {/* Patient Section */}
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="solar:user-outline" width={24} />
                    <Typography variant="h6">Dati del paziente</Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">Data servizio</Typography>
                      <Typography>{methods.watch('serviceDate') || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">Nome paziente</Typography>
                      <Typography>{methods.watch('patientName') || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">Telefono</Typography>
                      <Typography>{methods.watch('phoneNumber') || '-'}</Typography>
                    </Grid>
                  </Grid>
                </Stack>

                {/* Service Section */}
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="solar:calendar-outline" width={24} />
                    <Typography variant="h6">Dettagli servizio</Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">Tipo servizio</Typography>
                      <Typography>{methods.watch('serviceType') || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">In sede alle</Typography>
                      <Typography>{methods.watch('arrivalTime') || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">Partenza sede</Typography>
                      <Typography>{methods.watch('departureTime') || '-'}</Typography>
                    </Grid>
                  </Grid>
                </Stack>

                {/* Transport Section */}
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="lineicons:ambulance" width={24} />
                    <Typography variant="h6">Trasporto</Typography>
                  </Stack>

                  <Box sx={{ 
                    display: 'grid', 
                    gap: 2,
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: '1fr 1fr'
                    }
                  }}>
                    {/* Pickup Box */}
                    <Box sx={{ 
                      p: 2.5, 
                      bgcolor: (themed) => themed.palette.mode === 'light' 
                        ? 'background.neutral'
                        : alpha(themed.palette.background.default, 0.4),
                      borderRadius: 1,
                      height: '100%',
                      border: (themed) => `solid 1px ${alpha(themed.palette.grey[500], 0.08)}`
                    }}>
                      <Stack spacing={2}>
                        <Stack 
                          direction={{ xs: 'column', sm: 'row' }} 
                          alignItems={{ sm: 'center' }} 
                          spacing={1}
                          sx={{ mb: 1 }}
                        >
                          <Iconify icon="eva:navigation-2-fill" width={20} sx={{ color: 'primary.main' }} />
                          <Typography variant="subtitle2">Trasportato da:</Typography>
                        </Stack>

                        <Stack spacing={2}>
                          <Typography variant="body2">{methods.watch('pickupAddress') || '-'}</Typography>
                          <Stack 
                            direction={{ xs: 'column', sm: 'row' }} 
                            spacing={{ xs: 1, sm: 3 }}
                            divider={
                              <Divider 
                                orientation="vertical"
                                flexItem 
                                sx={{ borderStyle: 'dashed' }}
                              />
                            }
                          >
                            <Stack direction="row" spacing={1}>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Tipo:</Typography>
                              <Typography variant="caption">{methods.watch('pickupType') || '-'}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Ore:</Typography>
                              <Typography variant="caption">{methods.watch('pickupTime') || '-'}</Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Box>

                    {/* Dropoff Box */}
                    <Box sx={{ 
                      p: 2.5, 
                      bgcolor: (themed) => themed.palette.mode === 'light' 
                        ? 'background.neutral'
                        : alpha(themed.palette.background.default, 0.4),
                      borderRadius: 1,
                      height: '100%',
                      border: (themed) => `solid 1px ${alpha(themed.palette.grey[500], 0.08)}`
                    }}>
                      <Stack spacing={2}>
                        <Stack 
                          direction={{ xs: 'column', sm: 'row' }} 
                          alignItems={{ sm: 'center' }} 
                          spacing={1}
                          sx={{ mb: 1 }}
                        >
                          <Iconify icon="eva:pin-fill" width={20} sx={{ color: 'error.main' }} />
                          <Typography variant="subtitle2">Trasportato a:</Typography>
                        </Stack>

                        <Stack spacing={2}>
                          <Typography variant="body2">{methods.watch('dropoffAddress') || '-'}</Typography>
                          <Stack 
                            direction={{ xs: 'column', sm: 'row' }} 
                            spacing={{ xs: 1, sm: 3 }}
                            divider={
                              <Divider 
                                orientation="vertical" 
                                flexItem 
                                sx={{ borderStyle: 'dashed' }}
                              />
                            }
                          >
                            <Stack direction="row" spacing={1}>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Tipo:</Typography>
                              <Typography variant="caption">{methods.watch('dropoffType') || '-'}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Ore:</Typography>
                              <Typography variant="caption">{methods.watch('dropoffTime') || '-'}</Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Box>
                  </Box>
                </Stack>

                {/* Details Section */}
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="solar:info-square-outline" width={24} />
                    <Typography variant="h6">Dettagli trasporto</Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">Mezzo utilizzato</Typography>
                      <Typography>{methods.watch('vehicle') || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">Posizione paziente</Typography>
                      <Typography>{methods.watch('position') || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">Presidi utilizzati</Typography>
                      <Typography>{methods.watch('equipment')?.join(', ') || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Difficoltà riscontrate</Typography>
                      <Typography>{methods.watch('difficulties')?.join(', ') || 'Nessuna'}</Typography>
                    </Grid>
                  </Grid>
                </Stack>

                {/* Additional Info Section */}
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="solar:notebook-outline" width={24} />
                    <Typography variant="h6">Note e altri dettagli</Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12}>
                      <Typography variant="subtitle2" color="text.secondary">Note</Typography>
                      <Typography sx={{ whiteSpace: 'pre-wrap' }}>{methods.watch('notes') || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">Chilometri percorsi</Typography>
                      <Typography>{methods.watch('kilometers') || '0'} km</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">Prezzo del servizio</Typography>
                      <Typography>€ {methods.watch('price') || '0'}</Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Stack>
            </Stack>
          </Card>
        );

      default:
        return null;
    }
  };

  const getStepError = (step: number): string | undefined => {
    switch (step) {
      case 0:
        return errors.serviceDate || errors.patientName || errors.phoneNumber;
      case 1:
        return errors.serviceType || errors.arrivalTime || errors.departureTime;
      case 2:
        return errors.pickupAddress || errors.pickupType || errors.pickupTime || errors.dropoffAddress || errors.dropoffType || errors.dropoffTime;
      case 3:
        return errors.vehicle || errors.equipment || errors.position || errors.difficulties;
      case 4:
        return errors.notes || errors.kilometers || errors.price;
      default:
        return undefined;
    }
  };

  const renderBackToSelection = () => (
    <Button
      startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
      color="inherit"
      disabled={activeStep === 0}
      onClick={onBack}
    >
      Indietro
    </Button>
  );

  return (
    <>
      <Stack spacing={4}>
        <StepperContent activeStep={activeStep} />
        {renderStepContent(activeStep)}
        {!isLastStep && getStepError(activeStep) && (
              <Alert severity="warning" sx={{ py: 0.5 }}>
                Completa tutti i campi obbligatori
              </Alert>
            )}

        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => router.back()}
            >
              Annulla
            </Button>
            {renderBackToSelection()}
          </Stack>

          <Stack direction="row" spacing={2}>
            {isLastStep ? (
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                startIcon={<Iconify icon="eva:checkmark-fill" />}
                sx={{
                  bgcolor: (themed) => themed.palette.mode === 'light' ? 'grey.800' : 'grey.50',
                  color: (themed) => themed.palette.mode === 'light' ? 'common.white' : 'grey.800',
                  '&:hover': {
                    bgcolor: (themed) => themed.palette.mode === 'light' ? 'grey.700' : 'grey.200',
                  },
                }}
              >
                Crea servizio
              </LoadingButton>
            ) : (
              <Button
                variant="contained"
                endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                onClick={onNext}
                disabled={!currentStepValid}
              >
                Avanti
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
} 