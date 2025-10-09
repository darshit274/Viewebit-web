import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { store } from './store';
import { useAppDispatch, useAppSelector } from './store';
import { restoreSession } from './store/slices/authSlice';

// Layout Components
import AuthLayout from './components/layout/AuthLayout';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyOTPPage from './pages/auth/VerifyOTPPage';

// Main Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import TestsPage from './pages/tests/TestsPage';
import TestSeriesPage from './pages/tests/TestSeriesPage';
import TestSeriesDetailPage from './pages/tests/TestSeriesDetailPage';
import CategoryDetailPage from './pages/tests/CategoryDetailPage';
import TakeTestPage from './pages/tests/TakeTestPage';
import TestResultsPage from './pages/tests/TestResultsPage';
import TestSolutionsPage from './pages/tests/TestSolutionsPage';
import SolutionsPage from './pages/tests/SolutionsPage';
import TestLeaderboardPage from './pages/tests/TestLeaderboardPage';
import PDFsPage from './pages/pdfs/PDFsPage';
import PDFViewerPage from './pages/pdfs/PDFViewerPage';
import FreeTestsPage from './pages/tests/FreeTestsPage';
import FreeInPaidTestsPage from './pages/tests/FreeInPaidTestsPage';
import TestHistoryPage from './pages/tests/TestHistoryPage';
import TestHistoryDetailPage from './pages/tests/TestHistoryDetailPage';
import TestAttemptsPage from './pages/tests/TestAttemptsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import ProfileEditPage from './pages/profile/ProfileEditPage';
import PerformancePage from './pages/profile/PerformancePage';

// Payment Pages
import PaymentPage from './pages/PaymentPage';

// Error Pages
import NotFoundPage from './pages/errors/NotFoundPage';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 3;
      },
    },
  },
});

// App Content Component (inside Redux Provider)
function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Restore user session from localStorage on app load
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/forgot-password" 
              element={!isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/dashboard" replace />} 
            />
            <Route
              path="/reset-password"
              element={!isAuthenticated ? <ResetPasswordPage /> : <Navigate to="/dashboard" replace />}
            />
            <Route
              path="/verify-otp"
              element={!isAuthenticated ? <VerifyOTPPage /> : <Navigate to="/dashboard" replace />}
            />
          </Route>

          {/* Protected Main Routes */}
          <Route 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Test Routes */}
            <Route path="/tests" element={<TestsPage />} />
            <Route path="/tests/series/:uuid" element={<TestSeriesDetailPage />} />
            <Route path="/tests/category/:uuid" element={<CategoryDetailPage />} />
            <Route path="/tests/quiz/:uuid" element={<TakeTestPage />} />
            <Route path="/tests/solutions/:uuid" element={<SolutionsPage />} />
            <Route path="/tests/leaderboard/:uuid" element={<TestLeaderboardPage />} />
            <Route path="/tests/series/:id" element={<TestSeriesPage />} />
            <Route path="/tests/take/:id" element={<TakeTestPage />} />
            <Route path="/tests/results/:id" element={<TestResultsPage />} />
            <Route path="/tests/solutions/:id" element={<TestSolutionsPage />} />
            
            {/* Free Test Routes */}
            <Route path="/free-tests" element={<FreeTestsPage />} />
            <Route path="/free-tests/take/:id" element={<TakeTestPage />} />

            {/* Free in Paid Series Routes */}
            <Route path="/free-in-paid-tests" element={<FreeInPaidTestsPage />} />

            {/* Test History Routes */}
            <Route path="/test-history" element={<TestHistoryPage />} />
            <Route path="/test-history/test/:testId/attempts" element={<TestAttemptsPage />} />
            <Route path="/test-history/:sessionId" element={<TestHistoryDetailPage />} />
            <Route path="/test-history/:sessionId/solutions" element={<TestSolutionsPage />} />

            {/* PDF Routes */}
            <Route path="/pdfs" element={<PDFsPage />} />
            <Route path="/pdfs/view/:id" element={<PDFViewerPage />} />
            <Route path="/pdfs/:id" element={<PDFViewerPage />} />
            
            {/* Profile Routes */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/profile/performance" element={<PerformancePage />} />
            
            {/* Payment Routes */}
            <Route path="/payment" element={<PaymentPage />} />
            
            {/* Other Routes - Leaderboard removed from sidebar, now only accessible after tests */}
          </Route>

          {/* Error Routes */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>

        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#22c55e',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </Router>
    </QueryClientProvider>
  );
}

// Main App Component
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;