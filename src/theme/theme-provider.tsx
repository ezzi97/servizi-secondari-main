import type {} from '@mui/lab/themeAugmentation';
import type { PaletteMode } from '@mui/material';
import type {} from '@mui/material/themeCssVarsAugmentation';

import { useMemo, useContext, useCallback, createContext } from 'react';

import { track } from '@vercel/analytics';

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

const TRANSITION_DURATION = 350; // ms — matches the CSS transition in create-theme.ts

function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const { mode = 'light', setMode } = useColorScheme();

  const toggleThemeMode = useCallback(() => {
    const nextMode = mode === 'light' ? 'dark' : 'light';

    // 1. Add class so the global CSS rule kicks in with !important
    document.documentElement.classList.add('theme-transitioning');

    // 2. Actually switch mode
    setMode(nextMode);

    track('Theme Mode Changed', { mode: nextMode });

    // 3. Remove class after the transition finishes
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, TRANSITION_DURATION);
  }, [mode, setMode]);

  const themeMode = useMemo(
    () => ({
      toggleThemeMode,
      mode: (mode === 'system' ? 'light' : mode) as 'light' | 'dark',
    }),
    [toggleThemeMode, mode]
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
