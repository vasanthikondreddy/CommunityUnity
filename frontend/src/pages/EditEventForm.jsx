import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditEventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '' });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/events/${id}`)
      .then(res => res.json())
      .then(data => setFormData(data.data));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      alert(result.message || 'Event updated');
      navigate('/dashboard/organizer');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold text-blue-600">Edit Event</h2>
      <input name="title" value={formData.title} onChange={handleChange} className="border p-2 w-full" />
      <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 w-full" />
      <input type="date" name="date" value={formData.date} onChange={handleChange} className="border p-2 w-full" />
      <input name="location" value={formData.location} onChange={handleChange} className="border p-2 w-full" />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Update Event</button>
    </form>
  );
}
