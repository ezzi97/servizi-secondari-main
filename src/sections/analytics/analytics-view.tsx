import type { Service } from 'src/types';

import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useMemo, useState, useEffect } from 'react';

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
  IconButton,
  Typography,
} from '@mui/material';

import { serviceService } from 'src/services';
import { DashboardContent } from 'src/layouts/dashboard';
import { useServices } from 'src/contexts/service-context';

import { Iconify } from 'src/components/iconify';

import { KmRevenueChart } from 'src/sections/overview/km-revenue-chart';
import { MonthlyRevenueChart } from 'src/sections/analytics/monthly-revenue-chart';
import { MonthlyServicesChart } from 'src/sections/overview/monthly-services-chart';
import { AnalyticsWidgetSummary } from 'src/sections/overview/analytics-widget-summary';
import { VehicleUtilizationChart } from 'src/sections/analytics/vehicle-utilization-chart';

// ----------------------------------------------------------------------

const DATE_PRESETS = [
  {
    label: 'Oggi',
    getDates: () => {
      const today = new Date();
      return { from: today, to: today };
    },
  },
  {
    label: 'Ieri',
    getDates: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return { from: yesterday, to: yesterday };
    },
  },
  {
    label: 'Ultimi 7 giorni',
    getDates: () => {
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      return { from: lastWeek, to: today };
    },
  },
  {
    label: 'Questo mese',
    getDates: () => {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: firstDay, to: today };
    },
  },
  {
    label: 'Ultimi 30 giorni',
    getDates: () => {
      const today = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 30);
      return { from, to: today };
    },
  },
  {
    label: 'Ultimi 90 giorni',
    getDates: () => {
      const today = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 90);
      return { from, to: today };
    },
  },
];

export function AnalyticsView() {
  const { stats, statsLoading, fetchStats } = useServices();
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [chartsLoading, setChartsLoading] = useState(true);

  const [filterDateFrom, setFilterDateFrom] = useState<Date | null>(null);
  const [filterDateTo, setFilterDateTo] = useState<Date | null>(null);
  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLElement | null>(null);
  const openDateFilter = Boolean(dateAnchorEl);
  const hasActiveDateFilters = filterDateFrom || filterDateTo;

  const handleOpenDateFilter = (event: React.MouseEvent<HTMLElement>) => {
    setDateAnchorEl(event.currentTarget);
  };
  const handleCloseDateFilter = () => {
    setDateAnchorEl(null);
  };
  const handleClearDateFilters = () => {
    setFilterDateFrom(null);
    setFilterDateTo(null);
  };
  const formatDateLabel = (date: Date) => format(date, 'dd MMM yyyy', { locale: it });
  const applyDatePreset = (preset: typeof DATE_PRESETS[number]) => {
    const { from, to } = preset.getDates();
    setFilterDateFrom(from);
    setFilterDateTo(to);
  };

  const services = useMemo(() => {
    if (!filterDateFrom && !filterDateTo) return allServices;

    return allServices.filter((service) => {
      const rawDate = service.type === 'secondary' ? service.serviceDate : service.eventDateSport;
      if (!rawDate) return false;

      const serviceDate = new Date(rawDate);
      if (Number.isNaN(serviceDate.getTime())) return false;

      if (filterDateFrom) {
        const from = new Date(filterDateFrom);
        from.setHours(0, 0, 0, 0);
        if (serviceDate < from) return false;
      }

      if (filterDateTo) {
        const to = new Date(filterDateTo);
        to.setHours(23, 59, 59, 999);
        if (serviceDate > to) return false;
      }

      return true;
    });
  }, [allServices, filterDateFrom, filterDateTo]);

  const monthKeysForCharts = useMemo(() => {
    if (!filterDateFrom && !filterDateTo) return undefined;

    const fromSeed = filterDateFrom ?? filterDateTo;
    const toSeed = filterDateTo ?? filterDateFrom;
    if (!fromSeed || !toSeed) return undefined;

    const start = new Date(fromSeed.getFullYear(), fromSeed.getMonth(), 1);
    const end = new Date(toSeed.getFullYear(), toSeed.getMonth(), 1);
    const keys: string[] = [];

    const cursor = new Date(start);
    while (cursor <= end) {
      keys.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`);
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return keys;
  }, [filterDateFrom, filterDateTo]);

  const localStats = useMemo(() => {
    const total = services.length;
    const completed = services.filter((s) => s.status === 'completed').length;
    const pending = services.filter((s) => s.status === 'pending').length;
    const cancelled = services.filter((s) => s.status === 'cancelled').length;
    const totalRevenue = services
      .filter((s) => s.status === 'completed')
      .reduce((sum, s) => sum + (s.type === 'secondary' ? (s.price ?? 0) : (s.priceSport ?? 0)), 0);
    const averagePrice = completed > 0 ? totalRevenue / completed : 0;
    const totalKilometers = services
      .reduce((sum, s) => sum + (s.type === 'secondary' ? (s.kilometers ?? 0) : (s.kilometersSport ?? 0)), 0);

    return {
      total,
      completed,
      pending,
      cancelled,
      totalRevenue,
      averagePrice,
      totalKilometers,
    };
  }, [services]);

  const activeStats = filterDateFrom || filterDateTo ? localStats : stats;

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    setChartsLoading(true);

    async function loadServicesForAnalytics() {
      try {
        const baseFilters = {
          pageSize: '100',
          sortBy: 'created_at',
          sortOrder: 'asc',
        };

        const firstPageResponse = await serviceService.getServices({
          ...baseFilters,
          page: '1',
        } as any);

        if (!firstPageResponse.success || !firstPageResponse.data) {
          if (!cancelled) setAllServices([]);
          return;
        }

        const allItems: Service[] = [...(firstPageResponse.data.items ?? [])];
        const totalPages = firstPageResponse.data.totalPages || 1;

        if (totalPages > 1) {
          const remainingResponses = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, idx) =>
              serviceService.getServices({
                ...baseFilters,
                page: String(idx + 2),
              } as any)
            )
          );

          remainingResponses.forEach((response) => {
            if (response.success && response.data?.items?.length) {
              allItems.push(...response.data.items);
            }
          });
        }

        if (!cancelled) setAllServices(allItems);
      } catch {
        if (!cancelled) setAllServices([]);
      } finally {
        if (!cancelled) setChartsLoading(false);
      }
    }

    loadServicesForAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatCurrency = (v: number) =>
    `${v.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

  return (
    <DashboardContent maxWidth="xl" sx={{ pb: 15 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: { xs: 2, md: 3 } }}
      >
        <Typography variant="h4">Analisi</Typography>
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
      </Stack>

      {(filterDateFrom || filterDateTo) && (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Chip
            size="small"
            color="primary"
            variant="outlined"
            onDelete={handleClearDateFilters}
            label={
              filterDateFrom && filterDateTo
                ? filterDateFrom.getTime() === filterDateTo.getTime()
                  ? formatDateLabel(filterDateFrom)
                  : `${formatDateLabel(filterDateFrom)} – ${formatDateLabel(filterDateTo)}`
                : filterDateFrom
                  ? `Da: ${formatDateLabel(filterDateFrom)}`
                  : `A: ${formatDateLabel(filterDateTo!)}`
            }
          />
        </Stack>
      )}

      <Popover
        open={openDateFilter}
        anchorEl={dateAnchorEl}
        onClose={handleCloseDateFilter}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { p: 0, width: 300, mt: 1.5, overflow: 'hidden' } }}
      >
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={it}
          localeText={{
            okButtonLabel: 'OK',
            cancelButtonLabel: 'Annulla',
            todayButtonLabel: 'Oggi',
            clearButtonLabel: 'Cancella',
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1">Filtra per periodo</Typography>
          </Box>

          <Box sx={{ p: 2, borderBottom: '1px dashed', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Selezione rapida
            </Typography>
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
                maxDate={filterDateTo ?? undefined}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
              <DatePicker
                label="Data a"
                value={filterDateTo}
                onChange={setFilterDateTo}
                minDate={filterDateFrom ?? undefined}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Stack>
          </Box>

          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
            {hasActiveDateFilters && (
              <Button variant="outlined" color="inherit" onClick={handleClearDateFilters} size="small">
                Cancella
              </Button>
            )}
            <Button variant="contained" onClick={handleCloseDateFilter} size="small" sx={{ ml: 'auto' }}>
              Applica
            </Button>
          </Box>
        </LocalizationProvider>
      </Popover>

      {/* Row 1: Revenue + key stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Ricavi totali"
            total={activeStats?.totalRevenue ?? 0}
            loading={statsLoading}
            color="success"
            formatTotal={formatCurrency}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
            sx={{ height: '100%' }}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Prezzo medio"
            total={activeStats?.averagePrice ?? 0}
            loading={statsLoading}
            color="primary"
            formatTotal={formatCurrency}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            sx={{ height: '100%' }}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Cancellati"
            total={activeStats?.cancelled ?? 0}
            loading={statsLoading}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            sx={{ height: '100%' }}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Totale servizi"
            total={activeStats?.total ?? 0}
            loading={statsLoading}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            sx={{ height: '100%' }}
          />
        </Grid>
      </Grid>

      {/* Row 2: Charts side-by-side */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <MonthlyServicesChart
            services={services}
            loading={chartsLoading}
            monthKeys={monthKeysForCharts}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <KmRevenueChart
            services={services}
            loading={chartsLoading}
            monthKeys={monthKeysForCharts}
          />
        </Grid>
      </Grid>

      {/* Row 3: New analytics charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <MonthlyRevenueChart
            services={services}
            loading={chartsLoading}
            monthKeys={monthKeysForCharts}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <VehicleUtilizationChart services={services} loading={chartsLoading} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
