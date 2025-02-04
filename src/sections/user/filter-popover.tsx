import type { SelectChangeEvent } from '@mui/material/Select';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type FilterPopoverProps = {
  open: boolean;
  onClose: () => void;
  filterVisit: string;
  filterStatus: string;
  onFilterVisit: (value: string) => void;
  onFilterStatus: (value: string) => void;
  anchorEl: null | HTMLElement;
};

export function FilterPopover({
  open,
  onClose,
  anchorEl,
  filterVisit,
  filterStatus,
  onFilterVisit,
  onFilterStatus,
}: FilterPopoverProps) {

  return (
    <Menu
      keepMounted
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: { width: 280, maxWidth: '100%' },
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" gutterBottom>
          Filtri
        </Typography>

        <Select
          fullWidth
          size="small"
          value={filterVisit}
          onChange={(e: SelectChangeEvent) => onFilterVisit(e.target.value)}
          sx={{ mt: 2 }}
        >
          <MenuItem value="">Tutte le visite</MenuItem>
          <MenuItem value="visita_generica">Visita Generica</MenuItem>
          <MenuItem value="visita_controllo">Visita di Controllo</MenuItem>
          <MenuItem value="visita_urgenza">Visita di Urgenza</MenuItem>
        </Select>

        <Select
          fullWidth
          size="small"
          value={filterStatus}
          onChange={(e: SelectChangeEvent) => onFilterStatus(e.target.value)}
          sx={{ mt: 2 }}
        >
          <MenuItem value="">Tutti gli stati</MenuItem>
          <MenuItem value="effettuato">Effettuato</MenuItem>
          <MenuItem value="cancellato">Cancellato</MenuItem>
        </Select>


        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="contained" onClick={onClose}>
            Applica
          </Button>
        </Box>
      </Box>
    </Menu>
  );
} 