import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import PublicRoute from "./presentation/routes/PublicRoute";
import AuthGateway from "./presentation/pages/auth/AuthGateway";
import { useAuth } from "./hooks/useAuth";
import UserProtectedRoute from "./presentation/routes/UserProtectedRoute";
const Home = lazy(() => import('./presentation/pages/home/Home'));
const Dashboard = lazy(() => import('./presentation/pages/dashboard/Dashboard'));
const PageNotFound = lazy(() => import('./presentation/pages/common/PageNotFound'));

const App = () => {

  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  return (
    <>
      <Toaster position="top-right" />
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register"
            element={
              <PublicRoute>
                <AuthGateway mode="signup" />
              </PublicRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthGateway mode="login" />
              </PublicRoute>
            }
          />

          <Route element={<UserProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>

      </Suspense>

    </>
  )
}

export default App
