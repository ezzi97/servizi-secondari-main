import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

import { stylesMode } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify/iconify';
import { IconButton } from '@mui/material';
import { useAppTheme } from 'src/hooks/use-theme-mode';
import { Main } from './main';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';

// ----------------------------------------------------------------------

export type AuthLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function AuthLayout({ sx, children, header }: AuthLayoutProps) {
  const layoutQuery: Breakpoint = 'md';
  const { toggleThemeMode, mode } = useAppTheme();

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: { maxWidth: false },
            toolbar: { sx: { bgcolor: 'transparent', backdropFilter: 'unset' } },
          }}
          sx={{
            position: { [layoutQuery]: 'fixed' },

            ...header?.sx,
          }}
          slots={{
            leftArea: (
                <IconButton
                onClick={toggleThemeMode}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  color: 'text.primary',
                }}
              >
                <Iconify
                  icon={mode === 'light' ? 'solar:moon-bold-duotone' : 'solar:sun-bold-duotone'}
                  width={24}
                />
              </IconButton>
            ),
            rightArea: (
              <Link
                component={RouterLink}
                href="#"
              >
                Hai bisogno di aiuto?
              </Link>
            ),
          }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{ '--layout-auth-content-width': '420px' }}
      sx={{
        '&::before': {
          width: 1,
          height: 1,
          zIndex: -1,
          content: "''",
          opacity: 0.24,
          position: 'fixed',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundImage: `url(/assets/background/overlay.jpg)`,
          [stylesMode.dark]: { opacity: 0.08 },
        },
        ...sx,
      }}
    >
      <Main layoutQuery={layoutQuery}>{children}</Main>
    </LayoutSection>
  );
}
