import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import DialogContentText from '@mui/material/DialogContentText';
import { useTheme } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';

import { useRouter, usePathname } from 'src/routes/hooks';

import { _myAccount } from 'src/_mock';

// ----------------------------------------------------------------------

export type AccountPopoverProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountPopover({ data = [], sx, ...other }: AccountPopoverProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleClickItem = useCallback(
    (path: string) => {
      handleClosePopover();
      router.push(path);
    },
    [handleClosePopover, router]
  );

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      // Add your logout logic here
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulated delay
      handleClosePopover();
      router.push('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoggingOut(false);
      setOpenLogoutDialog(false);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        sx={{
          p: '2px',
          width: 40,
          height: 40,
          background: (theme) =>
            `conic-gradient(${theme.vars.palette.primary.light}, ${theme.vars.palette.warning.light}, ${theme.vars.palette.primary.light})`,
          ...sx,
        }}
        {...other}
      >
        <Avatar src={_myAccount.photoURL} alt={_myAccount.displayName} sx={{ width: 1, height: 1 }}>
          {_myAccount.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 200 },
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {_myAccount?.displayName}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {_myAccount?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuList
          disablePadding
          sx={{
            p: 1,
            gap: 0.5,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
              [`&.${menuItemClasses.selected}`]: {
                color: 'text.primary',
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold',
              },
            },
          }}
        >
          {data.map((option) => (
            <MenuItem
              key={option.label}
              selected={option.href === pathname}
              onClick={() => handleClickItem(option.href)}
            >
              {option.icon}
              {option.label}
            </MenuItem>
          ))}
        </MenuList>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            color="error"
            size="medium"
            variant="text"
            onClick={() => setOpenLogoutDialog(true)}
          >
            Esci
          </Button>
        </Box>
      </Popover>

      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        aria-labelledby="logout-dialog-title"
        PaperProps={{
          elevation: 24,
          sx: {
            width: '100%',
            maxWidth: 440,
            borderRadius: 3,
            p: { xs: 1, sm: 2 },
            backgroundImage: (theme) => `linear-gradient(135deg, 
              ${theme.palette.background.neutral} 0%, 
              ${theme.palette.background.paper} 100%
            )`,
          },
        }}
      >
        <DialogTitle 
          id="logout-dialog-title"
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2.5,
            pb: 0,
          }}
        >
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              display: 'flex',
              bgcolor: (theme) => theme.palette.error.lighter,
            }}
          >
            <Iconify 
              icon="solar:logout-3-bold-duotone" 
              width={28}
              sx={{ 
                color: 'error.main',
              }} 
            />
          </Box>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Conferma logout
          </Typography>
          <IconButton 
            onClick={() => setOpenLogoutDialog(false)}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Iconify icon="mingcute:close-line" width={24} />
          </IconButton>
        </DialogTitle>

        <DialogContent 
          sx={{ 
            p: 2.5,
            pb: 1,
            pt: 1,
          }}
        >

          <DialogContentText 
            sx={{ 
              color: 'text.secondary',
              typography: 'subtitle1',
              textAlign: 'center',
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyItems: 'center',
              marginTop: 2,
              marginBottom: 2,
              fontSize: '1rem',
            }}
          >
            Sei sicuro di voler uscire?
          </DialogContentText>
        </DialogContent>

        <DialogActions 
          sx={{ 
            px: 2.5, 
            pb: 2.5, 
            pt: 1,
            gap: 1.5,
          }}
        >
          <Button 
            onClick={() => setOpenLogoutDialog(false)} 
            color="inherit"
            variant="outlined"
            sx={{ 
              flex: 1,
              borderRadius: 1.5,
            }}
          >
            Annulla
          </Button>
          <LoadingButton
            onClick={handleLogout}
            color="error"
            loading={loggingOut}
            variant="contained"
            startIcon={!loggingOut && <Iconify icon="solar:logout-3-bold" />}
            sx={{
              flex: 1,
              borderRadius: 1.5,
              bgcolor: 'error.main',
              '&:hover': {
                bgcolor: 'error.dark',
              },
            }}
          >
            {loggingOut ? 'Uscita in corso...' : 'Esci'}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
