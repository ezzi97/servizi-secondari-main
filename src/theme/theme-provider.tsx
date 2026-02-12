import type {} from '@mui/lab/themeAugmentation';
import type { PaletteMode } from '@mui/material';
import type {} from '@mui/material/themeCssVarsAugmentation';

import { useMemo, useContext, createContext } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { useColorScheme, Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

import { createTheme } from './create-theme';

// ----------------------------------------------------------------------

export const ThemeModeContext = createContext<{
  toggleThemeMode: () => void;
  mode: PaletteMode;
}>({ toggleThemeMode: () => {}, mode: 'light' });

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return context;
}

type Props = {
  children: React.ReactNode;
};

function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const { mode = 'light', setMode } = useColorScheme();
  
  const themeMode = useMemo(
    () => ({
      toggleThemeMode: () => {
        setMode(mode === 'light' ? 'dark' : 'light');
      },
      mode: mode === 'system' ? 'light' : mode,
    }),
    [mode, setMode]
  );

  return (
    <ThemeModeContext.Provider value={themeMode}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function ThemeProvider({ children }: Props) {
  const theme = createTheme();

  return (
    <CssVarsProvider theme={theme} defaultMode="light">
      <CssBaseline />
      <ThemeModeProvider>
        {children}
      </ThemeModeProvider>
    </CssVarsProvider>
  );
}
