import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VolunteerCheckIn = () => {
  const [volunteers, setVolunteers] = useState([]);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const userRole = localStorage.getItem('role');

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
      await axios.patch(`${API_BASE}/volunteers/${id}/checkin`);
      toast.success('✅ Volunteer checked in');
      fetchVolunteers();
    } catch (err) {
      toast.error('Check-in failed');
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await axios.patch(`${API_BASE}/volunteers/${id}/checkout`);
      toast.success('❌ Volunteer checked out');
      fetchVolunteers();
    } catch (err) {
      toast.error('Check-out failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">🙌 Volunteer Check-In</h2>

      {volunteers.length === 0 && (
        <p className="text-center text-gray-500 mb-4">No volunteers available.</p>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {volunteers.map((vol) => (
          <li
            key={vol._id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex justify-between items-center transition hover:shadow-md"
          >
            <div>
              <p className="font-semibold text-gray-800">{vol.name}</p>
              <p className="text-sm text-gray-500">
                Status:{' '}
                <span
                  className={
                    vol.checkedIn
                      ? 'text-green-600 font-medium'
                      : 'text-red-600 font-medium'
                  }
                >
                  {vol.checkedIn ? 'Checked In' : 'Not Checked In'}
                </span>
              </p>

              {vol.checkInTime && (
                <p className="text-xs text-gray-400">
                  Checked in at {new Date(vol.checkInTime).toLocaleTimeString()}
                </p>
              )}
              {vol.checkOutTime && (
                <p className="text-xs text-gray-400">
                  Checked out at {new Date(vol.checkOutTime).toLocaleTimeString()}
                </p>
              )}
            </div>

            {(userRole === 'organizer' || userRole === 'admin') && (
              vol.checkedIn ? (
                <button
                  onClick={() => handleCheckOut(vol._id)}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-full transition duration-200 ease-in-out"
                >
                  ❌ Check Out
                </button>
              ) : (
                <button
                  onClick={() => handleCheckIn(vol._id)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full transition duration-200 ease-in-out"
                >
                  ✅ Check In
                </button>
              )
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VolunteerCheckIn;


