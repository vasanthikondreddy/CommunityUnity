 import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EventList from './EventList';

export default function OrganizerDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name || 'Organizer'}!</h1>
        <p className="text-gray-600">Manage your events and stay organized.</p>
      </header>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create New Event
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Upload Files
        </button>
      </div>

      {/* Event List */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Events</h2>
        <EventList />
      </section>
    </div>
  );
}
