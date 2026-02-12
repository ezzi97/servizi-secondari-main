import { yupResolver } from '@hookform/resolvers/yup';

import { useServices } from 'src/contexts/service-context';

import { ServiceFormWrapper } from 'src/components/service-form-wrapper';

import SportServiceForm, { SportServiceSchema, sportServiceDefaultValues } from './sport-service-form';

export function SportServiceView() {
  const { createService } = useServices();

  const handleSubmit = async (data: typeof sportServiceDefaultValues) => {
    await createService({ ...data, type: 'sport' } as any);
  };

  return (
    <ServiceFormWrapper
      title="Nuovo Servizio Sportivo"
      schema={yupResolver(SportServiceSchema)}
      defaultValues={sportServiceDefaultValues}
      onSubmit={handleSubmit}
      successMessage="Servizio sportivo creato con successo"
    >
      {({ isSubmitting }) => (
        <SportServiceForm isSubmitting={isSubmitting} />
      )}
    </ServiceFormWrapper>
  );
}
