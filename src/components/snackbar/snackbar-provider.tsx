import { useRef } from 'react';
import { closeSnackbar, SnackbarProvider as NotistackProvider } from 'notistack';

import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

type Props = {
  children: React.ReactNode;
};

export function SnackbarProvider({ children }: Props) {
  const notistackRef = useRef<any>(null);

  return (
    <NotistackProvider
      ref={notistackRef}
      maxSnack={5}
      preventDuplicate
      autoHideDuration={3000}
      variant="success"
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      action={(snackbarId) => (
        <IconButton size="small" onClick={() => closeSnackbar(snackbarId)} sx={{ p: 0.5 }}>
          <Iconify icon="mingcute:close-line" width={16} />
        </IconButton>
      )}
    >
      {children}
    </NotistackProvider>
  );
}

