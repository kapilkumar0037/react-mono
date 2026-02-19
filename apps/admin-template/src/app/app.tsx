import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Users from './Users';
import Settings from './Settings';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import ErrorBoundary from './ErrorBoundary';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

function AppLayout({ isDarkMode, onToggleDarkMode, isLoggedIn }: { isDarkMode: boolean; onToggleDarkMode: () => void; isLoggedIn: boolean }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

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
            <Routes>
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <ErrorBoundary>
              <Login isDarkMode={isDarkMode} onLogin={handleLogin} />
            </ErrorBoundary>
          )
        } />
        <Route path="*" element={
          <AppLayout 
            isDarkMode={isDarkMode} 
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            isLoggedIn={isLoggedIn}
          />
        } />
      </Routes>
    </Router>
  );
}

export default App;
