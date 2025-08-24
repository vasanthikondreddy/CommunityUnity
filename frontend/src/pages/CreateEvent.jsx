// src/pages/CreateEvent.jsx
import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function CreateEvent({ socket }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      alert('Organizer ID missing. Please log in again.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('location', location);
    formData.append('organizer', user._id); // ✅ Required by backend
    if (file) formData.append('file', file); // ✅ Optional file

    try {
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Include token if route is protected
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert('✅ Event created successfully!');
        socket?.emit('newEvent', result.data); // ✅ Real-time update
        // Optionally reset form
        setTitle('');
        setDate('');
        setLocation('');
        setDescription('');
        setFile(null);
      } else {
        alert(result.error || 'Failed to create event');
      }
    } catch (err) {
      console.error('Create event error:', err);
      alert('Server error. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">📅 Create New Event</h2>

      <input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        rows={4}
        required
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full mb-4"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Event
      </button>
    </form>
  );
}
