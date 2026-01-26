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
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Challenges from "./pages/Challenges";
import Friends from "./pages/Friends";
import Stats from "./pages/Stats";
import AddChild from "./pages/AddChild";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import HelpSupport from "./pages/HelpSupport";
import Downtime from "./pages/parent/Downtime";
import AppLimits from "./pages/parent/AppLimits";
import AlwaysAllowed from "./pages/parent/AlwaysAllowed";
import ScreenTimeControl from "./pages/parent/ScreenTimeControl";

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
        path="/parent/add-child" 
        element={
          <ProtectedRoute allowedRole="parent">
            <AddChild />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/parent/downtime" 
        element={
          <ProtectedRoute allowedRole="parent">
            <Downtime />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/parent/app-limits" 
        element={
          <ProtectedRoute allowedRole="parent">
            <AppLimits />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/parent/always-allowed" 
        element={
          <ProtectedRoute allowedRole="parent">
            <AlwaysAllowed />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/parent/screen-time/:childId" 
        element={
          <ProtectedRoute allowedRole="parent">
            <ScreenTimeControl />
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
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute allowedRole="child">
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/challenges" 
        element={
          <ProtectedRoute allowedRole="child">
            <Challenges />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/friends" 
        element={
          <ProtectedRoute allowedRole="child">
            <Friends />
          </ProtectedRoute>
        } 
      />
        <Route 
          path="/stats" 
          element={
            <ProtectedRoute allowedRole="child">
              <Stats />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/privacy-policy" 
          element={
            <ProtectedRoute>
              <PrivacyPolicy />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/help-support" 
          element={
            <ProtectedRoute>
              <HelpSupport />
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
