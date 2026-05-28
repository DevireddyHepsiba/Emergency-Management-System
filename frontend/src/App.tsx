import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { EmergencyReportForm } from "./components/EmergencyReportForm";
import { HospitalManagement } from "./components/HospitalManagement";
import { VolunteerTaskManagement } from "./components/VolunteerTaskManagement";
import { RescueMissionManagement } from "./components/RescueMissionManagement";
import { Button } from "./components/ui/button";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("userRole");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Layout Component
function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-red-600">🚑 Sentinelos</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {userRole}
            </span>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </nav>
      </header>

      {/* Sidebar Navigation */}
      <div className="flex">
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <nav className="p-4 space-y-2">
            <NavLink href="/dashboard" label="📊 Dashboard" />
            <NavLink href="/report-emergency" label="🆘 Report Emergency" />
            <NavLink href="/hospitals" label="🏥 Hospitals" />
            <NavLink href="/volunteer-tasks" label="👥 Volunteer Tasks" />
            <NavLink href="/rescue-missions" label="🚑 Rescue Missions" />
            <hr className="my-2" />
            <NavLink href="/ai-metrics" label="🤖 AI Metrics" />
            <NavLink href="/settings" label="⚙️ Settings" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
    >
      {label}
    </a>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/report-emergency"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <div className="flex justify-center">
                  <EmergencyReportForm />
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospitals"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <HospitalManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer-tasks"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <VolunteerTaskManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rescue-missions"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <RescueMissionManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Root and Fallback */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
