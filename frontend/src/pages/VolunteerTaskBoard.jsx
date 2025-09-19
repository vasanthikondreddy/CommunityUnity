import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate } from 'react-router-dom';
import { socket } from "../utils/socket";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const VolunteerTaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const user = JSON.parse(localStorage.getItem('user')) || null;

  useEffect(() => {
    if (user) {
      fetchTasks();
      socket.on('taskUpdate', (task) => {
        toast.info(`📌 New task update: ${task.name}`);
        fetchTasks();
      });
      return () => socket.off('taskUpdate');
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tasks`);
      const assigned = res.data.filter((t) => {
        const assignedId =
          typeof t.assignedTo === 'string' ? t.assignedTo : t.assignedTo?._id;
        return assignedId === user._id;
      });
      setTasks(assigned);
    } catch (err) {
      toast.error('❌ Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (taskId) => {
    try {
      await axios.put(`${API_BASE}/tasks/${taskId}/status`, {
        status: 'Completed',
      });
      toast.success('✅ Task marked as completed');
      fetchTasks();
    } catch (err) {
      toast.error('❌ Failed to update task status');
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  const filteredTasks = filter
    ? tasks.filter((t) => t.status === filter)
    : tasks;

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4">🧭 My Assigned Tasks</h2>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <p className="text-sm text-gray-600">
          ✅ {completedCount} of {tasks.length} tasks completed
        </p>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Loading tasks...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="text-center text-gray-500">🎉 You're all caught up! No tasks assigned.</p>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white shadow-md p-4 rounded-md flex flex-col gap-2"
            >
              <h3 className="text-lg font-semibold text-gray-800">{task.name}</h3>
              {task.description && (
                <p className="text-sm text-gray-700">{task.description}</p>
              )}
              <p className="text-xs text-gray-500">
                Assigned on: {new Date(task.createdAt).toLocaleString()}
              </p>
              <span
                className={`self-start px-3 py-1 rounded-full text-white text-sm ${
                  task.status === 'Completed'
                    ? 'bg-green-500'
                    : task.status === 'Pending'
                    ? 'bg-yellow-500'
                    : task.status === 'Scheduled'
                    ? 'bg-purple-500'
                    : 'bg-blue-500'
                }`}
              >
                {task.status}
              </span>
              {task.status !== 'Completed' && (
                <button
                  onClick={() => markAsCompleted(task._id)}
                  className="text-sm text-blue-200 hover:underline self-start"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerTaskBoard;
