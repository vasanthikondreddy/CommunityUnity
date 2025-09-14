import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await axios.get(`${API_BASE}/volunteers`);

        setVolunteers(response.data);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      }
    };

    fetchVolunteers();
  }, []);

  const checkedIn = volunteers
    .filter((v) => v.checkInTime)
    .sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime));

  const notCheckedIn = volunteers.filter((v) => !v.checkInTime);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">🌟 Admin Dashboard</h2>

      {/* Checked-In Section */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-green-700 mb-3">✅ Checked-In Volunteers</h3>
        <p className="text-sm text-gray-600 mb-4">Total: {checkedIn.length}</p>
        {checkedIn.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {checkedIn.map((vol, index) => (
              <li
                key={vol._id}
                className={`p-4 rounded-lg shadow-md transition transform hover:scale-[1.02] ${
                  index < 3
                    ? 'bg-green-100 border-l-4 border-green-600 relative'
                    : 'bg-green-50 border border-green-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-green-800">
                    {vol.name || 'Unnamed Volunteer'}
                  </span>
                  <span className="text-xs text-gray-600">
                    {new Date(vol.checkInTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {index < 3 && (
                  <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                    ⭐ Top {index + 1}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No volunteers have checked in yet.</p>
        )}
      </section>

     
      <section>
        <h3 className="text-2xl font-semibold text-red-700 mb-3">❌ Not Checked-In</h3>
        <p className="text-sm text-gray-600 mb-4">Total: {notCheckedIn.length}</p>
        {notCheckedIn.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notCheckedIn.map((vol) => (
              <li
                key={vol._id}
                className="bg-red-50 border border-red-200 p-4 rounded-lg shadow-sm transition hover:shadow-md"
              >
                <span className="font-semibold text-red-800">
                  {vol.name || 'Unnamed Volunteer'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">Everyone has checked in!</p>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
