import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_BASE}/events/${eventId}`);
        if (!res.ok) throw new Error('Event not found');
        const data = await res.json();
        setEvent(data.success ? data.data : data); // Adjust if backend wraps in { success, data }
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleJoin = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token'); // Optional: if using JWT

    if (!userId) {
      alert('Please log in to join this event.');
      return;
    }

    setJoining(true);

    try {
      const res = await fetch(`${API_BASE}/events/${eventId}/signups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // Uncomment if using JWT
        },
        body: JSON.stringify({ userId }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Signup failed');
      alert(result.message || 'Successfully signed up!');
    } catch (err) {
      console.error('Signup error:', err);
      alert(err.message);
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <div className="p-4">Loading event...</div>;
  if (!event) return <div className="p-4 text-red-600">Event not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
      <p className="mb-2">{event.description}</p>
      <p className="text-sm text-gray-500">📅 {new Date(event.date).toLocaleDateString()}</p>

      <button
        onClick={handleJoin}
        disabled={joining}
        className={`mt-4 px-4 py-2 rounded text-white ${
          joining ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {joining ? 'Joining...' : 'Join Event'}
      </button>
    </div>
  );
};

export default EventPage;
