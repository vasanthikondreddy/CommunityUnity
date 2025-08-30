import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ParticipantList() {
  const { eventId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/events/${eventId}/participants`)
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👥 Participants</h1>

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
