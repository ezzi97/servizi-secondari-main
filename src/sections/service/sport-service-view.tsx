// Similar to secondary-service-view.tsx but for sport services 
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';

import { Stack, Alert, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';  // Use our custom router hook instead of next/navigation
import SportServiceForm, { SportServiceSchema, sportServiceDefaultValues } from './sport-service-form';

export function SportServiceView() {
    const router = useRouter();
    const [error, setError] = useState('');
    
    const methods = useForm({
        resolver: yupResolver(SportServiceSchema),
        defaultValues: sportServiceDefaultValues,
        mode: 'onChange',
    });

    const onSubmit = methods.handleSubmit(async (data) => {
        try {
            setError('');
            console.log('DATA', data);
            await new Promise((resolve) => setTimeout(resolve, 10000));
            router.push('/servizi');
        } catch (exception) {
            console.error(exception);
            setError('Si è verificato un errore. Riprova più tardi.');
        }
    });

    return (
        <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
            <Stack spacing={4} sx={{ mb: 4, p: 4 }}>
                <Stack 
                direction="row" 
                alignItems="center" 
                justifyContent="center"
                sx={{ mb: 1 }}
            >
            <Typography variant="h4">Nuovo Servizio Sportivo</Typography>
            </Stack>
            
            {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
            {error}
                </Alert>
                )}
                <SportServiceForm isSubmitting={methods.formState.isSubmitting} />
            </Stack>
            </form>
        </FormProvider>
    );
}