import { Routes, Route, Navigate, Link, NavLink, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Button } from "./components/ui/button";
import {
  Activity,
  Building2,
  ClipboardList,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Siren,
  UsersRound,
  ChartNoAxesCombined,
} from "lucide-react";
import { LandingPage } from "./pages/LandingPage";

const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("./pages/RegisterPage").then((module) => ({ default: module.RegisterPage })),
);
const AdminDashboard = lazy(() =>
  import("./components/AdminDashboard").then((module) => ({ default: module.AdminDashboard })),
);
const EmergencyReportForm = lazy(() =>
  import("./components/EmergencyReportForm").then((module) => ({
    default: module.EmergencyReportForm,
  })),
);
const MyReports = lazy(() =>
  import("./components/MyReports").then((module) => ({ default: module.MyReports })),
);
const HospitalManagement = lazy(() =>
  import("./components/HospitalManagement").then((module) => ({
    default: module.HospitalManagement,
  })),
);
const VolunteerTaskManagement = lazy(() =>
  import("./components/VolunteerTaskManagement").then((module) => ({
    default: module.VolunteerTaskManagement,
  })),
);
const RescueMissionManagement = lazy(() =>
  import("./components/RescueMissionManagement").then((module) => ({
    default: module.RescueMissionManagement,
  })),
);
const AIPage = lazy(() => import("./routes/ai").then((module) => ({ default: module.AIPage })));
const pageFallback = (
  <div className="page-skeleton" role="status" aria-label="Loading page">
    <span />
  </div>
);

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!localStorage.getItem("token")) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RoleProtectedRoute({ children, roles }: { children: React.ReactNode; roles: string[] }) {
  const role = localStorage.getItem("userRole");
  if (!role || !roles.includes(role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

// Layout Component
function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userRole = localStorage.getItem("userRole");
  const roleLabel = (userRole || "CITIZEN").replaceAll("_", " ");
  const links = [
    {
      to: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      roles: ["ADMIN", "DISPATCHER", "RESCUE_TEAM", "HOSPITAL", "VOLUNTEER", "NGO", "CITIZEN"],
    },
    {
      to: "/report-emergency",
      label: "Report emergency",
      icon: Siren,
      roles: ["CITIZEN", "VOLUNTEER", "RESCUE_TEAM", "HOSPITAL", "DISPATCHER", "ADMIN"],
    },
    {
      to: "/my-reports",
      label: "My reports",
      icon: ClipboardList,
      roles: ["CITIZEN", "VOLUNTEER", "RESCUE_TEAM", "HOSPITAL", "DISPATCHER", "ADMIN"],
    },
    {
      to: "/hospitals",
      label: "Hospitals & fleet",
      icon: Building2,
      roles: ["ADMIN", "DISPATCHER", "HOSPITAL", "RESCUE_TEAM", "CITIZEN"],
    },
    {
      to: "/rescue-missions",
      label: "Response offers",
      icon: Activity,
      roles: ["ADMIN", "DISPATCHER", "RESCUE_TEAM", "HOSPITAL"],
    },
    {
      to: "/volunteer-tasks",
      label: "Volunteer tasks",
      icon: UsersRound,
      roles: ["ADMIN", "NGO", "VOLUNTEER"],
    },
    { to: "/ai-metrics", label: "Analytics", icon: ChartNoAxesCombined, roles: ["ADMIN"] },
  ].filter((item) => item.roles.includes(userRole || "CITIZEN"));

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("hospitalId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="workspace-shell">
      <a className="skip-link" href="#workspace-main">
        Skip to content
      </a>
      <header className="workspace-header">
        <Link to="/dashboard" className="brand-lockup" aria-label="SentinelOS workspace">
          <span className="brand-mark">
            <Siren aria-hidden="true" />
          </span>
          <span>
            Sentinel<span className="brand-light">OS</span>
          </span>
        </Link>
        <div className="workspace-header-right">
          <span className="role-pill">
            <span className="role-live-dot" />
            {roleLabel}
          </span>
          <Button onClick={handleLogout} variant="outline" className="logout-button">
            <LogOut size={16} aria-hidden="true" />
            <span>Sign out</span>
          </Button>
        </div>
      </header>
      <div className="workspace-frame">
        <aside className="workspace-sidebar">
          <div className="sidebar-caption">WORKSPACE</div>
          <nav aria-label="Workspace navigation" className="workspace-nav">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/dashboard"}
                className={({ isActive }) => `workspace-nav-link${isActive ? " is-active" : ""}`}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-foot">
            <HeartHandshake size={17} aria-hidden="true" />
            <span>Shared response. Clear handoffs.</span>
          </div>
        </aside>
        <main id="workspace-main" className="workspace-main">
          <div className="workspace-content">
            <Suspense fallback={pageFallback}>{children}</Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  useEffect(() => {
    const privatePaths = [
      "/dashboard",
      "/report-emergency",
      "/my-reports",
      "/hospitals",
      "/rescue-missions",
      "/volunteer-tasks",
      "/ai-metrics",
    ];
    const pageTitles: Record<string, string> = {
      "/": "SentinelOS | Emergency Response Coordination",
      "/login": "Sign in | SentinelOS",
      "/register": "Create an account | SentinelOS",
      "/dashboard": "Workspace | SentinelOS",
      "/report-emergency": "Report an emergency | SentinelOS",
      "/my-reports": "My reports | SentinelOS",
      "/hospitals": "Hospitals & fleet | SentinelOS",
      "/rescue-missions": "Response offers | SentinelOS",
      "/volunteer-tasks": "Volunteer tasks | SentinelOS",
      "/ai-metrics": "Analytics | SentinelOS",
    };
    document.title =
      pageTitles[location.pathname] || "SentinelOS | Emergency Response Coordination";
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.append(robots);
    }
    robots.content =
      privatePaths.includes(location.pathname) ||
      ["/login", "/register"].includes(location.pathname)
        ? "noindex, nofollow"
        : "index, follow";
  }, [location.pathname]);
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <Suspense fallback={pageFallback}>
            <LoginPage />
          </Suspense>
        }
      />
      <Route
        path="/register"
        element={
          <Suspense fallback={pageFallback}>
            <RegisterPage />
          </Suspense>
        }
      />

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
        path="/my-reports"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MyReports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospitals"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <RoleProtectedRoute
                roles={["ADMIN", "DISPATCHER", "HOSPITAL", "RESCUE_TEAM", "CITIZEN"]}
              >
                <HospitalManagement />
              </RoleProtectedRoute>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/volunteer-tasks"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <RoleProtectedRoute roles={["ADMIN", "NGO", "VOLUNTEER"]}>
                <VolunteerTaskManagement />
              </RoleProtectedRoute>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rescue-missions"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <RoleProtectedRoute roles={["ADMIN", "DISPATCHER", "RESCUE_TEAM", "HOSPITAL"]}>
                <RescueMissionManagement />
              </RoleProtectedRoute>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-metrics"
        element={
          <ProtectedRoute>
            <RoleProtectedRoute roles={["ADMIN"]}>
              <AIPage />
            </RoleProtectedRoute>
          </ProtectedRoute>
        }
      />

      {/* Root and Fallback */}
      <Route
        path="*"
        element={<Navigate to={localStorage.getItem("token") ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}
