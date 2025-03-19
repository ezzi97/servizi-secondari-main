import { useState, useEffect } from 'react';
import dayjs, { type Dayjs } from 'dayjs';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import it from 'date-fns/locale/it';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { 
  Box, 
  Chip, 
  Grid,
  Stack, 
  Button, 
  Popover, 
  Tooltip, 
  useTheme, 
  IconButton,
  Typography,
  useMediaQuery,
  InputAdornment
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { UserView } from '../../user/view';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

// Date preset options
const DATE_PRESETS = [
  { 
    label: 'Oggi', 
    getDates: () => {
      const today = new Date();
      return { from: today, to: today };
    }
  },
  { 
    label: 'Ieri', 
    getDates: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return { from: yesterday, to: yesterday };
    }
  },
  { 
    label: 'Ultimi 7 giorni', 
    getDates: () => {
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      return { from: lastWeek, to: today };
    }
  },
  { 
    label: 'Questo mese', 
    getDates: () => {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: firstDay, to: today };
    }
  },
];

export function OverviewAnalyticsView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [filterDate, setFilterDate] = useState<Dayjs | null>(dayjs());
  
  // Date range filters for all content
  const [filterDateFrom, setFilterDateFrom] = useState<Date | null>(null);
  const [filterDateTo, setFilterDateTo] = useState<Date | null>(null);
  
  // For date filter popover
  const [openDateFilter, setOpenDateFilter] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  const handleOpenDateFilter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenDateFilter(true);
  };
  
  const handleCloseDateFilter = () => {
    setOpenDateFilter(false);
    setAnchorEl(null);
  };
  
  const handleClearDateFilters = () => {
    setFilterDateFrom(null);
    setFilterDateTo(null);
  };
  
  const hasActiveDateFilters = filterDateFrom || filterDateTo;

  // Example function to calculate stats based on date
  const getStats = (date: Dayjs | null) => {
    if (!date) {
      return {
        servicesCompleted: 100,
        kmTraveled: 135,
        lateServices: 3,
        totalServices: 150,
      };
    }
    if (date.isSame(dayjs(), 'day')) {
      return {
        servicesCompleted: 200,
        kmTraveled: 135,
        lateServices: 3,
        totalServices: 150,
      };
    }
    return {
      servicesCompleted: 250,
      kmTraveled: 135,
      lateServices: 3,
      totalServices: 150,
    };
  };

  const stats = getStats(filterDate);

  // Apply loading effect when filters change
  useEffect(() => {
    if (filterDateFrom || filterDateTo) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [filterDateFrom, filterDateTo]);
  
  // Format date with Italian locale
  const formatDate = (date: Date) => format(date, 'dd MMM yyyy', { locale: it });
  
  // Apply date preset
  const applyDatePreset = (preset: typeof DATE_PRESETS[number]) => {
    const { from, to } = preset.getDates();
    setFilterDateFrom(from);
    setFilterDateTo(to);
    if (isMobile) handleCloseDateFilter();
  };

  return (
    <DashboardContent maxWidth="xl" sx={{ pb: 15 }}>
      <Grid container spacing={3} sx={{ mb: { xs: 3, md: 5 } }}>
        {/* Title - Full width on mobile, partial width on desktop */}
        <Grid item xs={12} md={6}>
        <Typography variant="h4">
          Ciao, benvenuto! 👋
        </Typography>
        </Grid>
        
        {/* Calendar - Bottom on mobile (order: 2), right on desktop */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{ 
            display: 'flex', 
            justifyContent: { xs: 'flex-start', md: 'flex-end' },
            order: { xs: 2, md: 1 }
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            {/* Improved filter chips with animation */}
            {(filterDateFrom || filterDateTo) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Box 
                  sx={{ 
                    px: 2, 
                    py: 0.75, 
                    borderRadius: 1.5, 
                    bgcolor: theme.palette.mode === 'dark' ? 'primary.darker' : 'primary.lighter',
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    mb: { xs: 1, sm: 0 },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {filterDateFrom && filterDateTo ? (
                      <>
                        {filterDateFrom.getTime() === filterDateTo.getTime() 
                          ? formatDate(filterDateFrom)
                          : `${formatDate(filterDateFrom)} - ${formatDate(filterDateTo)}`
                        }
                      </>
                    ) : (
                      <>
                        {filterDateFrom && `Da: ${formatDate(filterDateFrom)}`}
                        {filterDateTo && `A: ${formatDate(filterDateTo)}`}
                      </>
                    )}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={handleClearDateFilters}
                    sx={{ ml: 0.5, p: 0.25 }}
                    aria-label="Cancella filtri data"
                  >
                    <Iconify icon="eva:close-fill" width={16} />
                  </IconButton>
                </Box>
              </motion.div>
            )}
            
            {/* Mobile/Desktop filter icon and popover */}
            {isMobile ? (
              <>
                <Tooltip title="Filtra per periodo">
                  <IconButton 
                    onClick={handleOpenDateFilter}
                    sx={{ 
                      position: 'relative',
                      ...(hasActiveDateFilters && {
                        color: 'primary.main',
                        bgcolor: 'primary.lighter',
                      }),
                    }}
                  >
                    <Iconify icon="mdi:calendar-filter" />
                    {hasActiveDateFilters && (
                      <Box
                        component={motion.div}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
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
                
                <Popover
                  open={openDateFilter}
                  anchorEl={anchorEl}
                  onClose={handleCloseDateFilter}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: {
                      p: 0,
                      width: 300,
                      mt: 1.5,
                      overflow: 'hidden',
                      boxShadow: (theme) => theme.customShadows.z20,
                    },
                  }}
                >
                  <LocalizationProvider 
                    dateAdapter={AdapterDateFns} 
                    adapterLocale={it}
                    localeText={{
                      okButtonLabel: 'OK',
                      cancelButtonLabel: 'Annulla',
                      todayButtonLabel: 'Oggi',
                      clearButtonLabel: 'Cancella'
                    }}
                  >
                    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="subtitle1">Filtra per periodo</Typography>
                    </Box>
                    
                    {/* Quick date presets */}
                    <Box sx={{ p: 2, borderBottom: '1px dashed', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Selezione rapida
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {DATE_PRESETS.map((preset) => (
                          <Chip
                            key={preset.label}
                            label={preset.label}
                            size="small"
                            onClick={() => applyDatePreset(preset)}
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </Box>
                    </Box>
                    
                    <Box sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <DatePicker
                          label="Data da"
                          value={filterDateFrom}
                          onChange={setFilterDateFrom}
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                              InputProps: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Iconify icon="eva:calendar-fill" width={20} sx={{ color: 'text.disabled' }} />
                                  </InputAdornment>
                                ),
                              }
                            }
                          }}
                        />

                        <DatePicker
                          label="Data a"
                          value={filterDateTo}
                          onChange={setFilterDateTo}
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                              InputProps: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Iconify icon="eva:calendar-fill" width={20} sx={{ color: 'text.disabled' }} />
                                  </InputAdornment>
                                ),
                              }
                            }
                          }}
                        />
                      </Stack>
                    </Box>
                    
                    <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
                      {hasActiveDateFilters && (
                        <Button
                          variant="outlined"
                          color="inherit"
                          onClick={handleClearDateFilters}
                          size="small"
                        >
                          Cancella
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        onClick={handleCloseDateFilter}
                        size="small"
                        sx={{ ml: 'auto' }}
                      >
                        Applica
                      </Button>
                    </Box>
                  </LocalizationProvider>
                </Popover>
              </>
            ) : (
              <>
                <Tooltip title="Filtra per periodo">
                  <IconButton 
                    onClick={handleOpenDateFilter}
                    sx={{ 
                      position: 'relative',
                      ...(hasActiveDateFilters && {
                        color: 'primary.main',
                        bgcolor: 'primary.lighter',
                      }),
                    }}
                  >
                    <Iconify icon="mdi:calendar-filter" />
                    {hasActiveDateFilters && (
                      <Box
                        component={motion.div}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
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

                <Popover
                  open={openDateFilter}
                  anchorEl={anchorEl}
                  onClose={handleCloseDateFilter}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: {
                      p: 0,
                      width: 300,
                      mt: 1.5,
                    },
                  }}
                >
                  <LocalizationProvider 
                    dateAdapter={AdapterDateFns} 
                    adapterLocale={it}
                    localeText={{
                      okButtonLabel: 'OK',
                      cancelButtonLabel: 'Annulla',
                      todayButtonLabel: 'Oggi',
                      clearButtonLabel: 'Cancella'
                    }}
                  >
                    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="subtitle1">Filtra per periodo</Typography>
                    </Box>
                    
                    <Box sx={{ p: 2, borderBottom: '1px dashed', borderColor: 'divider' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>Selezione rapida</Typography>
                      <Stack direction="row" flexWrap="wrap" sx={{ mx: -0.5 }}>
                        {DATE_PRESETS.map((preset) => (
                          <Chip
                            key={preset.label}
                            label={preset.label}
                            size="small"
                            onClick={() => applyDatePreset(preset)}
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </Stack>
                    </Box>
                    
                    <Box sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <DatePicker
                          label="Data da"
                          value={filterDateFrom}
                          onChange={setFilterDateFrom}
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true
                            }
                          }}
                        />

                        <DatePicker
                          label="Data a"
                          value={filterDateTo}
                          onChange={setFilterDateTo}
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true
                            }
                          }}
                        />
                      </Stack>
      </Box>

                    <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
                      {hasActiveDateFilters && (
                        <Button
                          variant="outlined"
                          color="inherit"
                          onClick={handleClearDateFilters}
                          size="small"
                        >
                          Cancella
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        onClick={handleCloseDateFilter}
                        size="small"
                        sx={{ ml: 'auto' }}
                      >
                        Applica
                      </Button>
                    </Box>
                  </LocalizationProvider>
                </Popover>
              </>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Add loading overlay */}
      {isLoading && (
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255,255,255,0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component={motion.div}
            animate={{ 
              rotate: 360,
              transition: { duration: 1.5, repeat: Infinity, ease: 'linear' }
            }}
          >
            <Iconify icon="eos-icons:loading" width={40} height={40} />
          </Box>
        </Box>
      )}

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Servizi effettuati"
            percent={2.6}
            total={stats.servicesCompleted}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            sx={{ height: '100%' }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Km percorsi"
            percent={-0.1}
            total={stats.kmTraveled}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            sx={{ height: '100%' }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Servizi in ritardo"
            percent={-0.1}
            total={stats.lateServices}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            sx={{ height: '100%' }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Servizi conclusi"
            percent={-0.1}
            total={stats.totalServices ?? 0}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            sx={{ height: '100%' }}
          />
        </Grid>
      </Grid>

      <UserView 
        filterDateFrom={filterDateFrom}
        filterDateTo={filterDateTo}
      />
    </DashboardContent>
  );
}

