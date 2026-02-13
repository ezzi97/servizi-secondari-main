import { format } from 'date-fns';
import it from 'date-fns/locale/it';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useServices } from 'src/contexts/service-context';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { UserTableToolbar } from '../user-table-toolbar';
import { applyFilter, getComparator } from '../utils';

import type { UserProps } from '../models';

// ----------------------------------------------------------------------

/** Map status codes to Italian display labels */
function mapStatus(status: string): string {
  const statusMap: Record<string, string> = {
    draft: 'bozza',
    pending: 'in attesa',
    confirmed: 'confermato',
    completed: 'effettuato',
    cancelled: 'cancellato',
  };
  return statusMap[status] || status;
}

/** Map Italian filter labels to API values */
const STATUS_TO_API: Record<string, string> = {
  Bozza: 'draft',
  'In attesa': 'pending',
  Confermato: 'confirmed',
  Effettuato: 'completed',
  Cancellato: 'cancelled',
};
const VISIT_TO_API: Record<string, 'sport' | 'secondary'> = {
  Sportivo: 'sport',
  Secondario: 'secondary',
};
const ORDERBY_TO_SORT: Record<string, string> = {
  date: 'service_date',
  timestamp: 'service_date',
  visit: 'type',
  status: 'status',
  name: 'service_date',
};

/** Map a Service from the API to UserProps for the table */
function serviceToRow(service: any): UserProps {
  const isSport = service.type === 'sport';

  const name = isSport
    ? (service.eventNameSport || service.organizerNameSport || '-')
    : (service.patientName || '-');

  const visit = isSport ? 'Sportivo' : 'Secondario';

  const rawDate = isSport ? service.eventDateSport : service.serviceDate;
  const dateObj = rawDate ? new Date(rawDate) : null;
  const timestamp = dateObj
    ? dateObj.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-';
  const dateISO = dateObj ? dateObj.toISOString() : '';

  // Secondary-specific fields
  const secondaryFields = !isSport ? {
    serviceType: service.serviceType || '',
    time: service.arrivalTime || service.departureTime || '',
    arrivalTime: service.arrivalTime || '',
    departureTime: service.departureTime || '',
    pickupLocation: service.pickupAddress || '',
    pickupTime: service.pickupTime || '',
    destinationType: service.dropoffAddress || service.dropoffType || '',
    position: service.position || '',
    notes: service.additional_notes || '',
    equipment: service.equipment || [],
    difficulties: service.difficulties || [],
    phone: service.phoneNumber || '',
  } : {};

  // Sport-specific fields
  const sportFields = isSport ? {
    eventName: service.eventNameSport || '',
    startTime: service.startTimeSport || '',
    endTime: service.endTimeSport || '',
    arrivalTime: service.arrivalTimeSport || '',
    departureTime: service.departureTimeSport || '',
    organizerName: service.organizerNameSport || '',
    organizerContact: service.organizerContactSport || '',
    equipmentItems: service.equipmentSport || [],
    notes: service.notesSport || '',
  } : {};

  return {
    id: service.id,
    name,
    visit,
    timestamp,
    status: mapStatus(service.status),
    statusCode: service.status,
    archivedAt: service.archivedAt ?? null,
    avatarUrl: '',
    vehicle: isSport ? service.vehicleSport : service.vehicle,
    date: dateISO,
    kilometers: service.kilometers ?? 0,
    price: service.price ?? 0,
    ...secondaryFields,
    ...sportFields,
  };
}

// ----------------------------------------------------------------------

const DATE_PRESETS = [
  {
    label: 'Oggi',
    getDates: () => {
      const today = new Date();
      return { from: today, to: today };
    },
  },
  {
    label: 'Ieri',
    getDates: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return { from: yesterday, to: yesterday };
    },
  },
  {
    label: 'Ultimi 7 giorni',
    getDates: () => {
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      return { from: lastWeek, to: today };
    },
  },
  {
    label: 'Questo mese',
    getDates: () => {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: firstDay, to: today };
    },
  },
];

interface AllServicesViewProps {
  mode?: 'active' | 'archived';
}

export function AllServicesView({ mode = 'active' }: AllServicesViewProps) {
  const table = useTable();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { services, total, isLoading, fetchServices } = useServices();

  // Date filter state
  const [filterDateFrom, setFilterDateFrom] = useState<Date | null>(null);
  const [filterDateTo, setFilterDateTo] = useState<Date | null>(null);
  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLElement | null>(null);
  const openDateFilter = Boolean(dateAnchorEl);
  const hasActiveDateFilters = filterDateFrom || filterDateTo;

  const handleOpenDateFilter = (event: React.MouseEvent<HTMLElement>) => {
    setDateAnchorEl(event.currentTarget);
  };
  const handleCloseDateFilter = () => {
    setDateAnchorEl(null);
  };
  const formatDateLabel = (date: Date) => format(date, 'dd MMM yyyy', { locale: it });
  const applyDatePreset = (preset: typeof DATE_PRESETS[number]) => {
    const { from, to } = preset.getDates();
    setFilterDateFrom(from);
    setFilterDateTo(to);
    if (isMobile) handleCloseDateFilter();
  };

  // ---- Pending filter state (what the user edits in the UI) ----
  const [filterName, setFilterName] = useState('');
  const [filterVisit, setFilterVisit] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterVehicle, setFilterVehicle] = useState('');

  // Debounce timer for live name search
  const nameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (nameTimerRef.current) clearTimeout(nameTimerRef.current); }, []);

  // ---- Applied filter state (what actually drives the API fetch) ----
  const [appliedFilters, setAppliedFilters] = useState({
    name: '',
    visit: '',
    status: '',
    vehicle: '',
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
  });

  // Fetch whenever applied filters, pagination, sort, or mode change
  const fetchWithFilters = useCallback(() => {
    const sortBy = ORDERBY_TO_SORT[table.orderBy] || 'service_date';
    const filters: Record<string, unknown> = {
      archived: mode === 'archived',
      page: table.page + 1,
      pageSize: table.rowsPerPage,
      sortBy,
      sortOrder: table.order,
    };
    if (appliedFilters.dateFrom) filters.dateFrom = format(appliedFilters.dateFrom, 'yyyy-MM-dd');
    if (appliedFilters.dateTo) filters.dateTo = format(appliedFilters.dateTo, 'yyyy-MM-dd');
    if (appliedFilters.visit && appliedFilters.visit !== 'Tutti') {
      const type = VISIT_TO_API[appliedFilters.visit];
      if (type) filters.type = type;
    }
    if (appliedFilters.status && appliedFilters.status !== 'Tutti') {
      const apiStatus = STATUS_TO_API[appliedFilters.status];
      if (apiStatus) filters.status = apiStatus;
    }
    if (appliedFilters.name) filters.search = appliedFilters.name;
    if (appliedFilters.vehicle && appliedFilters.vehicle !== 'Tutti') {
      filters.vehicle = appliedFilters.vehicle;
    }
    fetchServices(filters as any);
  }, [mode, table.page, table.rowsPerPage, table.orderBy, table.order, appliedFilters, fetchServices]);

  // Auto-fetch on mount and whenever applied filters / pagination / sort change
  useEffect(() => {
    fetchWithFilters();
  }, [fetchWithFilters]);

  // ---- "Applica" handler: copy pending → applied ----
  const handleApplyFilters = useCallback(() => {
    setAppliedFilters({
      name: filterName,
      visit: filterVisit,
      status: filterStatus,
      vehicle: filterVehicle,
      dateFrom: filterDateFrom,
      dateTo: filterDateTo,
    });
    table.onResetPage();
  }, [filterName, filterVisit, filterStatus, filterVehicle, filterDateFrom, filterDateTo, table]);

  // Remove a single filter chip and immediately refetch
  const handleRemoveFilter = useCallback((key: 'status' | 'visit' | 'vehicle') => {
    if (key === 'status') setFilterStatus('');
    if (key === 'visit') setFilterVisit('');
    if (key === 'vehicle') setFilterVehicle('');
    setAppliedFilters(prev => ({ ...prev, [key]: '' }));
    table.onResetPage();
  }, [table]);

  // Clear ALL filters and refetch
  const handleClearAllFilters = useCallback(() => {
    setFilterName('');
    setFilterVisit('');
    setFilterStatus('');
    setFilterVehicle('');
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setAppliedFilters({ name: '', visit: '', status: '', vehicle: '', dateFrom: null, dateTo: null });
    table.onResetPage();
  }, [table]);

  // Remove date filter and refetch
  const handleRemoveDateFilter = useCallback(() => {
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setAppliedFilters(prev => ({ ...prev, dateFrom: null, dateTo: null }));
    table.onResetPage();
  }, [table]);

  // Apply only dates (from the date popover "Applica" button)
  const handleApplyDateFilters = useCallback(() => {
    setAppliedFilters(prev => ({ ...prev, dateFrom: filterDateFrom, dateTo: filterDateTo }));
    table.onResetPage();
  }, [filterDateFrom, filterDateTo, table]);

  // Live name search: debounce 400ms, immediate on clear
  const handleFilterName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilterName(value);

    if (nameTimerRef.current) clearTimeout(nameTimerRef.current);

    if (!value) {
      // Cleared — apply immediately
      setAppliedFilters(prev => ({ ...prev, name: '' }));
      table.onResetPage();
    } else {
      nameTimerRef.current = setTimeout(() => {
        setAppliedFilters(prev => ({ ...prev, name: value }));
        table.onResetPage();
      }, 400);
    }
  }, [table]);

  // Convert services to table rows — all filtering is server-side now
  const rows: UserProps[] = services.map(serviceToRow);
  const dataFiltered: UserProps[] = applyFilter({
    inputData: rows,
    comparator: getComparator(table.order, table.orderBy),
    filterName: '',
    filterVisit: '',
    filterStatus: '',
    filterVehicle: '',
    filterDateFrom: null,
    filterDateTo: null,
  });

  const hasAnyAppliedFilter = appliedFilters.name || appliedFilters.visit || appliedFilters.status || appliedFilters.vehicle || appliedFilters.dateFrom || appliedFilters.dateTo;
  const notFound = !dataFiltered.length && !!hasAnyAppliedFilter;
  const isEmpty = !isLoading && total === 0;

  const escapeCsvValue = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    const raw = Array.isArray(value) ? value.join(', ') : String(value);
    const escaped = raw.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const handleExportCsv = () => {
    const headers = [
      'Nome',
      'Tipo',
      'Data',
      'Stato',
      'Archiviato il',
      'Mezzo',
      'In sede alle',
      'Partenza alle',
      'Ritiro',
      'Destinazione',
      'Evento',
      'Organizzatore',
      'KM',
      'Prezzo',
      'Note',
    ];

    const lines = dataFiltered.map((row) => [
      row.name,
      row.visit,
      row.timestamp,
      row.status,
      row.archivedAt ? format(new Date(row.archivedAt), 'dd/MM/yyyy HH:mm') : '',
      row.vehicle ?? '',
      row.arrivalTime ?? '',
      row.departureTime ?? '',
      row.pickupLocation ?? '',
      row.destinationType ?? '',
      row.eventName ?? '',
      row.organizerName ?? '',
      row.kilometers ?? '',
      row.price ?? '',
      row.notes ?? '',
    ].map(escapeCsvValue).join(','));

    const csvContent = [headers.map(escapeCsvValue).join(','), ...lines].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mode === 'archived' ? 'servizi-archiviati' : 'servizi'}-${format(new Date(), 'yyyyMMdd-HHmm')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 500);
  };

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={{ mb: 3 }}>
        <Typography variant="h4">
          {mode === 'archived' ? 'Servizi archiviati' : 'Servizi'}
        </Typography>
      </Stack>

      <Card sx={{ position: 'relative', zIndex: 20 }}>
        <UserTableToolbar
          onOpenDateFilter={handleOpenDateFilter}
          hasActiveDateFilters={!!hasActiveDateFilters}
          filterName={filterName}
          filterVisit={filterVisit}
          filterStatus={filterStatus}
          filterVehicle={filterVehicle}
          onFilterName={handleFilterName}
          onFilterVisit={(value) => setFilterVisit(value)}
          onFilterStatus={(value) => setFilterStatus(value)}
          onFilterVehicle={(value) => setFilterVehicle(value)}
          onExportCsv={handleExportCsv}
          canExportCsv={dataFiltered.length > 0}
          onApply={handleApplyFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAllFilters={handleClearAllFilters}
        />

        {/* Active date filter chip — shows applied dates */}
        {(appliedFilters.dateFrom || appliedFilters.dateTo) && (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 2.5, py: 1 }}>
            <Chip
              size="small"
              color="primary"
              variant="outlined"
              onDelete={handleRemoveDateFilter}
              label={
                appliedFilters.dateFrom && appliedFilters.dateTo
                  ? appliedFilters.dateFrom.getTime() === appliedFilters.dateTo.getTime()
                    ? formatDateLabel(appliedFilters.dateFrom)
                    : `${formatDateLabel(appliedFilters.dateFrom)} – ${formatDateLabel(appliedFilters.dateTo)}`
                  : appliedFilters.dateFrom
                    ? `Da: ${formatDateLabel(appliedFilters.dateFrom)}`
                    : `A: ${formatDateLabel(appliedFilters.dateTo!)}`
              }
            />
          </Stack>
        )}

        {/* Date filter popover */}
        <Popover
          open={openDateFilter}
          anchorEl={dateAnchorEl}
          onClose={handleCloseDateFilter}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { p: 0, width: 300, mt: 1.5, overflow: 'hidden' } }}
        >
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={it}
            localeText={{
              okButtonLabel: 'OK',
              cancelButtonLabel: 'Annulla',
              todayButtonLabel: 'Oggi',
              clearButtonLabel: 'Cancella',
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1">Filtra per periodo</Typography>
            </Box>

            <Box sx={{ p: 2, borderBottom: '1px dashed', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Selezione rapida
              </Typography>
              <Stack direction="row" flexWrap="wrap" sx={{ mx: -0.5 }}>
                {DATE_PRESETS.map((preset) => (
                  <Chip
                    key={preset.label}
                    label={preset.label}
                    size="small"
                    onClick={() => applyDatePreset(preset)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Stack>
            </Box>

            <Box sx={{ p: 2 }}>
              <Stack spacing={2}>
                <DatePicker
                  label="Data da"
                  value={filterDateFrom}
                  onChange={setFilterDateFrom}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
                <DatePicker
                  label="Data a"
                  value={filterDateTo}
                  onChange={setFilterDateTo}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </Stack>
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
              {hasActiveDateFilters && (
                <Button variant="outlined" color="inherit" onClick={() => { handleRemoveDateFilter(); handleCloseDateFilter(); }} size="small">
                  Cancella
                </Button>
              )}
              <Button variant="contained" onClick={() => { handleApplyDateFilters(); handleCloseDateFilter(); }} size="small" sx={{ ml: 'auto' }}>
                Applica
              </Button>
            </Box>
          </LocalizationProvider>
        </Popover>

        <Scrollbar>
          <TableContainer 
            sx={{ 
              overflow: 'unset',
              [theme.breakpoints.down('sm')]: {
                '& table': {
                  '& thead': {
                    display: 'none',
                  },
                },
              },
            }}
          >
            <Table 
              sx={{ 
                minWidth: { sm: 800 },
                '& .MuiTableHead-root': {
                  bgcolor: 'background.default',
                  '& .MuiTableCell-head': {
                    bgcolor: 'background.default',
                  },
                },
              }}
            >
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                onSort={(id) => {
                  table.onSort(id);
                  table.onResetPage();
                }}
                headLabel={[
                  { id: 'name', label: 'Paziente / Evento' },
                  { id: 'visit', label: 'Tipo' },
                  { id: 'timestamp', label: 'Data' },
                  { id: 'status', label: 'Stato' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress />
                      </Box>
                    </td>
                  </tr>
                ) : (
                  <>
                    {dataFiltered.map((row) => (
                        <UserTableRow
                          key={row.id}
                          row={row}
                          canArchive={mode !== 'archived'}
                        />
                      ))}

                    {isEmpty && !hasAnyAppliedFilter && (
                      <tr>
                        <td colSpan={5}>
                          <Box sx={{ py: 10, textAlign: 'center' }}>
                            <Iconify icon="solar:document-add-bold-duotone" width={64} sx={{ mb: 2, color: 'text.disabled' }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>
                              {mode === 'archived' ? 'Nessun servizio archiviato' : 'Nessun servizio'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {mode === 'archived'
                                ? 'I servizi archiviati appariranno qui.'
                                : 'Inizia creando il tuo primo servizio con il pulsante + in basso a destra.'}
                            </Typography>
                          </Box>
                        </td>
                      </tr>
                    )}

                    {notFound && <TableNoData searchQuery={appliedFilters.name} />}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Box 
          sx={{ 
            position: 'relative',
            zIndex: 25,
            pointerEvents: 'auto',
          }}
        >
          <TablePagination
            component="div"
            labelRowsPerPage="Per pagina"
            page={table.page}
            count={total}
            rowsPerPage={table.rowsPerPage}
            onPageChange={(_, newPage) => {
              table.onChangePage(_, newPage);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            onRowsPerPageChange={(e) => {
              table.onChangeRowsPerPage(e);
            }}
          />
        </Box>
      </Card>
    </>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('date');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
