import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VolunteersPage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/volunteers`);
      setVolunteers(res.data);
    } catch (err) {
      toast.error('❌ Failed to load volunteers');
    }
  };

  const handleCheckIn = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE}/volunteers/${id}/checkin`);
      updateVolunteer(res.data);
      toast.success('✅ Checked in');
    } catch (err) {
      toast.error('❌ Check-in failed');
    }
  };

  const handleCheckOut = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE}/volunteers/${id}/checkout`);
      updateVolunteer(res.data);
      toast.success('🚪 Checked out');
    } catch (err) {
      toast.error('❌ Check-out failed');
    }
  };

  const updateVolunteer = (updated) => {
    setVolunteers((prev) =>
      prev.map((v) => (v._id === updated._id ? updated : v))
    );
  };

  const filtered = volunteers.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCheckedIn = volunteers.filter((v) => v.checkedIn).length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🙌 Volunteer Check-In</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="🔍 Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/2"
        />
        <p className="text-sm text-gray-600">
          ✅ Checked In: <span className="font-semibold">{totalCheckedIn}</span> / {volunteers.length}
        </p>
      </div>

      <ul className="space-y-3">
        {filtered.map((vol) => (
          <li
            key={vol._id}
            className="flex justify-between items-center bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div>
              <p className="font-medium text-gray-800">{vol.name}</p>
              <p className="text-sm text-gray-500">{vol.email}</p>
              <p className="text-xs mt-1">
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded ${
                    vol.checkedIn
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {vol.checkedIn ? "Checked In" : "Not Checked In"}
                </span>
              </p>
              {vol.checkedIn && vol.checkInTime && (
                <p className="text-xs text-gray-500 mt-1">
                  ⏰ {new Date(vol.checkInTime).toLocaleTimeString()}
                </p>
              )}
            </div>
            <div>
              {vol.checkedIn ? (
                <button
                  onClick={() => handleCheckOut(vol._id)}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-full transition"
                >
                  🚪 Check Out
                </button>
              ) : (
                <button
                  onClick={() => handleCheckIn(vol._id)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full transition"
                >
                  ✅ Check In
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VolunteersPage;
