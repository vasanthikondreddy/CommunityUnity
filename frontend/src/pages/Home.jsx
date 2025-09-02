import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { Link } from 'react-router-dom';

export default function Home() {
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


          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="font-semibold text-xl mb-2">🎯 Create Events</h3>
                <p className="text-gray-600 text-sm">
                  Organizers can post events with details, dates, and file uploads.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="font-semibold text-xl mb-2">🤝 Join as Volunteer</h3>
                <p className="text-gray-600 text-sm">
                  Members can browse, view, and sign up for events seamlessly.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="font-semibold text-xl mb-2">🛡️ Role-Based Access</h3>
                <p className="text-gray-600 text-sm">
                  Admins, organizers, and members see tailored dashboards and controls.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="font-semibold text-xl mb-2">📁 File Uploads</h3>
                <p className="text-gray-600 text-sm">
                  Organizers can attach flyers, images, or documents to their events.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="font-semibold text-xl mb-2">⚡ Real-Time Updates</h3>
                <p className="text-gray-600 text-sm">
                  Event lists and pages update instantly as new data is added.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="font-semibold text-xl mb-2">🎨 Polished UI</h3>
                <p className="text-gray-600 text-sm">
                  Clean design with Tailwind CSS for a professional, official look.
                </p>
              </div>
            </div>
          </section>


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

        </section>
      </main>
      <Footer />
    </>
  );
}
