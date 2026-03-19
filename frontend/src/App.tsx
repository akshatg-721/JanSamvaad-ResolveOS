import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import GISMap    from './pages/GISMap';
import Ledger    from './pages/Ledger';
import Activity  from './pages/Activity';
import Analytics from './pages/Analytics';
import Reports   from './pages/Reports';
import Settings  from './pages/Settings';
import QRPage    from './pages/QRPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ledger"    element={<Ledger />} />
        <Route path="/gis"       element={<GISMap />} />
        <Route path="/activity"  element={<Activity />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports"   element={<Reports />} />
        <Route path="/settings"  element={<Settings />} />
        <Route path="/qr"        element={<QRPage />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
