import React from 'react';


const OrganizerLogisticsBoard = ({ previewMode, logisticsItems }) => {
  if (previewMode && logisticsItems?.length === 0) {
    return <p className="text-gray-500 text-center">No preview data available.</p>;
  }

  if (!logisticsItems || logisticsItems.length === 0) {
    return <p className="text-gray-500 text-center">Loading logistics...</p>;
  }

  return (
    <div className="space-y-4">
      {logisticsItems.map((item, index) => (
        <div key={index} className="flex justify-between items-center bg-gray-100 p-4 rounded shadow">
          <span className="font-medium text-gray-800">{item.name}</span>
          <span className={`px-3 py-1 rounded-full text-white text-sm ${
            item.status === 'Completed' ? 'bg-green-500' :
            item.status === 'Pending' ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}>
            {item.status}
          </span>
        </div>
      ))}
    </div>
  );
};



export default OrganizerLogisticsBoard;
