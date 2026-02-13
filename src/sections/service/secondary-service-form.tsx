import * as Yup from 'yup';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Chip, Grid, Stack, Radio, Alert, Button, Divider, MenuItem, Checkbox, useTheme, Typography, RadioGroup, useMediaQuery, FormControlLabel } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';

import { formatDate, addMinutesToTime } from './utils';
import { ServiceStepper, CustomStepHeader } from './components';
import { ICONS, VEHICLES, POSITIONS, EQUIPMENT, DIFFICULTIES, SERVICE_TYPES, mapServiceType, TRANSPORT_TYPES } from './constants';

type FormField = keyof typeof secondaryServiceDefaultValues;

// Constants for Secondary Service
const SECONDARY_STEPS = [
  {
    label: 'Paziente',
    fields: ['serviceDate', 'patientName'] as FormField[],
  },
  {
    label: 'Servizio',
    fields: ['serviceType', 'arrivalTime', 'departureTime'] as FormField[],
  },
  {
    label: 'Trasporto',
    fields: ['pickupAddress', 'pickupType', 'pickupTime', 'dropoffAddress', 'dropoffType', 'dropoffTime'] as FormField[],
  },
  {
    label: 'Dettagli trasporto',
    fields: ['vehicle'] as FormField[],
  },
  {
    label: 'Note e altri dettagli',
    fields: ['kilometers', 'price'] as FormField[],
  },
  {
    label: 'Riepilogo',
    fields: [] as FormField[],
  },
] as const;

const secondaryServiceSchemaFields = {
  // Patient section
  patientName: Yup.string().required('Nome e cognome sono obbligatori'),
  phoneNumber: Yup.string(),
  
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
  additional_notes: Yup.string(),
  kilometers: Yup.number().min(0, 'I chilometri non possono essere negativi'),
  price: Yup.number().min(0, 'Il prezzo non può essere negativo'),
};

// Create mode: date must be today or in the future
const SecondaryServiceSchema = Yup.object().shape({
  serviceDate: Yup.string()
    .required('Data servizio è obbligatoria')
    .test('futureDate', 'La data non può essere nel passato', (value) => {
      if (!value) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(value) >= today;
    }),
  ...secondaryServiceSchemaFields,
});

// Edit mode: any date is allowed
const SecondaryServiceEditSchema = Yup.object().shape({
  serviceDate: Yup.string().required('Data servizio è obbligatoria'),
  ...secondaryServiceSchemaFields,
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
  additional_notes: '',
  kilometers: 0,
  price: 0,
};

export { SECONDARY_STEPS, SecondaryServiceSchema, SecondaryServiceEditSchema };

interface SecondaryServiceFormProps {
  isSubmitting: boolean;
  isEditMode?: boolean;
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Bozza', color: 'default' as const },
  { value: 'pending', label: 'In attesa', color: 'warning' as const },
  { value: 'confirmed', label: 'Confermato', color: 'info' as const },
  { value: 'completed', label: 'Completato', color: 'success' as const },
  { value: 'cancelled', label: 'Cancellato', color: 'error' as const },
];

export default function SecondaryServiceForm({ isSubmitting, isEditMode = false }: SecondaryServiceFormProps) {
  const methods = useFormContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  
  // Start at summary (last step) in edit mode, step 0 in create mode
  const [activeStep, setActiveStep] = useState(isEditMode ? SECONDARY_STEPS.length - 1 : 0);
  
  const isLastStep = activeStep === SECONDARY_STEPS.length - 1;

  const handleNext = async () => {
    const currentStepFields = SECONDARY_STEPS[activeStep].fields;
    const isValid = await methods.trigger(currentStepFields);
    const areFieldsFilled = currentStepFields.every(field => {
      const value = methods.watch(field);
      return value !== undefined && value !== '';
    });

    if (isValid && areFieldsFilled) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const isStepValid = (step: number) => {
    const currentStepFields = SECONDARY_STEPS[step].fields;
    return !currentStepFields.some(field => methods.formState.errors[field]);
  };

  const areFieldsFilled = (step: number) => {
    const currentStepFields = SECONDARY_STEPS[step].fields;
    return currentStepFields.every(field => {
      const value = methods.watch(field);
      return value !== undefined && value !== '';
    });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={4}>
            <CustomStepHeader
              title="Dati Paziente"
              icon="solar:user-id-bold"
              description="Inserisci i dati del paziente da trasportare"
            />
            <Stack spacing={3} sx={{ pt: 1 }}>
              <RHFTextField
                name="serviceDate"
                label="Data servizio"
                type="date"
                InputLabelProps={{ shrink: true }}
                helperText="Seleziona la data in cui verrà effettuato il servizio"
                sx={{ '& .MuiFormHelperText-root': { mx: 0 } }}
                inputProps={{
                  ...(isEditMode ? {} : { min: new Date().toISOString().split('T')[0] }),
                }}
                InputProps={{
                  startAdornment: <Iconify icon={ICONS.service.date} sx={{ color: 'text.disabled', mr: 1 }} />,
                }}
                value={methods.watch('serviceDate')}
                onChange={(e) => {
                  methods.setValue('serviceDate', e.target.value);
                }}
              />
              <RHFTextField 
                name="patientName" 
                label="Cognome e Nome"
                placeholder="es. Mario Rossi"
                InputProps={{
                  startAdornment: <Iconify icon={ICONS.patient.name} sx={{ color: 'text.disabled', mr: 1 }} />,
                }}
                value={methods.watch('patientName')}
                onChange={(e) => {
                  methods.setValue('patientName', e.target.value);
                }}
              />
              <RHFTextField 
                name="phoneNumber" 
                type="tel"
                label="Recapito telefonico"
                placeholder="es. 333 1234567"
                InputProps={{
                  startAdornment: <Iconify icon={ICONS.patient.phone} sx={{ color: 'text.disabled', mr: 1 }} />,
                }}
                value={methods.watch('phoneNumber')}
                onChange={(e) => {
                  methods.setValue('phoneNumber', e.target.value);
                }}
              />
            </Stack>
          </Stack>
        );

      case 1:
        return (
            <Stack spacing={4}>
              <CustomStepHeader
                title="Tipo Servizio"
                icon="solar:hand-heart-bold-duotone"
                description="Seleziona il tipo di servizio e gli orari"
              />
            <Stack spacing={3} sx={{ pt: 1 }}>
              <RHFTextField 
                name="serviceType" 
                label="Tipo di servizio"
                select
                SelectProps={{
                  MenuProps: {
                    PaperProps: { sx: { maxHeight: 220 } },
                  },
                }}
                InputProps={{
                  startAdornment: <Iconify icon={ICONS.service.type} sx={{ color: 'text.disabled', mr: 1 }} />,
                }}
                value={methods.watch('serviceType')}
                onChange={(e) => {
                  methods.setValue('serviceType', e.target.value);
                }}
              >
                {SERVICE_TYPES.map((group) => [
                  <MenuItem 
                    key={group.group} 
                    disabled 
                    sx={{ 
                      opacity: 1,
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'background.neutral',
                      typography: 'subtitle2',
                      fontWeight: 'bold',
                      py: 1,
                      px: 2,
                    }}
                  >
                    {group.group}
                  </MenuItem>,
                  ...group.options.map((option) => (
                    <MenuItem 
                      key={option.value} 
                      value={option.value}
                      sx={{ 
                        pl: 3,
                        py: 0.75,
                        typography: 'body2',
                      }}
                    >
                      {option.label}
                    </MenuItem>
                  )),
                ])}
              </RHFTextField>
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
                  Orari sede
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <RHFTextField
                      name="arrivalTime"
                      label="In sede alle ore"
                      type="time"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <Iconify icon={ICONS.service.time} sx={{ color: 'text.disabled', mr: 1 }} />,
                      }}
                      value={methods.watch('arrivalTime')}
                      onChange={(e) => {
                        methods.setValue('arrivalTime', e.target.value);
                        methods.setValue('departureTime', addMinutesToTime(e.target.value, 10));
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFTextField
                      name="departureTime"
                      label="Partenza sede alle ore"
                      type="time"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <Iconify icon={ICONS.service.time} sx={{ color: 'text.disabled', mr: 1 }} />,
                      }}
                      value={methods.watch('departureTime')}
                      onChange={(e) => {
                        methods.setValue('departureTime', e.target.value);
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </Stack>
        );

      case 2:
        return (
            <Stack spacing={4}>
              <CustomStepHeader
                title="Dettagli Trasporto"
                icon="solar:map-point-bold"
                description="Specifica i luoghi di partenza e arrivo"
              />
            <Stack divider={<Divider flexItem sx={{ my: 2 }} />}>
              {/* Pickup Section */}
              <Stack spacing={3}>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                  Paziente trasportato da
                </Typography>
                <RHFTextField 
                  name="pickupAddress" 
                  label="Indirizzo di partenza"
                  placeholder="es. Via Roma 1, Milano"
                  multiline 
                  rows={2}
                  InputProps={{
                    startAdornment: <Iconify icon={ICONS.transport.location} sx={{ color: 'text.disabled', mr: 1 }} />,
                  }}
                  onChange={(e) => {
                    methods.setValue('pickupAddress', e.target.value);
                  }}
                  value={methods.watch('pickupAddress')}
                />
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  <RHFTextField 
                    name="pickupType" 
                    label="Tipo di struttura"
                    select
                    SelectProps={{
                      MenuProps: {
                        PaperProps: { sx: { maxHeight: 220 } },
                      },
                    }}
                    InputProps={{
                      startAdornment: <Iconify icon={ICONS.transport.type} sx={{ color: 'text.disabled', mr: 1 }} />,
                    }}
                    onChange={(e) => {
                      methods.setValue('pickupType', e.target.value);
                    }}
                  >
                    {TRANSPORT_TYPES.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </RHFTextField>
                  <RHFTextField
                    name="pickupTime"
                    label="Orario di partenza"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <Iconify icon={ICONS.transport.time} sx={{ color: 'text.disabled', mr: 1 }} />,
                    }}
                    value={methods.watch('pickupTime')}
                    onChange={(e) => {
                      methods.setValue('pickupTime', e.target.value);
                    }}
                  />
                </Box>
              </Stack>

              {/* Dropoff Section */}
              <Stack spacing={3}>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                  Paziente trasportato a
                </Typography>
                <RHFTextField 
                  name="dropoffAddress" 
                  label="Indirizzo di destinazione"
                  placeholder="es. Via Milano 1, Milano"
                  multiline 
                  rows={2}
                  InputProps={{
                    startAdornment: <Iconify icon={ICONS.transport.location} sx={{ color: 'text.disabled', mr: 1 }} />,
                  }}
                  value={methods.watch('dropoffAddress')}
                  onChange={(e) => {
                    methods.setValue('dropoffAddress', e.target.value);
                  }}
                />
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  <RHFTextField 
                    name="dropoffType" 
                    label="Tipo di struttura"
                    select
                    SelectProps={{
                      MenuProps: {
                        PaperProps: { sx: { maxHeight: 220 } },
                      },
                    }}
                    InputProps={{
                      startAdornment: <Iconify icon={ICONS.transport.type} sx={{ color: 'text.disabled', mr: 1 }} />,
                    }}
                    onChange={(e) => {
                      methods.setValue('dropoffType', e.target.value);
                    }}
                  >
                    {TRANSPORT_TYPES.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </RHFTextField>
                  <RHFTextField
                    name="dropoffTime"
                    label="Orario di arrivo"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <Iconify icon={ICONS.transport.time} sx={{ color: 'text.disabled', mr: 1 }} />,
                    }}
                    value={methods.watch('dropoffTime')}
                    onChange={(e) => {
                      methods.setValue('dropoffTime', e.target.value);
                    }}
                  />
                </Box>
              </Stack>
            </Stack>
          </Stack>
        );

      case 3:
        return (
            <Stack spacing={4}>
              <CustomStepHeader
                title="Modalità Trasporto"
                icon="lineicons:ambulance"
                description="Seleziona il mezzo e le modalità di trasporto"
              />
            <Stack spacing={4}>
              <RHFTextField 
                name="vehicle" 
                label="Mezzo utilizzato"
                select
                SelectProps={{
                  MenuProps: {
                    PaperProps: { sx: { maxHeight: 220 } },
                  },
                }}
                InputProps={{
                  startAdornment: <Iconify icon={ICONS.details.vehicle} sx={{ color: 'text.disabled', mr: 1 }} />,
                }}
                value={methods.watch('vehicle')}
                onChange={(e) => {
                  methods.setValue('vehicle', e.target.value);
                }}
              >
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
                        p: 0.5,
                        width: '100%',
                      },
                    }),
                  }}
                >
                  {EQUIPMENT.map((item) => (
                    <FormControlLabel 
                      key={item} 
                      value={item}
                      control={<Checkbox 
                        checked={methods.watch('equipment')?.includes(item) || false}
                        onChange={(e) => {
                          const current = methods.watch('equipment') || [];
                          if (e.target.checked) {
                            methods.setValue('equipment', [...current, item]);
                          } else {
                            methods.setValue('equipment', current.filter((eq: string) => eq !== item));
                          }
                        }}
                      />} 
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
                          p: 0.5,
                          width: '100%',
                        },
                      }),
                    }}
                  >
                    {POSITIONS.map((item) => (
                      <FormControlLabel 
                        key={item} 
                        value={item} 
                        control={<Radio 
                          checked={methods.watch('position') === item}
                          onChange={(e) => {
                            methods.setValue('position', e.target.value);
                          }}
                        />} 
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
                        p: 0.5,
                        width: '100%',
                      },
                    }),
                  }}
                >
                  {DIFFICULTIES.map((item) => (
                    <FormControlLabel 
                      key={item} 
                      control={
                      <Checkbox 
                        checked={methods.watch('difficulties')?.includes(item) || false}
                        onChange={(e) => {
                          const current = methods.watch('difficulties') || [];
                          if (e.target.checked) {
                            methods.setValue('difficulties', [...current, item]);
                          } else {
                            methods.setValue('difficulties', current.filter((diff: string) => diff !== item));
                          }
                        }}
                      />
                      } 
                      label={item}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Stack>
        );

      case 4:
        return (
            <Stack spacing={4}>
              <CustomStepHeader
                title="Note e Dettagli"
                icon="solar:notebook-bold"
                description="Aggiungi note e dettagli aggiuntivi"
              />
            <Stack spacing={3}>
              <RHFTextField 
                name="additional_notes" 
                label="Note aggiuntive"
                placeholder="Inserisci eventuali note o richieste particolari..."
                multiline 
                rows={3}
                InputProps={{
                  startAdornment: <Iconify icon={ICONS.details.notes} sx={{ color: 'text.disabled', mr: 1, mt: 1.5 }} />,
                }}
                value={methods.watch('additional_notes')}
                onChange={(e) => {
                  methods.setValue('additional_notes', e.target.value);
                }}
              />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <RHFTextField 
                name="kilometers" 
                label="Chilometri percorsi"
                type="number"
                InputProps={{
                  startAdornment: <Iconify icon="solar:map-arrow-square-bold-duotone" sx={{ color: 'text.disabled', mr: 1 }} />,
                  endAdornment: <Typography sx={{ color: 'text.disabled' }}>km</Typography>,
                }}
                value={methods.watch('kilometers')}
                onChange={(e) => {
                  methods.setValue('kilometers', e.target.value);
                }}
              />
              <RHFTextField 
                name="price" 
                label="Prezzo del servizio"
                type="number"
                InputProps={{
                  startAdornment: <Iconify icon="solar:euro-bold-duotone" sx={{ color: 'text.disabled', mr: 1 }} />,
                  endAdornment: <Typography sx={{ color: 'text.disabled' }}>€</Typography>,
                }}
                value={methods.watch('price')}
                onChange={(e) => {
                  methods.setValue('price', e.target.value);
                }}
              />
            </Stack>
          </Stack>
        );

      case 5:
        return (
            <Stack spacing={4}>
              <CustomStepHeader
                title="Riepilogo Servizio"
                icon="solar:clipboard-list-bold-duotone"
              />

              {/* Patient Section */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Iconify icon={ICONS.patient.name} width={24} />
                  <Typography variant="subtitle1">Dati Paziente</Typography>
                </Stack>

                <Card sx={{ p: 2, borderRadius: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'background.neutral' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack 
                        direction="row" 
                        spacing={2}
                        sx={{ 
                          p: 2,
                          height: 1,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: (theme) => theme.palette.mode === 'dark' ? 'divider' : 'grey.200',
                          '& .MuiTypography-root': {
                            color: (theme) => theme.palette.mode === 'dark' ? 'text.primary' : 'text.secondary',
                          },
                          '& .MuiIconify-root': {
                            color: (theme) => theme.palette.mode === 'dark' ? 'text.primary' : 'text.secondary',
                          }
                        }}
                      >
                        <Iconify icon={ICONS.patient.name} width={24} sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Nome Paziente
                          </Typography>
                          <Typography variant="body1">
                            {methods.watch('patientName') || '-'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack 
                        direction="row" 
                        spacing={2}
                        sx={{ 
                          p: 2,
                          height: 1,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: (theme) => theme.palette.mode === 'dark' ? 'divider' : 'grey.200',
                          '& .MuiTypography-root': {
                            color: (theme) => theme.palette.mode === 'dark' ? 'text.primary' : 'text.secondary',
                          },
                          '& .MuiIconify-root': {
                            color: (theme) => theme.palette.mode === 'dark' ? 'text.primary' : 'text.secondary',
                          }
                        }}
                      >
                        <Iconify icon={ICONS.patient.phone} width={24} sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Telefono
                          </Typography>
                          <Typography variant="body1">
                            {methods.watch('phoneNumber') || '-'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
              </Box>

              {/* Service Section */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Iconify icon={ICONS.service.type} width={24} />
                  <Typography variant="subtitle1">Tipo Servizio</Typography>
                </Stack>

                <Card sx={{ p: 2, borderRadius: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'background.neutral' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack 
                        direction="row" 
                        spacing={2}
                        sx={{ 
                          p: 2,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: (theme) => theme.palette.mode === 'dark' ? 'divider' : 'grey.200',
                        }}
                      >
                        <Iconify icon={ICONS.service.type} width={24} sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Servizio
                          </Typography>
                          <Typography variant="body1">
                            {methods.watch('serviceType') ? mapServiceType(methods.watch('serviceType')) : '-'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack 
                        spacing={1}
                        sx={{ 
                          p: 2,
                          height: 1,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: (theme) => theme.palette.mode === 'dark' ? 'divider' : 'grey.200',
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Iconify icon={ICONS.service.date} width={20} sx={{ color: 'text.secondary' }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Data Servizio
                          </Typography>
                        </Stack>
                        <Typography variant="body1">
                          {formatDate(methods.watch('serviceDate'))}
                        </Typography>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                    <Stack 
                        spacing={1} 
                        sx={{ 
                            p: 2,
                            height: 1,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: (themed) => themed.palette.mode === 'dark' ? 'divider' : 'grey.200',
                        }}
                        >
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 1 }}>
                          <Iconify icon={ICONS.service.time} width={24} sx={{ color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              Arrivo in sede
                            </Typography>
                            <Typography variant="body1">
                              {methods.watch('arrivalTime') || '-'}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 1 }}>
                          <Iconify icon={ICONS.service.time} width={24} sx={{ color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              Partenza dalla sede
                            </Typography>
                            <Typography variant="body1">
                              {methods.watch('departureTime') || '-'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
              </Box>

              {/* Transport Section */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Iconify icon={ICONS.transport.location} width={24} />
                  <Typography variant="subtitle1">Trasporto</Typography>
                </Stack>

                <Card sx={{ p: 2, borderRadius: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'background.neutral' }}>
                  <Grid container spacing={3}>
                    {/* Pickup Location */}
                    <Grid item xs={12} sm={6}>
                      <Stack 
                        spacing={2}
                        sx={{ 
                          p: 2,
                          height: 1,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: (theme) => theme.palette.mode === 'dark' ? 'divider' : 'grey.200',
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Iconify icon="eva:navigation-2-fill" width={20} sx={{ color: 'primary.main' }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Trasportato da
                          </Typography>
                        </Stack>
                        <Box>
                          <Typography variant="body1">{methods.watch('pickupAddress') || '-'}</Typography>
                          <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                            <Stack direction="row" spacing={1}>
                              <Typography variant="body2" color="text.secondary">Tipo:</Typography>
                              <Typography variant="body2">{methods.watch('pickupType') || '-'}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                              <Typography variant="body2" color="text.secondary">Ore:</Typography>
                              <Typography variant="body2">{methods.watch('pickupTime') || '-'}</Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      </Stack>
                    </Grid>

                    {/* Dropoff Location */}
                    <Grid item xs={12} sm={6}>
                      <Stack 
                        spacing={2}
                        sx={{ 
                          p: 2,
                          height: 1,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: (theme) => theme.palette.mode === 'dark' ? 'divider' : 'grey.200',
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Iconify icon="eva:pin-fill" width={20} sx={{ color: 'error.main' }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Trasportato a
                          </Typography>
                        </Stack>
                        <Box>
                          <Typography variant="body1">{methods.watch('dropoffAddress') || '-'}</Typography>
                          <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                            <Stack direction="row" spacing={1}>
                              <Typography variant="body2" color="text.secondary">Tipo:</Typography>
                              <Typography variant="body2">{methods.watch('dropoffType') || '-'}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                              <Typography variant="body2" color="text.secondary">Ore:</Typography>
                              <Typography variant="body2">{methods.watch('dropoffTime') || '-'}</Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
              </Box>

              {/* Details Section */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Iconify icon={ICONS.details.vehicle} width={24} />
                  <Typography variant="subtitle1">Dettagli Trasporto</Typography>
                </Stack>

                <Card sx={{ p: 2, borderRadius: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'background.neutral' }}>
                  <Grid container spacing={3}>
                    {/* Vehicle */}
                    <Grid item xs={12} sm={12}>
                      <Stack 
                        direction="row" 
                        spacing={2}
                        sx={{ 
                          p: 2,
                          height: 1,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: (theme) => theme.palette.mode === 'dark' ? 'divider' : 'grey.200',
                        }}
                      >
                        <Iconify icon={ICONS.details.vehicle} width={24} sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Mezzo utilizzato
                          </Typography>
                          <Typography variant="body1">
                            {methods.watch('vehicle') || '-'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    {/* Position */}
                    <Grid item xs={12} sm={6}>
                      <Stack 
                        direction="row" 
                        spacing={2}
                        sx={{ 
                          p: 2,
                          height: 1,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: (theme) => theme.palette.mode === 'dark' ? 'divider' : 'grey.200',
                        }}
                      >
                        <Iconify icon={ICONS.details.position} width={24} sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Paziente trasportato in
                          </Typography>
                          <Typography variant="body1">
                            {methods.watch('position') || '-'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    {/* Equipment */}
                    <Grid item xs={12} sm={6}>
                      <Stack 
                        spacing={2}
                        sx={{ 
                          p: 2,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: (theme) => theme.palette.mode === 'dark' ? 'divider' : 'grey.200',
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Iconify icon={ICONS.details.equipment} width={20} sx={{ color: 'text.secondary' }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Presidi utilizzati
                          </Typography>
                        </Stack>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {methods.watch('equipment')?.length ? (
                            methods.watch('equipment').map((eq: string) => (
                              <Stack 
                                key={eq} 
                                direction="row" 
                                spacing={0.5} 
                                alignItems="center"
                                sx={{
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'background.neutral',
                                  border: '1px solid',
                                  borderColor: (theme) => theme.palette.mode === 'dark' ? 'divider' : 'grey.200',
                                }}
                              >
                                <Iconify icon={ICONS.details.equipment} width={16} sx={{ color: 'text.secondary' }} />
                                <Typography variant="body2">{eq}</Typography>
                              </Stack>
                            ))
                          ) : (
                            <Typography>Nessuno</Typography>
                          )}
                        </Box>
                      </Stack>
                    </Grid>

                    {/* Difficulties */}
                    <Grid item xs={12}>
                      <Stack 
                        spacing={2}
                        sx={{ 
                          p: 2,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: (theme) => theme.palette.mode === 'dark' ? 'divider' : 'grey.200',
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Iconify icon={ICONS.details.difficulty} width={20} sx={{ color: 'text.secondary' }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Difficoltà riscontrate
                          </Typography>
                        </Stack>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {methods.watch('difficulties')?.length ? (
                            methods.watch('difficulties').map((diff: string) => (
                              <Stack 
                                key={diff} 
                                direction="row" 
                                spacing={0.5} 
                                alignItems="center"
                                sx={{
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'background.neutral',
                                  border: '1px solid',
                                  borderColor: (theme) => theme.palette.mode === 'dark' ? 'divider' : 'grey.200',
                                }}
                              >
                                <Iconify icon={ICONS.details.difficulty} width={16} sx={{ color: 'text.secondary' }} />
                                <Typography variant="body2">{diff}</Typography>
                              </Stack>
                            ))
                          ) : (
                            <Typography>Nessuna</Typography>
                          )}
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
              </Box>

              {/* Additional Info Section */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Iconify icon={ICONS.details.notes} width={24} />
                  <Typography variant="subtitle1">Note e Altri Dettagli</Typography>
                </Stack>

                <Card sx={{ p: 2, borderRadius: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'background.neutral' }}>
                  <Grid container spacing={3}>
                    {/* Notes */}
                    <Grid item xs={12}>
                      <Stack 
                        spacing={2}
                        sx={{ 
                          p: 2,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: (theme) => theme.palette.mode === 'dark' ? 'divider' : 'grey.200',
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Iconify icon={ICONS.details.notes} width={20} sx={{ color: 'text.secondary' }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Note aggiuntive
                          </Typography>
                        </Stack>
                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                          {methods.watch('additional_notes') || 'Nulla da segnalare'}
                        </Typography>
                      </Stack>
                    </Grid>

                    {/* Kilometers and Price */}
                    <Grid item xs={12} sm={6}>
                      <Stack 
                        direction="row" 
                        spacing={2}
                        sx={{ 
                          p: 2,
                          height: 1,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: (theme) => theme.palette.mode === 'dark' ? 'divider' : 'grey.200',
                        }}
                      >
                        <Iconify icon="solar:map-arrow-square-bold-duotone" width={24} sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Chilometri percorsi
                          </Typography>
                          <Stack direction="row" spacing={0.5} alignItems="baseline">
                            <Typography variant="h6">
                              {methods.watch('kilometers') || '0'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              km
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack 
                        direction="row" 
                        spacing={2}
                        sx={{ 
                          p: 2,
                          height: 1,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: (theme) => theme.palette.mode === 'dark' ? 'divider' : 'grey.200',
                        }}
                      >
                        <Iconify icon="solar:euro-bold-duotone" width={24} sx={{ color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Prezzo del servizio
                          </Typography>
                          <Stack direction="row" spacing={0.5} alignItems="baseline">
                            <Typography variant="h6">
                              {methods.watch('price') || '0'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              €
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
              </Box>
            </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Stack spacing={4}>
        {isEditMode && (
          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
            {STATUS_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                color={opt.color}
                variant={methods.watch('status') === opt.value ? 'filled' : 'outlined'}
                onClick={() => methods.setValue('status', opt.value, { shouldDirty: true })}
                sx={{ fontWeight: methods.watch('status') === opt.value ? 700 : 400 }}
              />
            ))}
          </Stack>
        )}

        <ServiceStepper
          activeStep={activeStep}
          steps={SECONDARY_STEPS as any}
          onStepClick={isEditMode ? (step) => setActiveStep(step) : undefined}
        />

        <Card sx={{ p: { xs: 3, md: 4 } }}>
            {renderStepContent(activeStep)}
        </Card>
        {!isLastStep && !isStepValid(activeStep) && (
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
            <Button
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Indietro
            </Button>
          </Stack>

          <Stack direction="row" spacing={2}>
            {isLastStep ? (
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {isEditMode ? 'Aggiorna servizio' : 'Crea servizio'}
              </LoadingButton>
            ) : (
              <Button
                variant="contained"
                endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                onClick={handleNext}
                disabled={!isStepValid(activeStep) || !areFieldsFilled(activeStep)}
              >
                Avanti
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
  );
} 