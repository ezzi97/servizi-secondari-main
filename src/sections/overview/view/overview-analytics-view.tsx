import { useEffect } from 'react';

import { 
  Grid,
  Typography,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { useAuth } from 'src/contexts/auth-context';
import { useServices } from 'src/contexts/service-context';
import { Iconify } from 'src/components/iconify';

import { WeeklyCalendar } from '../weekly-calendar';
import { UpcomingServices } from '../upcoming-services';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { stats, statsLoading, fetchStats } = useServices();
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

      {/* Row 1: Stat cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Servizi completati"
            total={stats?.completed ?? 0}
            loading={statsLoading}
            icon={<Iconify icon="mdi:check-decagram" width={40} />}
            sx={{ height: '100%' }}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Km percorsi"
            total={stats?.totalKilometers ?? 0}
            loading={statsLoading}
            color="secondary"
            icon={<Iconify icon="mdi:road-variant" width={40} />}
            sx={{ height: '100%' }}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Servizi in attesa"
            total={stats?.pending ?? 0}
            loading={statsLoading}
            color="info"
            icon={<Iconify icon="mdi:clock-alert-outline" width={40} />}
            sx={{ height: '100%' }}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Totale servizi"
            total={stats?.total ?? 0}
            loading={statsLoading}
            color="warning"
            icon={<Iconify icon="solar:clipboard-list-bold" width={40} />}
            sx={{ height: '100%' }}
          />
        </Grid>
      </Grid>

      {/* Row 2: Weekly Calendar */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <WeeklyCalendar />
        </Grid>
      </Grid>

      {/* Row 3: Upcoming Services (with today highlighted) */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <UpcomingServices />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
