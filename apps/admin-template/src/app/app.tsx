
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import ErrorBoundary from './ErrorBoundary';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" index element={
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        } />
        {/* Future routes can be added here */}
      </Routes>
    </Router>
  );
}

export default App;
