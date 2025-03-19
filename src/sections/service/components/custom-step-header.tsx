import { Box, Stack, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface CustomStepHeaderProps {
  title: string;
  icon: string;
  description?: string;
}

export function CustomStepHeader({ title, icon, description }: CustomStepHeaderProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ p: 1.5, borderRadius: 1 }}>
        <Iconify icon={icon} width={24} />
      </Box>
      <Box>
        <Typography variant="h6">{title}</Typography>
        {description && (
          <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
            {description}
          </Typography>
        )}
      </Box>
    </Stack>
  );
} 