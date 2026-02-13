import type { ReactNode } from 'react';
import type { FieldValues, DefaultValues } from 'react-hook-form';

import { useForm, FormProvider } from 'react-hook-form';

import { Stack, Alert, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useToast } from 'src/hooks/use-toast';
import { useUnsavedChanges } from 'src/hooks/use-unsaved-changes';

import { UnsavedChangesDialog } from 'src/components/unsaved-changes-dialog';

interface ServiceFormWrapperProps<T extends FieldValues> {
  title: string;
  schema: any; // Using any to avoid resolver type conflicts
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => Promise<void>;
  children: (props: { isSubmitting: boolean }) => ReactNode;
  successMessage?: string;
  redirectPath?: string;
}

export function ServiceFormWrapper<T extends FieldValues>({
  title,
  schema,
  defaultValues,
  onSubmit,
  children,
  successMessage = 'Servizio creato con successo',
  redirectPath = '/tutti-servizi',
}: ServiceFormWrapperProps<T>) {
  const router = useRouter();
  const { success, error: showError } = useToast();

  const methods = useForm<T>({
    resolver: schema,
    defaultValues,
    mode: 'onChange',
  });

  const { formState: { isSubmitting, isDirty } } = methods;

  // Handle unsaved changes warning
  const { isBlocked, confirmLeave, cancelLeave } = useUnsavedChanges({
    isDirty: isDirty && !isSubmitting,
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
      success(successMessage);
      router.push(redirectPath);
    } catch (err) {
      console.error(err);
      showError(err instanceof Error ? err.message : 'Si è verificato un errore. Riprova più tardi.');
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4} sx={{ mb: 4, p: 4 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ mb: 1 }}
          >
            <Typography variant="h4">{title}</Typography>
          </Stack>

          {methods.formState.errors.root && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {methods.formState.errors.root.message}
            </Alert>
          )}

          {children({ isSubmitting })}
        </Stack>
      </form>

      <UnsavedChangesDialog
        open={isBlocked}
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
      />
    </FormProvider>
  );
}

