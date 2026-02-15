import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Users from './Users';
import ErrorBoundary from './ErrorBoundary';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            } />
            <Route path="/users" element={
              <ErrorBoundary>
                <Users />
              </ErrorBoundary>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
