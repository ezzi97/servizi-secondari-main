import type { VariantType } from 'notistack';

import { useSnackbar } from 'notistack';

export function useToast() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showToast = (message: string, variant: VariantType = 'default') => {
    enqueueSnackbar(message, { variant });
  };

  const success = (message: string) => showToast(message, 'success');
  const error = (message: string) => showToast(message, 'error');
  const warning = (message: string) => showToast(message, 'warning');
  const info = (message: string) => showToast(message, 'info');

  return {
    showToast,
    success,
    error,
    warning,
    info,
    closeSnackbar,
  };
}

