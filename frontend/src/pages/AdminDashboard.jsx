import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await axios.get('/api/volunteers'); // Adjust route if needed
        setVolunteers(response.data);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      }
    };

    fetchVolunteers();
  }, []);

  const checkedIn = volunteers.filter((v) => v.checkedInAt);
  const notCheckedIn = volunteers.filter((v) => !v.checkedInAt);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>

      {/* ✅ Checked-In Volunteers */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-green-700 mb-2">✅ Checked-In Volunteers</h3>
        <p className="text-sm text-gray-600 mb-2">Total: {checkedIn.length}</p>
        {checkedIn.length > 0 ? (
          <ul className="space-y-2">
            {checkedIn.map((vol) => (
              <li key={vol._id} className="bg-green-100 p-3 rounded flex justify-between items-center">
                <span>{vol.name}</span>
                <span className="text-xs text-gray-600">
                  {new Date(vol.checkedInAt).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No volunteers have checked in yet.</p>
        )}
      </section>

      {/* ❌ Not Checked-In Volunteers */}
      <section>
        <h3 className="text-xl font-semibold text-red-700 mb-2">❌ Not Checked-In</h3>
        <p className="text-sm text-gray-600 mb-2">Total: {notCheckedIn.length}</p>
        {notCheckedIn.length > 0 ? (
          <ul className="space-y-2">
            {notCheckedIn.map((vol) => (
              <li key={vol._id} className="bg-red-100 p-3 rounded">
                {vol.name}
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
