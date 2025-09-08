import React, { useEffect, useState } from 'react';
import OrganizerLogisticsBoard from './OrganizerLogisticsBoard';
import axios from 'axios';

const EventManagementPage = ({ eventId }) => {
  const [logisticsItems, setLogisticsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch logistics tasks for this event
    const fetchLogistics = async () => {
      try {
        const response = await axios.get(`/api/events/${eventId}/logistics`);
        setLogisticsItems(response.data); // Expecting array of { name, status }
      } catch (error) {
        console.error('Error fetching logistics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchLogistics();
    }
  }, [eventId]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Event Logistics</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading logistics...</p>
      ) : (
        <OrganizerLogisticsBoard previewMode={false} logisticsItems={logisticsItems} />
      )}
    </div>
  );
};

export default EventManagementPage;
