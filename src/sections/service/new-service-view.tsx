import { Box, Card, Stack, alpha, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

const SERVICE_CATEGORIES = [
  { 
    value: 'secondary', 
    label: 'Servizi Secondari',
    icon: 'lineicons:ambulance',
    description: 'Servizi di trasporto sanitario secondario',
    color: '#2196F3', // blue
    path: '/servizi/secondari/nuovo'
  },
  { 
    value: 'sport', 
    label: 'Servizi Sportivi',
    icon: 'solar:basketball-bold',
    description: 'Servizi per eventi sportivi',
    color: '#4CAF50', // green
    path: '/servizi/sportivi/nuovo'
  },
] as const;

export default function NewServiceView() {
  const router = useRouter();

  return (
    <Card sx={{ p: { xs: 2, sm: 4 } }}>
      <Stack spacing={3}>
        <Typography variant="h4" sx={{ textAlign: 'center' }}>
          Seleziona il tipo di servizio
        </Typography>
        
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Scegli il tipo di servizio che desideri creare
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            },
          }}
        >
          {SERVICE_CATEGORIES.map((category) => (
            <Card
              key={category.value}
              sx={{
                p: 3,
                cursor: 'pointer',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                bgcolor: 'background.paper',
                border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: (theme) => `0 8px 16px 0 ${alpha(category.color, 0.16)}`,
                  borderColor: category.color,
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
              }}
              onClick={() => router.push(category.path)}
            >
              <Stack
                spacing={2.5}
                alignItems="center"
                sx={{
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: '50%',
                    bgcolor: (theme) => alpha(category.color, 0.08),
                  }}
                >
                  <Iconify
                    icon={category.icon}
                    width={32}
                    sx={{ color: category.color }}
                  />
                </Box>

                <Stack spacing={0.5}>
                  <Typography variant="h6">{category.label}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {category.description}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Box>
      </Stack>
    </Card>
  );
} 