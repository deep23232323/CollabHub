import React from 'react';
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './components/LoginPage';
import { OnboardingWizard } from './components/OnboardingWizard';
import { DashboardContent } from './components/DashboardContent';
import { InstagramCallbackPage } from './components/InstagramCallbackPage';
import { CreatorCollabFeed } from './components/CreatorCollabFeed';
import { BrandPortal } from './components/BrandPortal';
import { useDispatch, useSelector } from 'react-redux';
import { setError, setLoading, setUserInfo } from './store/slices/userSlice';

export default function App() {
   const dispatch = useDispatch();



  useEffect(() => {
    const fetchCurrentUser = async () => {
      dispatch(setLoading(true));

      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch user");
        }

        if (data.success && data.user) {
          dispatch(setUserInfo(data.user));
        }
      } catch (error: any) {
        console.error("Failed to fetch current user:", error);

        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Instagram OAuth Callback Route */}
          <Route path="/instagram-callback" element={<InstagramCallbackPage />} />

          {/* Protected Onboarding Route */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute requireOnboarding={false}>
                <OnboardingWizard />
              </ProtectedRoute>
            }
          />
          

          {/* Protected Main Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <DashboardContent />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
