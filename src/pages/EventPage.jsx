import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
import { useAuth } from './../context/AuthContext';

export default function EventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user')) || null;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_BASE}/events/${eventId}`);
        const data = await res.json();
        setEvent(data.data || data); 
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await fetch(`${API_BASE}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      alert(result.message || 'Event deleted');
      navigate('/dashboard/organizer');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleJoin = async () => {
    try {
      const res = await fetch(`${API_BASE}/events/${eventId}/signups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user._id }),
      });
      const result = await res.json();
      alert(result.message || 'Successfully joined!');
    } catch (err) {
      console.error('Join failed:', err);
    }
  };

  if (loading) return <div className="p-4">Loading event...</div>;
  if (!event) return <div className="p-4 text-red-600">Event not found.</div>;


  const isOrganizer =
    user?.role === 'organizer' &&
    event?.organizer &&
    (user._id === event.organizer._id || user._id === event.organizer);

 
  console.log('User ID:', user._id);
  console.log('Event Organizer:', event.organizer);
  console.log('isOrganizer:', isOrganizer);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">{event.title}</h1>
      <p className="text-gray-600 mb-2">
        📅 {new Date(event.date).toLocaleDateString()} • 📍 {event.location}
      </p>
      <p className="mb-4 text-gray-800">{event.description}</p>

     
      {event.organizer?.name && (
        <p className="text-sm text-gray-500 mb-4">
          Organized by: {event.organizer.name}
        </p>
      )}

      {isOrganizer ? (
        <div className="flex gap-4 mt-4">
          <Link
            to={`/events/edit/${event._id}`}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            ✏️ Edit Event
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🗑️ Delete Event
          </button>
        </div>
      ) : (
        <button
          onClick={handleJoin}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4"
        >
          ✅ Join Event
        </button>
      )}
      <p className="text-sm text-gray-500">
  Organizer ID: {event.organizer?._id || event.organizer}
</p>
<p className="text-sm text-gray-500">
  Your ID: {user._id}
</p>

    </div>
  );
}
