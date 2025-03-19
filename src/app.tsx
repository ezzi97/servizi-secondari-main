import 'src/index.css';

import { Suspense } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';
// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider>
        <Suspense fallback={<div>Caricamento...</div>}>
          <Router />
        </Suspense>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
