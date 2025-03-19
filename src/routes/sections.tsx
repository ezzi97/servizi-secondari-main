import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { AuthGuard } from 'src/components/auth-guard';
import { EditSecondaryServiceView, EditSportServiceView } from 'src/sections/service';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ForgotPasswordPage = lazy(() => import('src/pages/forgot-password'));
export const NewServicePage = lazy(() => import('src/pages/new-service'));
export const SecondaryServicePage = lazy(() => import('src/pages/servizi/secondari/nuovo'));
export const SportServicePage = lazy(() => import('src/pages/servizi/sportivi/nuovo'));
export const ServicesPage = lazy(() => import('src/pages/user'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { path: 'dashboard', element: <HomePage />, index: true },
        { path: 'servizi', children: [
          { element: <NewServicePage />, index: true },
          { element: <SecondaryServicePage />, path: 'secondari/nuovo' },
          { element: <SportServicePage />, path: 'sportivi/nuovo' },
        ] },
      ],
    },
    {
        element: (
            <DashboardLayout>
                <Suspense fallback={renderFallback}>
                    <Outlet />
                </Suspense>
            </DashboardLayout>
        ),
        children: [
            { path: 'servizi-archiviati', element: <ServicesPage />, index: true },
        ],
    },
    {
      element: (
        <AuthLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </AuthLayout>
      ),
      children: [
        { path: '/', element: <SignInPage /> },
        { path: 'sign-up', element: <SignUpPage /> },
        { path: 'forgot-password', element: <ForgotPasswordPage /> },
      ],
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: 'servizi/secondari/modifica/:id',
      element: (
        <AuthGuard>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <EditSecondaryServiceView />
            </Suspense>
          </DashboardLayout>
        </AuthGuard>
      ),
    },
    {
      path: 'servizi/sportivi/modifica/:id',
      element: (
        <AuthGuard>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <EditSportServiceView />
            </Suspense>
          </DashboardLayout>
        </AuthGuard>
      ),
    },
  ]);
}
