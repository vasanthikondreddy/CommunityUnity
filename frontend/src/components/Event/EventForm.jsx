import React, { useState } from 'react';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user?._id) {
      alert('User not found. Please log in again.');
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    formDataToSend.append('organizer', user._id);
    if (file) {
      formDataToSend.append('file', file);
    }

    try {
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const raw = await res.text();
        throw new Error('Unexpected response: ' + raw.slice(0, 100));
      }

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Event creation failed');
      alert(result.message || 'Event created successfully!');
    } catch (err) {
      console.error('❌ Event creation failed:', err);
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold text-blue-700 mb-2">Create New Event</h2>

      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="border p-2 w-full rounded"
        required
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 w-full rounded"
        required
      />

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />

      <input
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
        className="border p-2 w-full rounded"
        required
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 w-full rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Event
      </button>
    </form>
  );
};

export default EventForm;
