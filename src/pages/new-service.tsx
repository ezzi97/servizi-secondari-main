import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { NewServiceView } from 'src/sections/service';

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