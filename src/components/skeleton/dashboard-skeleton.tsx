import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

export function DashboardSkeleton() {
  return (
    <Stack spacing={3}>
      {/* Header skeleton */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rounded" width={150} height={40} />
      </Stack>

      {/* Summary cards skeleton */}
      <Grid container spacing={3}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Skeleton variant="circular" width={48} height={48} />
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" height={20} />
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Chart skeleton */}
      <Card sx={{ p: 3 }}>
        <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" width="100%" height={300} />
      </Card>

      {/* Table skeleton */}
      <Card sx={{ p: 3 }}>
        <Skeleton variant="text" width="25%" height={32} sx={{ mb: 2 }} />
        <Stack spacing={2}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" width="100%" height={48} />
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}

