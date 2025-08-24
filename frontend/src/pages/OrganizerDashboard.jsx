import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('/api/events/organizer')
      .then(res => setEvents(res.data))
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await axios.delete(`/api/events/${eventId}`);
      setEvents(prev => prev.filter(event => event._id !== eventId));
      alert('Event deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete event');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Your Events</h1>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid gap-4">
          {events.map(event => (
            <div key={event._id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-gray-600">{event.description}</p>
              <div className="mt-4 flex gap-2">
                <Link
                  to={`/event/${event._id}/edit`}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  ✏️ Edit
                </Link>
                <Link
                  to={`/event/${event._id}/participants`}
                  className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                >
                  👥 Participants
                </Link>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
