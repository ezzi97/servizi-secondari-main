import type { Theme } from '@mui/material/styles';

import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

import { shadows, typography, components, colorSchemes, customShadows } from './core';

// ----------------------------------------------------------------------

export function createTheme(): Theme {
  const initialTheme = {
    colorSchemes,
    shadows: shadows(),
    customShadows: customShadows(),
    shape: { borderRadius: 8 },
    components: {
      ...components,
      MuiCssBaseline: {
        styleOverrides: {
          // When theme is switching (class added/removed by ThemeModeProvider),
          // all elements get a smooth color transition
          'html.theme-transitioning *, html.theme-transitioning *::before, html.theme-transitioning *::after': {
            transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, fill 0.3s ease-in-out !important',
          },
        },
      },
    },
    typography,
    cssVarPrefix: '',
    shouldSkipGeneratingVar,
  };

  const theme = extendTheme(initialTheme);
  return theme;
}

// ----------------------------------------------------------------------

function shouldSkipGeneratingVar(keys: string[], value: string | number): boolean {
  const skipGlobalKeys = [
    'mixins',
    'overlays',
    'direction',
    'typography',
    'breakpoints',
    'transitions',
    'cssVarPrefix',
    'unstable_sxConfig',
  ];

  const skipPaletteKeys: {
    [key: string]: string[];
  } = {
    global: ['tonalOffset', 'dividerChannel', 'contrastThreshold'],
    grey: ['A100', 'A200', 'A400', 'A700'],
    text: ['icon'],
  };

  const isPaletteKey = keys[0] === 'palette';

  if (isPaletteKey) {
    const paletteType = keys[1];
    const skipKeys = skipPaletteKeys[paletteType] || skipPaletteKeys.global;

    return keys.some((key) => skipKeys?.includes(key));
  }

  return keys.some((key) => skipGlobalKeys?.includes(key));
}
