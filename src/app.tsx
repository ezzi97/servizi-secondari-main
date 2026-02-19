import 'src/index.css';

import { Suspense } from 'react';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';
import { UIProvider, AuthProvider, ServiceProvider } from 'src/contexts';

import { SnackbarProvider } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider>
        <SnackbarProvider>
          <AuthProvider>
            <ServiceProvider>
              <UIProvider>
                <Suspense fallback={<div>Caricamento...</div>}>
                  <Router />
                </Suspense>
                <Analytics />
                <SpeedInsights />
              </UIProvider>
            </ServiceProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
