import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserDashboard({ user }) {
  const [joinedEvents, setJoinedEvents] = useState([]);

  useEffect(() => {
    if (user?._id) {
      axios.get(`/api/users/${user._id}/events`)
        .then(res => setJoinedEvents(res.data))
        .catch(err => console.error('Error fetching joined events:', err));
    }
  }, [user]);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user?.name}</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your Joined Events</h2>
        {joinedEvents.length === 0 ? (
          <p className="text-gray-500">You haven’t joined any events yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {joinedEvents.map(event => (
              <li key={event._id} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold text-blue-700">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.date}</p>
                <p className="text-sm text-gray-600">{event.location}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
