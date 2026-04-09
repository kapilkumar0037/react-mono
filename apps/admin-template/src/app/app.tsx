import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import Customers from './Customers';
import BillingSubscriptions from './BillingSubscriptions';
import InventoryManagement from './InventoryManagement';
import IntegrationsHub from './IntegrationsHub';
import Orders from './Orders';
import ReturnsRefunds from './ReturnsRefunds';
import SupportTickets from './SupportTickets';
import Users from './Users';
import Settings from './Settings';
import Reports from './Reports';
import ActivityLog from './ActivityLog';
import NotificationsCenter from './NotificationsCenter';
import SystemHealth from './SystemHealth';
import BackupRecovery from './BackupRecovery';
import ApiKeyManagement from './ApiKeyManagement';
import Login from './Login';
import ErrorBoundary from './ErrorBoundary';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import ProtectedRoute from './ProtectedRoute';
import { ToastProvider } from '@react-mono/ui-controls';
import {
  AuthSession,
  clearStoredSession,
  persistSidebarCollapsed,
  persistSession,
  persistTheme,
  readStoredSidebarCollapsed,
  readStoredSession,
  readStoredTheme,
} from './authStorage';

function ProtectedLayout({
  isDarkMode,
  onToggleDarkMode,
  userEmail,
  onLogout,
}: {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  userEmail?: string;
  onLogout: () => void;
}) {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => readStoredSidebarCollapsed());
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    persistSidebarCollapsed(sidebarCollapsed);
  }, [sidebarCollapsed]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!isMobileSidebarOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileSidebarOpen]);

  const handleSidebarToggle = () => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      setIsMobileSidebarOpen((current) => !current);
      return;
    }

    setSidebarCollapsed((current) => !current);
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <AdminSidebar
          collapsed={sidebarCollapsed}
          isDarkMode={isDarkMode}
          mobileOpen={isMobileSidebarOpen}
          onRequestClose={() => setIsMobileSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNavbar
            onToggleSidebar={handleSidebarToggle}
            isDarkMode={isDarkMode}
            onToggleDarkMode={onToggleDarkMode}
            userEmail={userEmail}
            onLogout={onLogout}
          />

          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => readStoredTheme());
  const [session, setSession] = useState<AuthSession | null>(() => readStoredSession());
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = session !== null;

  useEffect(() => {
    persistTheme(isDarkMode);
  }, [isDarkMode]);

  const handleLogin = (credentials: { email: string; password: string; rememberMe: boolean }) => {
    const nextSession: AuthSession = {
      email: credentials.email,
      loginAt: new Date().toISOString(),
    };

    persistSession(nextSession, credentials.rememberMe);
    setSession(nextSession);
  };

  const handleLogout = () => {
    clearStoredSession();
    setSession(null);
  };

  // Show loading state briefly to prevent layout flashing
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <ToastProvider>
      <Router>
        <div className={`${isDarkMode ? 'dark' : ''}`}>
          <Routes>
            {/* Login Route */}
            <Route path="/login" element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <ErrorBoundary>
                  <Login isDarkMode={isDarkMode} onLogin={handleLogin} />
                </ErrorBoundary>
              )
            } />

            {/* Protected routes with layout */}
            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
              <Route
                element={
                  <ProtectedLayout
                    isDarkMode={isDarkMode}
                    onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                    userEmail={session?.email}
                    onLogout={handleLogout}
                  />
                }
              >
                <Route path="/" element={
                  <ErrorBoundary>
                    <Dashboard isDarkMode={isDarkMode} />
                  </ErrorBoundary>
                } />
                <Route path="/users" element={
                  <ErrorBoundary>
                    <Users isDarkMode={isDarkMode} />
                  </ErrorBoundary>
                } />
                <Route path="/orders" element={
                  <ErrorBoundary>
                    <Orders isDarkMode={isDarkMode} />
                  </ErrorBoundary>
                } />
                <Route path="/inventory" element={
                  <ErrorBoundary>
                    <InventoryManagement isDarkMode={isDarkMode} />
                  </ErrorBoundary>
                } />
                <Route path="/billing-subscriptions" element={
                  <ErrorBoundary>
                    <BillingSubscriptions isDarkMode={isDarkMode} />
                  </ErrorBoundary>
                } />
                <Route path="/integrations" element={
                  <ErrorBoundary>
                    <IntegrationsHub isDarkMode={isDarkMode} />
                  </ErrorBoundary>
                } />
                <Route path="/customers" element={
                  <ErrorBoundary>
                    <Customers isDarkMode={isDarkMode} />
                  </ErrorBoundary>
                } />
                <Route path="/returns-refunds" element={
                  <ErrorBoundary>
                    <ReturnsRefunds isDarkMode={isDarkMode} />
                  </ErrorBoundary>
                } />
                <Route path="/support-tickets" element={
                  <ErrorBoundary>
                    <SupportTickets isDarkMode={isDarkMode} />
                  </ErrorBoundary>
                } />
                <Route path="/settings" element={
                  <ErrorBoundary>
                    <Settings isDarkMode={isDarkMode} />
                  </ErrorBoundary>
                } />
                <Route path="/reports" element={
                  <ErrorBoundary>
                    <Reports isDarkMode={isDarkMode} />
                  </ErrorBoundary>
                } />
                <Route path="/activity" element={
                  <ErrorBoundary>
                    <ActivityLog isDarkMode={isDarkMode} />
                  </ErrorBoundary>
                } />
                <Route path="/notifications" element={
                  <ErrorBoundary>
                    <NotificationsCenter isDarkMode={isDarkMode} />
                  </ErrorBoundary>
                } />
                <Route path="/system-health" element={
                  <ErrorBoundary>
                    <SystemHealth isDarkMode={isDarkMode} />
                  </ErrorBoundary>
                } />
                <Route path="/backup-recovery" element={
                  <ErrorBoundary>
                    <BackupRecovery isDarkMode={isDarkMode} />
                  </ErrorBoundary>
                } />
                <Route path="/api-keys" element={
                  <ErrorBoundary>
                    <ApiKeyManagement isDarkMode={isDarkMode} />
                  </ErrorBoundary>
                } />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
