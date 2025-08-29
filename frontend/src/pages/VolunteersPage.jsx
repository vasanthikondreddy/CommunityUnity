import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VolunteersPage = () => {
  const [volunteers, setVolunteers] = useState([]);

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🙋‍♀️ Volunteers</h2>
        {volunteers.length === 0 ? (
          <p className="text-gray-500">No volunteers found.</p>
        ) : (
          <ul className="space-y-4">
            {volunteers.map((v) => (
              <li key={v._id} className="border p-4 rounded-md shadow-sm">
                <h3 className="text-lg font-semibold">{v.name}</h3>
                <p className="text-sm text-gray-600">Role: {v.role}</p>
                <p className="text-sm text-gray-600">Email: {v.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VolunteersPage;
