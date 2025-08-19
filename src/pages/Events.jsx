import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function MyEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/user/${user._id}`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    if (user?._id) fetchEvents();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">My Events</h2>
      {events.length === 0 ? (
        <p className="text-center text-gray-600">You haven’t joined or created any events yet.</p>
      ) : (
        <ul className="space-y-4">
          {events.map(event => (
            <li key={event._id} className="border p-4 rounded shadow-sm">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-700">{event.description}</p>
              <p className="text-sm text-gray-500">📍 {event.location} | 📅 {new Date(event.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">👤 Organizer: {event.organizer?.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
