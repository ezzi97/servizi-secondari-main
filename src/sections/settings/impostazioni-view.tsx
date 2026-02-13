import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import LoadingButton from '@mui/lab/LoadingButton';

import { useToast } from 'src/hooks/use-toast';

import { userService } from 'src/services';
import { useAuth } from 'src/contexts/auth-context';

import { FormProvider } from 'src/components/hook-form';

import { AccountCard } from './account-card';
import { ProfileCard } from './profile-card';

// ----------------------------------------------------------------------

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Nome è obbligatorio').min(2, 'Nome deve essere almeno 2 caratteri'),
  phone: Yup.string(),
  address: Yup.string(),
});

type ProfileFormValues = Yup.InferType<typeof ProfileSchema>;

export function ImpostazioniView() {
  const { user, updateUser } = useAuth();
  const { success, error: showError } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string>((user as any)?.avatarUrl || '');
  const [profileLoading, setProfileLoading] = useState(true);

  const methods = useForm<ProfileFormValues>({
    resolver: yupResolver(ProfileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  });

  const { reset, handleSubmit, formState: { isSubmitting } } = methods;

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const res = await userService.getProfile();
        if (cancelled || !res.success) return;

        const data = res.data as any;
        if (data) {
          reset({
            name: data.name || '',
            phone: data.phone || '',
            address: data.address || '',
          });
          setAvatarUrl(data.avatarUrl || '');
        }
      } catch {
        // fallback to auth user
        if (user && !cancelled) {
          reset({
            name: user.name || '',
            phone: user.phone || '',
            address: user.address || '',
          });
          setAvatarUrl((user as any)?.avatarUrl || '');
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    };

    loadProfile();
    return () => { cancelled = true; };
  }, [user, reset]);

  useEffect(() => {
    if (user) {
      setAvatarUrl((user as any)?.avatarUrl || '');
    }
  }, [user]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await userService.updateProfile(data);
      if (!res.success) {
        showError(res.message || 'Errore durante il salvataggio');
        return;
      }

      const updated = res.data as any;
      updateUser({
        name: updated?.name ?? data.name,
        phone: updated?.phone ?? data.phone,
        address: updated?.address ?? data.address,
      });
      success('Profilo aggiornato con successo');
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Si è verificato un errore');
    }
  });

  if (profileLoading) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4">Impostazioni</Typography>
        <Stack direction="row" spacing={3} alignItems="center" sx={{ py: 2 }}>
          <Skeleton variant="circular" width={80} height={80} />
          <Stack spacing={1} flex={1}>
            <Skeleton variant="rounded" width={140} height={36} />
          </Stack>
        </Stack>
        <Skeleton variant="text" width="20%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="rounded" width="100%" height={56} />
        <Skeleton variant="text" width="20%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="rounded" width="100%" height={56} />
        <Skeleton variant="text" width="20%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="rounded" width="100%" height={56} />
        <Skeleton variant="rounded" width="40%" height={56} sx={{ mt: 2 }} />
      </Stack>
    );
  }

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <Typography variant="h4">Impostazioni</Typography>

          <ProfileCard
            user={user}
            avatarUrl={avatarUrl}
            isSubmitting={isSubmitting}
          />

          <AccountCard user={user} />

          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            loading={isSubmitting}
          >
            Salva modifiche
          </LoadingButton>
        </Stack>
    </FormProvider>
  );
}
