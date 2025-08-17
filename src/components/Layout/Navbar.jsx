import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-xl">CommunityUnity</Link>
      <div className="space-x-4">
        <Link to="/events">Events</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
    </nav>
  );
}
