import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" />;

  const logout = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user.name || user.email}!</h1>
        <p className="text-gray-600 mb-6">Role: {user.role}</p>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
      </div>
    </div>
  );
}
