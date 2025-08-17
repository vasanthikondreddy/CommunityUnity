import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [files, setFiles] = useState([]);
  const [signedUp, setSignedUp] = useState(false);

  useEffect(() => {
   
    api.get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error("Error fetching event:", err));

    
    api.get(`/events/${id}/files`)
      .then((res) => setFiles(res.data))
      .catch((err) => console.error("Error fetching files:", err));

    
    api.get(`/events/${id}/signup-status`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((res) => setSignedUp(res.data.signedUp))
      .catch(() => setSignedUp(false));
  }, [id]);

  const handleSignup = () => {
    api.post(`/events/${id}/signup`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(() => {
        alert("Signed up successfully!");
        setSignedUp(true);
      })
      .catch((err) => {
        console.error("Signup failed:", err);
        alert("Signup failed. Please try again.");
      });
  };

  if (!event) return <p className="text-center mt-10">Loading event...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <img
        src={event.cover_image_url || "/default-event.jpg"}
        alt={event.title}
        className="w-full h-64 object-cover rounded"
      />
      <h1 className="text-3xl font-bold mt-4 text-indigo-700">{event.title}</h1>
      <p className="text-gray-600 mt-2">{event.description}</p>
      <p className="mt-2 text-sm text-gray-500">
        📍 {event.location} <br />
        🕒 {new Date(event.start_time).toLocaleString()} – {new Date(event.end_time).toLocaleString()}
      </p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Required Documents</h2>
        {files.length > 0 ? (
          <ul className="list-disc pl-6">
            {files.map(file => (
              <li key={file._id}>
                <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
                  {file.file_name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No documents uploaded for this event.</p>
        )}
      </div>

      <div className="mt-6">
        {signedUp ? (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
            disabled
          >
            ✅ You're Signed Up
          </button>
        ) : (
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600"
            onClick={handleSignup}
          >
            Sign Up to Volunteer
          </button>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
