import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import { alpha, useTheme } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { useToast } from 'src/hooks/use-toast';

import { useServices } from 'src/contexts/service-context';

import { Iconify } from 'src/components/iconify';
import ServiceShareDialog from 'src/components/share/service-share-dialog';

import type { UserProps } from './models';

// ----------------------------------------------------------------------

type UserTableRowProps = {
  row: UserProps;
  canArchive?: boolean;
};

const STATUS_OPTIONS = [
  { value: 'draft', label: 'bozza' },
  { value: 'pending', label: 'in attesa' },
  { value: 'confirmed', label: 'confermato' },
  { value: 'completed', label: 'effettuato' },
  { value: 'cancelled', label: 'cancellato' },
] as const;

const STATUS_FLOW: Array<UserProps['statusCode']> = ['draft', 'pending', 'confirmed', 'completed', 'cancelled'];

function getStatusCodeFromLabel(statusLabel: string): UserProps['statusCode'] {
  return STATUS_OPTIONS.find((item) => item.label === statusLabel)?.value ?? 'draft';
}

function getStatusLabelFromCode(statusCode: string): string {
  return STATUS_OPTIONS.find((item) => item.value === statusCode)?.label ?? statusCode;
}

function getStatusColorFromCode(
  statusCode: string
): 'default' | 'warning' | 'info' | 'success' | 'error' {
  switch (statusCode) {
    case 'pending':
      return 'warning';
    case 'confirmed':
      return 'info';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
}

export function UserTableRow({ row, canArchive = true }: UserTableRowProps) {
  const theme = useTheme();
  const router = useRouter();
  const { updateService } = useServices();
  const { success: showSuccess, error: showError } = useToast();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusCode, setStatusCode] = useState<UserProps['statusCode']>(
    row.statusCode ?? getStatusCodeFromLabel(row.status)
  );
  const isArchivedRow = !canArchive;
  const dialogTitle = isArchivedRow ? 'Conferma ripristino' : 'Conferma archiviazione';
  const dialogSubtitle = isArchivedRow
    ? 'Il servizio tornerà nella sezione servizi attivi.'
    : 'Il servizio verrà spostato nei servizi archiviati.';
  const dialogIcon = isArchivedRow ? 'mdi:restore' : 'mdi:alert-outline';
  
  const getRowStatusColor = (status: string): 'default' | 'warning' | 'info' | 'success' | 'error' => {
    switch (status.toLowerCase()) {
      case 'bozza': return 'default';
      case 'in attesa': return 'warning';
      case 'confermato': return 'info';
      case 'effettuato': return 'success';
      case 'cancellato': return 'error';
      default: return 'default';
    }
  };

  useEffect(() => {
    setStatusCode(row.statusCode ?? getStatusCodeFromLabel(row.status));
  }, [row.status, row.statusCode]);

  const handleStatusClick = async () => {
    const current = statusCode ?? 'draft';
    const currentIndex = STATUS_FLOW.indexOf(current);
    const nextStatus = STATUS_FLOW[(currentIndex + 1) % STATUS_FLOW.length];
    const previousStatus = statusCode;
    setStatusCode(nextStatus);

    try {
      setIsSubmitting(true);
      await updateService(row.id, { status: nextStatus as any });
      showSuccess('Stato aggiornato con successo');
    } catch (err) {
      console.error(err);
      setStatusCode(previousStatus);
      showError('Errore durante l\'aggiornamento dello stato');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusControl = (
    <Tooltip title="Clicca per cambiare stato">
      <span>
        <Chip
          size="small"
          clickable
          label={getStatusLabelFromCode(statusCode ?? 'draft')}
          color={getStatusColorFromCode(statusCode ?? 'draft')}
          onClick={handleStatusClick}
          disabled={isSubmitting}
        />
      </span>
    </Tooltip>
  );

  // Determine the edit route based on service type
  const navigateToEdit = () => (
    row.visit === 'Sportivo'
      ? `/servizi/sportivi/modifica/${row.id}`
      : `/servizi/secondari/modifica/${row.id}`
  );

  const handleEdit = async () => {
    if (isArchivedRow) {
      try {
        setIsSubmitting(true);
        await updateService(row.id, { archivedAt: null });
        showSuccess('Servizio ripristinato per la modifica');
      } catch (err) {
        console.error(err);
        showError('Errore durante il ripristino del servizio');
        return;
      } finally {
        setIsSubmitting(false);
      }
    }

    router.push(navigateToEdit());
  };

  // Archive / restore handlers
  const handleOpenArchiveDialog = () => {
    setArchiveDialogOpen(true);
  };

  const handleCloseArchiveDialog = () => {
    setArchiveDialogOpen(false);
  };

  const handleConfirmArchiveAction = async () => {
    try {
      setIsSubmitting(true);
      await updateService(row.id, { archivedAt: isArchivedRow ? null : new Date().toISOString() });
      showSuccess(isArchivedRow ? 'Servizio ripristinato con successo' : 'Servizio archiviato con successo');
      handleCloseArchiveDialog();
    } catch (err) {
      console.error(err);
      showError(isArchivedRow ? 'Errore durante il ripristino del servizio' : 'Errore durante l\'archiviazione del servizio');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Share dialog handlers
  const handleOpenShareDialog = () => {
    setShareDialogOpen(true);
  };
  
  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
  };

  return (
    <>
      {/* Mobile View */}
      <TableRow
        hover
        tabIndex={-1}
        sx={{ display: { xs: 'table-row', sm: 'none' } }}
      >
        <TableCell colSpan={5} sx={{ p: 2 }}>
          {/* Top: Avatar + Name / Type · Date */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
          <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette[row.visit === 'Sportivo' ? 'info' : 'warning'].main, 0.12),
                    color: row.visit === 'Sportivo' ? 'info.main' : 'warning.main',
                    flexShrink: 0,
                  }}
                >
                  <Iconify
                    icon={row.visit === 'Sportivo' ? 'solar:flag-bold-duotone' : 'mdi:ambulance'}
                    width={22}
                  />
                </Box>
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ typography: 'subtitle2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {row.name}
              </Box>
              <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
                {row.visit} &middot; {row.timestamp}
              </Box>
            </Box>
          </Box>

          {/* Bottom: Status left, actions right */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {renderStatusControl}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {isSubmitting && <CircularProgress size={16} sx={{ alignSelf: 'center', mr: 0.5 }} />}
              <IconButton size="small" color="primary" onClick={handleEdit} disabled={isSubmitting}>
                <Iconify icon="eva:edit-fill" width={18} />
              </IconButton>
              <IconButton
                size="small"
                color={isArchivedRow ? 'info' : 'error'}
                onClick={handleOpenArchiveDialog}
                aria-label={isArchivedRow ? 'Ripristina servizio' : 'Archivia servizio'}
              >
                <Iconify icon={isArchivedRow ? 'mdi:restore' : 'solar:trash-bin-minimalistic-bold'} width={18} />
              </IconButton>
              <IconButton size="small" color="success" onClick={handleOpenShareDialog}>
                <Iconify icon="solar:share-bold" width={18} />
              </IconButton>
            </Box>
          </Box>
        </TableCell>
      </TableRow>

      {/* Desktop View */}
      <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        sx={{ display: { xs: 'none', sm: 'table-row' } }}
      >
        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
          <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette[row.visit === 'Sportivo' ? 'info' : 'warning'].main, 0.12),
                    color: row.visit === 'Sportivo' ? 'info.main' : 'warning.main',
                    flexShrink: 0,
                  }}
                >
                  <Iconify
                    icon={row.visit === 'Sportivo' ? 'solar:flag-bold-duotone' : 'mdi:ambulance'}
                    width={22}
                  />
                </Box>{row.name}
          </Box>
        </TableCell>

        <TableCell>{row.visit}</TableCell>

        <TableCell>{row.timestamp}</TableCell>

        <TableCell>{renderStatusControl}</TableCell>

        <TableCell align="right">
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Tooltip title="Modifica">
              <IconButton color="primary" onClick={handleEdit} disabled={isSubmitting}>
                <Iconify icon="eva:edit-fill" />
              </IconButton>
            </Tooltip>
            <Tooltip title={isArchivedRow ? 'Ripristina' : 'Archivia'}>
              <span>
                <IconButton
                  color={isArchivedRow ? 'info' : 'error'}
                  onClick={handleOpenArchiveDialog}
                  aria-label={isArchivedRow ? 'Ripristina servizio' : 'Archivia servizio'}
                >
                  <Iconify icon={isArchivedRow ? 'mdi:restore' : 'solar:trash-bin-minimalistic-bold'} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Condividi">
              <IconButton color="success" onClick={handleOpenShareDialog}>
                <Iconify icon="solar:share-bold" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
      
      {/* Share Dialog */}
      <ServiceShareDialog
        open={shareDialogOpen}
        onClose={handleCloseShareDialog}
        serviceData={row}
      />

      {/* Archive / Restore Confirmation Dialog */}
      <Dialog
        open={archiveDialogOpen}
        onClose={handleCloseArchiveDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette[isArchivedRow ? 'info' : 'error'].main, 0.12),
                color: isArchivedRow ? 'info.main' : 'error.main',
              }}
            >
              <Iconify icon={dialogIcon} width={20} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {dialogTitle}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {dialogSubtitle}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 0.5 }}>
          <Stack spacing={1.25}>
            <Box sx={{ p: 1.25, borderRadius: 1.5, bgcolor: 'background.neutral' }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                {row.name}
              </Typography>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                <Chip size="small" label={row.visit} variant="outlined" />
                <Chip size="small" label={row.timestamp} variant="outlined" />
                <Chip size="small" label={row.status} color={getRowStatusColor(row.status)} variant="outlined" />
              </Stack>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {isArchivedRow
                ? 'Confermando, il servizio tornera visibile tra i servizi attivi.'
                : 'Confermando, il servizio restera disponibile nello storico e potra essere ripristinato in qualsiasi momento.'}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            pb: 2.5,
            pt: 1,
            gap: 1,
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: { sm: 'flex-end' },
            alignItems: { xs: 'stretch', sm: 'center' },
            '& > :not(:first-of-type)': { ml: { xs: '0 !important', sm: undefined } },
          }}
        >
          <Button
            onClick={handleConfirmArchiveAction}
            color={isArchivedRow ? 'info' : 'error'}
            variant="contained"
            disabled={isSubmitting}
            fullWidth
            sx={{ order: { xs: 1, sm: 2 } }}
          >
            {isSubmitting
              ? isArchivedRow ? 'Ripristino...' : 'Archiviazione...'
              : isArchivedRow ? 'Ripristina' : 'Archivia'}
          </Button>
          <Button
            onClick={handleCloseArchiveDialog}
            color="inherit"
            disabled={isSubmitting}
            variant="outlined"
            fullWidth
            sx={{ order: { xs: 2, sm: 1 } }}
          >
            Annulla
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
