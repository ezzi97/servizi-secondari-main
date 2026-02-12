import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <Card>
      {/* Toolbar skeleton */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
        <Skeleton variant="rounded" width={200} height={40} />
        <Skeleton variant="rounded" width={100} height={40} />
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {Array.from({ length: columns }).map((_, index) => (
                <TableCell key={index}>
                  <Skeleton variant="text" width="80%" height={24} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    {colIndex === 0 ? (
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="text" width={100} height={20} />
                      </Stack>
                    ) : (
                      <Skeleton variant="text" width="60%" height={20} />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination skeleton */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Skeleton variant="rounded" width={300} height={32} />
      </Box>
    </Card>
  );
}

