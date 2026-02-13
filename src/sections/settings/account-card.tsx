import type { User } from 'src/types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';

// ----------------------------------------------------------------------

type AccountCardProps = {
  user: User | null;
};

export function AccountCard({ user }: AccountCardProps) {
  const email = user?.email || '';

  return (
    <Card>
      <CardHeader
        title="Account"
        subheader="Informazioni di accesso"
      />
      <Stack spacing={2} sx={{ p: 3, pt: 2 }}>
        <TextField
          label="Email"
          value={email}
          disabled
          fullWidth
          helperText="L'email può essere modificata solo dall'amministratore di sistema"
        />
      </Stack>
    </Card>
  );
}
