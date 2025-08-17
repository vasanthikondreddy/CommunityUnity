export default function EventCard({ event }) {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h2 className="text-xl font-bold">{event.title}</h2>
      <p>{event.description}</p>
      <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
    </div>
  );
}
