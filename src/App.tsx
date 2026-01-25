import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Login from "./pages/Login";
import ParentDashboard from "./pages/ParentDashboard";
import ChildDashboard from "./pages/ChildDashboard";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import Pass from "./pages/Pass";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'parent' | 'child' }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect to onboarding if not completed
  if (profile && !profile.onboarding_complete) {
    return <Navigate to="/onboarding" replace />;
  }

  if (allowedRole && profile?.role !== allowedRole) {
    return <Navigate to={profile?.role === 'parent' ? '/parent' : '/child'} replace />;
  }

  return <>{children}</>;
}

function AuthRedirect() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user && profile) {
    // Redirect to onboarding if not completed
    if (!profile.onboarding_complete) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to={profile.role === 'parent' ? '/parent' : '/child'} replace />;
  }

  return <Login />;
}

function OnboardingRoute() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/" replace />;
  }

  if (profile.onboarding_complete) {
    return <Navigate to={profile.role === 'parent' ? '/parent' : '/child'} replace />;
  }

  return <Onboarding />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthRedirect />} />
      <Route path="/onboarding" element={<OnboardingRoute />} />
      <Route 
        path="/parent" 
        element={
          <ProtectedRoute allowedRole="parent">
            <ParentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/child" 
        element={
          <ProtectedRoute allowedRole="child">
            <ChildDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/pass" 
        element={
          <ProtectedRoute allowedRole="child">
            <Pass />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
