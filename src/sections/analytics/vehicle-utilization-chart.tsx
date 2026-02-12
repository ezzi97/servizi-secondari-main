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
  if (service.type === 'secondary') return service.vehicle ?? '';
  return service.vehicleSport ?? '';
}

type Props = {
  services: Service[];
  loading?: boolean;
};

export function VehicleUtilizationChart({ services, loading = false }: Props) {
  const theme = useTheme();

  const vehicleCounts: Record<string, number> = {};
  services.forEach((service) => {
    const vehicle = getVehicle(service).trim();
    if (!vehicle) return;
    vehicleCounts[vehicle] = (vehicleCounts[vehicle] || 0) + 1;
  });

  const topVehicles = Object.entries(vehicleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const categories = topVehicles.map(([vehicle]) => vehicle);
  const seriesData = topVehicles.map(([, count]) => count);

  const chartOptions = useChart({
    xaxis: { categories },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} servizi`,
      },
    },
    colors: [theme.palette.info.main],
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
        <CardHeader title="Utilizzo mezzi" />
        <Box sx={{ p: 3 }}>
          <Skeleton variant="rounded" height={280} />
        </Box>
      </Card>
    );
  }

  const hasData = seriesData.length > 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Utilizzo mezzi" subheader="Servizi per mezzo (top 8)" />

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
            series={[
              { name: 'Servizi', data: seriesData },
            ]}
            options={chartOptions}
            height={280}
          />
        </Box>
      )}
    </Card>
  );
}
