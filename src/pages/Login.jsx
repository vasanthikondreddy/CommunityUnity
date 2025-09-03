import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [redirectMessage, setRedirectMessage] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (shouldRedirect) {
      const timer = setTimeout(() => {
        navigate('/signup', {
          state: { message: 'Please create an account to continue.' },
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      await handleLogin({ email, password });
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      if (err.message.includes('User not found')) {
        toast.error('No account found. Redirecting to signup...');
        setRedirectMessage('No account found. Redirecting to signup...');
        setShouldRedirect(true);
      } else {
        toast.error(err.message || 'Login failed');
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded transition-all"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Login to CommunityUnity
      </h2>

      {location.state?.message && (
        <p className="text-green-600 text-sm mb-2 text-center">
          {location.state.message}
        </p>
      )}
      {error && (
        <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
      )}
      {redirectMessage && (
        <p className="text-yellow-600 text-sm mb-4 text-center">
          {redirectMessage}
        </p>
      )}

      <input
        name="email"
        type="email"
        aria-label="Email address"
        placeholder="Email"
        required
        className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <input
        name="password"
        type="password"
        aria-label="Password"
        placeholder="Password"
        required
        className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don’t have an account?{' '}
        <Link to="/signup" className="text-blue-600 hover:underline font-medium">
          Sign up here
        </Link>
      </p>

      <p className="mt-2 text-center text-sm text-gray-600">
        Just browsing?{' '}
        <Link to="/" className="text-purple-600 hover:underline font-medium">
          Go to Home
        </Link>
      </p>

      <p className="mt-2 text-center text-sm text-gray-600">
        Want to create an event directly?{' '}
        <Link to="/create-event" className="text-blue-600 hover:underline font-medium">
          Go to Event Creation
        </Link>
      </p>
    </form>
  );
}
