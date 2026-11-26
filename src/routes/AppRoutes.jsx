import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Account } from '../pages/account/Account';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { Transfer } from '../pages/transaction/Transfer';
import { Activity } from '../pages/transaction/Activity';
import { UrlCheck } from '../pages/security/UrlCheck';
import { DeviceApproval } from '../pages/auth/DeviceApproval';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRoutes() {
  const { credentials } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={credentials ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={credentials ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/device-approval" element={<DeviceApproval />} />
      <Route path="/security/url-check" element={<UrlCheck />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/account/:accountId" element={<ProtectedRoute><Account /></ProtectedRoute>} />
      <Route path="/transfer" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
      <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
