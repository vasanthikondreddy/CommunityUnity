import React, { useState } from 'react';

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
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (file) data.append('file', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const result = await res.json();
      alert(result.message);
    } catch (err) {
      console.error('Event creation failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="border p-2 w-full" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="border p-2 w-full" />
      <input type="date" name="date" value={formData.date} onChange={handleChange} className="border p-2 w-full" />
      <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="border p-2 w-full" />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border p-2 w-full" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Event</button>
    </form>
  );
};

export default EventForm;
