import type { Service } from 'src/types';

import it from 'date-fns/locale/it';
import { useRef, useState, useEffect } from 'react';
import { format, addDays, addWeeks, isSameDay, startOfWeek } from 'date-fns';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { serviceService } from 'src/services';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

function buildWeekDays(weekStart: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i += 1) {
    days.push(addDays(weekStart, i));
  }
  return days;
}

function getServiceDate(service: Service): string {
  if (service.type === 'secondary') return service.serviceDate ?? '';
  return service.eventDateSport ?? '';
}

function getServiceName(service: Service): string {
  if (service.type === 'secondary') return service.patientName ?? 'Paziente';
  return service.eventNameSport ?? 'Evento';
}

function getServiceTime(service: Service): string {
  if (service.type === 'secondary') return service.departureTime ?? service.arrivalTime ?? '';
  return service.departureTimeSport ?? service.startTimeSport ?? '';
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

export function WeeklyCalendar() {
  const theme = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [counts, setCounts] = useState<Record<string, { secondary: number; sport: number }>>({});
  const [allServices, setAllServices] = useState<Service[]>([]);
  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const [selectedDay, setSelectedDay] = useState<string | null>(todayKey);
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isWeekLoading, setIsWeekLoading] = useState(false);
  const hasLoadedOnceRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    if (hasLoadedOnceRef.current) {
      setIsWeekLoading(true);
    } else {
      setIsLoading(true);
    }

    // Build the week (Monday-Sunday)
    const days = buildWeekDays(weekStart);
    setWeekDays(days);
    setSelectedDay((prev) => {
      if (prev && days.some((day) => format(day, 'yyyy-MM-dd') === prev)) return prev;
      return days.some((day) => format(day, 'yyyy-MM-dd') === todayKey)
        ? todayKey
        : format(days[0], 'yyyy-MM-dd');
    });

    const dateFrom = format(days[0], 'yyyy-MM-dd');
    const dateTo = format(days[6], 'yyyy-MM-dd');

    async function load() {
      try {
        const res = await serviceService.getServices({
          dateFrom,
          dateTo,
          pageSize: '100',
          sortBy: 'service_date',
          sortOrder: 'asc',
        } as any);

        if (cancelled) return;

        const services = res.success ? (res.data?.items ?? []) : [];
        setAllServices(services);

        // Count per day
        const dayCounts: Record<string, { secondary: number; sport: number }> = {};
        days.forEach((d) => {
          dayCounts[format(d, 'yyyy-MM-dd')] = { secondary: 0, sport: 0 };
        });

        services.forEach((s: Service) => {
          const dateStr = getServiceDate(s);
          if (!dateStr) return;
          const key = dateStr.slice(0, 10);
          if (dayCounts[key]) {
            if (s.type === 'secondary') {
              dayCounts[key].secondary += 1;
            } else {
              dayCounts[key].sport += 1;
            }
          }
        });

        setCounts(dayCounts);
      } catch {
        // Non-critical widget
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsWeekLoading(false);
          hasLoadedOnceRef.current = true;
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [todayKey, weekStart]);

  const handleDayClick = (dayKey: string) => {
    setSelectedDay((prev) => (prev === dayKey ? null : dayKey));
  };

  const handleEditService = (service: Service) => {
    if (service.type === 'sport') {
      router.push(`/servizi/sportivi/modifica/${service.id}`);
    } else {
      router.push(`/servizi/secondari/modifica/${service.id}`);
    }
  };

  const handlePreviousWeek = () => {
    setWeekStart((prev) => addWeeks(prev, -1));
  };

  const handleNextWeek = () => {
    setWeekStart((prev) => addWeeks(prev, 1));
  };

  const handleTodayWeek = () => {
    setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const selectedServices = selectedDay
    ? allServices.filter((s) => getServiceDate(s).slice(0, 10) === selectedDay)
    : [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Questa settimana" />
        <Box sx={{ px: 3, pb: 3, display: 'flex', gap: 1.5 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" width="100%" height={90} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      </Card>
    );
  }

  const today = new Date();

  return (
    <Card>
      <CardHeader
        title="Questa settimana"
        subheader={
          weekDays.length === 7
            ? `${format(weekDays[0], 'd MMM', { locale: it })} - ${format(weekDays[6], 'd MMM yyyy', { locale: it })}`
            : undefined
        }
        action={
          <Stack direction="row" spacing={0.5}>
            <Button size="small" onClick={handleTodayWeek} disabled={isWeekLoading}>
              Torna a oggi
            </Button>
            <IconButton
              size="small"
              onClick={handlePreviousWeek}
              aria-label="Settimana precedente"
              disabled={isWeekLoading}
            >
              <Iconify icon="mdi:chevron-left" width={20} />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleNextWeek}
              aria-label="Settimana successiva"
              disabled={isWeekLoading}
            >
              <Iconify icon="mdi:chevron-right" width={20} />
            </IconButton>
          </Stack>
        }
      />

      <Box
        sx={{
          px: 3,
          pb: 1.5,
          pt: 1.5,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(7, 1fr)' },
          gap: { xs: 0.75, sm: 1.5 },
        }}
      >
        {weekDays.map((day, index) => {
          const key = format(day, 'yyyy-MM-dd');
          const dayCount = counts[key] || { secondary: 0, sport: 0 };
          const total = dayCount.secondary + dayCount.sport;
          const isDayToday = isSameDay(day, today);
          const isPast = day < today && !isDayToday;
          const isSelected = selectedDay === key;

          if (isWeekLoading) {
            return (
              <Box
                key={key}
                sx={{
                  textAlign: 'center',
                  py: { xs: 1.25, sm: 1.5 },
                  px: { xs: 0.5, sm: 1 },
                  borderRadius: 2,
                  bgcolor: 'background.neutral',
                  border: '2px solid transparent',
                }}
              >
                <Skeleton variant="text" width={26} sx={{ mx: 'auto', fontSize: { xs: '0.7rem', sm: '0.8rem' } }} />
                <Skeleton variant="text" width={20} sx={{ mx: 'auto', fontSize: { xs: '1.25rem', sm: '1.4rem' } }} />
                <Skeleton variant="circular" width={16} height={16} sx={{ mx: 'auto', mt: 0.5 }} />
              </Box>
            );
          }

          return (
            <Box
              key={key}
              onClick={() => handleDayClick(key)}
              sx={{
                textAlign: 'center',
                py: { xs: 1.25, sm: 1.5 },
                px: { xs: 0.5, sm: 1 },
                borderRadius: 2,
                position: 'relative',
                transition: 'all 0.2s',
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
                ...(isSelected && {
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  border: `2px solid ${theme.palette.primary.main}`,
                  boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.24)}`,
                }),
                ...(!isSelected && isDayToday && {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  border: `2px dotted ${alpha(theme.palette.primary.main, 0.4)}`,
                }),
                ...(!isSelected && !isDayToday && {
                  bgcolor: 'background.neutral',
                  border: '2px solid transparent',
                }),
                ...(isPast && !isSelected && { opacity: 0.5 }),
              }}
            >
              {/* Day label */}
              <Typography
                variant="caption"
                sx={{
                  fontWeight: isDayToday || isSelected ? 700 : 500,
                  color: isDayToday || isSelected ? 'primary.main' : 'text.secondary',
                  display: 'block',
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                }}
              >
                {DAY_LABELS[index]}
              </Typography>

              {/* Day number */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: isDayToday || isSelected ? 800 : 600,
                  color: isDayToday || isSelected ? 'primary.main' : 'text.primary',
                  my: 0.25,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                {format(day, 'd')}
              </Typography>

              {/* Service count dots */}
              {total > 0 ? (
                <Stack direction="row" justifyContent="center" spacing={0.25} sx={{ mt: 0.25 }}>
                  {dayCount.secondary > 0 && (
                    <Box
                      sx={{
                        width: { xs: 16, sm: 20 },
                        height: { xs: 16, sm: 20 },
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: { xs: '0.6rem', sm: '0.7rem' },
                        fontWeight: 700,
                      }}
                    >
                      {dayCount.secondary}
                    </Box>
                  )}
                  {dayCount.sport > 0 && (
                    <Box
                      sx={{
                        width: { xs: 16, sm: 20 },
                        height: { xs: 16, sm: 20 },
                        borderRadius: '50%',
                        bgcolor: 'warning.main',
                        color: 'warning.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: { xs: '0.6rem', sm: '0.7rem' },
                        fontWeight: 700,
                      }}
                    >
                      {dayCount.sport}
                    </Box>
                  )}
                </Stack>
              ) : (
                <Box sx={{ mt: 0.25, height: { xs: 16, sm: 20 } }}>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, color: 'text.disabled' }}
                  >
                    —
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Expandable service list for selected day */}
      <Collapse in={!!selectedDay} unmountOnExit>
        <Divider />
        <Box sx={{ px: 3, py: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
            {isWeekLoading ? (
              <>
                <Skeleton variant="text" width={140} sx={{ fontSize: '1rem' }} />
                <Skeleton variant="rounded" width={78} height={22} />
              </>
            ) : (
              <>
                <Typography variant="subtitle2">
                  {selectedDay
                    ? format(new Date(selectedDay), "EEEE d MMMM", { locale: it })
                    : ''}
                </Typography>
                <Chip
                  label={`${selectedServices.length} servizi`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700, textTransform: 'capitalize' }}
                />
              </>
            )}
          </Stack>

          {isWeekLoading ? (
            <Stack spacing={1}>
              {Array.from({ length: 1 }).map((_, index) => (
                <Stack key={index} direction="row" alignItems="center" spacing={1.25} sx={{ py: 0.75 }}>
                  <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: 1.5 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="45%" sx={{ fontSize: '0.9rem' }} />
                    <Skeleton variant="text" width="30%" sx={{ fontSize: '0.75rem' }} />
                  </Box>
                  <Skeleton variant="rounded" width={64} height={20} />
                </Stack>
              ))}
            </Stack>
          ) : selectedServices.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Nessun servizio per questo giorno
              </Typography>
            </Box>
          ) : (
            <Stack spacing={0}>
              {selectedServices.map((service, index) => {
                const name = getServiceName(service);
                const time = getServiceTime(service);
                const isSport = service.type === 'sport';

                return (
                  <Box
                    key={service.id}
                    onClick={() => handleEditService(service)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      py: 1.25,
                      cursor: 'pointer',
                      borderRadius: 1,
                      transition: 'background-color 0.15s',
                      '&:hover': { bgcolor: 'action.hover' },
                      ...(index < selectedServices.length - 1 && {
                        borderBottom: '1px dashed',
                        borderColor: 'divider',
                      }),
                    }}
                  >
                    {/* Type icon */}
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
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
                        width={20}
                      />
                    </Box>

                    {/* Name + time */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" noWrap sx={{ fontSize: '0.85rem' }}>
                        {name}
                      </Typography>
                      {time && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Iconify icon="mdi:clock-outline" width={13} sx={{ color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            {time}
                          </Typography>
                        </Stack>
                      )}
                    </Box>

                    {/* Status */}
                    <Label color={getStatusColor(service.status)} sx={{ fontSize: '0.7rem' }}>
                      {getStatusLabel(service.status)}
                    </Label>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Box>
      </Collapse>

      {/* Legend */}
      <Divider sx={{ mx: 3 }} />
      <Stack direction="row" spacing={2} sx={{ px: 3, py: 1.5 }} justifyContent="center">
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main' }} />
          <Typography variant="caption" color="text.secondary">Secondario</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'warning.main' }} />
          <Typography variant="caption" color="text.secondary">Sportivo</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
