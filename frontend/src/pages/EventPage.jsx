import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const EventPage = () => {
  const { eventId } = useParams(); // Get event ID from URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_BASE}/events/${eventId}`);
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) return <div className="p-4">Loading event...</div>;
  if (!event) return <div className="p-4 text-red-600">Event not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-700 mb-4">{event.description}</p>
      <p className="text-sm text-gray-500">📅 {new Date(event.date).toLocaleDateString()}</p>
      <p className="text-sm text-gray-500">👤 Organizer: {event.organizer?.name || 'Unknown'}</p>

      <hr className="my-4" />

      <div className="text-gray-600 italic">
        🔧 Uploads, RSVP, and comments coming soon...
      </div>
    </div>
  );
};

export default EventPage;
