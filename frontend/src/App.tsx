import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import QRPage from "@/pages/QRPage";
import ResolveFeedbackPage from "@/pages/ResolveFeedback";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:section" element={<Dashboard />} />

        <Route path="/gis" element={<Navigate to="/dashboard/gis" replace />} />
        <Route path="/ledger" element={<Navigate to="/dashboard/ledger" replace />} />
        <Route path="/activity" element={<Navigate to="/dashboard/activity" replace />} />
        <Route path="/analytics" element={<Navigate to="/dashboard/analytics" replace />} />
        <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
        <Route path="/reports" element={<Navigate to="/dashboard/analytics" replace />} />

        <Route path="/resolve/:id" element={<ResolveFeedbackPage />} />
        <Route path="/qr" element={<QRPage />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
