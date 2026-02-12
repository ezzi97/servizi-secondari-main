import { useEffect } from 'react';

import {
  Grid,
  Typography,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { useServices } from 'src/contexts/service-context';

import { KmRevenueChart } from 'src/sections/overview/km-revenue-chart';
import { MonthlyServicesChart } from 'src/sections/overview/monthly-services-chart';
import { AnalyticsWidgetSummary } from 'src/sections/overview/analytics-widget-summary';

// ----------------------------------------------------------------------

export function AnalyticsView() {
  const { stats, statsLoading, fetchStats } = useServices();

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatCurrency = (v: number) =>
    `${v.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

  return (
    <DashboardContent maxWidth="xl" sx={{ pb: 15 }}>
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Analisi
      </Typography>

      {/* Row 1: Revenue + key stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Ricavi totali"
            total={stats?.totalRevenue ?? 0}
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
            total={stats?.averagePrice ?? 0}
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
            total={stats?.cancelled ?? 0}
            loading={statsLoading}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            sx={{ height: '100%' }}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Totale servizi"
            total={stats?.total ?? 0}
            loading={statsLoading}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            sx={{ height: '100%' }}
          />
        </Grid>
      </Grid>

      {/* Row 2: Charts side-by-side */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MonthlyServicesChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <KmRevenueChart />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
