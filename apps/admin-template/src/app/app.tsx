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
import AccessControl from './AccessControl';
import CommandPalette from './CommandPalette';
import Login from './Login';
import ErrorBoundary from './ErrorBoundary';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import ProtectedRoute from './ProtectedRoute';
import PermissionGuard from './PermissionGuard';
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
import { AppPermission, AppRole, DEFAULT_ROLE_DEFINITIONS } from './rbac';
import { GlobalToastProvider } from './providers/GlobalToastProvider';
import { GlobalToastContainer } from './components/GlobalToastContainer';

function ProtectedLayout({
  isDarkMode,
  onToggleDarkMode,
  userEmail,
  currentRole,
  onLogout,
}: {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  userEmail?: string;
  currentRole: AppRole;
  onLogout: () => void;
}) {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => readStoredSidebarCollapsed());
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    persistSidebarCollapsed(sidebarCollapsed);
  }, [sidebarCollapsed]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
    setIsCommandPaletteOpen(false);
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

  useEffect(() => {
    const handleCommandShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleCommandShortcut);
    return () => window.removeEventListener('keydown', handleCommandShortcut);
  }, []);

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
          currentRole={currentRole}
          definitions={DEFAULT_ROLE_DEFINITIONS}
          mobileOpen={isMobileSidebarOpen}
          onRequestClose={() => setIsMobileSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNavbar
            onToggleSidebar={handleSidebarToggle}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={onToggleDarkMode}
            userEmail={userEmail}
            currentRole={currentRole}
            onLogout={onLogout}
          />

          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        isDarkMode={isDarkMode}
        currentRole={currentRole}
        definitions={DEFAULT_ROLE_DEFINITIONS}
        onClose={() => setIsCommandPaletteOpen(false)}
        onToggleDarkMode={onToggleDarkMode}
        onLogout={onLogout}
      />
      <GlobalToastContainer isDarkMode={isDarkMode} position="bottom-right" />
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

  const handleLogin = (credentials: { email: string; password: string; rememberMe: boolean; role: AppRole }) => {
    const nextSession: AuthSession = {
      email: credentials.email,
      loginAt: new Date().toISOString(),
      role: credentials.role,
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

  const currentRole = session?.role ?? 'Owner';

  const renderProtectedPage = (
    permission: AppPermission,
    element: React.ReactNode
  ) => (
    <PermissionGuard
      currentRole={currentRole}
      permission={permission}
      definitions={DEFAULT_ROLE_DEFINITIONS}
      isDarkMode={isDarkMode}
    >
      <ErrorBoundary>{element}</ErrorBoundary>
    </PermissionGuard>
  );

  return (
    <ToastProvider>
      <GlobalToastProvider>
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
                    currentRole={currentRole}
                    onLogout={handleLogout}
                  />
                }
              >
                <Route path="/" element={
                  renderProtectedPage('dashboard.view', <Dashboard isDarkMode={isDarkMode} />)
                } />
                <Route path="/users" element={
                  renderProtectedPage(
                    'users.view',
                    <Users
                      isDarkMode={isDarkMode}
                      currentRole={currentRole}
                      currentUserEmail={session?.email}
                      definitions={DEFAULT_ROLE_DEFINITIONS}
                    />
                  )
                } />
                <Route path="/orders" element={
                  renderProtectedPage('orders.view', <Orders isDarkMode={isDarkMode} />)
                } />
                <Route path="/inventory" element={
                  renderProtectedPage('inventory.view', <InventoryManagement isDarkMode={isDarkMode} />)
                } />
                <Route path="/billing-subscriptions" element={
                  renderProtectedPage('billing.view', <BillingSubscriptions isDarkMode={isDarkMode} />)
                } />
                <Route path="/integrations" element={
                  renderProtectedPage('integrations.view', <IntegrationsHub isDarkMode={isDarkMode} />)
                } />
                <Route path="/customers" element={
                  renderProtectedPage('customers.view', <Customers isDarkMode={isDarkMode} />)
                } />
                <Route path="/returns-refunds" element={
                  renderProtectedPage('returns.view', <ReturnsRefunds isDarkMode={isDarkMode} />)
                } />
                <Route path="/support-tickets" element={
                  renderProtectedPage('support.view', <SupportTickets isDarkMode={isDarkMode} />)
                } />
                <Route path="/settings" element={
                  renderProtectedPage('settings.view', <Settings isDarkMode={isDarkMode} />)
                } />
                <Route path="/reports" element={
                  renderProtectedPage('reports.view', <Reports isDarkMode={isDarkMode} />)
                } />
                <Route path="/activity" element={
                  renderProtectedPage('activity.view', <ActivityLog isDarkMode={isDarkMode} />)
                } />
                <Route path="/notifications" element={
                  renderProtectedPage('notifications.view', <NotificationsCenter isDarkMode={isDarkMode} />)
                } />
                <Route path="/system-health" element={
                  renderProtectedPage('system.view', <SystemHealth isDarkMode={isDarkMode} />)
                } />
                <Route path="/backup-recovery" element={
                  renderProtectedPage('backup.manage', <BackupRecovery isDarkMode={isDarkMode} />)
                } />
                <Route path="/api-keys" element={
                  renderProtectedPage('apiKeys.manage', <ApiKeyManagement isDarkMode={isDarkMode} />)
                } />
                <Route path="/access-control" element={
                  renderProtectedPage(
                    'rbac.manage',
                    <AccessControl
                      isDarkMode={isDarkMode}
                      currentRole={currentRole}
                      currentUserEmail={session?.email}
                    />
                  )
                } />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
          </Routes>
        </div>
      </Router>
      </GlobalToastProvider>
    </ToastProvider>
  );
}

export default App;
