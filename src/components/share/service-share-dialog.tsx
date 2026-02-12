import type { RefObject} from 'react';
import type { UserProps } from 'src/sections/user/models';

import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// Create a light theme to override any parent theme context
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      paper: '#ffffff',
      default: '#f5f5f5',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
});

// ----------------------------------------------------------------------

// Association information
const ASSOCIATION_INFO = {
  name: 'Gruppo Volontari del Soccorso di Roccafranca e Ludriano',
  logo: '/assets/logo/logo.png',
  president: {
    name: 'Marco Rossi',
    phone: '+39 123 456 7890',
  },
  serviceManager: {
    name: 'Giulia Bianchi',
    phone: '+39 098 765 4321',
  },
  email: 'info@associazione.it',
  website: 'www.associazione.it',
};

interface ServiceCardProps {
  row: UserProps;
  cardRef: RefObject<HTMLDivElement>;
}

// Compressed service card for sharing
const ServiceCard = ({ row, cardRef }: ServiceCardProps) => {
  const isSportService = row.visit === 'Sportivo';
  
  return (
    <Paper 
      ref={cardRef}
      data-card-ref="true"
      sx={{ 
        p: 0.5,
        width: 500,
        maxWidth: '100%',
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 1.5,
        overflow: 'hidden'
      }}
    >
      {/* Header with logo and type */}
      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between" 
        sx={{ 
          mb: 0.5, 
          pb: 0.5, 
          px: 0.5,
          pt: 1,
          borderBottom: '1px solid', 
          borderColor: 'divider' 
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Avatar 
            alt={ASSOCIATION_INFO.name} 
            src={ASSOCIATION_INFO.logo}
            sx={{ width: 28, height: 28 }}
          />
          <Box sx={{ maxWidth: '90%' }}>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 'bold', 
              fontSize: '0.7rem',
              lineHeight: 1.2,
              whiteSpace: 'normal',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {ASSOCIATION_INFO.name}
            </Typography>
            <Label color="primary" sx={{ mt: 0.25, height: 16, fontSize: '0.6rem', px: 0.5 }}>
              {isSportService ? 'Servizio Sportivo' : 'Servizio Secondario'}
            </Label>
          </Box>
        </Stack>
      </Stack>
      
      {/* Main content */}
      <Box sx={{ px: 0.5 }}>
        {/* Patient/Event Info and Date/Status in one row */}
        <Grid container spacing={0.5} sx={{ mb: 0.5 }}>
          <Grid item xs={12}>
            <Box sx={{ p: 0.75, borderRadius: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <Avatar alt={row.name} src={row.avatarUrl} sx={{ width: 20, height: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1 }}>
                    {isSportService ? 'Evento' : 'Paziente'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '0.7rem', lineHeight: 1.2 }}>
                    {row.name || 'Non specificato'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        {/* Date and details in the second row */}
        <Grid container spacing={0.5} sx={{ mb: 0.5 }}>
          <Grid item xs={12}>
            <Box sx={{ p: 0.75, borderRadius: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" spacing={0.5} alignItems="flex-start">
                <Iconify icon="mdi:calendar" width={12} sx={{ color: 'text.secondary', mt: 0.25 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1 }}>Data</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>{row.date || row.timestamp || 'Non spec.'}</Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={5}>
            <Box sx={{ p: 0.75, height: '100%', borderRadius: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1 }}>Stato</Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Label color={(row.status === 'cancellato' && 'error') || 'success'} sx={{ fontSize: '0.6rem', height: 16, mt: 0.25 }}>
                  {row.status || 'Non spec.'}
                </Label>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={7}>
            {!isSportService ? (
              <Box sx={{ p: 0.75, borderRadius: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" spacing={0.5} alignItems="flex-start">
                  <Iconify icon="mdi:medical-bag" width={12} sx={{ color: 'text.secondary', mt: 0.25 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1 }}>Tipo Servizio</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>{row.visit || 'Non spec.'}</Typography>
                  </Box>
                </Stack>
              </Box>
            ) : (
              <Box sx={{ p: 0.75, borderRadius: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" spacing={0.5} alignItems="flex-start">
                  <Iconify icon="mdi:calendar-star" width={12} sx={{ color: 'text.secondary', mt: 0.25 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1 }}>Nome Evento</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>{row.eventName || 'Non spec.'}</Typography>
                  </Box>
                </Stack>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Schedule or details */}
        <Grid container spacing={0.5} sx={{ mb: 0.5 }}>
          <Grid item xs={12}>
            <Box sx={{ p: 0.75, borderRadius: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" spacing={0.5} alignItems="flex-start">
                <Iconify icon="mdi:clock" width={12} sx={{ color: 'text.secondary', mt: 0.25 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1 }}>
                    {isSportService ? 'Orari Evento' : 'Orario'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
                    {isSportService ? 
                      `Inizio: ${row.startTime || 'Non spec.'} • Fine: ${row.endTime || 'Non spec.'}` : 
                      row.time || 'Non spec.'
                    }
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        {/* Location info */}
        <Grid container spacing={0.5} sx={{ mb: 0.5 }}>
          {!isSportService ? (
            <>
              <Grid item xs={6}>
                <Box sx={{ p: 0.75, borderRadius: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                  <Stack direction="row" spacing={0.5} alignItems="flex-start">
                    <Iconify icon="mdi:map-marker" width={12} sx={{ color: 'text.secondary', mt: 0.25 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1 }}>Ritiro</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
                        {row.pickupLocation ? `${row.pickupLocation}` : 'Non spec.'}
                        {row.pickupTime && `, ${row.pickupTime}`}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ p: 0.75, borderRadius: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                  <Stack direction="row" spacing={0.5} alignItems="flex-start">
                    <Iconify icon="mdi:hospital-building" width={12} sx={{ color: 'text.secondary', mt: 0.25 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1 }}>Destinazione</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>{row.destinationType || 'Non spec.'}</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={6}>
                <Box sx={{ p: 0.75, borderRadius: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                  <Stack direction="row" spacing={0.5} alignItems="flex-start">
                    <Iconify icon="mdi:account-tie" width={12} sx={{ color: 'text.secondary', mt: 0.25 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1 }}>Organizzatore</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>{row.organizerName || 'Non spec.'}</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ p: 0.75, borderRadius: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                  <Stack direction="row" spacing={0.5} alignItems="flex-start">
                    <Iconify icon="mdi:clock" width={12} sx={{ color: 'text.secondary', mt: 0.25 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1 }}>Orari Sede</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
                        {`${row.arrivalTime || 'Non spec.'} - ${row.departureTime || 'Non spec.'}`}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </>
          )}
        </Grid>

        {/* Vehicle and notes */}
        <Grid container spacing={0.5} sx={{ mb: 0.5 }}>
          <Grid item xs={!isSportService ? 6 : 12}>
            <Box sx={{ p: 0.75, borderRadius: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" spacing={0.5} alignItems="flex-start">
                <Iconify icon="mdi:ambulance" width={12} sx={{ color: 'text.secondary', mt: 0.25 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1 }}>Mezzo</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>{row.vehicle || 'Non spec.'}</Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {!isSportService && (
            <Grid item xs={6}>
              <Box sx={{ p: 0.75, borderRadius: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" spacing={0.5} alignItems="flex-start">
                  <Iconify icon="mdi:seat" width={12} sx={{ color: 'text.secondary', mt: 0.25 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1 }}>Posizione</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>{row.position || 'Non spec.'}</Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Equipment for Sport Service */}
        {isSportService && row.equipmentItems && row.equipmentItems.length > 0 && (
          <Box sx={{ p: 0.75, mb: 0.5, borderRadius: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1 }}>Attrezzatura</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25, mt: 0.25 }}>
              {row.equipmentItems.map((item) => (
                <Typography 
                  key={item} 
                  variant="caption" 
                  sx={{ 
                    px: 0.5, 
                    py: 0.1, 
                    fontSize: '0.6rem',
                    borderRadius: 0.5,
                    bgcolor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
        )}
        
        {/* Notes Section - if notes exist, but compact */}
        {// row.notes && (
          <Box sx={{ p: 0.75, mb: 0.5, borderRadius: 1, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" spacing={0.5} alignItems="flex-start">
              <Iconify icon="mdi:note-text" width={12} sx={{ color: 'text.secondary', mt: 0.25 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1 }}>Note</Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.7rem', 
                    lineHeight: 1.2,
                    whiteSpace: 'pre-wrap',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {row.notes}
                </Typography>
              </Box>
            </Stack>
          </Box>
        }
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Label color="warning" sx={{ height: 20, fontSize: '0.75rem', p: 1 }}>
              Buon Servizio!!
            </Label>
          </Grid>
        </Grid>
      </Box>
      
      {/* Ultra Compact Footer with Contacts */}
      <Box sx={{ 
        py: 0.5,
        mt: 0.25,
        borderTop: '1px solid',
        borderColor: 'divider',
        textAlign: 'center',
        px: 1
      }}>
        <Stack direction="column" spacing={0.25} alignItems="center" justifyContent="center">
          <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>
          <Iconify icon="mdi:account-tie" sx={{ width: 10, height: 10, mr: 0.25, verticalAlign: 'text-top' }} />
          {ASSOCIATION_INFO.president.phone} 
        </Typography>
        <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>
          <Iconify icon="mdi:account-supervisor" sx={{ width: 10, height: 10, mr: 0.25, verticalAlign: 'text-top' }} />
          {ASSOCIATION_INFO.serviceManager.phone}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>
          <Iconify icon="mdi:at" sx={{ width: 10, height: 10, mr: 0.25, verticalAlign: 'text-top' }} />
            {ASSOCIATION_INFO.email}
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
};

interface ServiceShareDialogProps {
  open: boolean;
  onClose: () => void;
  serviceData: UserProps;
}

export default function ServiceShareDialog({ open, onClose, serviceData }: ServiceShareDialogProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fixed image sharing function
  const handleShareAsImage = async () => {
    if (!cardRef.current) {
      console.error('Card reference is not available');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Dynamically import html2canvas to avoid webpack bundling issues
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      
      // Create canvas from the service card
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // Higher scale for better quality with small text
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        onclone: (doc) => {
          // Ensure proper styles to the cloned element
          const clonedElement = doc.querySelector('[data-card-ref="true"]');
          if (clonedElement instanceof HTMLElement) {
            // Force the width to ensure consistent size
            clonedElement.style.width = '500px';
            clonedElement.style.maxWidth = '500px';
            clonedElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
            clonedElement.style.borderRadius = '8px';
            clonedElement.style.backgroundColor = '#ffffff';
            clonedElement.style.overflow = 'hidden';
            
            // Ensure all child elements are visible and styled properly
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach(el => {
              if (el instanceof HTMLElement) {
                el.style.visibility = 'visible';
                
                // Ensure light mode for all elements
                if (el.className && el.className.includes('MuiBox') || 
                    el.className && el.className.includes('MuiPaper')) {
                  // Apply light theme background to boxes
                  if (el.style.backgroundColor === 'rgb(18, 18, 18)' ||
                      el.style.backgroundColor === '#121212') {
                    el.style.backgroundColor = '#f5f5f5';
                  }
                }
                
                // Ensure text is properly visible with enhanced rendering for small fonts
                if (el.tagName === 'SPAN' || el.tagName === 'P' || el.tagName === 'DIV' || 
                    el.tagName === 'LABEL' || el.tagName === 'H6' || el.tagName === 'TYPOGRAPHY') {
                  // Force light mode text colors
                  if (el.style.color === 'rgb(255, 255, 255)' || 
                      el.style.color === '#ffffff' ||
                      el.style.color === 'white') {
                    el.style.color = '#000000';
                  } else if (!el.style.color || el.style.color === '') {
                    el.style.color = '#000000';
                  }
                  
                  el.style.textRendering = 'optimizeLegibility';
                  // Apply vendor prefixes using setAttribute to avoid TypeScript errors
                  el.setAttribute('style', `
                    ${el.getAttribute('style') || ''}
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                  `);
                }
              }
            });
          }
        }
      });
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      // Download the image
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `servizio-${serviceData.id || 'share'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      onClose();
    } catch (error) {
      console.error('Error creating image:', error);
      alert('Non è stato possibile creare l\'immagine. Prova a utilizzare WhatsApp.');
    } finally {
      setIsLoading(false);
    }
  };

  // Share via WhatsApp
  const handleShareViaWhatsApp = () => {
    const isSportService = serviceData.visit === 'Sportivo';
    
    // Create a formatted message with service details
    let message = `*${isSportService ? 'Servizio Sportivo' : 'Servizio Secondario'}*\n\n`;
    
    // Common fields
    message += `Data: ${serviceData.date || serviceData.timestamp || 'Non specificata'}\n`;
    message += `Stato: ${serviceData.status || 'Non specificato'}\n\n`;
    
    if (isSportService) {
      // Sport Service specific fields
      message += `*Dettagli Evento*\n`;
      message += `Nome evento: ${serviceData.eventName || 'Non specificato'}\n`;
      message += `Inizio: ${serviceData.startTime || 'Non specificato'}\n`;
      message += `Fine: ${serviceData.endTime || 'Non specificato'}\n`;
      message += `Arrivo: ${serviceData.arrivalTime || 'Non specificato'}\n`;
      message += `Partenza: ${serviceData.departureTime || 'Non specificato'}\n\n`;
      
      message += `*Organizzatore*\n`;
      message += `Nome: ${serviceData.organizerName || 'Non specificato'}\n`;
      message += `Contatto: ${serviceData.organizerContact || 'Non disponibile'}\n\n`;
      
      message += `*Attrezzatura*\n`;
      message += `Mezzo: ${serviceData.vehicle || 'Non specificato'}\n`;
      
      if (serviceData.equipmentItems && serviceData.equipmentItems.length > 0) {
        message += `Attrezzatura: ${serviceData.equipmentItems.join(', ')}\n`;
      }
    } else {
      // Secondary Service specific fields
      message += `*Paziente*\n`;
      message += `Nome: ${serviceData.name || 'Non specificato'}\n`;
      message += `Tipo servizio: ${serviceData.visit || 'Non specificato'}\n`;
      message += `Orario: ${serviceData.time || 'Non specificato'}\n\n`;
      
      message += `*Trasporto*\n`;
      message += `Ritiro: ${serviceData.pickupLocation || 'Non specificato'}`;
      if (serviceData.pickupTime) message += ` alle ${serviceData.pickupTime}`;
      message += `\n`;
      message += `Destinazione: ${serviceData.destinationType || 'Non specificata'}\n\n`;
      
      message += `*Dettagli*\n`;
      message += `Mezzo: ${serviceData.vehicle || 'Non specificato'}\n`;
      message += `Posizione: ${serviceData.position || 'Non specificata'}\n`;
    }
    
    // Notes for both types
    if (serviceData.notes) {
      message += `\n*Note*\n${serviceData.notes}\n`;
    }
    
    // Encode the message for a URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create the WhatsApp URL
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    onClose();
  };

  // Wrap the entire dialog in the ThemeProvider to isolate it from the app's theme
  return (
    <ThemeProvider theme={lightTheme}>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="sm"
        fullWidth={false}
        PaperProps={{
          sx: {
            width: 'auto',
            maxWidth: { xs: '95%', sm: 520, md: 520 },
            margin: { xs: 1, sm: 'auto' },
            bgcolor: 'background.paper', // Use theme colors
          }
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }
        }}
      >
        <DialogTitle sx={{ py: 1, fontSize: '0.9rem', color: 'text.primary', bgcolor: 'background.paper' }}>
          Condividi Servizio
        </DialogTitle>
        <DialogContent sx={{ pt: 0, pb: 1, bgcolor: 'background.paper' }}>
          <Box sx={{ mb: 0.5, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }} gutterBottom>
              Anteprima
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ServiceCard row={serviceData} cardRef={cardRef} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', px: 1.5, pb: 1.5, bgcolor: 'background.paper' }}>
          <Button 
            variant="contained" 
            onClick={handleShareAsImage}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="mdi:image" />}
            disabled={isLoading}
            size="small"
            sx={{ mb: 0.75, fontSize: '0.8rem' }}
          >
            {isLoading ? 'Creazione immagine...' : 'Condividi come immagine'}
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleShareViaWhatsApp}
            startIcon={<Iconify icon="mdi:whatsapp" />}
            disabled={isLoading}
            size="small"
            sx={{ fontSize: '0.8rem' }}
          >
            Condividi su WhatsApp
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}