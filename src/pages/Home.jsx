import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Optional: Redirect logged-in users to dashboard
  if (user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="p-8 text-center bg-gray-50 min-h-[80vh] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to CommunityUnity</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-xl">
          Empowering volunteers and organizers to build stronger communities together.
        </p>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-200 text-white px-6 py-2 rounded hover:bg-blue-500 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
