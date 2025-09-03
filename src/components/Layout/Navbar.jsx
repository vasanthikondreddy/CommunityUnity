import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center relative">
      <Link to="/" className="font-bold text-xl">CommunityUnity</Link>

      
      <div className="hidden md:flex space-x-4 items-center">
        <Link to="/events">Events</Link>

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}

        {user?.role === 'organizer' && (
          <>
            <Link to="/create-event">Create Event</Link>
            <Link to="/dashboard/organizer">Organizer Dashboard</Link>
          </>
        )}

        {user?.role === 'user' && (
          <Link to="/dashboard/user">My Events</Link>
        )}

       
        {user && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-2 bg-white text-blue-600 px-3 py-1 rounded-full font-semibold"
            >
              <img
                src={user.avatarUrl || 'https://i.pravatar.cc/150?u=default'}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <span>{user.name}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white text-blue-600 rounded shadow-lg py-2 w-40 z-10">
                <Link to="/profile" className="block px-4 py-2 hover:bg-blue-100">Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-blue-100">
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      
      <div className="md:hidden">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white text-2xl">
          ☰
        </button>

        {mobileOpen && (
          <div className="absolute top-16 right-4 bg-white text-blue-600 rounded shadow-lg py-2 w-48 z-10">
            <Link to="/events" className="block px-4 py-2 hover:bg-blue-100">Events</Link>

            {!user && (
              <>
                <Link to="/login" className="block px-4 py-2 hover:bg-blue-100">Login</Link>
                <Link to="/signup" className="block px-4 py-2 hover:bg-blue-100">Signup</Link>
              </>
            )}

            {user?.role === 'organizer' && (
              <>
                <Link to="/create-event" className="block px-4 py-2 hover:bg-blue-100">Create Event</Link>
                <Link to="/dashboard/organizer" className="block px-4 py-2 hover:bg-blue-100">Organizer Dashboard</Link>
              </>
            )}

            {user?.role === 'user' && (
              <Link to="/dashboard/user" className="block px-4 py-2 hover:bg-blue-100">My Events</Link>
            )}

          
            {user && (
              <>
                <Link to="/profile" className="block px-4 py-2 hover:bg-blue-100">Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-blue-100">
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
