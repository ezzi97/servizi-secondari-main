import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SportServiceView } from 'src/sections/service';

export default function SportServicePage() {
  return (
    <>
      <Helmet>
        <title>{`Nuovo Servizio Sportivo - ${CONFIG.appName}`}</title>
      </Helmet>

      <SportServiceView />
    </>
  );
} 