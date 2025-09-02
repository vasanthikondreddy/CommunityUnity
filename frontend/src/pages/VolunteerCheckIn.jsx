import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VolunteerCheckin = () => {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    const res = await axios.get('/api/volunteers');
    setVolunteers(res.data);
  };

  const handleCheckIn = async (id) => {
    await axios.patch(`/api/volunteers/${id}/checkin`);
    fetchVolunteers();
  };

  const handleCheckOut = async (id) => {
    await axios.patch(`/api/volunteers/${id}/checkout`);
    fetchVolunteers();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">🙌 Volunteer Check-In</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {volunteers.map((vol) => (
          <li
            key={vol._id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex justify-between items-center transition hover:shadow-md"
          >
            <div>
              <p className="font-semibold text-gray-800">{vol.name}</p>
              <p className="text-sm text-gray-500">
                Status:{" "}
                <span className={vol.checkedIn ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {vol.checkedIn ? "Checked In" : "Not Checked In"}
                </span>
              </p>
            </div>
            {vol.checkedIn ? (
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
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VolunteerCheckin;
