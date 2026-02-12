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

function getKilometers(service: Service): number {
  if (service.type === 'secondary') return service.kilometers ?? 0;
  return service.kilometersSport ?? 0;
}

function getPrice(service: Service): number {
  if (service.type === 'secondary') return service.price ?? 0;
  return service.priceSport ?? 0;
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

  const km: Record<string, number> = {};
  const revenue: Record<string, number> = {};
  monthKeys.forEach((key) => {
    km[key] = 0;
    revenue[key] = 0;
  });

  sourceServices.forEach((s: Service) => {
    const dateStr = getServiceDate(s);
    if (!dateStr) return;
    const d = new Date(dateStr);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (km[key] !== undefined) {
      km[key] += getKilometers(s);
      revenue[key] += getPrice(s);
    }
  });

  return {
    categories: monthKeys.map((key) => getMonthLabel(key)),
    kmData: monthKeys.map((key) => Math.round(km[key] * 10) / 10),
    revenueData: monthKeys.map((key) => Math.round(revenue[key] * 100) / 100),
  };
}

type KmRevenueChartProps = {
  services?: Service[];
  loading?: boolean;
  monthKeys?: string[];
};

export function KmRevenueChart({ services, loading = false, monthKeys }: KmRevenueChartProps) {
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
  const { categories, kmData, revenueData } = useMemo(
    () => {
      if (monthKeys && monthKeys.length > 0) {
        const km: Record<string, number> = {};
        const revenue: Record<string, number> = {};
        monthKeys.forEach((key) => {
          km[key] = 0;
          revenue[key] = 0;
        });

        sourceServices.forEach((s: Service) => {
          const dateStr = getServiceDate(s);
          if (!dateStr) return;
          const d = new Date(dateStr);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          if (km[key] !== undefined) {
            km[key] += getKilometers(s);
            revenue[key] += getPrice(s);
          }
        });

        return {
          categories: monthKeys.map((key) => getMonthLabel(key)),
          kmData: monthKeys.map((key) => Math.round(km[key] * 10) / 10),
          revenueData: monthKeys.map((key) => Math.round(revenue[key] * 100) / 100),
        };
      }

      return buildChartData(sourceServices, services === undefined);
    },
    [monthKeys, sourceServices, services]
  );

  const chartColors = [theme.palette.info.main, theme.palette.success.main];

  const chartOptions = useChart({
    colors: chartColors,
    xaxis: { categories },
    stroke: { width: [3, 3], curve: 'smooth' },
    yaxis: [
      {
        title: { text: 'KM' },
        labels: {
          formatter: (value: number) => `${Math.round(value)}`,
        },
      },
      {
        opposite: true,
        title: { text: 'Ricavi (€)' },
        labels: {
          formatter: (value: number) => `${Math.round(value)} €`,
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number, { seriesIndex }: { seriesIndex: number }) =>
          seriesIndex === 0 ? `${value} km` : `${value.toFixed(2)} €`,
      },
    },
    markers: { size: 4 },
    grid: { padding: { left: 8, right: 8 } },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Andamento KM e Ricavi" />
        <Box sx={{ p: 3 }}>
          <Skeleton variant="rounded" height={280} />
        </Box>
      </Card>
    );
  }

  const hasData = kmData.some((v) => v > 0) || revenueData.some((v) => v > 0);

  return (
    <Card>
      <CardHeader title="Andamento KM e Ricavi" />

      {!hasData ? (
        <Box sx={{ px: 3, pb: 4, pt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Nessun dato disponibile
          </Typography>
        </Box>
      ) : (
        <>
          <ChartLegends
            labels={['Chilometri', 'Ricavi (€)']}
            colors={chartColors}
            sx={{ px: 3, pt: 2, pb: 1 }}
          />

          <Box sx={{ px: 1 }}>
            <Chart
              type="line"
              series={[
                { name: 'Chilometri', data: kmData },
                { name: 'Ricavi (€)', data: revenueData },
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
