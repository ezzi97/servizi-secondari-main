import type { Service } from 'src/types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

function getRevenue(service: Service): number {
  if (service.type === 'secondary') return service.price ?? 0;
  return service.priceSport ?? 0;
}

type Props = {
  services: Service[];
  loading?: boolean;
};

export function RevenueByTypeChart({ services, loading = false }: Props) {
  const theme = useTheme();

  const completed = services.filter((s) => s.status === 'completed');
  const secondaryCompleted = completed.filter((s) => s.type === 'secondary');
  const sportCompleted = completed.filter((s) => s.type === 'sport');
  const secondaryRevenue = secondaryCompleted.reduce((sum, s) => sum + getRevenue(s), 0);
  const sportRevenue = sportCompleted.reduce((sum, s) => sum + getRevenue(s), 0);
  const secondaryCount = secondaryCompleted.length;
  const sportCount = sportCompleted.length;

  const categories = ['Secondario', 'Sportivo'];
  const revenueData = [
    Math.round(secondaryRevenue * 100) / 100,
    Math.round(sportRevenue * 100) / 100,
  ];
  const countData = [secondaryCount, sportCount];

  const chartColors = [theme.palette.primary.main, theme.palette.secondary.main];

  const chartOptions = useChart({
    colors: chartColors,
    xaxis: { categories },
    yaxis: [
      {
        seriesName: 'Ricavi',
        title: { text: 'Ricavi (€)' },
        labels: {
          formatter: (value: number) => `${Math.round(value)} €`,
        },
      },
      {
        seriesName: 'Servizi',
        opposite: true,
        title: { text: 'N. servizi' },
        labels: {
          formatter: (value: number) => String(Math.round(value)),
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        {
          formatter: (value: number) =>
            `${Number(value).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`,
        },
        {
          formatter: (value: number) => `${value} servizi`,
        },
      ],
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 4,
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: {
      enabled: false,
    },
  });

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader title="Ricavi per tipo" />
        <Box sx={{ p: 3 }}>
          <Skeleton variant="rounded" height={280} />
        </Box>
      </Card>
    );
  }

  const hasData = revenueData.some((v) => v > 0) || countData.some((v) => v > 0);

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Ricavi per tipo"
        subheader="Ricavi e numero servizi completati nel periodo"
      />

      {!hasData ? (
        <Box sx={{ px: 3, pb: 4, pt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Nessun dato disponibile
          </Typography>
        </Box>
      ) : (
        <>
          <ChartLegends
            labels={['Ricavi', 'Servizi']}
            colors={chartColors}
            sx={{ px: 3, pt: 2, pb: 1 }}
          />
          <Box sx={{ px: 1 }}>
            <Chart
              type="bar"
              series={[
                { name: 'Ricavi', data: revenueData },
                { name: 'Servizi', data: countData },
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
