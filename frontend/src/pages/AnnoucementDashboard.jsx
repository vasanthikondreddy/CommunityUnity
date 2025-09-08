import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io(import.meta.env.VITE_BACKEND_URL);
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const AnnouncementDashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: '', message: '' });
  const [editingId, setEditingId] = useState(null);

  const user = JSON.parse(localStorage.getItem('user')) || null;
  const userRole = user?.role;
  const isAuthorized = userRole === 'organizer' || userRole === 'admin';

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

    if (!isAuthorized) {
      toast.error('❌ Only organizers or admins can post announcements');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/api/announcements/${editingId}`, {
          ...form,
          userId: user._id,
          role: userRole,
        });
        toast.success('✅ Announcement updated');
      } else {
        await axios.post('/api/announcements', {
          ...form,
          userId: user._id,
          role: userRole,
        });
        toast.success('✅ Announcement posted');
      }

      socket.emit('newAnnouncement');
      setForm({ title: '', message: '' });
      setEditingId(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post announcement');
    }
  };

  const handleEdit = (a) => {
    if (!isAuthorized) {
      toast.error('❌ Only organizers or admins can edit announcements');
      return;
    }
    setForm({ title: a.title, message: a.message });
    setEditingId(a._id);
  };

  const handleDelete = async (id) => {
    if (!isAuthorized) {
      toast.error('❌ Only organizers or admins can delete announcements');
      return;
    }

    if (!window.confirm('🗑️ Are you sure you want to delete this announcement?')) return;

    try {
      await axios.delete(`/api/announcements/${id}`, {
        data: { userId: user._id, role: userRole },
      });
      toast.success('🗑️ Announcement deleted');
      socket.emit('newAnnouncement');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete announcement');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4">📢 Live Announcements</h2>

      {isAuthorized && (
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
      )}

      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a._id} className="bg-white shadow-md p-4 rounded-md relative">
            <h3 className="text-lg font-bold">📌 {a.title}</h3>
            <p className="text-gray-700">{a.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              Sent at: {new Date(a.createdAt).toLocaleString()}
            </p>

            {isAuthorized && (
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(a)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementDashboard;
