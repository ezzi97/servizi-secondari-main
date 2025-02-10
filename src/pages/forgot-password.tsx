import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { ForgotPasswordView } from 'src/sections/auth';

export default function ForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title>{`Password dimenticata - ${CONFIG.appName}`}</title>
      </Helmet>

      <ForgotPasswordView />
    </>
  );
} 