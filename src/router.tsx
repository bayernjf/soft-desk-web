import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Landing } from '@/pages/Landing';
import { Dashboard } from '@/pages/Dashboard';
import { Library } from '@/pages/Library';
import { Workflows } from '@/pages/Workflows';
import { Favorites } from '@/pages/Favorites';
import { MyShares } from '@/pages/MyShares';
import { Statistics } from '@/pages/Statistics';
import { Uninstall } from '@/pages/Uninstall';
import { Settings } from '@/pages/Settings';
import { Privacy } from '@/pages/Privacy';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/privacy',
    element: <Privacy theme="light" />,
  },
  {
    path: '/app',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'library', element: <Library /> },
      { path: 'favorites', element: <Favorites /> },
      { path: 'workflows', element: <Workflows /> },
      { path: 'my-shares', element: <MyShares /> },
      { path: 'statistics', element: <Statistics /> },
      { path: 'uninstall', element: <Uninstall /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);