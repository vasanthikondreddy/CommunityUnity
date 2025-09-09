import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

export default function Home() {
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/events`);
        if (res.data.success && Array.isArray(res.data.data)) {
          if (res.data.data.length > 0) {
            setFeaturedEvent(res.data.data[0]); // pick first event
          } else {
            console.warn("No events found");
          }
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchEvent();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center py-12 px-4">
        <section className="max-w-7xl w-full text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-green-700">CommunityUnity</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Empowering volunteers and organizers to build stronger communities together.
          </p>

          <div className="flex justify-center flex-wrap gap-4 mb-8">
            <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
              Log In
            </Link>
            <Link to="/signup" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition">
              Sign Up
            </Link>
            <Link to="/create-event" className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 transition">
              ➕ Create Event
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-2">Discover Local Impact</h2>
            <p className="text-gray-700 mb-4">
              Browse events, join causes, and connect with changemakers near you.
            </p>
            <Link
              to="/event-list"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Browse Events
            </Link>
          </div>

          {/* 🚀 Dashboards Section */}
          <section className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🚀 Explore Dashboards</h2>
            <p className="text-gray-600 mb-6">Choose your role to access the right tools:</p>
            <div className="flex justify-center flex-wrap gap-4">
              <Link to="/organizer" className="bg-yellow-500 text-white px-6 py-3 rounded hover:bg-yellow-600 transition">
                🧑‍💼 Organizer Dashboard
              </Link>
              <Link to="/volunteer" className="bg-indigo-500 text-white px-6 py-3 rounded hover:bg-indigo-600 transition">
                🧍 Volunteer Check-In
              </Link>
              <Link to="/announcements" className="bg-pink-500 text-white px-6 py-3 rounded hover:bg-pink-600 transition">
                📣 Announcement Board
              </Link>
              <Link to="/admin" className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition">
                🛠️ Admin Dashboard
              </Link>
            </div>
          </section>

          {/* 🚚 Logistics Coordination Section */}
          <section className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
              🚚 Logistics Coordination
              <span title="Track tasks, volunteers, and event readiness" className="text-gray-400 cursor-help">ℹ️</span>
            </h2>
            <p className="text-gray-600 mb-4">
              Organizers can track live task progress, volunteer assignments, and event readiness.
            </p>

            {featuredEvent && (
              <p className="text-lg text-gray-700 mb-2">
                Featured Event: <span className="font-semibold text-red-600">{featuredEvent.title}</span>
              </p>
            )}

            <div className="flex justify-center">
              {loadingEvent ? (
                <div className="animate-pulse text-gray-400">Loading featured event...</div>
              ) : featuredEvent ? (
                <Link
                  to={`/manage-event/${featuredEvent._id}`}
                  className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition"
                >
                  View Logistics Board
                </Link>
              ) : (
                <p className="text-gray-500">No events available yet. Be the first to create one!</p>
              )}
            </div>
          </section>

          {/* 🌟 Platform Highlights */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: '🎯 Create Events', desc: 'Organizers can post events with details, dates, and file uploads.' },
                { title: '🤝 Join as Volunteer', desc: 'Members can browse, view, and sign up for events seamlessly.' },
                { title: '🛡️ Role-Based Access', desc: 'Admins, organizers, and members see tailored dashboards and controls.' },
                { title: '📁 File Uploads', desc: 'Organizers can attach flyers, images, or documents to their events.' },
                { title: '⚡ Real-Time Updates', desc: 'Event lists and pages update instantly as new data is added.' },
                { title: '🎨 Polished UI', desc: 'Clean design with Tailwind CSS for a professional, official look.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}

