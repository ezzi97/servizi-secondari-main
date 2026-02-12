import { useState } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'src/routes/hooks';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import ServiceShareDialog from 'src/components/share/service-share-dialog';

import type { UserProps } from './models';

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
                    bgcolor: row.visit === 'Sportivo' ? 'info.lighter' : 'warning.lighter',
                    color: row.visit === 'Sportivo' ? 'info.darker' : 'warning.darker',
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
              <IconButton size="small" color="error">
                <Iconify icon="solar:archive-down-minimlistic-bold-duotone" width={18} />
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
                    bgcolor: row.visit === 'Sportivo' ? 'info.lighter' : 'warning.lighter',
                    color: row.visit === 'Sportivo' ? 'info.darker' : 'warning.darker',
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
