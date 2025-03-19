import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import SpeedDial from '@mui/material/SpeedDial';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import TablePagination from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';

import { _users } from 'src/_mock';

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

type UserViewProps = {
  filterDateFrom?: Date | null;
  filterDateTo?: Date | null;
};

export function UserView({ filterDateFrom, filterDateTo }: UserViewProps) {
  const router = useRouter();
  const table = useTable();
  const theme = useTheme();
  
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = [
    { 
      icon: <Iconify icon="lineicons:ambulance" width={22} height={22} />, 
      name: 'Secondari',
      onClick: () => {
        router.push('/servizi/secondari/nuovo');
        handleClose();
      }
    },
    { 
      icon: <Iconify icon="solar:basketball-bold" width={22} height={22} />, 
      name: 'Sportivi',
      onClick: () => {
        router.push('/servizi/sportivi/nuovo');
        handleClose();
      }
    },
  ];

  const [filterName, setFilterName] = useState('');
  const [filterVisit, setFilterVisit] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterVehicle, setFilterVehicle] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterTimeOfDay, setFilterTimeOfDay] = useState('');

  const dataFiltered: UserProps[] = applyFilter({
    inputData: _users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterVisit,
    filterStatus,
    filterVehicle,
    filterPriority,
    filterTimeOfDay,
    filterDateFrom: filterDateFrom ?? null,
    filterDateTo: filterDateTo ?? null
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <>
      <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Servizi
        </Typography>
      </Stack>

      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 24, sm: 24 },
          right: { xs: 24, sm: 24 },
          zIndex: 30,
        }}
      >
        <SpeedDial
          ariaLabel="Nuovo Servizio"
          icon={<Iconify icon="eva:plus-fill" width={24} />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          FabProps={{
            sx: {
              bgcolor: (theme) => theme.palette.mode === 'light' ? 'grey.800' : 'grey.50',
              color: (theme) => theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
              '&:hover': {
                bgcolor: (theme) => theme.palette.mode === 'light' ? 'grey.700' : 'grey.200',
              },
              borderRadius: 5,
              width: 56,
              height: 56,
            }
          }}
          sx={{
            '& .MuiSpeedDial-actions': {
              visibility: open ? 'visible' : 'hidden',
              height: open ? 'auto' : 0,
              overflow: 'hidden',
              transition: 'height 0.3s, visibility 0.3s',
            }
          }}
          direction="up"
          hidden={false}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              tooltipTitle={action.name}
              icon={action.icon}
              tooltipPlacement="left"
              onClick={action.onClick}
              FabProps={{
                sx: {
                  bgcolor: (theme) => theme.palette.mode === 'light' ? 'grey.800' : 'grey.50',
                  color: (theme) => theme.palette.mode === 'light' ? 'common.white' : 'grey.800',
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'light' ? 'grey.700' : 'grey.200',
                  },
                  width: 56,
                  height: 56,
                  borderRadius: 5,
                }
              }}
            />
          ))}
        </SpeedDial>
      </Box>

      <Card sx={{ position: 'relative', zIndex: 20 }}>
        <UserTableToolbar
          filterName={filterName}
          filterVisit={filterVisit}
          filterStatus={filterStatus}
          filterVehicle={filterVehicle}
          filterPriority={filterPriority}
          filterTimeOfDay={filterTimeOfDay}
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
          onFilterPriority={(value) => {
            setFilterPriority(value);
            table.onResetPage();
          }}
          onFilterTimeOfDay={(value) => {
            setFilterTimeOfDay(value);
            table.onResetPage();
          }}
        />

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
                  { id: 'name', label: 'Paziente' },
                  { id: 'visit', label: 'Visita' },
                  { id: 'timestamp', label: 'Data e ora' },
                  { id: 'status', label: 'Stato' },
                  { id: '' },
                ]}
              />
              <TableBody>
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
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
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
            count={_users.length}
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
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

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
