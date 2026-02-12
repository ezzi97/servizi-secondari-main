import { useEffect } from 'react';

import { 
  Grid,
  Typography,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { useServices } from 'src/contexts/service-context';

import { useAuth } from 'src/contexts/auth-context';

import { UpcomingServices } from '../upcoming-services';
import { MonthlyServicesChart } from '../monthly-services-chart';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { stats, fetchStats } = useServices();
  const { user } = useAuth();

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Personalized greeting
  const firstName = user?.name?.split(' ')[0] || '';
  const greeting = firstName ? `Ciao, ${firstName}!` : 'Ciao!';

  return (
    <DashboardContent maxWidth="xl" sx={{ pb: 15 }}>
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        {greeting}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={6} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Servizi completati"
            total={stats?.completed ?? 0}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            sx={{ height: '100%' }}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Km percorsi"
            total={stats?.totalKilometers ?? 0}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            sx={{ height: '100%' }}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Servizi in attesa"
            total={stats?.pending ?? 0}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            sx={{ height: '100%' }}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Totale servizi"
            total={stats?.total ?? 0}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            sx={{ height: '100%' }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <UpcomingServices />
        </Grid>
        <Grid item xs={12} md={6}>
          <MonthlyServicesChart />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
