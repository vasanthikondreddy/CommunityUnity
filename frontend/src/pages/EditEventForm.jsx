import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const EditEventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    startTime: '',
    endTime: '',
    organizer: '',
  });

  useEffect(() => {
    axios
      .get(`${API_BASE}/events/${id}`)
      .then((res) => {
        const event = res.data.data;
        setFormData({
          title: event.title || '',
          description: event.description || '',
          date: event.date?.slice(0, 10) || '',
          location: event.location || '',
          startTime: event.startTime || '',
          endTime: event.endTime || '',
          organizer: event.organizer?._id || event.organizer || '',
        });
      })
      .catch((err) => {
        console.error('Error loading event:', err);
        toast.error('❌ Failed to load event details');
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting payload:', formData);

      await axios.put(`${API_BASE}/events/${id}`, formData);
      toast.success('✅ Event updated successfully');
      navigate('/dashboard');
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      toast.error('❌ Failed to update event');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">✏️ Edit Event</h2>

      <label className="block mb-2 font-medium">Title</label>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <label className="block mb-2 font-medium">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <label className="block mb-2 font-medium">Date</label>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block mb-2 font-medium">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-2 font-medium">End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <label className="block mb-2 font-medium">Location</label>
      <input
        name="location"
        value={formData.location}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        💾 Save Changes
      </button>
    </form>
  );
};

export default EditEventForm;
