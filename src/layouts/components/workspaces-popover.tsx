import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';

import { useAppTheme } from 'src/hooks/use-theme-mode';

import { varAlpha } from 'src/theme/styles';

// ----------------------------------------------------------------------

export type WorkspacesPopoverProps = ButtonBaseProps & {
  data?: {
    id: string;
    name: string;
    logoLight: string;
    logoDark: string;
  }[];
};

export function WorkspacesPopover({ data = [], sx, ...other }: WorkspacesPopoverProps) {
  const { mode } = useAppTheme();
  const logoSrc = mode === 'dark' ? data[0]?.logoDark : data[0]?.logoLight;

  return (
    <ButtonBase
      disableRipple
      sx={{
        pl: 1,
        py: 1,
        gap: 1.5,
        pr: 1.5,
        width: 1,
        borderRadius: 1.5,
        textAlign: 'left',
        justifyContent: 'flex-start',
        bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
        ...sx,
      }}
      {...other}
    >
      <Box
        component="img"
        alt={data[0]?.name}
        src={logoSrc}
        sx={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'contain' }}
      />

      <Box
        gap={1}
        flexGrow={1}
        display="flex"
        alignItems="center"
        sx={{ typography: 'subtitle1', fontWeight: 'fontWeightBold' }}
      >
        {data[0]?.name}
      </Box>
    </ButtonBase>
  );
}
