import { Link } from 'react-router-dom';

export default function EventCard({ event, onDelete }) {
  const user = JSON.parse(localStorage.getItem('user')) || null;

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/${event._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      alert(result.message || 'Event deleted');
      onDelete?.(event._id); // Optional: refresh list
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
      <h3 className="text-xl font-semibold text-blue-700">{event.title}</h3>
      <p className="text-sm text-gray-600">
        📅 {new Date(event.date).toLocaleDateString()} • 📍 {event.location}
      </p>
      <p className="mt-2 text-gray-700">{event.description}</p>
      <Link to={`/event/${event._id}`} className="text-green-600 hover:underline mt-2 inline-block">
        View Details →
      </Link>

      {/* Show Edit/Delete only if user is organizer and owns the event */}
      {user?.role === 'organizer' && user?._id === event.organizer && (
        <div className="flex gap-4 mt-2">
          <Link to={`/events/edit/${event._id}`} className="text-blue-600 hover:underline">Edit</Link>
          <button onClick={handleDelete} className="text-red-600 hover:underline">Delete</button>
        </div>
      )}
    </div>
  );
}
