import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { message: 'Please log in to access your dashboard.' } });
    }
  }, [user, navigate]);

  if (!user) return null; 

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Welcome, {user.name || user.email}!</h2>

      <div className="space-y-2 text-gray-700">
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
        {user.location && <p><strong>Location:</strong> {user.location}</p>}
        {user.availability && <p><strong>Availability:</strong> {user.availability}</p>}
        {user.interests?.length > 0 && (
          <p><strong>Interests:</strong> {user.interests.join(', ')}</p>
        )}
      </div>
      <Link to="/my-events" className="text-blue-600 hover:underline font-medium">
  View My Events
</Link>
         <p className="mt-2 text-center text-sm text-gray-600">
        Just browsing?{' '}
        <Link to="/" className="text-purple-600 hover:underline font-medium">
          Go to Home
        </Link>
      </p>

    </div>
  );
}
