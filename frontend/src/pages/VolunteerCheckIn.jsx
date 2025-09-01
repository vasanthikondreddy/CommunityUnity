import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const VolunteerCheckIn = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/volunteers`);
        const data = await res.json();
        const loaded = Array.isArray(data) ? data : data.volunteers || [];
        setVolunteers(loaded);
      } catch (err) {
        console.error('Error fetching volunteers:', err);
        setError('Failed to load volunteers');
        toast.error('Failed to load volunteers');
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  const handleCheckIn = async (volunteerId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/volunteers/${volunteerId}/checkin`, {
        method: 'PATCH',
      });
      const updated = await res.json();

      setVolunteers((prev) =>
        prev.map((v) => (v._id === updated._id ? updated : v))
      );

      toast.success(`${updated.name} checked in successfully!`);
    } catch (err) {
      console.error('Check-in failed:', err);
      toast.error('Check-in failed. Please try again.');
    }
  };

  const filteredVolunteers = volunteers.filter((v) =>
    (v.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const checkedInCount = volunteers.filter((v) => v.checkedIn).length;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-2">✅ Volunteer Check-In</h2>
      <p className="text-sm text-gray-600 mb-2">
        {checkedInCount} of {volunteers.length} volunteers checked in
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${(checkedInCount / volunteers.length) * 100}%` }}
        ></div>
      </div>

      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {loading && <p className="text-gray-600">Loading volunteers...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && filteredVolunteers.length === 0 && (
        <p className="text-gray-500 italic">
          No volunteers match your search. Try a different name or check spelling 🙏
        </p>
      )}

      <ul className="space-y-3">
        {filteredVolunteers.map((v) => (
          <li
            key={v._id}
            className="border p-4 rounded-md flex justify-between items-center hover:bg-gray-50 transition"
          >
            <div>
              <span className="font-semibold">{v.name}</span>
              <div className="text-sm text-gray-500">{v.email}</div>
              {v.checkedIn && v.checkInTime && (
                <div className="text-xs text-gray-400">
                  Checked in at {new Date(v.checkInTime).toLocaleTimeString()}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`text-sm px-2 py-1 rounded ${
                  v.checkedIn ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {v.checkedIn ? 'Checked In ✅' : 'Not Checked In ⏳'}
              </span>

              {!v.checkedIn && (
                <button
                  onClick={() => handleCheckIn(v._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                  aria-label={`Check in ${v.name}`}
                >
                  Check In
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VolunteerCheckIn;
