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

export function MonthlyServicesChart() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [transportData, setTransportData] = useState<number[]>([]);
  const [sportData, setSportData] = useState<number[]>([]);

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

        const transport: Record<string, number> = {};
        const sport: Record<string, number> = {};
        months.forEach((m) => { transport[m.key] = 0; sport[m.key] = 0; });

        services.forEach((s: Service) => {
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

        setCategories(months.map((m) => m.label));
        setTransportData(months.map((m) => transport[m.key]));
        setSportData(months.map((m) => sport[m.key]));
      } catch {
        // Non-critical widget
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const chartColors = [theme.palette.primary.main, theme.palette.warning.main];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { width: 0 },
    xaxis: { categories },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} servizi`,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '36%',
        borderRadius: 6,
      },
    },
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
              type="bar"
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
