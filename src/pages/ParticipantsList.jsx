import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ParticipantsList({ eventId }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!eventId) return;

    axios.get(`${API_BASE}/events/${eventId}/participants`)
      .then(res => {
        if (res.data.success) {
          setParticipants(res.data.data);
        } else {
          setError(res.data.error || 'Failed to load participants');
        }
      })
      .catch(err => {
        console.error('Error fetching participants:', err);
        setError('Server error. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow">
      {loading ? (
        <p className="text-gray-500">Loading participants...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : participants.length === 0 ? (
        <p>No one has signed up yet.</p>
      ) : (
        <ul className="space-y-2">
          {participants.map(user => (
            <li key={user._id} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
