import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import QueryClientProvider
import LoadingSpinner from './components/LoadingSpinner';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './contexts/ThemeContext';

// Lazy load components
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const DashboardDetail = React.lazy(() => import('./pages/DashboardDetail'));

// Tạo QueryClient
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>

              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />

              {/* Admin Route */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/:id" element={<DashboardDetail />} />

              {/* Special Routes */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider >
    </QueryClientProvider>
  );
};

export default App;