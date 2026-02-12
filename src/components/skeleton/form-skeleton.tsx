import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

interface FormSkeletonProps {
  rows?: number;
}

export function FormSkeleton({ rows = 4 }: FormSkeletonProps) {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Header skeleton */}
        <Skeleton variant="text" width="40%" height={40} />
        
        {/* Form fields skeleton */}
        {Array.from({ length: rows }).map((_, index) => (
          <Box key={index}>
            <Skeleton variant="text" width="20%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" width="100%" height={56} />
          </Box>
        ))}
        
        {/* Button skeleton */}
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Skeleton variant="rounded" width={100} height={40} />
          <Skeleton variant="rounded" width={120} height={40} />
        </Stack>
      </Stack>
    </Card>
  );
}

