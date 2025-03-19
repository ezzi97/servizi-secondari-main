import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import NewServiceView from 'src/sections/service/new-service-view';

export default function NewServicePage() {
  return (
    <>
      <Helmet>
        <title>{`Nuovo Servizio - ${CONFIG.appName}`}</title>
      </Helmet>

      <NewServiceView />
    </>
  );
} 