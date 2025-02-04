import type { TableRowProps } from '@mui/material/TableRow';

import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
// ----------------------------------------------------------------------

type TableEmptyRowsProps = TableRowProps & {
  emptyRows: number;
  height?: number;
};

export function TableEmptyRows({ emptyRows, height, sx, ...other }: TableEmptyRowsProps) {
  if (!emptyRows) {
    return null;
  }

  return (
    <TableRow
      sx={{
        ...(height && {
          height: height * emptyRows,
        }),
        ...sx,
      }}
      {...other}
    >
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Nessun risultato trovato
    </Typography>
    </TableRow>
  );
}
