import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-150px)] w-screen bg-gray-50 flex flex-col justify-center items-center">
  <div className="w-full text-center">
    <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to CommunityUnity</h1>
    <p className="text-lg text-gray-600 mb-8">
      Empowering volunteers and organizers to build stronger communities together.
    </p>
    <div className="flex justify-center gap-6">
      <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
        Login
      </Link>
      <Link to="/signup" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition">
        Sign Up
      </Link>
    </div>
  </div>
</main>

      <Footer />
    </>
  );
}
