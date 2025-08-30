import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

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

  const chartData = {
    labels: ['Announcements', 'Events', 'Volunteers'],
    datasets: [
      {
        label: 'Total Count',
        data: [stats.announcements, stats.events, stats.volunteers],
        backgroundColor: ['#93c5fd', '#86efac', '#d8b4fe'],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">📊 Reports</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            to="/announcements"
            className="bg-blue-100 p-4 rounded-md text-center hover:bg-blue-200 transition"
          >
            <h3 className="text-xl font-bold">{stats.announcements}</h3>
            <p className="text-gray-700">Announcements</p>
          </Link>

          <Link
            to="/events"
            className="bg-green-100 p-4 rounded-md text-center hover:bg-green-200 transition"
          >
            <h3 className="text-xl font-bold">{stats.events}</h3>
            <p className="text-gray-700">Events</p>
          </Link>

          <Link
            to="/volunteers"
            className="bg-purple-100 p-4 rounded-md text-center hover:bg-purple-200 transition"
          >
            <h3 className="text-xl font-bold">{stats.volunteers}</h3>
            <p className="text-gray-700">Volunteers</p>
          </Link>
        </div>

        <p className="text-gray-600 mt-6 text-center">
          You currently have <strong>{stats.announcements}</strong> announcements,{' '}
          <strong>{stats.events}</strong> events, and{' '}
          <strong>{stats.volunteers}</strong> volunteers in the system.
        </p>

        <div className="mt-8">
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
