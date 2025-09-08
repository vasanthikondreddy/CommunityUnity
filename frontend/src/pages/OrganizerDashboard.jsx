import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrganizerDashboard = ({ user }) => {
  const navigate = useNavigate();

  // TEMP: Replace this with actual event ID from your backend
  const selectedEventId = '64f9c2e1a1b2d3f4e5g6h7'; // Example MongoDB ID

  const handleNavigation = (path) => {
    navigate(path);
    toast.info(`Navigated to ${path}`, { autoClose: 2000 });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-right" />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🎯 Welcome, {user?.name || 'Organizer'}!
        </h1>
        <p className="text-gray-600 mb-6">
          Manage your announcements, events, and community updates from here.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => handleNavigation('/announcements')}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg shadow-md transition"
          >
            📢 Manage Announcements
          </button>

          <button
            onClick={() => handleNavigation('/events')}
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg shadow-md transition"
          >
            📅 Manage Events
          </button>

          <button
            onClick={() => handleNavigation('/volunteers')}
            className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg shadow-md transition"
          >
            🙋‍♀️ View Volunteers
          </button>

          <button
            onClick={() => handleNavigation(`/manage-event/${selectedEventId}`)}
            className="bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg shadow-md transition"
          >
            🚚 Live Logistics Board
          </button>

          <button
            onClick={() => handleNavigation('/reports')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg shadow-md transition"
          >
            📊 View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
