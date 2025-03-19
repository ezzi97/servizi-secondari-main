import { useState } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { 
  Box, 
  Chip, 
  Stack, 
  Button, 
  Tooltip, 
  Popover,
  Divider,
  MenuItem,
  useTheme,
  TextField,
  IconButton,
  Typography,
  useMediaQuery,
  InputAdornment,
  Grid
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { motion } from 'framer-motion';

// Define filter options
const VISIT_OPTIONS = ['Tutti', 'Dialisi', 'Visita', 'Trasporto', 'Esami'];
const STATUS_OPTIONS = ['Tutti', 'Completato', 'In corso', 'Annullato', 'In attesa'];
const VEHICLE_OPTIONS = ['Tutti', 'Auto', 'Ambulanza', 'Doblò', 'Pulmino'];
const PRIORITY_OPTIONS = ['Tutti', 'Urgente', 'Normale', 'Programmato'];
const TIME_OPTIONS = ['Tutti', 'Mattina', 'Pomeriggio', 'Sera'];

type Props = {
  filterName: string;
  filterVisit: string;
  filterStatus: string;
  filterVehicle: string;
  filterPriority: string;
  filterTimeOfDay: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterVisit: (value: string) => void;
  onFilterStatus: (value: string) => void;
  onFilterVehicle: (value: string) => void;
  onFilterPriority: (value: string) => void;
  onFilterTimeOfDay: (value: string) => void;
};

// Create a dark mode wrapper for the entire desktop filters section
const DesktopFiltersWrapper = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        ...(theme.palette.mode === 'dark' && {
          // Apply dark mode styling directly to the container
          bgcolor: theme.palette.background.default,
          
          // Style all input fields
          '& .MuiInputBase-root': {
            bgcolor: 'transparent',
          },
          
          // Style all text fields
          '& .MuiTextField-root .MuiInputBase-root': {
            bgcolor: 'transparent',
          },
          
          // Style all select fields
          '& .MuiSelect-select': {
            bgcolor: 'transparent',
          },
          
          // Style all paper elements (menus, popovers)
          '& .MuiPaper-root': {
            bgcolor: theme.palette.background.paper,
          },
          
          // Style all outlined inputs
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
          },
          
          // Style all input text
          '& .MuiInputBase-input': {
            color: theme.palette.text.primary,
          },
          
          // Style all input labels
          '& .MuiInputLabel-root': {
            color: theme.palette.text.secondary,
          },
          
          // Style all dividers
          '& .MuiDivider-root': {
            borderColor: 'rgba(255, 255, 255, 0.12)',
          },
          
          // Style all chips
          '& .MuiChip-root': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
          },
        }),
      }}
    >
      {children}
    </Box>
  );
};

export function UserTableToolbar({
  filterName,
  filterVisit,
  filterStatus,
  filterVehicle,
  filterPriority,
  filterTimeOfDay,
  onFilterName,
  onFilterVisit,
  onFilterStatus,
  onFilterVehicle,
  onFilterPriority,
  onFilterTimeOfDay,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // For mobile filter popover
  const [openFilter, setOpenFilter] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const handleOpenFilter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
    setAnchorEl(null);
  };

  const handleClearFilters = () => {
    onFilterName({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    onFilterVisit('');
    onFilterStatus('');
    onFilterVehicle('');
    onFilterPriority('');
    onFilterTimeOfDay('');
    if (isMobile) handleCloseFilter();
  };
  
  const hasActiveFilters = filterName || filterVisit || filterStatus || 
    filterVehicle || filterPriority || filterTimeOfDay;
  
  // Calculate the number of active filters
  const activeFiltersCount = [
    filterName, 
    filterVisit, 
    filterStatus, 
    filterVehicle, 
    filterPriority, 
    filterTimeOfDay
  ].filter(Boolean).length;
  
  // Then wrap your desktopFilters with this component:
  const desktopFilters = (
    <DesktopFiltersWrapper>
      <LocalizationProvider 
        dateAdapter={AdapterDateFns} 
        localeText={{
          okButtonLabel: 'OK',
          cancelButtonLabel: 'Annulla',
          todayButtonLabel: 'Oggi',
          clearButtonLabel: 'Cancella'
        }}
      >
        <Box 
          sx={{ 
            p: 2.5, 
            width: '100%', 
          }}
        >
          {/* Top row with search and advanced filters toggle */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2}
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <TextField
              fullWidth
              value={filterName}
              onChange={onFilterName}
              placeholder="Cerca paziente..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                endAdornment: filterName ? (
                  <InputAdornment position="end">
                    <IconButton onClick={() => onFilterName({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}>
                      <Iconify icon="eva:close-fill" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={{ 
                maxWidth: { sm: 280 },
              }}
            />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, flexGrow: 1, justifyContent: 'flex-end' }}>
              {/* Advanced filters toggle */}
              <Tooltip title={showAdvancedFilters ? "Nascondi filtri avanzati" : "Mostra filtri avanzati"}>
                <Button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  startIcon={<Iconify icon="mdi:filter-variant" />}
                  endIcon={<Iconify icon={showAdvancedFilters ? "eva:chevron-up-fill" : "eva:chevron-down-fill"} />}
                  color={hasActiveFilters ? "primary" : "inherit"}
                  variant={showAdvancedFilters ? "contained" : "outlined"}
                  size="small"
                  sx={{ 
                    borderRadius: 1.5,
                    ...(hasActiveFilters && !showAdvancedFilters && {
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                      borderColor: 'primary.light',
                    }),
                  }}
                >
                  Filtri {hasActiveFilters && `(${activeFiltersCount})`}
                </Button>
              </Tooltip>

              {hasActiveFilters && (
                <Tooltip title="Cancella filtri">
                  <IconButton 
                    onClick={handleClearFilters}
                  >
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Stack>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <Stack 
              direction="row" 
              spacing={1} 
              flexWrap="wrap"
              sx={{ mb: 2 }}
            >
              {filterStatus && (
                <Chip 
                  label={`Stato: ${filterStatus}`} 
                  size="small" 
                  onDelete={() => onFilterStatus('')}
                />
              )}
              {filterVisit && (
                <Chip 
                  label={`Visita: ${filterVisit}`} 
                  size="small" 
                  onDelete={() => onFilterVisit('')}
                />
              )}
              {filterVehicle && (
                <Chip 
                  label={`Mezzo: ${filterVehicle}`} 
                  size="small" 
                  onDelete={() => onFilterVehicle('')}
                />
              )}
              {filterPriority && (
                <Chip 
                  label={`Priorità: ${filterPriority}`} 
                  size="small" 
                  onDelete={() => onFilterPriority('')}
                />
              )}
              {filterTimeOfDay && (
                <Chip 
                  label={`Orario: ${filterTimeOfDay}`} 
                  size="small" 
                  onDelete={() => onFilterTimeOfDay('')}
                />
              )}
            </Stack>
          )}

          {/* Advanced filters */}
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Box 
      sx={{
                  mt: 2, 
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: (theme) => theme.customShadows.z8,
                  bgcolor: 'background.paper',
                }}
              >
                <Grid container spacing={3}>
                  {/* Status filter */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                      Stato
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {STATUS_OPTIONS.map((option) => (
                        option !== 'Tutti' && (
                          <Chip
                            key={option}
                            label={option}
                            size="small"
                            onClick={() => onFilterStatus(option === filterStatus ? '' : option)}
                            color={option === filterStatus ? 'primary' : 'default'}
                            variant={option === filterStatus ? 'filled' : 'outlined'}
                            sx={{ m: 0.5 }}
                          />
                        )
                      ))}
                    </Box>
                  </Grid>

                  {/* Visit type filter */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                      Tipo visita
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {VISIT_OPTIONS.map((option) => (
                        option !== 'Tutti' && (
                          <Chip
                            key={option}
                            label={option}
                            size="small"
                            onClick={() => onFilterVisit(option === filterVisit ? '' : option)}
                            color={option === filterVisit ? 'primary' : 'default'}
                            variant={option === filterVisit ? 'filled' : 'outlined'}
                            sx={{ m: 0.5 }}
                          />
                        )
                      ))}
                    </Box>
                  </Grid>

                  {/* Vehicle filter */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                      Mezzo
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {VEHICLE_OPTIONS.map((option) => (
                        option !== 'Tutti' && (
                          <Chip
                            key={option}
                            label={option}
                            size="small"
                            onClick={() => onFilterVehicle(option === filterVehicle ? '' : option)}
                            color={option === filterVehicle ? 'primary' : 'default'}
                            variant={option === filterVehicle ? 'filled' : 'outlined'}
                            sx={{ m: 0.5 }}
                          />
                        )
                      ))}
                    </Box>
                  </Grid>

                  {/* Priority filter */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                      Priorità
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {PRIORITY_OPTIONS.map((option) => (
                        option !== 'Tutti' && (
                          <Chip
                            key={option}
                            label={option}
                            size="small"
                            onClick={() => onFilterPriority(option === filterPriority ? '' : option)}
                            color={option === filterPriority ? 'primary' : 'default'}
                            variant={option === filterPriority ? 'filled' : 'outlined'}
                            sx={{ m: 0.5 }}
                          />
                        )
                      ))}
                    </Box>
                  </Grid>

                  {/* Time of day filter */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                      Fascia oraria
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {TIME_OPTIONS.map((option) => (
                        option !== 'Tutti' && (
                          <Chip
                            key={option}
                            label={option}
                            size="small"
                            onClick={() => onFilterTimeOfDay(option === filterTimeOfDay ? '' : option)}
                            color={option === filterTimeOfDay ? 'primary' : 'default'}
                            variant={option === filterTimeOfDay ? 'filled' : 'outlined'}
                            sx={{ 
                              m: 0.5,
                            }}
                          />
                        )
                      ))}
                    </Box>
                  </Grid>
                </Grid>

                {/* Action buttons */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  {hasActiveFilters && (
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={handleClearFilters}
                      startIcon={<Iconify icon="eva:trash-2-outline" />}
                      sx={{ mr: 1 }}
                    >
                      Cancella filtri
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={() => setShowAdvancedFilters(false)}
                  >
                    Applica
                  </Button>
                </Box>
              </Box>
            </motion.div>
          )}
        </Box>
      </LocalizationProvider>
    </DesktopFiltersWrapper>
  );

  // Mobile view
  const mobileFilters = (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Cerca paziente..."
          size="small"
          InputProps={{
            startAdornment: (
          <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment: filterName ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onFilterName({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}>
                  <Iconify icon="eva:close-fill" width={18} />
                </IconButton>
          </InputAdornment>
            ) : null,
          }}
      />

      <Tooltip title="Filtri">
          <IconButton 
            onClick={handleOpenFilter}
            sx={{ 
              ...(hasActiveFilters && {
                color: 'primary.main',
                bgcolor: 'primary.lighter',
              }),
            }}
          >
          <Iconify icon="ic:round-filter-list" />
            {hasActiveFilters && (
              <Box
                component="span"
                sx={{
                  top: 4,
                  right: 4,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  position: 'absolute',
                  bgcolor: 'error.main',
                }}
              />
            )}
        </IconButton>
      </Tooltip>
      </Stack>
    </Box>
  );

  // Active filter indicators for mobile
  const activeFilterChips = (
    <Box 
      sx={{ 
        px: 2, 
        pb: 1.5,
        display: { xs: hasActiveFilters ? 'block' : 'none', sm: 'none' },
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Filtri attivi:
      </Typography>
      <Stack 
        direction="row" 
        spacing={0.5} 
        flexWrap="wrap"
      >
        {filterStatus && (
          <Chip 
            label={filterStatus} 
            size="small" 
            onDelete={() => onFilterStatus('')}
            sx={{ m: 0.5 }}
            color="primary"
            variant="outlined"
          />
        )}
        {filterVisit && (
          <Chip 
            label={filterVisit} 
            size="small" 
            onDelete={() => onFilterVisit('')}
            sx={{ m: 0.5 }}
            color="primary"
            variant="outlined"
          />
        )}
        {filterVehicle && (
          <Chip 
            label={filterVehicle} 
            size="small" 
            onDelete={() => onFilterVehicle('')}
            sx={{ m: 0.5 }}
            color="primary"
            variant="outlined"
          />
        )}
        {filterPriority && (
          <Chip 
            label={filterPriority} 
            size="small" 
            onDelete={() => onFilterPriority('')}
            sx={{ m: 0.5 }}
            color="primary"
            variant="outlined"
          />
        )}
        {filterTimeOfDay && (
          <Chip 
            label={filterTimeOfDay} 
            size="small" 
            onDelete={() => onFilterTimeOfDay('')}
            sx={{ m: 0.5 }}
            color="primary"
            variant="outlined"
          />
        )}
      </Stack>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          {mobileFilters}
          {activeFilterChips}
          <Popover
            open={openFilter}
        anchorEl={anchorEl}
            onClose={handleCloseFilter}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                p: 0,
                width: 300,
                mt: 1.5,
                maxHeight: '80vh',
                overflowY: 'auto',
              },
            }}
          >
            <LocalizationProvider 
              dateAdapter={AdapterDateFns} 
              localeText={{
                okButtonLabel: 'OK',
                cancelButtonLabel: 'Annulla',
                todayButtonLabel: 'Oggi',
                clearButtonLabel: 'Cancella'
              }}
            >
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">Filtri</Typography>
                {hasActiveFilters && (
                  <Button
                    size="small"
                    color="inherit"
                    onClick={handleClearFilters}
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                  >
                    Cancella
                  </Button>
                )}
              </Box>

              <Box sx={{ p: 2, borderBottom: '1px dashed', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>Stato</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {STATUS_OPTIONS.map((option) => (
                    option !== 'Tutti' && (
                      <Chip
                        key={option}
                        label={option}
                        size="small"
                        onClick={() => onFilterStatus(option === filterStatus ? '' : option)}
                        color={option === filterStatus ? 'primary' : 'default'}
                        variant={option === filterStatus ? 'filled' : 'outlined'}
                        sx={{ m: 0.5 }}
                      />
                    )
                  ))}
                </Box>
              </Box>

              <Box sx={{ p: 2, borderBottom: '1px dashed', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>Tipo visita</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {VISIT_OPTIONS.map((option) => (
                    option !== 'Tutti' && (
                      <Chip
                        key={option}
                        label={option}
                        size="small"
                        onClick={() => onFilterVisit(option === filterVisit ? '' : option)}
                        color={option === filterVisit ? 'primary' : 'default'}
                        variant={option === filterVisit ? 'filled' : 'outlined'}
                        sx={{ m: 0.5 }}
                      />
                    )
                  ))}
                </Box>
              </Box>

              <Box sx={{ p: 2, borderBottom: '1px dashed', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>Mezzo</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {VEHICLE_OPTIONS.map((option) => (
                    option !== 'Tutti' && (
                      <Chip
                        key={option}
                        label={option}
                        size="small"
                        onClick={() => onFilterVehicle(option === filterVehicle ? '' : option)}
                        color={option === filterVehicle ? 'primary' : 'default'}
                        variant={option === filterVehicle ? 'filled' : 'outlined'}
                        sx={{ m: 0.5 }}
                      />
                    )
                  ))}
                </Box>
              </Box>

              <Box sx={{ p: 2, borderBottom: '1px dashed', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>Priorità</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {PRIORITY_OPTIONS.map((option) => (
                    option !== 'Tutti' && (
                      <Chip
                        key={option}
                        label={option}
                        size="small"
                        onClick={() => onFilterPriority(option === filterPriority ? '' : option)}
                        color={option === filterPriority ? 'primary' : 'default'}
                        variant={option === filterPriority ? 'filled' : 'outlined'}
                        sx={{ m: 0.5 }}
                      />
                    )
                  ))}
                </Box>
              </Box>

              <Box sx={{ p: 2, borderBottom: '1px dashed', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>Fascia oraria</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {TIME_OPTIONS.map((option) => (
                    option !== 'Tutti' && (
                      <Chip
                        key={option}
                        label={option}
                        size="small"
                        onClick={() => onFilterTimeOfDay(option === filterTimeOfDay ? '' : option)}
                        color={option === filterTimeOfDay ? 'primary' : 'default'}
                        variant={option === filterTimeOfDay ? 'filled' : 'outlined'}
                        sx={{ 
                          m: 0.5,
                        }}
                      />
                    )
                  ))}
                </Box>
              </Box>

              <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleCloseFilter}
                >
                  Applica
                </Button>
              </Box>
            </LocalizationProvider>
          </Popover>
        </>
      ) : (
        desktopFilters
      )}
      {hasActiveFilters && <Divider />}
    </>
  );
}
