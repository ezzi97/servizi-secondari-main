import { useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import ServiceShareDialog from 'src/components/share/service-share-dialog';
import { UserProps } from './models';

// ----------------------------------------------------------------------

type UserTableRowProps = {
  row: UserProps;
};

export function UserTableRow({ row }: UserTableRowProps) {
  const router = useRouter();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  const renderStatus = (
    <Label color={(row.status === 'cancellato' && 'error') || 'success'}>
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
  
  // Open share dialog
  const handleOpenShareDialog = () => {
    setShareDialogOpen(true);
  };
  
  // Close share dialog
  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
  };

  return (
    <>
      {/* Mobile View */}
      <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        sx={{ display: { xs: 'table-row', sm: 'none' } }}
      >
        <TableCell colSpan={6} sx={{ padding: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Top row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar alt={row.name} src={row.avatarUrl} />
              <Box>
                <Box sx={{ typography: 'subtitle2' }}>{row.name}</Box>
                <Box sx={{ typography: 'body2', color: 'text.secondary' }}>{row.visit}</Box>
              </Box>
            </Box>

            {/* Date and time */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ typography: 'body2', color: 'text.secondary' }}>{row.timestamp}</Box>
              <Box sx={{ typography: 'body2', color: 'text.secondary' }}>{row.date}</Box>
            </Box>

            {/* Bottom row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>{row.visit}</Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TableCell>{renderStatus}</TableCell>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton color="primary" onClick={handleEdit}>
                  <Iconify icon="eva:edit-fill" />
                </IconButton>
                <IconButton color="error">
                  <Iconify icon="solar:archive-down-minimlistic-bold-duotone" />
                </IconButton>
                <IconButton color="success" onClick={handleOpenShareDialog}>
                  <Iconify icon="solar:share-bold" />
                </IconButton>
              </Box>
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
            <Avatar alt={row.name} src={row.avatarUrl} />
            {row.name}
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
            <Tooltip title="Cancella">
              <IconButton color="error">
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
      
      {/* Share Dialog - now using the separate component */}
      <ServiceShareDialog
        open={shareDialogOpen}
        onClose={handleCloseShareDialog}
        serviceData={row}
      />
    </>
  );
}
