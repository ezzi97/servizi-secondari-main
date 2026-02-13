import type { User } from 'src/types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type ProfileCardProps = {
  user: User | null;
  avatarUrl: string;
  isSubmitting: boolean;
};

export function ProfileCard({
  user,
  avatarUrl,
  isSubmitting,
}: ProfileCardProps) {

  const displayName = user?.name || '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Card>
      <CardHeader
        title="Profilo"
        subheader="Aggiorna le informazioni del tuo profilo"
      />
      <Stack spacing={3} sx={{ p: 3, pt: 0 }}>
          <Stack direction="row" spacing={3} alignItems="center" pt={2}>
            <Avatar
              src={avatarUrl}
              alt={displayName}
              sx={{
                width: 60,
                height: 60,
                cursor: 'pointer',
                bgcolor: 'primary.lighter',
              }}
            >
              {initial}
            </Avatar>
            
            <RHFTextField name="name" label="Nome" fullWidth />
          </Stack>

          <RHFTextField name="phone" label="Telefono" fullWidth />

          <RHFTextField name="address" label="Indirizzo" multiline rows={2} />
        </Stack>
    </Card>
  );
}
