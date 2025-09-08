import OrganizerLogisticBoard from './OrganizerLogisticsBoard';

const SelectEventPage = () => (
  <div className="p-6 text-center">
    <h2 className="text-xl font-semibold mb-2">Please select an event to view logistics.</h2>
    <p className="text-gray-600 mb-6">Go back to the dashboard and choose an event.</p>
    <OrganizerLogisticBoard previewMode={true} />
  </div>
);

export default SelectEventPage;
