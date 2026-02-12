import type { Service } from 'src/types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

const MONTH_LABELS_IT = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

function getServiceDate(service: Service): string {
  if (service.type === 'secondary') return service.serviceDate ?? '';
  return service.eventDateSport ?? '';
}

function getRevenue(service: Service): number {
  if (service.type === 'secondary') return service.price ?? 0;
  return service.priceSport ?? 0;
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

type Props = {
  services: Service[];
  loading?: boolean;
  monthKeys?: string[];
};

export function MonthlyRevenueChart({ services, loading = false, monthKeys }: Props) {
  const theme = useTheme();

  const monthBuckets = monthKeys && monthKeys.length > 0
    ? monthKeys
    : Array.from(
      new Set(
        services
          .map((s) => getServiceDate(s))
          .filter(Boolean)
          .map((dateStr) => {
            const d = new Date(dateStr);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          })
      )
    ).sort();

  const secondaryRevenue: Record<string, number> = {};
  const sportRevenue: Record<string, number> = {};
  monthBuckets.forEach((key) => {
    secondaryRevenue[key] = 0;
    sportRevenue[key] = 0;
  });

  services.forEach((service) => {
    const dateStr = getServiceDate(service);
    if (!dateStr) return;
    const d = new Date(dateStr);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (secondaryRevenue[monthKey] === undefined) return;

    if (service.type === 'secondary') {
      secondaryRevenue[monthKey] += getRevenue(service);
    } else {
      sportRevenue[monthKey] += getRevenue(service);
    }
  });

  const categories = monthBuckets.map((key) => getMonthLabel(key));
  const secondaryData = monthBuckets.map((key) => Math.round(secondaryRevenue[key] * 100) / 100);
  const sportData = monthBuckets.map((key) => Math.round(sportRevenue[key] * 100) / 100);

  const chartColors = [theme.palette.primary.main, theme.palette.warning.main];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { width: [3, 3], curve: 'smooth' },
    xaxis: { categories },
    yaxis: {
      labels: {
        formatter: (value: number) => `${Math.round(value)} €`,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => `${value.toFixed(2)} €`,
      },
    },
    markers: { size: 4 },
    grid: { padding: { left: 8, right: 8 } },
  });

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader title="Ricavi mensili per tipo" />
        <Box sx={{ p: 3 }}>
          <Skeleton variant="rounded" height={280} />
        </Box>
      </Card>
    );
  }

  const hasData = secondaryData.some((v) => v > 0) || sportData.some((v) => v > 0);

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Ricavi mensili per tipo" />

      {!hasData ? (
        <Box sx={{ px: 3, pb: 4, pt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Nessun dato disponibile
          </Typography>
        </Box>
      ) : (
        <>
          <ChartLegends
            labels={['Secondario', 'Sportivo']}
            colors={chartColors}
            sx={{ px: 3, pt: 2, pb: 1 }}
          />

          <Box sx={{ px: 1 }}>
            <Chart
              type="line"
              series={[
                { name: 'Secondario', data: secondaryData },
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
