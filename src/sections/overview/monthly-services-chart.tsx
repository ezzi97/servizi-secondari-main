import type { Service } from 'src/types';

import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { serviceService } from 'src/services';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

const MONTH_LABELS_IT = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

function getServiceDate(service: Service): string {
  if (service.type === 'secondary') return service.serviceDate ?? '';
  return service.eventDateSport ?? '';
}

function buildLastSixMonthsKeys() {
  const now = new Date();
  const months: string[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
}

function getMonthLabel(monthKey: string): string {
  const [yearStr, monthStr] = monthKey.split('-');
  const monthIndex = parseInt(monthStr, 10) - 1;
  const year = parseInt(yearStr, 10);
  const now = new Date();
  return year === now.getFullYear()
    ? MONTH_LABELS_IT[monthIndex]
    : `${MONTH_LABELS_IT[monthIndex]} ${String(year).slice(2)}`;
}

function buildChartData(sourceServices: Service[], fixedLastSixMonths: boolean) {
  const monthKeys = fixedLastSixMonths
    ? buildLastSixMonthsKeys()
    : Array.from(
      new Set(
        sourceServices
          .map((s) => getServiceDate(s))
          .filter(Boolean)
          .map((dateStr) => {
            const d = new Date(dateStr);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          })
      )
    ).sort();

  const transport: Record<string, number> = {};
  const sport: Record<string, number> = {};
  monthKeys.forEach((key) => {
    transport[key] = 0;
    sport[key] = 0;
  });

  sourceServices.forEach((s: Service) => {
    const dateStr = getServiceDate(s);
    if (!dateStr) return;
    const d = new Date(dateStr);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (s.type === 'secondary' && transport[key] !== undefined) {
      transport[key] += 1;
    } else if (s.type === 'sport' && sport[key] !== undefined) {
      sport[key] += 1;
    }
  });

  return {
    categories: monthKeys.map((key) => getMonthLabel(key)),
    transportData: monthKeys.map((key) => transport[key]),
    sportData: monthKeys.map((key) => sport[key]),
  };
}

type MonthlyServicesChartProps = {
  services?: Service[];
  loading?: boolean;
  monthKeys?: string[];
};

export function MonthlyServicesChart({ services, loading = false, monthKeys }: MonthlyServicesChartProps) {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(loading || services === undefined);
  const [fetchedServices, setFetchedServices] = useState<Service[]>([]);

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
      return () => {};
    }

    if (services) {
      setIsLoading(false);
      return () => {};
    }

    let cancelled = false;

    async function load() {
      try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        const dateFrom = sixMonthsAgo.toISOString().split('T')[0];

        const res = await serviceService.getServices({
          dateFrom,
          pageSize: '200',
          sortBy: 'service_date',
          sortOrder: 'asc',
        } as any);

        if (cancelled) return;

        const loadedServices = res.success ? (res.data?.items ?? []) : [];
        setFetchedServices(loadedServices);
      } catch {
        // Non-critical widget
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [loading, services]);

  const sourceServices = services ?? fetchedServices;
  const { categories, transportData, sportData } = useMemo(
    () => {
      if (monthKeys && monthKeys.length > 0) {
        const transport: Record<string, number> = {};
        const sport: Record<string, number> = {};
        monthKeys.forEach((key) => {
          transport[key] = 0;
          sport[key] = 0;
        });

        sourceServices.forEach((s: Service) => {
          const dateStr = getServiceDate(s);
          if (!dateStr) return;
          const d = new Date(dateStr);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          if (s.type === 'secondary' && transport[key] !== undefined) {
            transport[key] += 1;
          } else if (s.type === 'sport' && sport[key] !== undefined) {
            sport[key] += 1;
          }
        });

        return {
          categories: monthKeys.map((key) => getMonthLabel(key)),
          transportData: monthKeys.map((key) => transport[key]),
          sportData: monthKeys.map((key) => sport[key]),
        };
      }

      return buildChartData(sourceServices, services === undefined);
    },
    [monthKeys, sourceServices, services]
  );

  const chartColors = [theme.palette.primary.main, theme.palette.warning.main];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { width: [3, 3], curve: 'smooth' },
    xaxis: { categories },
    yaxis: {
      stepSize: 1,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => `${value} servizi`,
      },
    },
    markers: { size: 4 },
    grid: { padding: { left: 8, right: 8 } },
  });

  if (isLoading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader title="Servizi mensili" />
        <Box sx={{ p: 3 }}>
          <Skeleton variant="rounded" height={280} />
        </Box>
      </Card>
    );
  }

  const hasData = transportData.some((v) => v > 0) || sportData.some((v) => v > 0);

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Servizi mensili" />

      {!hasData ? (
        <Box sx={{ px: 3, pb: 4, pt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Nessun dato disponibile
          </Typography>
        </Box>
      ) : (
        <>
          <ChartLegends
            labels={['Trasporto', 'Sportivo']}
            colors={chartColors}
            sx={{ px: 3, pt: 2, pb: 1 }}
          />

          <Box sx={{ px: 1 }}>
            <Chart
              type="line"
              series={[
                { name: 'Trasporto', data: transportData },
                { name: 'Sportivo', data: sportData },
              ]}
              options={chartOptions}
              height={280}
            />
          </Box>
        </>
      )}
    </Card>
  );
}
