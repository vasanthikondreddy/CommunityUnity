import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VolunteersPage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [checkedIn, setCheckedIn] = useState({});

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await axios.get('/api/volunteers');
        setVolunteers(res.data);
      } catch (err) {
        console.error('Error fetching volunteers:', err);
      }
    };

    fetchVolunteers();
  }, []);

  const handleCheckIn = async (volunteerId) => {
    try {
      const res = await axios.post('/api/volunteer/checkin', { volunteerId });
      setCheckedIn((prev) => ({
        ...prev,
        [volunteerId]: res.data.checkedInAt,
      }));
    } catch (err) {
      console.error('Check-in failed:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Volunteer Check-In</h2>
      <ul className="space-y-3">
        {volunteers.map((vol) => (
          <li key={vol._id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
            <div>
              <span className="font-medium">{vol.name}</span>
              {checkedIn[vol._id] && (
                <p className="text-xs text-green-600">
                  Checked in at: {new Date(checkedIn[vol._id]).toLocaleTimeString()}
                </p>
              )}
            </div>
            {!checkedIn[vol._id] && (
              <button
                onClick={() => handleCheckIn(vol._id)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Check In
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VolunteersPage;
