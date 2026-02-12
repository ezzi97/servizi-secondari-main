import type { Service } from 'src/types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

function getKilometers(service: Service): number {
  if (service.type === 'secondary') return service.kilometers ?? 0;
  return service.kilometersSport ?? 0;
}

function getRevenue(service: Service): number {
  if (service.type === 'secondary') return service.price ?? 0;
  return service.priceSport ?? 0;
}

type ScatterPoint = {
  x: number;
  y: number;
};

type Props = {
  services: Service[];
  loading?: boolean;
};

export function KmRevenueScatterChart({ services, loading = false }: Props) {
  const theme = useTheme();

  const secondaryPoints: ScatterPoint[] = [];
  const sportPoints: ScatterPoint[] = [];

  services.forEach((service) => {
    const kilometers = getKilometers(service);
    const revenue = getRevenue(service);
    if (kilometers <= 0 && revenue <= 0) return;

    const point = { x: kilometers, y: revenue };
    if (service.type === 'secondary') {
      secondaryPoints.push(point);
    } else {
      sportPoints.push(point);
    }
  });

  const chartColors = [theme.palette.primary.main, theme.palette.warning.main];

  const chartOptions = useChart({
    colors: chartColors,
    xaxis: {
      title: { text: 'Chilometri' },
      labels: {
        formatter: (value: string) => `${Math.round(Number(value) || 0)}`,
      },
    },
    yaxis: {
      title: { text: 'Ricavi (EUR)' },
      labels: {
        formatter: (value: number) => `${Math.round(value)} €`,
      },
    },
    tooltip: {
      shared: false,
      intersect: true,
      y: {
        formatter: (value: number) => `${value.toFixed(2)} €`,
      },
      x: {
        formatter: (value: number) => `${Math.round(value)} km`,
      },
    },
    markers: {
      size: 5,
      strokeWidth: 0,
      hover: { sizeOffset: 2 },
    },
  });

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader title="KM vs Ricavi (dispersione)" />
        <Box sx={{ p: 3 }}>
          <Skeleton variant="rounded" height={320} />
        </Box>
      </Card>
    );
  }

  const hasData = secondaryPoints.length > 0 || sportPoints.length > 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="KM vs Ricavi (dispersione)" subheader="Individua anomalie di pricing" />

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
              type="scatter"
              series={[
                { name: 'Secondario', data: secondaryPoints },
                { name: 'Sportivo', data: sportPoints },
              ]}
              options={chartOptions}
              height={320}
            />
          </Box>
        </>
      )}
    </Card>
  );
}
