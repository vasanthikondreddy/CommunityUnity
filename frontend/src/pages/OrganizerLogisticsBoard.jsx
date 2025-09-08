import React from 'react';

const OrganizerLogisticsBoard = ({ previewMode = false }) => {
  
  const logisticsItems = previewMode
    ? [
        { name: 'Stage Setup', status: 'Preview' },
        { name: 'Volunteer Check-in', status: 'Preview' },
        { name: 'Security Briefing', status: 'Preview' },
      ]
    : [
        { name: 'Stage Setup', status: 'Completed' },
        { name: 'Volunteer Check-in', status: 'Pending' },
        { name: 'Food Distribution', status: 'In Progress' },
        { name: 'Security Briefing', status: 'Scheduled' },
      ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {previewMode ? 'Live Logistics Preview' : 'Organizer Live Logistics'}
      </h2>

      <ul className="space-y-3">
        {logisticsItems.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm"
          >
            <span className="font-medium">{item.name}</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                item.status === 'Completed'
                  ? 'bg-green-200 text-green-800'
                  : item.status === 'In Progress'
                  ? 'bg-yellow-200 text-yellow-800'
                  : item.status === 'Pending'
                  ? 'bg-red-200 text-red-800'
                  : 'bg-blue-200 text-blue-800'
              }`}
            >
              {item.status}
            </span>
          </li>
        ))}
      </ul>

      {previewMode && (
        <p className="mt-6 text-sm text-gray-500 text-center">
          This is a preview. Select an event to view real-time logistics.
        </p>
      )}
    </div>
  );
};

export default OrganizerLogisticsBoard;
