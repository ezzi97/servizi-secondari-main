import { useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import dayjs, { Dayjs } from 'dayjs';

import { DashboardContent } from 'src/layouts/dashboard';

import { UserView } from '../../user/view';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const [filterDate, setFilterDate] = useState<Dayjs | null>(dayjs());

  // Example function to calculate stats based on date
  const getStats = (date: Dayjs | null) => {
    if (!date) {
      return {
        servicesCompleted: 100,
        kmTraveled: 135,
        lateServices: 3,
        totalServices: 150,
      };
    }
    if (date.isSame(dayjs(), 'day')) {
      return {
        servicesCompleted: 200,
        kmTraveled: 135,
        lateServices: 3,
      };
    }
    return {
      servicesCompleted: 250,
      kmTraveled: 135,
      lateServices: 3,
    };
  };

  const stats = getStats(filterDate);

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography variant="h4">
          Ciao, benvenuto! 👋
        </Typography>
        
        <DatePicker 
          label="Data"
          value={filterDate}
          onChange={(newValue) => setFilterDate(newValue)}
          slotProps={{
            textField: { size: 'small' }
          }}
        />
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Servizi effettuati"
            percent={2.6}
            total={stats.servicesCompleted}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Km percorsi"
            percent={-0.1}
            total={stats.kmTraveled}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Servizi in ritardo"
            percent={-0.1}
            total={stats.lateServices}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Servizi conclusi"
            percent={-0.1}
            total={stats.totalServices ?? 0}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
          />
        </Grid>
      </Grid>

      <UserView />
    </DashboardContent>
  );
}

