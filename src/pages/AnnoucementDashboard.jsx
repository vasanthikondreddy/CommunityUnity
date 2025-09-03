import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io(import.meta.env.VITE_BACKEND_URL);

const AnnouncementDashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: '', message: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get('/api/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      toast.error('Failed to load announcements');
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    socket.on('newAnnouncement', fetchAnnouncements);
    return () => socket.off('newAnnouncement');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/announcements/${editingId}`, form);
        toast.success('Announcement updated');
      } else {
        await axios.post('/api/announcements', form);
        toast.success('Announcement posted');
      }
      socket.emit('newAnnouncement');
      setForm({ title: '', message: '' });
      setEditingId(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post announcement');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4">📢 Live Announcements</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="📌 Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="📝 Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {editingId ? 'Update Announcement ✏️' : 'Send Announcement 🚀'}
        </button>
      </form>

      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a._id} className="bg-white shadow-md p-4 rounded-md">
            <h3 className="text-lg font-bold">📌 {a.title}</h3>
            <p className="text-gray-700">{a.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              Sent at: {new Date(a.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementDashboard;
