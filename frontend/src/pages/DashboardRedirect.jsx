import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function DashboardRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin-dashboard" />;
  if (user.role === 'organizer') return <Navigate to="/organizer-dashboard" />;
  return <Navigate to="/member-dashboard" />;
}
