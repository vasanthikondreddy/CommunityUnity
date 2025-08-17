import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [redirectMessage, setRedirectMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await handleLogin({ email, password });
      navigate('/dashboard');
    } catch (err) {
      if (err.message.includes('User not found')) {
        setRedirectMessage('No account found. Redirecting to signup...');
        setTimeout(() => {
          navigate('/signup', { state: { message: 'Please create an account to continue.' } });
        }, 2000); // 2-second delay to show message
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Login to CommunityUnity</h2>
      {location.state?.message && <p className="text-green-600 text-sm mb-2 text-center">{location.state.message}</p>}
      {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
      {redirectMessage && <p className="text-yellow-600 text-sm mb-4 text-center">{redirectMessage}</p>}

      <input name="email" type="email" placeholder="Email" required className="w-full mb-3 p-2 border rounded" />
      <input name="password" type="password" placeholder="Password" required className="w-full mb-4 p-2 border rounded" />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Login
      </button>
    </form>
  );
}
