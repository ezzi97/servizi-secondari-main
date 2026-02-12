import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

export function DashboardSkeleton() {
  return (
    <Stack spacing={3}>
      {/* Header */}
      <Skeleton variant="text" width={200} height={40} />

      {/* Row 1: 4 stat cards */}
      <Grid container spacing={3}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Skeleton variant="circular" width={48} height={48} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={32} />
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Row 2: Weekly Calendar */}
      <Card sx={{ p: 3 }}>
        <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" width="100%" height={90} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      </Card>

      {/* Row 3: Upcoming Services */}
      <Card sx={{ p: 3 }}>
        <Skeleton variant="text" width="40%" height={28} sx={{ mb: 2 }} />
        <Stack spacing={1}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="60%" height={20} />
                <Skeleton width="40%" height={16} />
              </Box>
              <Skeleton variant="rounded" width={70} height={24} />
            </Box>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
