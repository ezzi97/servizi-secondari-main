import { Controller, useFormContext } from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';

type Props = TextFieldProps & {
  name: string;
  children?: React.ReactNode;
};

export function RHFTextField({ name, children, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={field.value ?? ''}
          error={!!error}
          helperText={error?.message}
          {...other}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  maxHeight: 220,
                },
              },
              // Prevent scroll and layout shifts
              BackdropProps: {
                invisible: true,
              },
              // Keep menu width same as TextField
              sx: {
                '& .MuiMenu-paper': {
                  width: 'auto',
                  minWidth: '100%',
                },
              },
              // Prevent scroll behavior
              disableScrollLock: true,
              keepMounted: false,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
              slotProps: {
                paper: {
                  sx: {
                    mt: 1,
                  },
                },
              },
            },
            ...other.SelectProps,
          }}
        >
          {children}
        </TextField>
      )}
    />
  );
} 