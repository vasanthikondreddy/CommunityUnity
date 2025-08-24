import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function EventCard({ event, userRole, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const token = localStorage.getItem('token');

  // Check if user is organizer and owns the event
  const isOwner =
    userRole === 'organizer' &&
    (user?._id === event.organizer || user?._id === event.organizer?._id);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    setDeleting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/${event._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      alert(result.message || 'Event deleted');
      onDelete?.(event._id); // Notify parent to remove from list
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete event.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
      <h3 className="text-xl font-semibold text-blue-700">{event.title}</h3>
      <p className="text-sm text-gray-600">
        📅 {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'} • 📍{' '}
        {event.location || 'Location TBD'}
      </p>
      <p className="mt-2 text-gray-700">{event.description || 'No description provided.'}</p>

      <Link
        to={`/event/${event._id}`}
        className="text-green-600 hover:underline mt-2 inline-block"
      >
        View Details →
      </Link>

      {isOwner && (
        <div className="flex gap-4 mt-2">
          <Link
            to={`/edit-event/${event._id}`}
            className="text-blue-600 hover:underline"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`text-red-600 hover:underline ${
              deleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
}
