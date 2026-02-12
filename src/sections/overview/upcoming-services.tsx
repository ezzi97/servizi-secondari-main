import type { Service } from 'src/types';

import { format, isSameDay } from 'date-fns';
import it from 'date-fns/locale/it';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { serviceService } from 'src/services';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

function getServiceDate(service: Service): string {
  if (service.type === 'secondary') return service.serviceDate ?? '';
  return service.eventDateSport ?? '';
}

function getServiceName(service: Service): string {
  if (service.type === 'secondary') return service.patientName ?? 'Paziente';
  return service.eventNameSport ?? 'Evento';
}

function getServiceLabel(service: Service): string {
  if (service.type === 'secondary') return 'Trasporto';
  return 'Sportivo';
}

function getStatusColor(status: string): 'warning' | 'info' | 'success' | 'error' | 'default' {
  switch (status) {
    case 'pending': return 'warning';
    case 'confirmed': return 'info';
    case 'completed': return 'success';
    case 'cancelled': return 'error';
    default: return 'default';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'pending': return 'In attesa';
    case 'confirmed': return 'Confermato';
    case 'draft': return 'Bozza';
    case 'completed': return 'Completato';
    case 'cancelled': return 'Cancellato';
    default: return status;
  }
}

export function UpcomingServices() {
  const theme = useTheme();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await serviceService.getServices({
          dateFrom: todayStr,
          sortBy: 'service_date',
          sortOrder: 'asc',
          pageSize: '10',
        } as any);

        if (cancelled) return;

        setServices(res.success ? (res.data?.items ?? []) : []);
      } catch {
        // Non-critical widget — silently fail
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewAll = () => {
    router.push('/tutti-servizi');
  };

  const handleEdit = (service: Service) => {
    if (service.type === 'sport') {
      router.push(`/servizi/sportivi/modifica/${service.id}`);
    } else {
      router.push(`/servizi/secondari/modifica/${service.id}`);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy', { locale: it });
    } catch {
      return dateStr;
    }
  };

  const isToday = (dateStr: string): boolean => {
    try {
      return isSameDay(new Date(dateStr), today);
    } catch {
      return false;
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Prossimi servizi" />
        <Stack spacing={0} sx={{ px: 3, pb: 3 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
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
    );
  }

  return (
    <Card>
      <CardHeader
        title="Prossimi servizi"
        action={
          <Button
            size="small"
            color="inherit"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} />}
            onClick={handleViewAll}
          >
            Vedi tutti
          </Button>
        }
      />

      {services.length === 0 ? (
        <Box sx={{ px: 3, pb: 4, pt: 2, textAlign: 'center' }}>
          <Iconify
            icon="solar:calendar-minimalistic-bold-duotone"
            width={48}
            sx={{ color: 'text.disabled', mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            Nessun servizio in programma
          </Typography>
        </Box>
      ) : (
        <Stack spacing={0} sx={{ px: 3, pb: 2 }}>
          {services.map((service, index) => {
            const dateStr = getServiceDate(service);
            const name = getServiceName(service);
            const typeLabel = getServiceLabel(service);
            const isSport = service.type === 'sport';
            const isTodayService = dateStr ? isToday(dateStr) : false;

            return (
              <Box
                key={service.id}
                onClick={() => handleEdit(service)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  py: 1.5,
                  cursor: 'pointer',
                  borderRadius: 1,
                  transition: 'background-color 0.15s',
                  '&:hover': { bgcolor: 'action.hover' },
                  ...(index < services.length - 1 && {
                    borderBottom: '1px dashed',
                    borderColor: 'divider',
                  }),
                }}
              >
                {/* Type icon */}
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette[isSport ? 'info' : 'warning'].main, 0.12),
                    color: isSport ? 'info.main' : 'warning.main',
                    flexShrink: 0,
                  }}
                >
                  <Iconify
                    icon={isSport ? 'solar:flag-bold-duotone' : 'mdi:ambulance'}
                    width={22}
                  />
                </Box>

                {/* Name + date */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" noWrap>
                    {name}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Typography variant="caption" color="text.secondary">
                      {typeLabel} &middot; {dateStr ? formatDate(dateStr) : '—'}
                    </Typography>
                    {isTodayService && (
                      <Chip
                        label="Oggi"
                        size="small"
                        color="primary"
                        sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }}
                      />
                    )}
                  </Stack>
                </Box>

                {/* Status */}
                <Label color={getStatusColor(service.status)}>
                  {getStatusLabel(service.status)}
                </Label>
              </Box>
            );
          })}
        </Stack>
      )}
    </Card>
  );
}
