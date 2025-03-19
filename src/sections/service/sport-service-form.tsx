import type { Theme} from '@mui/material';

import * as Yup from 'yup';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import { Box, Grid, Card, Stack, Alert, Button, MenuItem, Checkbox, Typography, useMediaQuery, FormControlLabel } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';

import { formatDate, addMinutesToTime } from './utils';
import { ICONS, VEHICLES, SPORT_EQUIPMENT } from './constants';
import { ServiceStepper, CustomStepHeader } from './components';

const EVENT_TYPES = [
  { value: 'calcio', label: 'Calcio', icon: 'solar:football-bold-duotone' },
  { value: 'pallacanestro', label: 'Pallacanestro', icon: 'solar:basketball-bold-duotone' },
  { value: 'pallavolo', label: 'Pallavolo', icon: 'solar:volleyball-bold-duotone' },
  { value: 'ciclismo', label: 'Ciclismo', icon: 'solar:bicycling-bold-duotone' },
  { value: 'festa', label: 'Festa', icon: 'solar:confetti-bold-duotone' },
  { value: 'moto', label: 'Moto', icon: 'solar:wheel-bold-duotone' },
  { value: 'corsa', label: 'Corsa', icon: 'solar:running-bold-duotone' },
  { value: 'altro', label: 'Altro', icon: 'solar:close-square-line-duotone' },
] as const;

// Update the SportFormFields type
type SportFormFields = {
  eventTypeSport: string;
  eventNameSport: string;
  eventDateSport: string;
  startTimeSport: string;
  endTimeSport: string;
  arrivalTimeSport: string;
  departureTimeSport: string;
  organizerNameSport: string;
  organizerContactSport: string;
  vehicleSport: string;
  equipmentSport: string[]; // Change to string array
  kilometersSport: number;
  priceSport: number;
  notesSport: string;
};

// Update SPORT_STEPS to include the new step
const SPORT_STEPS = [
  {
    label: 'Evento',
    fields: ['eventTypeSport', 'eventNameSport'] as Array<keyof SportFormFields>,
  },
  {
    label: 'Data',
    fields: ['eventDateSport', 'startTimeSport', 'endTimeSport', 'arrivalTimeSport', 'departureTimeSport'] as Array<keyof SportFormFields>,
  },
  {
    label: 'Organizzatore',
    fields: ['organizerNameSport'] as Array<keyof SportFormFields>,
  },
  {
    label: 'Dettagli mezzo',
    fields: ['vehicleSport'] as Array<keyof SportFormFields>,
  },
  {
    label: 'Note e altri dettagli',
    fields: ['kilometersSport', 'priceSport'] as Array<keyof SportFormFields>,
  },
  {
    label: 'Riepilogo',
    fields: [] as Array<keyof SportFormFields>,
  },
] as const;

// Add defaultValues at the top of the file
export const sportServiceDefaultValues = {
  eventTypeSport: '',
  eventNameSport: '',
  eventDateSport: '',
  startTimeSport: '',
  endTimeSport: '',
  arrivalTimeSport: '',
  departureTimeSport: '',
  organizerNameSport: '',
  organizerContactSport: '',
  vehicleSport: '',
  equipmentSport: [],
  kilometersSport: 0,
  priceSport: 0,
  notesSport: '',
};

// Add validation schema
export const SportServiceSchema = Yup.object().shape({
  eventTypeSport: Yup.string().required('Tipo evento è obbligatorio'),
  eventNameSport: Yup.string().required('Nome evento è obbligatorio'),
  eventDateSport: Yup.string().required('Data è obbligatoria'),
  startTimeSport: Yup.string().required('Ora inizio è obbligatoria'),
  endTimeSport: Yup.string().required('Ora fine è obbligatoria'),
  arrivalTimeSport: Yup.string().required('Ora arrivo in sede è obbligatoria'),
  departureTimeSport: Yup.string().required('Ora partenza dalla sede è obbligatoria'),
  organizerNameSport: Yup.string().required('Nome organizzatore è obbligatorio'),
  vehicleSport: Yup.string().required('Mezzo è obbligatorio'),
  equipmentSport: Yup.array(),
  kilometersSport: Yup.number().min(0, 'I chilometri non possono essere negativi'),
  priceSport: Yup.number().min(0, 'Il prezzo non può essere negativo'),
  notesSport: Yup.string(),
});

// Add isEditMode prop to the component props
interface SportServiceFormProps {
  isSubmitting: boolean;
  isEditMode?: boolean;
}

export default function SportServiceForm({ isSubmitting, isEditMode = false }: SportServiceFormProps) {
  const methods = useFormContext();
  const router = useRouter();
  
  const [activeStep, setActiveStep] = useState(0);
  const isLastStep = activeStep === SPORT_STEPS.length - 1;

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const handleNext = async () => {
    const currentStepFields = SPORT_STEPS[activeStep].fields;
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

  // Update the functions to use proper types
  const isStepValid = (step: number) => {
    const currentStepFields = SPORT_STEPS[step].fields;
    return !currentStepFields.some((field: keyof SportFormFields) => methods.formState.errors[field]);
  };

  const areFieldsFilled = (step: number) => {
    const currentStepFields = SPORT_STEPS[step].fields;
    return currentStepFields.every((field: keyof SportFormFields) => {
      const value = methods.watch(field);
      return value !== undefined && value !== '';
    });
  };

  const renderNavigation = () => (
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
  );

  // Update renderStepContent to split the event details
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={4}>
            <CustomStepHeader
              title="Dettagli Evento"
              icon={ICONS.event.name}
              description="Inserisci i dettagli dell'evento sportivo"
            />
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
                Informazioni Evento
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="eventTypeSport"
                    label="Tipo di Evento"
                    select
                    SelectProps={{
                      MenuProps: {
                        PaperProps: { sx: { maxHeight: 220 } },
                      },
                    }}
                    value={methods.watch('eventTypeSport')}
                    onChange={(e) => methods.setValue('eventTypeSport', e.target.value)}
                  >
                    {EVENT_TYPES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Iconify icon={option.icon} width={20} />
                          <Typography variant="body2">{option.label}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </RHFTextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField 
                    name="eventNameSport" 
                    type="text"
                    label="Nome Evento"
                    placeholder="es. Torneo di Calcio"
                    InputProps={{
                      startAdornment: <Iconify icon={ICONS.event.name} sx={{ color: 'text.disabled', mr: 1 }} />,
                    }}
                    value={methods.watch('eventNameSport')}
                    onChange={(e) => methods.setValue('eventNameSport', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={4}>
            <CustomStepHeader
              title="Data Evento"
              icon={ICONS.event.date}
              description="Inserisci la data e gli orari dell'evento"
            />
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
                Data e Orari
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <RHFTextField
                    name="eventDateSport"
                    label="Data Evento"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: new Date().toISOString().split('T')[0],
                    }}
                    InputProps={{
                      startAdornment: <Iconify icon={ICONS.event.date} sx={{ color: 'text.disabled', mr: 1 }} />,
                    }}
                    value={methods.watch('eventDateSport')}
                    onChange={(e) => methods.setValue('eventDateSport', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="startTimeSport"
                    label="Ora inizio"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <Iconify icon={ICONS.event.time} sx={{ color: 'text.disabled', mr: 1 }} />,
                    }}
                    value={methods.watch('startTimeSport')}
                    onChange={(e) => {
                        methods.setValue('startTimeSport', e.target.value)
                        methods.setValue('arrivalTimeSport', addMinutesToTime(e.target.value, -40))
                        methods.setValue('departureTimeSport', addMinutesToTime(e.target.value, -30))
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="endTimeSport"
                    label="Ora fine"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <Iconify icon={ICONS.event.time} sx={{ color: 'text.disabled', mr: 1 }} />,
                    }}
                    value={methods.watch('endTimeSport')}
                    onChange={(e) => methods.setValue('endTimeSport', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="arrivalTimeSport"
                    label="In sede alle ore"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <Iconify icon={ICONS.event.arrival} sx={{ color: 'text.disabled', mr: 1 }} />,
                    }}
                    value={methods.watch('arrivalTimeSport')}
                    onChange={(e) => {
                        methods.setValue('arrivalTimeSport', e.target.value)
                        methods.setValue('departureTimeSport', addMinutesToTime(e.target.value, 10))
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="departureTimeSport"
                    label="Partenza sede alle ore"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <Iconify icon={ICONS.event.departure} sx={{ color: 'text.disabled', mr: 1 }} />,
                    }}
                    value={methods.watch('departureTimeSport')}
                    onChange={(e) => methods.setValue('departureTimeSport', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={4}>
            <CustomStepHeader
              title="Organizzatore"
              icon={ICONS.organizer.name}
              description="Inserisci i dati del responsabile dell'evento"
            />
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <RHFTextField 
                    name="organizerNameSport" 
                    label="Denominazione"
                    placeholder="es. Associazione Sportiva"
                    InputProps={{
                      startAdornment: <Iconify icon={ICONS.organizer.name} sx={{ color: 'text.disabled', mr: 1 }} />,
                    }}
                    value={methods.watch('organizerNameSport')}
                    onChange={(e) => methods.setValue('organizerNameSport', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField 
                    name="organizerContactSport" 
                    label="Recapito"
                    placeholder="es. 333 1234567"
                    InputProps={{
                      startAdornment: <Iconify icon={ICONS.organizer.contact} sx={{ color: 'text.disabled', mr: 1 }} />,
                    }}
                    value={methods.watch('organizerContactSport')}
                    onChange={(e) => methods.setValue('organizerContactSport', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={4}>
            <CustomStepHeader
              title="Dettagli"
              icon={ICONS.equipment.bag}
              description="Inserisci i dettagli relativi al mezzo utilizzato e all'equipaggiamento"
            />
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
                Mezzo utilizzato
              </Typography>
              <RHFTextField 
                name="vehicleSport" 
                label="Seleziona mezzo"
                select
                InputProps={{
                  startAdornment: <Iconify icon={ICONS.equipment.vehicle} sx={{ color: 'text.disabled', mr: 1 }} />,
                }}
                value={methods.watch('vehicleSport')}
                onChange={(e) => methods.setValue('vehicleSport', e.target.value)}
              >
                {VEHICLES.map((vehicle) => (
                  <MenuItem key={vehicle} value={vehicle}>
                    {vehicle}
                  </MenuItem>
                ))}
              </RHFTextField>
            </Box>

            <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
                Equipaggiamento
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
                {SPORT_EQUIPMENT.map((item) => (
                  <FormControlLabel 
                    key={item.value} 
                    control={
                      <Checkbox 
                        checked={methods.watch('equipmentSport')?.includes(item.value) || false}
                        onChange={(e) => {
                          const current = methods.watch('equipmentSport') || [];
                          if (e.target.checked) {
                            methods.setValue('equipmentSport', [...current, item.value]);
                          } else {
                            methods.setValue('equipmentSport', current.filter((eq: string) => eq !== item.value));
                          }
                        }}
                      />
                    } 
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Iconify icon={item.icon} width={20} />
                        <Typography>{item.value}</Typography>
                      </Stack>
                    }
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        );

      case 4:
        return (
          <Stack spacing={4}>
            <CustomStepHeader
              title="Note e altri dettagli"
              icon={ICONS.details.notes}
              description="Aggiungi note e dettagli aggiuntivi"
            />
            <Stack spacing={3}>
              <RHFTextField 
                name="notesSport" 
                label="Note aggiuntive"
                placeholder="Inserisci eventuali note o richieste particolari..."
                multiline 
                rows={3}
                InputProps={{
                  startAdornment: <Iconify icon={ICONS.details.notes} sx={{ color: 'text.disabled', mr: 1, mt: 1.5 }} />,
                }}
                value={methods.watch('notesSport')}
                onChange={(e) => {
                  methods.setValue('notesSport', e.target.value);
                }}
              />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <RHFTextField 
                name="kilometersSport" 
                label="Chilometri percorsi"
                type="number"
                InputProps={{
                  startAdornment: <Iconify icon="solar:map-arrow-square-bold-duotone" sx={{ color: 'text.disabled', mr: 1 }} />,
                  endAdornment: <Typography sx={{ color: 'text.disabled' }}>km</Typography>,
                }}
                value={methods.watch('kilometersSport')}
                onChange={(e) => {
                  methods.setValue('kilometersSport', e.target.value);
                }}
              />
              <RHFTextField 
                name="priceSport" 
                label="Prezzo del servizio"
                type="number"
                InputProps={{
                  startAdornment: <Iconify icon="solar:euro-bold-duotone" sx={{ color: 'text.disabled', mr: 1 }} />,
                  endAdornment: <Typography sx={{ color: 'text.disabled' }}>€</Typography>,
                }}
                value={methods.watch('priceSport')}
                onChange={(e) => {
                  methods.setValue('priceSport', e.target.value);
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
              description="Riepilogo dei dati inseriti"
            />
            
            {/* Event Section */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Iconify icon={ICONS.event.name} width={24} />
                <Typography variant="subtitle1">Dettagli Evento</Typography>
              </Stack>

              <Card sx={{ 
                p: 2, 
                borderRadius: 2, 
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'background.neutral'
              }}>
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
                      }}
                    >
                      <Iconify 
                        icon={EVENT_TYPES.find(t => t.value === methods.watch('eventTypeSport'))?.icon || ''} 
                        width={24}
                        sx={{ color: 'text.secondary' }}
                      />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Tipo di Evento
                        </Typography>
                        <Typography variant="body1">
                          {EVENT_TYPES.find(t => t.value === methods.watch('eventTypeSport'))?.label || '-'}
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
                      }}
                    >
                      <Iconify icon={ICONS.event.name} width={24} sx={{ color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Nome Evento
                        </Typography>
                        <Typography variant="body1">
                          {methods.watch('eventNameSport')}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Card>
            </Box>

            {/* Data e Orari Section */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Iconify icon={ICONS.event.date} width={24} />
                <Typography variant="subtitle1">Data e Orari</Typography>
              </Stack>

              <Card sx={{ 
                p: 2, 
                borderRadius: 2, 
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'background.neutral'
              }}>
                <Grid container spacing={3}>
                  {/* Data */}
                  <Grid item xs={12} sm={4}>
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
                            <Iconify icon={ICONS.event.date} width={24} sx={{ color: 'text.secondary' }} />
                            <Typography variant="subtitle2" color="text.secondary">
                                Data Evento
                            </Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography variant="body1">
                                {formatDate(methods.watch('eventDateSport'))}
                            </Typography>
                        </Stack>
                    </Stack>
                  </Grid>

                  {/* Orario Evento */}
                  <Grid item xs={12} sm={4}>
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
                        <Iconify icon={ICONS.event.time} width={20} sx={{ color: 'text.secondary' }} />
                        <Typography variant="subtitle2" color="text.secondary">
                          Orario Evento
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="body1">
                          Dalle {methods.watch('startTimeSport')} alle {methods.watch('endTimeSport')}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>

                  {/* Orari Sede */}
                  <Grid item xs={12} sm={4}>
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
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 1 }}>
                          <Iconify icon={ICONS.service.time} width={24} sx={{ color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              Arrivo in sede
                            </Typography>
                            <Typography variant="body1">
                              {methods.watch('arrivalTimeSport') || '-'}
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
                              {methods.watch('departureTimeSport') || '-'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </Grid>
                </Grid>
              </Card>
            </Box>

            {/* Organizer Section */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Iconify icon={ICONS.organizer.name} width={24} />
                <Typography variant="subtitle1">Organizzatore</Typography>
              </Stack>

              <Card sx={{ 
                p: 2, 
                borderRadius: 2, 
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'background.neutral'
              }}>
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
                      }}
                    >
                      <Iconify icon={ICONS.organizer.name} width={24} sx={{ color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Nome
                        </Typography>
                        <Typography variant="body1">
                          {methods.watch('organizerNameSport') || '-'}
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
                      }}
                    >
                      <Iconify icon={ICONS.organizer.contact} width={24} sx={{ color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Contatto
                        </Typography>
                        <Typography variant="body1">
                          {methods.watch('organizerContactSport') || '-'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Card>
            </Box>

            {/* Equipment Section */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Iconify icon={ICONS.equipment.bag} width={24} />
                <Typography variant="subtitle1">Equipaggiamento</Typography>
              </Stack>

              <Card sx={{ 
                p: 2, 
                borderRadius: 2, 
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'background.neutral'
              }}>
                <Grid container spacing={3}>
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
                            <Iconify icon={ICONS.details.vehicle} width={24} sx={{ color: 'text.secondary' }} />
                            <Typography variant="subtitle2" color="text.secondary">
                            Mezzo utilizzato
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography variant="body1">
                            {methods.watch('vehicleSport') || '-'}
                            </Typography>
                        </Stack>
                    </Stack>
                  </Grid>

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
                        <Iconify icon={ICONS.equipment.bag} width={20} sx={{ color: 'text.secondary' }} />
                        <Typography variant="subtitle2" color="text.secondary">
                          Equipaggiamento
                        </Typography>
                      </Stack>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {methods.watch('equipmentSport')?.length ? (
                          methods.watch('equipmentSport').map((eq: string) => {
                            const equipItem = SPORT_EQUIPMENT.find(item => item.value === eq);
                            return (
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
                                  color: (theme) => theme.palette.mode === 'dark' ? 'text.primary' : 'text.secondary',
                                }}
                              >
                                <Iconify 
                                  icon={equipItem?.icon || ''} 
                                  width={16}
                                  sx={{ color: 'text.secondary' }} 
                                />
                                <Typography variant="body2">{eq}</Typography>
                              </Stack>
                            );
                          })
                        ) : (
                          <Typography>Nessuno</Typography>
                        )}
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Card>
            </Box>

            {/* Note and Other Details Section */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Iconify icon={ICONS.details.notes} width={24} />
                <Typography variant="subtitle1">Note e Altri Dettagli</Typography>
              </Stack>

              <Card sx={{ 
                p: 2, 
                borderRadius: 2, 
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'background.neutral'
              }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12}>
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
                        {methods.watch('notesSport') || 'Nulla da segnalare'}
                      </Typography>
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
                      <Iconify icon="solar:map-arrow-square-bold-duotone" width={24} sx={{ color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Chilometri percorsi
                        </Typography>
                        <Stack direction="row" spacing={0.5} alignItems="baseline">
                          <Typography variant="h6">
                            {methods.watch('kilometersSport') || '0'}
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
                            {methods.watch('priceSport') || '0'}
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
    <>
      <ServiceStepper activeStep={activeStep} steps={SPORT_STEPS as any} />
      <Card sx={{ p: 4, mt: 3 }}>
        {renderStepContent(activeStep)}
      </Card>
      {!isLastStep && !isStepValid(activeStep) && (
        <Alert severity="warning" sx={{ py: 0.5, mt: 2 }}>
          Completa tutti i campi obbligatori
        </Alert>
      )}
      {renderNavigation()}
    </>
  );
} 