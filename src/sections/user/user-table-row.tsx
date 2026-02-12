import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import { alpha, useTheme } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { useRouter } from 'src/routes/hooks';

import { useToast } from 'src/hooks/use-toast';

import { useServices } from 'src/contexts/service-context';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import ServiceShareDialog from 'src/components/share/service-share-dialog';

import type { UserProps } from './models';

// ----------------------------------------------------------------------

type UserTableRowProps = {
  row: UserProps;
};

export function UserTableRow({ row }: UserTableRowProps) {
  const theme = useTheme();
  const router = useRouter();
  const { deleteService } = useServices();
  const { success: showSuccess, error: showError } = useToast();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
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

  const renderStatus = (
    <Label color={getRowStatusColor(row.status)}>
      {row.status}
    </Label>
  );

  // Determine the edit route based on service type
  const handleEdit = () => {
    if (row.visit === 'Sportivo') {
      router.push(`/servizi/sportivi/modifica/${row.id}`);
    } else {
      router.push(`/servizi/secondari/modifica/${row.id}`);
    }
  };

  // Delete handlers
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteService(row.id);
      showSuccess('Servizio eliminato con successo');
      handleCloseDeleteDialog();
    } catch (err) {
      console.error(err);
      showError('Errore durante l\'eliminazione del servizio');
    } finally {
      setDeleting(false);
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
            {renderStatus}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" color="primary" onClick={handleEdit}>
                <Iconify icon="eva:edit-fill" width={18} />
              </IconButton>
              <IconButton size="small" color="error" onClick={handleOpenDeleteDialog}>
                <Iconify icon="solar:trash-bin-minimalistic-bold" width={18} />
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

        <TableCell>{renderStatus}</TableCell>

        <TableCell align="right">
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Tooltip title="Modifica">
              <IconButton color="primary" onClick={handleEdit}>
                <Iconify icon="eva:edit-fill" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Elimina">
              <IconButton color="error" onClick={handleOpenDeleteDialog}>
                <Iconify icon="solar:trash-bin-minimalistic-bold" />
              </IconButton>
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Conferma eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sei sicuro di voler eliminare il servizio &quot;{row.name}&quot;? Questa azione non può essere annullata.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="inherit" disabled={deleting}>
            Annulla
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Eliminazione...' : 'Elimina'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
