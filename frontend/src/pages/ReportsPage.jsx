import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ReportsPage = () => {
  const [stats, setStats] = useState({
    announcements: 0,
    events: 0,
    volunteers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [aRes, eRes, vRes] = await Promise.all([
          axios.get('/api/announcements'),
          axios.get('/api/events'),
          axios.get('/api/volunteers'),
        ]);

        console.log('Announcements:', aRes.data);
        console.log('Events:', eRes.data);
        console.log('Volunteers:', vRes.data);

        const announcementsCount = Array.isArray(aRes.data)
          ? aRes.data.length
          : Array.isArray(aRes.data.announcements)
          ? aRes.data.announcements.length
          : 0;

        const eventsCount = Array.isArray(eRes.data)
          ? eRes.data.length
          : Array.isArray(eRes.data.data)
          ? eRes.data.data.length
          : 0;

        const volunteersCount = Array.isArray(vRes.data)
          ? vRes.data.length
          : Array.isArray(vRes.data.volunteers)
          ? vRes.data.volunteers.length
          : 0;

        setStats({
          announcements: announcementsCount,
          events: eventsCount,
          volunteers: volunteersCount,
        });
      } catch (err) {
        console.error('Error fetching reports:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">📊 Reports</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-4 rounded-md text-center">
            <h3 className="text-xl font-bold">{stats.announcements}</h3>
            <p className="text-gray-700">Announcements</p>
          </div>
          <div className="bg-green-100 p-4 rounded-md text-center">
            <h3 className="text-xl font-bold">{stats.events}</h3>
            <p className="text-gray-700">Events</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-md text-center">
            <h3 className="text-xl font-bold">{stats.volunteers}</h3>
            <p className="text-gray-700">Volunteers</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
