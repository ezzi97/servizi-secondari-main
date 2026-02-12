import type { RefObject} from 'react';
import type { UserProps } from 'src/sections/user/models';

import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import useMediaQuery from '@mui/material/useMediaQuery';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';

import { domToPng } from 'modern-screenshot';

import { Iconify } from 'src/components/iconify';
import { mapServiceType } from 'src/sections/service/constants';

// Light theme for the share card (ensures consistent image export)
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: { paper: '#ffffff', default: '#f8f9fa' },
    text: { primary: 'rgba(0, 0, 0, 0.87)', secondary: 'rgba(0, 0, 0, 0.6)' },
  },
});

// ----------------------------------------------------------------------

function getStatusColor(status: string): 'default' | 'warning' | 'info' | 'success' | 'error' {
  switch (status.toLowerCase()) {
    case 'bozza': return 'default';
    case 'in attesa': return 'warning';
    case 'confermato': return 'info';
    case 'effettuato': return 'success';
    case 'cancellato': return 'error';
    default: return 'default';
  }
}

const ACCENT = { secondary: '#1976d2', sport: '#ed6c02' };


// Inline detail row: "icon  Label: value"
function DetailRow({
  icon,
  label,
  value,
  noWrap = false,
}: {
  icon: string;
  label: string;
  value?: string;
  noWrap?: boolean;
}) {
  if (!value) return null;
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 0.4, minWidth: 0 }}>
      <Iconify icon={icon} width={16} sx={{ color: 'text.secondary', flexShrink: 0 }} />
      <Typography
        variant="body2"
        sx={{
          fontSize: '0.8rem',
          lineHeight: 1.4,
          wordBreak: noWrap ? 'normal' : 'break-word',
          whiteSpace: noWrap ? 'nowrap' : 'normal',
          overflow: noWrap ? 'hidden' : 'visible',
          textOverflow: noWrap ? 'ellipsis' : 'clip',
          minWidth: 0,
        }}
      >
        <Typography component="span" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
          {label}:
        </Typography>
        {' '}{value}
      </Typography>
    </Stack>
  );
}

// Build a shareable plain-text summary (no WhatsApp bold markers)
function buildPlainTextSummary(data: UserProps): string {
  const isSport = data.visit === 'Sportivo';
  let text = `${isSport ? 'SERVIZIO SPORTIVO' : 'SERVIZIO SECONDARIO'}\n\n`;

  text += `Data: ${data.timestamp || data.date || '-'}\n`;
  text += `Stato: ${data.status || '-'}\n\n`;

  if (isSport) {
    if (data.eventName) text += `Evento: ${data.eventName}\n`;
    if (data.arrivalTime) text += `In sede alle: ${data.arrivalTime}\n`;
    if (data.departureTime) text += `Partenza alle: ${data.departureTime}\n`;
    if (data.startTime || data.endTime) text += `Orari evento: ${data.startTime || '?'} - ${data.endTime || '?'}\n`;
    if (data.organizerName) text += `Organizzatore: ${data.organizerName}\n`;
    if (data.organizerContact) text += `Contatto: ${data.organizerContact}\n`;
    if (data.vehicle) text += `Mezzo: ${data.vehicle}\n`;
    if (data.equipmentItems && data.equipmentItems.length > 0) text += `Attrezzatura: ${data.equipmentItems.join(', ')}\n`;
  } else {
    if (data.name) text += `Paziente: ${data.name}\n`;
    if (data.serviceType) text += `Tipo servizio: ${mapServiceType(data.serviceType)}\n`;
    if (data.arrivalTime) text += `In sede alle: ${data.arrivalTime}\n`;
    if (data.departureTime) text += `Partenza alle: ${data.departureTime}\n`;
    if (data.pickupLocation) text += `Ritiro: ${data.pickupLocation}${data.pickupTime ? ` alle ${data.pickupTime}` : ''}\n`;
    if (data.destinationType) text += `Destinazione: ${data.destinationType}\n`;
    if (data.vehicle) text += `Mezzo: ${data.vehicle}\n`;
    if (data.position) text += `Posizione: ${data.position}\n`;
    if (data.equipment && data.equipment.length > 0) text += `Presidi: ${data.equipment.join(', ')}\n`;
    if (data.difficulties && data.difficulties.length > 0) text += `Difficoltà: ${data.difficulties.join(', ')}\n`;
  }

  if (data.kilometers) text += `KM: ${data.kilometers}\n`;
  if (data.price) text += `Prezzo: ${data.price.toFixed(2)} €\n`;
  if (data.notes) text += `\nNote: ${data.notes}\n`;

  return text.trim();
}

// ----------------------------------------------------------------------

interface ServiceCardProps {
  row: UserProps;
  cardRef: RefObject<HTMLDivElement>;
}

const ServiceCard = ({ row, cardRef }: ServiceCardProps) => {
  const isSport = row.visit === 'Sportivo';
  const accent = isSport ? ACCENT.sport : ACCENT.secondary;

  // Main detail rows (without KM/Price — those go side-by-side)
  const secondaryDetails = !isSport ? [
    { icon: 'mdi:medical-bag', label: 'Tipo servizio', value: row.serviceType ? mapServiceType(row.serviceType) : undefined },
    { icon: 'mdi:clock-check-outline', label: 'In sede alle', value: row.arrivalTime },
    { icon: 'mdi:clock-fast', label: 'Partenza alle', value: row.departureTime },
    { icon: 'mdi:map-marker', label: 'Ritiro', value: row.pickupLocation ? `${row.pickupLocation}${row.pickupTime ? ` alle ${row.pickupTime}` : ''}` : undefined },
    { icon: 'mdi:hospital-building', label: 'Destinazione', value: row.destinationType },
    { icon: 'mdi:ambulance', label: 'Mezzo', value: row.vehicle },
    { icon: 'mdi:seat', label: 'Posizione', value: row.position },
  ] : [];

  const sportDetails = isSport ? [
    { icon: 'mdi:calendar-star', label: 'Evento', value: row.eventName },
    { icon: 'mdi:clock-check-outline', label: 'In sede alle', value: row.arrivalTime },
    { icon: 'mdi:clock-fast', label: 'Partenza alle', value: row.departureTime },
    {
      icon: 'mdi:clock-start',
      label: 'Orari evento',
      value: (row.startTime || row.endTime) ? `${row.startTime || '?'} - ${row.endTime || '?'}` : undefined,
      noWrap: true,
    },
    { icon: 'mdi:account-tie', label: 'Organizzatore', value: row.organizerName },
    { icon: 'mdi:ambulance', label: 'Mezzo', value: row.vehicle },
  ] : [];

  const details = isSport ? sportDetails : secondaryDetails;
  const hasKmOrPrice = !!(row.kilometers || row.price);
  const hasSecondaryEquipment = !isSport && row.equipment && row.equipment.length > 0;
  const hasSportEquipment = isSport && row.equipmentItems && row.equipmentItems.length > 0;
  const hasDifficulties = !isSport && row.difficulties && row.difficulties.length > 0;

  return (
    <Paper
      ref={cardRef}
      data-card-ref="true"
      elevation={3}
      sx={{ width: { xs: '100%', sm: 500 }, maxWidth: '100%', bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}
    >
      {/* Accent bar */}
      <Box sx={{ height: 4, bgcolor: accent }} />

      {/* Header: type + status */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, pt: 1.5, pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon={isSport ? 'mdi:trophy-outline' : 'mdi:medical-bag'} width={18} sx={{ color: accent }} />
          <Typography variant="overline" sx={{ fontSize: '0.8rem', fontWeight: 700, color: accent, letterSpacing: 1 }}>
            {isSport ? 'Servizio Sportivo' : 'Servizio Secondario'}
          </Typography>
        </Stack>
        <Chip
          label={row.status || '-'}
          color={getStatusColor(row.status)}
          size="small"
          sx={{ fontSize: '0.75rem', height: 22, textTransform: 'capitalize', borderRadius: 1 }}
        />
      </Stack>

      <Divider />

      {/* Hero: name + date */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
        <Typography variant="h6" sx={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.3, mb: 0.25 }}>
          {row.name || 'Senza nome'}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Iconify icon="mdi:calendar" width={14} sx={{ color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
            {row.timestamp || '-'}
          </Typography>
        </Stack>
      </Box>

      <Divider />

      {/* Details */}
      {(details.some(d => d.value) || hasKmOrPrice) && (
        <Box sx={{ px: 2, py: 1, bgcolor: 'background.default' }}>
          {details.map((d) => (
            <DetailRow
              key={d.label}
              icon={d.icon}
              label={d.label}
              value={d.value}
              noWrap={'noWrap' in d ? !!d.noWrap : false}
            />
          ))}

          {/* KM + Price side-by-side */}
          {hasKmOrPrice && (
            <Stack direction="row" spacing={3} sx={{ pt: 0.25 }}>
              <DetailRow icon="mdi:road-variant" label="KM" value={row.kilometers ? `${row.kilometers}` : undefined} />
              <DetailRow icon="mdi:currency-eur" label="Prezzo" value={row.price ? `${row.price.toFixed(2)} €` : undefined} />
            </Stack>
          )}
        </Box>
      )}

      {/* Equipment (secondary) */}
      {hasSecondaryEquipment && (
        <>
          <Divider />
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
              Presidi utilizzati
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {row.equipment!.map((item) => (
                <Chip key={item} label={item} size="small" variant="outlined" sx={{ fontSize: '0.75rem', height: 24 }} />
              ))}
            </Stack>
          </Box>
        </>
      )}

      {/* Equipment (sport) */}
      {hasSportEquipment && (
        <>
          <Divider />
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
              Attrezzatura
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {row.equipmentItems!.map((item) => (
                <Chip key={item} label={item} size="small" variant="outlined" sx={{ fontSize: '0.75rem', height: 24 }} />
              ))}
            </Stack>
          </Box>
        </>
      )}

      {/* Difficulties */}
      {hasDifficulties && (
        <>
          <Divider />
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
              Difficoltà riscontrate
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {row.difficulties!.map((item) => (
                <Chip key={item} label={item} size="small" variant="outlined" color="warning" sx={{ fontSize: '0.75rem', height: 24 }} />
              ))}
            </Stack>
          </Box>
        </>
      )}

      {/* Notes */}
      {row.notes && (
        <>
          <Divider />
          <Box sx={{ px: 2, py: 1 }}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Iconify icon="mdi:note-text-outline" width={16} sx={{ color: 'text.secondary', flexShrink: 0 }} />
              <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.4, minWidth: 0 }}>
                <Typography component="span" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Note:
                </Typography>
                {' '}
                <Typography
                  component="span"
                  sx={{
                    fontSize: '0.8rem',
                    whiteSpace: 'pre-wrap',
                    display: '-webkit-inline-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {row.notes}
                </Typography>
              </Typography>
            </Stack>
          </Box>
        </>
      )}
    </Paper>
  );
};

// ----------------------------------------------------------------------

interface ServiceShareDialogProps {
  open: boolean;
  onClose: () => void;
  serviceData: UserProps;
}

export default function ServiceShareDialog({ open, onClose, serviceData }: ServiceShareDialogProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const buildWhatsAppText = () => {
    const isSportService = serviceData.visit === 'Sportivo';

    let message = `*${isSportService ? 'Servizio Sportivo' : 'Servizio Secondario'}*\n\n`;
    message += `Data: ${serviceData.timestamp || serviceData.date || '-'}\n`;
    message += `Stato: ${serviceData.status || '-'}\n\n`;

    if (isSportService) {
      if (serviceData.eventName) message += `*Evento:* ${serviceData.eventName}\n`;
      if (serviceData.arrivalTime) message += `*In sede alle:* ${serviceData.arrivalTime}\n`;
      if (serviceData.departureTime) message += `*Partenza alle:* ${serviceData.departureTime}\n`;
      if (serviceData.startTime || serviceData.endTime) message += `*Orari:* ${serviceData.startTime || '?'} - ${serviceData.endTime || '?'}\n`;
      if (serviceData.organizerName) message += `*Organizzatore:* ${serviceData.organizerName}\n`;
      if (serviceData.organizerContact) message += `*Contatto:* ${serviceData.organizerContact}\n`;
      if (serviceData.vehicle) message += `*Mezzo:* ${serviceData.vehicle}\n`;
      if (serviceData.equipmentItems && serviceData.equipmentItems.length > 0) message += `*Attrezzatura:* ${serviceData.equipmentItems.join(', ')}\n`;
    } else {
      if (serviceData.name) message += `*Paziente:* ${serviceData.name}\n`;
      if (serviceData.serviceType) message += `*Tipo servizio:* ${mapServiceType(serviceData.serviceType)}\n`;
      if (serviceData.arrivalTime) message += `*In sede alle:* ${serviceData.arrivalTime}\n`;
      if (serviceData.departureTime) message += `*Partenza alle:* ${serviceData.departureTime}\n`;
      if (serviceData.pickupLocation) {
        message += `*Ritiro:* ${serviceData.pickupLocation}`;
        if (serviceData.pickupTime) message += ` alle ${serviceData.pickupTime}`;
        message += `\n`;
      }
      if (serviceData.destinationType) message += `*Destinazione:* ${serviceData.destinationType}\n`;
      if (serviceData.vehicle) message += `*Mezzo:* ${serviceData.vehicle}\n`;
      if (serviceData.position) message += `*Posizione:* ${serviceData.position}\n`;
      if (serviceData.equipment && serviceData.equipment.length > 0) message += `*Presidi:* ${serviceData.equipment.join(', ')}\n`;
      if (serviceData.difficulties && serviceData.difficulties.length > 0) message += `*Difficoltà:* ${serviceData.difficulties.join(', ')}\n`;
    }

    if (serviceData.kilometers) message += `*KM:* ${serviceData.kilometers}\n`;
    if (serviceData.price) message += `*Prezzo:* ${serviceData.price.toFixed(2)} €\n`;
    if (serviceData.notes) message += `\n*Note:* ${serviceData.notes}\n`;

    return message;
  };

  const createImagePayload = async () => {
    if (!cardRef.current) return null;

    // Small delay to ensure Iconify SVGs have loaded from API
    await new Promise((r) => { setTimeout(r, 150); });

    const dataUrl = await domToPng(cardRef.current, {
      scale: 3,
      backgroundColor: '#ffffff',
      width: 500,
      style: {
        width: '500px',
        maxWidth: '500px',
        borderRadius: '8px',
        overflow: 'hidden',
      },
      onCloneNode: (node: Node) => {
        if (node instanceof HTMLElement && node.ownerDocument) {
          // Force light-mode CSS variables on the cloned document root
          // so the captured image always looks correct regardless of dark/light mode
          const root = node.ownerDocument.documentElement;
          root.style.setProperty('--palette-text-primary', 'rgba(0,0,0,0.87)');
          root.style.setProperty('--palette-text-primaryChannel', '0 0 0');
          root.style.setProperty('--palette-text-secondary', 'rgba(0,0,0,0.6)');
          root.style.setProperty('--palette-text-secondaryChannel', '0 0 0');
          root.style.setProperty('--palette-text-disabled', 'rgba(0,0,0,0.38)');
          root.style.setProperty('--palette-background-paper', '#ffffff');
          root.style.setProperty('--palette-background-paperChannel', '255 255 255');
          root.style.setProperty('--palette-background-default', '#f5f5f5');
          root.style.setProperty('--palette-background-defaultChannel', '245 245 245');
          root.style.setProperty('--palette-background-neutral', '#eeeeee');
          root.style.setProperty('--palette-divider', 'rgba(0,0,0,0.12)');
          root.style.setProperty('--palette-action-hover', 'rgba(0,0,0,0.04)');
          root.style.setProperty('--palette-action-selected', 'rgba(0,0,0,0.08)');
          root.style.setProperty('--palette-action-active', 'rgba(0,0,0,0.54)');
          // Remove the transition class to avoid layout artifacts
          root.classList.remove('theme-transitioning');
        }
      },
    });

    const filename = `servizio-${serviceData.id || 'share'}.png`;
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], filename, { type: 'image/png' });

    return { dataUrl, blob, file, filename };
  };

  // ---- Share / download image ----
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    // Open immediately to avoid popup blockers on mobile after async work.
    const mobilePreviewWindow = isMobile ? window.open('', '_blank') : null;
    setIsLoading(true);

    try {
      const payload = await createImagePayload();
      if (!payload) return;

      // Best mobile UX: open native share sheet when available.
      if (navigator.canShare?.({ files: [payload.file] })) {
        if (mobilePreviewWindow && !mobilePreviewWindow.closed) {
          mobilePreviewWindow.close();
        }
        await navigator.share({ files: [payload.file], title: payload.filename });
        return;
      }

      // Fallback for browsers that block "download" on mobile Safari.
      const blobUrl = URL.createObjectURL(payload.blob);

      if (isMobile) {
        if (mobilePreviewWindow && !mobilePreviewWindow.closed) {
          mobilePreviewWindow.location.href = blobUrl;
        } else {
          window.open(blobUrl, '_blank');
        }
        // Keep URL alive a bit longer in case the new tab loads slowly.
        setTimeout(() => URL.revokeObjectURL(blobUrl), 20000);
        return;
      }

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = payload.filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
    } catch (error: any) {
      if (mobilePreviewWindow && !mobilePreviewWindow.closed) {
        mobilePreviewWindow.close();
      }
      console.error('Error downloading image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Copy text to clipboard ----
  const handleCopyText = async () => {
    const text = buildPlainTextSummary(serviceData);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ---- Share via WhatsApp ----
  const handleShareViaWhatsApp = () => {
    const message = buildWhatsAppText();
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    onClose();
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            maxWidth: { sm: 540 },
            bgcolor: 'background.paper',
            ...(isMobile && { borderRadius: 0 }),
          }
        }}
        sx={{ '& .MuiBackdrop-root': { backgroundColor: 'rgba(0,0,0,0.5)' } }}
      >
        <DialogTitle sx={{ pb: 0.5, color: 'text.primary', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Condividi Servizio
          {isMobile && (
            <Button onClick={onClose} sx={{ minWidth: 'auto', p: 0.5 }}>
              <Iconify icon="mdi:close" width={24} />
            </Button>
          )}
        </DialogTitle>

        <DialogContent sx={{ pt: 1, pb: 1.5, bgcolor: 'background.paper', display: 'flex', justifyContent: 'center', alignItems: isMobile ? 'flex-start' : 'center' }}>
          <ServiceCard row={serviceData} cardRef={cardRef} />
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 2, bgcolor: 'background.paper', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, '& > :not(:first-of-type)': { ml: { xs: '0 !important', sm: undefined } } }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleDownloadImage}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="mdi:image" />}
            disabled={isLoading}
            size="medium"
          >
            {isLoading ? 'Creazione...' : 'Condividi immagine'}
          </Button>

          <Tooltip title={copied ? 'Copiato!' : 'Copia testo negli appunti'} arrow>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleCopyText}
              startIcon={<Iconify icon={copied ? 'mdi:check' : 'mdi:content-copy'} />}
              disabled={isLoading}
              size="medium"
              color={copied ? 'success' : 'inherit'}
            >
              {copied ? 'Copiato!' : 'Copia'}
            </Button>
          </Tooltip>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleShareViaWhatsApp}
            startIcon={<Iconify icon="mdi:whatsapp" />}
            disabled={isLoading}
            size="medium"
            sx={{ color: '#25D366', borderColor: '#25D366', '&:hover': { borderColor: '#1da851', bgcolor: 'rgba(37, 211, 102, 0.04)' } }}
          >
            WhatsApp
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
