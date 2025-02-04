import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  name: string;
  visit: string;
  timestamp: string;
  status: string;
  avatarUrl: string;
};

type UserTableRowProps = {
  row: UserProps;
};

export function UserTableRow({ row }: UserTableRowProps) {

  const renderStatus = (
    <Label color={(row.status === 'cancellato' && 'error') || 'success'}>
      {row.status}
    </Label>
  );

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

            {/* Bottom row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>{row.visit}</Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TableCell>{renderStatus}</TableCell>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton color="primary">
                  <Iconify icon="solar:pen-bold" />
                </IconButton>
                <IconButton color="error">
                  <Iconify icon="solar:archive-down-minimlistic-bold-duotone" />
                </IconButton>
                <IconButton color="success">
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
            <IconButton color="primary">
              <Iconify icon="solar:pen-bold" />
            </IconButton>
            <IconButton color="error">
              <Iconify icon="solar:archive-down-minimlistic-bold-duotone" />
            </IconButton>
            <IconButton color="success">
              <Iconify icon="solar:share-bold" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
}
