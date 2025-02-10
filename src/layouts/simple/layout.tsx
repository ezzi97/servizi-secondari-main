import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify/iconify';
import { IconButton } from '@mui/material';
import { useAppTheme } from 'src/hooks/use-theme-mode';
import { Main, CompactContent } from './main';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';

// ----------------------------------------------------------------------

export type SimpleLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
  content?: {
    compact?: boolean;
  };
};

export function SimpleLayout({ sx, children, header, content }: SimpleLayoutProps) {
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
          slotProps={{ container: { maxWidth: false } }}
          sx={header?.sx}
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
                href="#"
                component={RouterLink}
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
      cssVars={{
        '--layout-simple-content-compact-width': '448px',
      }}
      sx={sx}
    >
      <Main>
        {content?.compact ? (
          <CompactContent layoutQuery={layoutQuery}>{children}</CompactContent>
        ) : (
          children
        )}
      </Main>
    </LayoutSection>
  );
}
