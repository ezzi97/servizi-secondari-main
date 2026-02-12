// ----------------------------------------------------------------------

import type { UserProps } from "./models";

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;

// ----------------------------------------------------------------------

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number): number {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// ----------------------------------------------------------------------

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// ----------------------------------------------------------------------

export function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// ----------------------------------------------------------------------

export function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterVisit,
  filterVehicle,
  filterDateFrom,
  filterDateTo,
}: {
  inputData: UserProps[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterVisit: string;
  filterVehicle: string;
  filterDateFrom: Date | null;
  filterDateTo: Date | null;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus) {
    inputData = inputData.filter(
      (user) => user.status.toLowerCase() === filterStatus.toLowerCase()
    );
  }

  if (filterVisit) {
    inputData = inputData.filter((user) => user.visit === filterVisit);
  }

  if (filterVehicle) {
    inputData = inputData.filter((user) => user.vehicle === filterVehicle);
  }

  if (filterDateFrom) {
    const dateFrom = new Date(filterDateFrom);
    dateFrom.setHours(0, 0, 0, 0);
    inputData = inputData.filter((user) => {
      const userDate = new Date(user.date || '');
      return userDate >= dateFrom;
    });
  }

  if (filterDateTo) {
    const dateTo = new Date(filterDateTo);
    dateTo.setHours(23, 59, 59, 999);
    inputData = inputData.filter((user) => {
      const userDate = new Date(user.date || '');
      return userDate <= dateTo;
    });
  }

  return inputData;
}
