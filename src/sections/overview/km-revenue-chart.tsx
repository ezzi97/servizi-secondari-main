import { useState, useEffect } from 'react';

import type { Service } from 'src/types';

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

export function KmRevenueChart() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [kmData, setKmData] = useState<number[]>([]);
  const [revenueData, setRevenueData] = useState<number[]>([]);

  useEffect(() => {
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

        const services = res.success ? (res.data?.items ?? []) : [];

        // Build 6-month buckets
        const now = new Date();
        const months: { key: string; label: string }[] = [];
        for (let i = 5; i >= 0; i -= 1) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          months.push({ key, label: MONTH_LABELS_IT[d.getMonth()] });
        }

        const km: Record<string, number> = {};
        const revenue: Record<string, number> = {};
        months.forEach((m) => { km[m.key] = 0; revenue[m.key] = 0; });

        services.forEach((s: Service) => {
          const dateStr = getServiceDate(s);
          if (!dateStr) return;
          const d = new Date(dateStr);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          if (km[key] !== undefined) {
            km[key] += getKilometers(s);
            revenue[key] += getPrice(s);
          }
        });

        setCategories(months.map((m) => m.label));
        setKmData(months.map((m) => Math.round(km[m.key] * 10) / 10));
        setRevenueData(months.map((m) => Math.round(revenue[m.key] * 100) / 100));
      } catch {
        // Non-critical widget
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

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
      <CardHeader title="Andamento KM e Ricavi" subheader="Ultimi 6 mesi" />

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
