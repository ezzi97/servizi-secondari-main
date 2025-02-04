import { useState } from 'react';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

import { FilterPopover } from './filter-popover';

// ----------------------------------------------------------------------

type UserTableToolbarProps = {
  filterName: string;
  filterVisit: string;
  filterStatus: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterVisit: (value: string) => void;
  onFilterStatus: (value: string) => void;
};

export function UserTableToolbar({
  filterName,
  filterVisit,
  filterStatus,
  onFilterName,
  onFilterVisit,
  onFilterStatus,
}: UserTableToolbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        bgcolor: 'background.default',
      }}
    >
      <OutlinedInput
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Cerca paziente..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        }
        sx={{ maxWidth: 480 }}
      />

      <Tooltip title="Filtri">
        <IconButton onClick={handleOpenMenu}>
          <Iconify icon="ic:round-filter-list" />
        </IconButton>
      </Tooltip>

      <FilterPopover
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorEl={anchorEl}
        filterVisit={filterVisit}
        filterStatus={filterStatus}
        onFilterVisit={onFilterVisit}
        onFilterStatus={onFilterStatus}
      />
    </Toolbar>
  );
}
