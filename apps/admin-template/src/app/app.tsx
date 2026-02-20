import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './Dashboard';
import Users from './Users';
import Settings from './Settings';
import Login from './Login';
import ErrorBoundary from './ErrorBoundary';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

function ProtectedLayout({ isDarkMode, onToggleDarkMode }: { isDarkMode: boolean; onToggleDarkMode: () => void }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <AdminSidebar isDarkMode={isDarkMode} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNavbar
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={onToggleDarkMode}
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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('isLoggedIn');
    return saved ? JSON.parse(saved) : false;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Persist login state
  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
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
    <Router>
      <div className={`${isDarkMode ? 'dark' : ''}`}>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <ErrorBoundary>
                <Login isDarkMode={isDarkMode} onLogin={handleLogin} />
              </ErrorBoundary>
            )
          } />

          {/* Protected routes with layout */}
          {isLoggedIn && (
            <Route
              element={
                <ProtectedLayout isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
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
              <Route path="/settings" element={
                <ErrorBoundary>
                  <Settings isDarkMode={isDarkMode} />
                </ErrorBoundary>
              } />
            </Route>
          )}

          {/* Fallback */}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
