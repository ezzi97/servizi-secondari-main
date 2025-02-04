import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard/main';

import { UserView } from 'src/sections/user/view';
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Servizi - ${CONFIG.appName}`}</title>
      </Helmet>
      <DashboardContent maxWidth="xl">
        <UserView />
      </DashboardContent>
    </>
  );
}
