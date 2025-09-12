import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const TaskItem = ({ task, eventId, onRefresh, volunteers }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(task.name);
  const [status, setStatus] = useState(task.status);
  const [assignedTo, setAssignedTo] = useState(task.assignedTo?._id || '');

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}/logistics/${task._id}`,
        { name, status }
      );
      toast.success('Task updated');
      setIsEditing(false);
      onRefresh();
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}/logistics/${task._id}`
      );
      toast.success('Task deleted');
      onRefresh();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete task');
    }
  };

  const handleAssign = async () => {
    if (!assignedTo) {
      toast.error('Please select a volunteer before assigning');
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}/logistics/${task._id}/assign`,
        { assignedTo }
      );
      toast.success('Volunteer assigned');
      onRefresh();
    } catch (err) {
      console.error('Assignment error:', err);
      toast.error('Failed to assign volunteer');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b py-3 gap-4">
      <div className="flex-1">
        {isEditing ? (
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-1 rounded w-full mb-1"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-1 rounded w-full"
            >
              <option>Pending</option>
              <option>Scheduled</option>
              <option>Completed</option>
            </select>
          </>
        ) : (
          <>
            <p className="font-medium">{task.name}</p>
            <p className="text-sm text-gray-500">Status: {task.status}</p>
          </>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Assigned to:{' '}
          <span className="font-semibold">
            {task.assignedTo?.name || '— Not assigned —'}
          </span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        {isEditing ? (
          <button onClick={handleUpdate} className="text-green-600 hover:underline">
            Save
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="text-indigo-600 hover:underline">
            Edit
          </button>
        )}
        <button onClick={handleDelete} className="text-pink-600 hover:underline">
          Delete
        </button>

        <div className="flex items-center gap-2">
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="">Assign Volunteer</option>
            {volunteers.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name}
              </option>
            ))}
          </select>
          <button onClick={handleAssign} className="text-blue-600 hover:underline">
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

const AddLogisticsTask = ({ eventId, onTaskAdded }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Pending');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Task name can't be empty");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}/logistics`,
        { name, status }
      );
      toast.success('Task added successfully!');
      setName('');
      setStatus('Pending');
      onTaskAdded();
    } catch (err) {
      console.error('Error adding task:', err);
      toast.error('Failed to add task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">➕ Add Logistics Task</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Task name"
        className="border p-2 rounded w-full"
        required
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option>Pending</option>
        <option>Scheduled</option>
        <option>Completed</option>
      </select>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Add Task
      </button>
    </form>
  );
};

const EventManagementPage = () => {
  const { eventId } = useParams();
  const [logisticsItems, setLogisticsItems] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogistics = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}/logistics`
      );
      const logisticsArray = Array.isArray(response.data.data)
        ? response.data.data
        : response.data;
      setLogisticsItems(logisticsArray);
    } catch (error) {
      console.error('Error fetching logistics:', error);
      setLogisticsItems([]);
    } finally {
      setLoading(false);
    }
  };

 const fetchVolunteers = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/volunteers/event/${eventId}`);
    setVolunteers(res.data.volunteers);
  } catch (err) {
    console.error('Error fetching volunteers:', err);
  }
};


  useEffect(() => {
    if (eventId) {
      fetchLogistics();
      fetchVolunteers();
    }
  }, [eventId]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          🛠️ Event Management Dashboard
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">🚚 Live Logistics Board</h2>

          {loading ? (
            <p className="text-gray-500 text-center">Loading logistics...</p>
          ) : logisticsItems.length === 0 ? (
            <p className="text-gray-500 text-center">No logistics tasks found for this event.</p>
          ) : (
            <div className="space-y-2">
              {logisticsItems.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  eventId={eventId}
                  onRefresh={fetchLogistics}
                  volunteers={volunteers}
                />
              ))}
            </div>
          )}
        </div>

        <AddLogisticsTask eventId={eventId} onTaskAdded={fetchLogistics} />
      </div>
    </div>
  );
};

export default EventManagementPage;
