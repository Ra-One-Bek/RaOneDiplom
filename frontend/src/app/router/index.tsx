import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

import HomePage from '../../pages/HomePage/HomePage';
import CatalogPage from '../../pages/CatalogPage/CatalogPage';
import AboutPage from '../../pages/AboutPage/AboutPage';
import ProductPage from '../../pages/ProductPage/ProductPage';
import FittingRoomPage from '../../pages/FittingRoomPage/FittingRoomPage';
import RecommendationsPage from '../../pages/RecommendationsPage/RecommendationsPage';
import LoginPage from '../../pages/LoginPage/LoginPage';
import RegisterPage from '../../pages/RegisterPage/RegisterPage';
import ProfilePage from '../../pages/ProfilePage/ProfilePage';
import AdminPage from '../../pages/AdminPage/AdminPage';
import UnauthorizedPage from '../../pages/UnauthorizedPage/UnauthorizedPage';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage';
import AssistantPage from '../../pages/AssistantPage/AssistantPage';
import AvatarSetupPage from '../../pages/AvatarSetupPage/AvatarSetupPage';

import ProtectedRoute from '../../features/auth/ProtectedRoute';
import AdminRoute from '../../features/auth/AdminRoute';

export const router = createBrowserRouter([
  { path: ROUTES.HOME, element: <HomePage /> },
  { path: ROUTES.CATALOG, element: <CatalogPage /> },
  { path: ROUTES.ABOUT, element: <AboutPage /> },
  { path: ROUTES.PRODUCT, element: <ProductPage /> },
  {
    path: ROUTES.FITTING_ROOM,
    element: (
      <ProtectedRoute>
        <FittingRoomPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.RECOMMENDATIONS,
    element: (
      <ProtectedRoute>
        <RecommendationsPage />
      </ProtectedRoute>
    ),
  },
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.REGISTER, element: <RegisterPage /> },
  {
    path: ROUTES.AVATAR_SETUP,
    element: (
      <ProtectedRoute>
        <AvatarSetupPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.PROFILE,
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ASSISTANT,
    element: (
      <ProtectedRoute>
        <AssistantPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADMIN,
    element: (
      <AdminRoute>
        <AdminPage />
      </AdminRoute>
    ),
  },
  { path: ROUTES.UNAUTHORIZED, element: <UnauthorizedPage /> },
  { path: '*', element: <NotFoundPage /> },
]);