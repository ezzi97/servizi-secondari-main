import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard/main';

import { ImpostazioniView } from 'src/sections/settings/impostazioni-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{`Impostazioni - ${CONFIG.appName}`}</title>
      </Helmet>
      <DashboardContent maxWidth="md">
        <ImpostazioniView />
      </DashboardContent>
    </>
  );
}
