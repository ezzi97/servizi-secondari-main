import { format } from 'date-fns';
import it from 'date-fns/locale/it';
import { useState, useEffect, useCallback } from 'react';

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
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useServices } from 'src/contexts/service-context';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

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

export function AllServicesView() {
  const table = useTable();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { services, isLoading, fetchServices } = useServices();

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
  const handleClearDateFilters = () => {
    setFilterDateFrom(null);
    setFilterDateTo(null);
  };
  const formatDateLabel = (date: Date) => format(date, 'dd MMM yyyy', { locale: it });
  const applyDatePreset = (preset: typeof DATE_PRESETS[number]) => {
    const { from, to } = preset.getDates();
    setFilterDateFrom(from);
    setFilterDateTo(to);
    if (isMobile) handleCloseDateFilter();
  };

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [filterName, setFilterName] = useState('');
  const [filterVisit, setFilterVisit] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterVehicle, setFilterVehicle] = useState('');

  // Convert real services to table rows
  const rows: UserProps[] = services.map(serviceToRow);

  const dataFiltered: UserProps[] = applyFilter({
    inputData: rows,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterVisit,
    filterStatus,
    filterVehicle,
    filterDateFrom: filterDateFrom ?? null,
    filterDateTo: filterDateTo ?? null
  });

  const notFound = !dataFiltered.length && !!filterName;
  const isEmpty = !isLoading && services.length === 0;

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={{ mb: 3 }}>
        <Typography variant="h4">
          Servizi
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
          onFilterName={(event) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onFilterVisit={(value) => {
            setFilterVisit(value);
            table.onResetPage();
          }}
          onFilterStatus={(value) => {
            setFilterStatus(value);
            table.onResetPage();
          }}
          onFilterVehicle={(value) => {
            setFilterVehicle(value);
            table.onResetPage();
          }}
        />

        {/* Active date filter chip */}
        {(filterDateFrom || filterDateTo) && (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 2.5, py: 1 }}>
            <Chip
              size="small"
              color="primary"
              variant="outlined"
              onDelete={handleClearDateFilters}
              label={
                filterDateFrom && filterDateTo
                  ? filterDateFrom.getTime() === filterDateTo.getTime()
                    ? formatDateLabel(filterDateFrom)
                    : `${formatDateLabel(filterDateFrom)} – ${formatDateLabel(filterDateTo)}`
                  : filterDateFrom
                    ? `Da: ${formatDateLabel(filterDateFrom)}`
                    : `A: ${formatDateLabel(filterDateTo!)}`
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
                <Button variant="outlined" color="inherit" onClick={handleClearDateFilters} size="small">
                  Cancella
                </Button>
              )}
              <Button variant="contained" onClick={handleCloseDateFilter} size="small" sx={{ ml: 'auto' }}>
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
                onSort={table.onSort}
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
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <UserTableRow
                          key={row.id}
                          row={row}
                        />
                      ))}

                    <TableEmptyRows
                      height={68}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                    />

                    {isEmpty && !filterName && (
                      <tr>
                        <td colSpan={5}>
                          <Box sx={{ py: 10, textAlign: 'center' }}>
                            <Iconify icon="solar:document-add-bold-duotone" width={64} sx={{ mb: 2, color: 'text.disabled' }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>
                              Nessun servizio
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Inizia creando il tuo primo servizio con il pulsante + in basso a destra.
                            </Typography>
                          </Box>
                        </td>
                      </tr>
                    )}

                    {notFound && <TableNoData searchQuery={filterName} />}
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
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
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
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
