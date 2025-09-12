import React, { useState } from 'react';

const OrganizerLogisticsBoard = ({
  previewMode,
  logisticsItems,
  onStatusChange,
  onDeleteTask,
  onEditTask,
  volunteers = [],
  onAssignVolunteer,
  onCreateTask, // make sure this is passed from parent
}) => {
  const [newTask, setNewTask] = useState({ name: '', status: 'Pending' });

  const handleCreate = () => {
    if (newTask.name.trim()) {
      onCreateTask?.(newTask);
      setNewTask({ name: '', status: 'Pending' });
    }
  };

  return (
    <div className="space-y-6">
      {/* ✅ Add Logistics Task Section at Top */}
      <div className="bg-white p-4 rounded shadow border">
        <h2 className="text-lg font-semibold mb-2">+ Add Logistics Task</h2>
        <input
          type="text"
          placeholder="Task name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          className="border-b w-full mb-2 p-1 focus:outline-none"
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          className="border rounded px-2 py-1 mb-2 bg-white"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>

      {/* ✅ Existing Logistics Items Below */}
      {previewMode && logisticsItems?.length === 0 ? (
        <p className="text-gray-500 text-center">No preview data available.</p>
      ) : !logisticsItems || logisticsItems.length === 0 ? (
        <p className="text-gray-500 text-center">Loading logistics...</p>
      ) : (
        logisticsItems.map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded shadow flex flex-col gap-4"
          >
            {/* Task Info */}
            <div>
              <input
                type="text"
                value={item.name}
                onChange={(e) => onEditTask(item._id, { name: e.target.value })}
                className="font-semibold text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
              />
              <textarea
                value={item.description || ''}
                onChange={(e) => onEditTask(item._id, { description: e.target.value })}
                className="text-sm text-gray-600 mt-2 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                rows={2}
              />
              <p className="text-xs text-gray-500 mt-2">
                Assigned to:{' '}
                <span className="font-medium">
                  {item.assignedTo?.name || '— Not assigned —'}
                </span>
              </p>
            </div>

            {/* Status + Controls */}
            <div className="flex flex-wrap gap-2 items-center">
              <span
                className={`px-3 py-1 rounded-full text-white text-sm ${
                  item.status === 'Completed'
                    ? 'bg-green-500'
                    : item.status === 'Pending'
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
                }`}
              >
                {item.status}
              </span>

              {onStatusChange && (
                <select
                  value={item.status}
                  onChange={(e) => onStatusChange(item._id, e.target.value)}
                  className="text-sm border rounded px-2 py-1 bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              )}

              {onAssignVolunteer && (
                <select
                  value={item.assignedTo?._id || ''}
                  onChange={(e) => onAssignVolunteer(item._id, e.target.value)}
                  className="text-sm border rounded px-2 py-1 bg-white"
                >
                  <option value="">Assign Volunteer</option>
                  {volunteers.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              )}

              {onDeleteTask && (
                <button
                  onClick={() => onDeleteTask(item._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrganizerLogisticsBoard;
