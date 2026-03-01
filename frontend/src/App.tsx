import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import LandingPage from './pages/LandingPage';
import ChatInterface from './pages/ChatInterface';
import TripSummary from './pages/TripSummary';
import AdminPanel from './pages/AdminPanel';
import AdminSettings from './pages/AdminSettings';
import BookingConfirmation from './pages/BookingConfirmation';
import BookingSuccess from './pages/BookingSuccess';
import Header from './components/Header';
import Footer from './components/Footer';
import SaraChat from './pages/SaraChat';

const saraRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sara',
  component: SaraChat,
});

const rootRoute = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: ChatInterface,
});

const summaryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/summary',
  component: TripSummary,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPanel,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/settings',
  component: AdminSettings,
});

const bookingConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/booking/confirmation',
  component: BookingConfirmation,
});

const bookingSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/booking/success',
  component: BookingSuccess,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  chatRoute,
  summaryRoute,
  saraRoute,
  adminRoute,
  adminSettingsRoute,
  bookingConfirmationRoute,
  bookingSuccessRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
