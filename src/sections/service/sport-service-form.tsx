import { Stack, Grid, Card, Typography, Box, Alert } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { alpha } from '@mui/material/styles';

export default function SportServiceForm() {
  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={4}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1
              }}
            >
              <Iconify icon="solar:basketball-bold" width={24} />
            </Box>
            <Typography variant="h6">Dettagli Servizio Sportivo</Typography>
          </Stack>
          
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3,
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <Stack spacing={1}>
              <Typography variant="subtitle2">Informazioni importanti:</Typography>
              <Typography variant="caption">
                • Compila tutti i campi richiesti per il servizio sportivo<br />
                • Assicurati di inserire il numero corretto di partecipanti<br />
                • Aggiungi eventuali note specifiche per l&apos;evento
              </Typography>
            </Stack>
          </Alert>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <RHFTextField 
              name="eventName" 
              label="Nome Evento"
              placeholder="es. Torneo di Calcio"
              helperText="Inserisci il nome completo dell'evento"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <RHFTextField
              name="eventDate"
              label="Data Evento"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <RHFTextField name="location" label="Luogo" />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField name="sportType" label="Tipo di Sport" />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField 
              name="numberOfParticipants" 
              label="Numero di Partecipanti" 
              type="number"
              InputProps={{
                startAdornment: <Iconify icon="eva:people-fill" sx={{ color: 'text.disabled', mr: 1 }} />,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <RHFTextField 
              name="notes" 
              label="Note" 
              multiline 
              rows={3}
              placeholder="Inserisci eventuali note o richieste particolari..."
            />
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
} 