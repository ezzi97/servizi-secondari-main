import type { Service } from 'src/types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

function getVehicle(service: Service): string {
  if (service.type === 'secondary') return (service.vehicle ?? '').trim().toLowerCase();
  return (service.vehicleSport ?? '').trim().toLowerCase();
}

function getKilometers(service: Service): number {
  if (service.type === 'secondary') return service.kilometers ?? 0;
  return service.kilometersSport ?? 0;
}

const TOP_N = 8;

type Props = {
  services: Service[];
  loading?: boolean;
};

export function TopVehiclesByKmChart({ services, loading = false }: Props) {
  const theme = useTheme();

  const vehicleKm: Record<string, number> = {};
  services.forEach((service) => {
    const vehicle = getVehicle(service);
    if (!vehicle) return;
    vehicleKm[vehicle] = (vehicleKm[vehicle] || 0) + getKilometers(service);
  });

  const topVehicles = Object.entries(vehicleKm)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_N);

  const categories = topVehicles.map(([vehicle]) => vehicle);
  const seriesData = topVehicles.map(([, km]) => Math.round(km * 100) / 100);

  const chartOptions = useChart({
    xaxis: { categories },
    tooltip: {
      y: {
        formatter: (value: number) => `${value.toLocaleString('it-IT')} km`,
      },
    },
    colors: [theme.palette.secondary.main],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '52%',
        borderRadius: 4,
      },
    },
  });

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader title="Top mezzi per km" />
        <Box sx={{ p: 3 }}>
          <Skeleton variant="rounded" height={280} />
        </Box>
      </Card>
    );
  }

  const hasData = seriesData.length > 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Top mezzi per km"
        subheader={`Km percorsi per mezzo (top ${TOP_N})`}
      />

      {!hasData ? (
        <Box sx={{ px: 3, pb: 4, pt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Nessun dato disponibile
          </Typography>
        </Box>
      ) : (
        <Box sx={{ px: 1 }}>
          <Chart
            type="bar"
            series={[{ name: 'Km', data: seriesData }]}
            options={chartOptions}
            height={280}
          />
        </Box>
      )}
    </Card>
  );
}
