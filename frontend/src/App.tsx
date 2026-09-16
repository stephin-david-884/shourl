import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import PublicRoute from "./presentation/routes/PublicRoute";
import AuthGateway from "./presentation/pages/auth/AuthGateway";
import { useAuth } from "./hooks/useAuth";
import UserProtectedRoute from "./presentation/routes/UserProtectedRoute";

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
        
      </Suspense>
      
    </>
  )
}

export default App
