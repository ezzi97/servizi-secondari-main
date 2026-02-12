import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AnalyticsView } from 'src/sections/analytics/analytics-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{`Analisi - ${CONFIG.appName}`}</title>
      </Helmet>

      <AnalyticsView />
    </>
  );
}
