import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter, usePathname } from 'src/routes/hooks';

import { useAuth } from 'src/contexts/auth-context';

import { Iconify } from 'src/components/iconify';

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
  const { user, logout } = useAuth();

  const displayName = user?.name || user?.email || '';
  const email = user?.email || '';
  const avatarUrl = (user as any)?.avatarUrl || '';

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
      await logout();
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
        <Avatar src={avatarUrl} alt={displayName} sx={{ width: 1, height: 1 }}>
          {displayName.charAt(0).toUpperCase()}
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
            {displayName}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {email}
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
          sx: {
            '& .MuiDialog-paper': {
              width: '100%',
              maxWidth: 400,
            },
            borderRadius: 2,
            p: 1,
          },
        }}
      >
        <DialogTitle 
          id="logout-dialog-title"
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 2,
          }}
        >
          <Iconify 
            icon="solar:logout-3-bold-duotone" 
            width={24} 
            sx={{ 
              color: 'error.main',
            }} 
          />
          <Typography variant="h6">
            Conferma logout
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 2 
          }}>
            <Avatar 
              src={avatarUrl} 
              alt={displayName}
              sx={{ 
                width: 48, 
                height: 48,
                border: (theme) => `solid 2px ${theme.palette.background.neutral}`
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">
                {displayName}
              </Typography>
            </Box>
          </Box>

          <DialogContentText sx={{ color: 'text.secondary' }}>
            Sei sicuro di voler uscire?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 2, pt: 1 }}>
          <Button 
            onClick={() => setOpenLogoutDialog(false)} 
            color="inherit"
            variant="outlined"
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
              bgcolor: (theme) => theme.palette.error.main,
              '&:hover': {
                bgcolor: (theme) => theme.palette.error.dark,
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
