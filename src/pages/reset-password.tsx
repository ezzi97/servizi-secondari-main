import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ResetPasswordView } from 'src/sections/auth';

export default function ResetPasswordPage() {
  return (
    <>
      <Helmet>
        <title>{`Reimposta password - ${CONFIG.appName}`}</title>
      </Helmet>

      <ResetPasswordView />
    </>
  );
}
