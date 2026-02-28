import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RoleSelector } from "@/components/RoleSelector";
import Index from "./pages/Index";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return <div className="flex min-h-[80vh] items-center justify-center text-muted-foreground">Loading...</div>;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (!role) {
    return <RoleSelector />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={role === "doctor" ? "/doctor" : "/admin"} replace />}
      />
      <Route
        path="/doctor"
        element={role === "doctor" ? <DoctorDashboard /> : <Navigate to="/admin" replace />}
      />
      <Route
        path="/admin"
        element={role === "admin" ? <AdminDashboard /> : <Navigate to="/doctor" replace />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="flex min-h-screen flex-col">
            <BrowserRouter>
              <Header />
              <main className="flex-1">
                <AppRoutes />
              </main>
              <Footer />
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
