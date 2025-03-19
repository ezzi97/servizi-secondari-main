import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SecondaryServiceView } from 'src/sections/service';

export default function SecondaryServicePage() {
  return (
    <>
      <Helmet>
        <title>{`Nuovo Servizio Secondario - ${CONFIG.appName}`}</title>
      </Helmet>

      <SecondaryServiceView />
    </>
  );
} 