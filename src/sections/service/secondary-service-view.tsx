import { yupResolver } from '@hookform/resolvers/yup';

import { useServices } from 'src/contexts/service-context';

import { ServiceFormWrapper } from 'src/components/service-form-wrapper';

import SecondaryServiceForm, { SecondaryServiceSchema, secondaryServiceDefaultValues } from './secondary-service-form';

export function SecondaryServiceView() {
  const { createService } = useServices();

  const handleSubmit = async (data: typeof secondaryServiceDefaultValues) => {
    await createService({ ...data, type: 'secondary' } as any);
  };

  return (
    <ServiceFormWrapper
      title="Nuovo Servizio Secondario"
      schema={yupResolver(SecondaryServiceSchema)}
      defaultValues={secondaryServiceDefaultValues}
      onSubmit={handleSubmit}
      successMessage="Servizio secondario creato con successo"
    >
      {({ isSubmitting }) => (
        <SecondaryServiceForm isSubmitting={isSubmitting} />
      )}
    </ServiceFormWrapper>
  );
}
