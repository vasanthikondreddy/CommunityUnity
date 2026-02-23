import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function EventCard({ event, userRole, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || null;
  const token = localStorage.getItem('token');

  const isOwner =
    userRole === 'organizer' &&
    (user?._id === event.organizer || user?._id === event.organizer?._id);

  const handleDelete = async () => {
    if (!window.confirm('🗑️ Are you sure you want to delete this event?')) return;

    if (!isOwner && userRole !== 'admin') {
      toast.error('❌ Only the organizer or an admin can delete this event');
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/${event._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ organizer: user?._id }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Delete failed');

      toast.success(`🗑️ Event "${event.title}" deleted successfully`);
      onDelete?.(event._id);
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error(`❌ Failed to delete "${event.title}"`);
    } finally {
      setDeleting(false);
    }
  };

  const fetchParticipants = async () => {
    setLoadingParticipants(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/events/${event._id}/participants`
      );
      if (res.data.success) {
        setParticipants(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load participants:', err);
    } finally {
      setLoadingParticipants(false);
    }
  };

  useEffect(() => {
    if (showParticipants) fetchParticipants();
  }, [showParticipants]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
      <h3 className="text-2xl font-bold text-blue-800 mb-2">{event.title}</h3>
      <p className="text-sm text-gray-500 mb-1">
        📅 {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'} • 📍{' '}
        {event.location || 'Location TBD'}
      </p>
      <p className="text-gray-700 mb-4">{event.description || 'No description provided.'}</p>

      <Link
        to={`/event/${event._id}`}
        className="text-green-600 hover:text-green-700 hover:underline font-medium transition"
      >
        View Details →
      </Link>

    
      <button
        onClick={() => setShowParticipants(!showParticipants)}
        className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition block mt-2"
      >
        {showParticipants
          ? 'Hide Participants'
          : `View Participants (${participants.length})`}
      </button>

      
      {showParticipants && (
        <div className="mt-4 bg-gray-50 p-3 rounded-lg">
          {loadingParticipants ? (
            <p className="text-gray-500">Loading participants...</p>
          ) : participants.length === 0 ? (
            <p className="text-gray-500">No one has signed up yet.</p>
          ) : (
            <ul className="space-y-2">
              {participants.map((user) => (
                <li key={user._id} className="bg-white p-2 rounded shadow">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {(isOwner || userRole === 'admin') && (
        <div className="flex gap-3 mt-5">
          <Link
            to={`/edit-event/${event._id}`}
            className="flex items-center gap-1 px-4 py-2 bg-purple-100 text-pink-700 rounded-md hover:bg-blue-200 transition font-medium"
          >
            ✏️ Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`flex items-center gap-1 px-4 py-2 bg-red-100 text-red-200 rounded-md hover:bg-red-200 transition font-medium ${
              deleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {deleting ? 'Deleting...' : '🗑️ Delete'}
          </button>
        </div>
      )}
    </div>
  );
}
