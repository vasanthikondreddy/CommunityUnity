import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE}/events`);
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleSignup = async () => {
  try {
    await axios.post(`/api/events/${event._id}/signups`, {
      userId: currentUser._id,
    });
    toast.success('You’ve joined this event!');
  } catch (err) {
    toast.error('Signup failed');
  }
};

<button onClick={handleSignup} className="btn btn-primary">
  Join Event
</button>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📅 Upcoming Events</h1>
        <Link
          to="/create-event"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          ➕ Create Event
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading events...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && events.length === 0 && (
        <p className="text-gray-600">No events found.</p>
      )}

      <div className="space-y-4">
        {events.map(event => (
          <div
            key={event._id}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-indigo-600">{event.title}</h2>
            <p className="text-gray-700">{event.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Date: {new Date(event.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
