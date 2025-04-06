// src/pages/AllEvents.jsx
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useState, useEffect } from 'react';


const AllEvents = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const userRole = currentUser?.role || "student";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem('likedPosts');
    return saved ? JSON.parse(saved) : {};
  });

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };
  const handleCertificate = () => {
    navigate('/certificate');
  };
  const handleDashboard = () => {
    navigate('/Dashboard');
  };

  const handleRegisterClick = (eventId) => {
    navigate(`/register-event/${eventId}`);
  };

  const handleCreateEventClick = () => {
    navigate('/create-event');
  };

  const handleSponsorClick = (eventId) => {
    navigate(`/sponsor-event/${eventId}`);
  };

  const handleViewAttendees = (eventId) => {
    navigate(`/event/${eventId}/attendees`);
  };
  
  // Add a new function to handle viewing sponsors
  const handleViewSponsors = (eventId) => {
    navigate(`/event/${eventId}/sponsors`);
  };

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchAllEvents = async () => {
      try {
        setLoading(true);
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/events/all/getEvent`;
        console.log('Fetching from:', apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        if (Array.isArray(data.data)) {
          setEvents(data.data);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, [currentUser, navigate]);

  const handleLike = async (postId) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === postId
            ? { ...event, likeCount: (event.likeCount || 0) + (likedPosts[postId] ? -1 : 1) }
            : event
        )
      );

      setLikedPosts(prev => {
        const newLikes = {
          ...prev,
          [postId]: !prev[postId]
        };
        localStorage.setItem('likedPosts', JSON.stringify(newLikes));
        return newLikes;
      });

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }

      // Refetch the updated events
      const updatedResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/all/getEvent`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      const updatedData = await updatedResponse.json();
      if (Array.isArray(updatedData.data)) {
        setEvents(updatedData.data);
      }

    } catch (error) {
      console.error('Error updating like:', error);
      // Revert optimistic update on error
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === postId
            ? { ...event, likeCount: event.likeCount - (likedPosts[postId] ? -1 : 1) }
            : event
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-900">CampusConnect</Link>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <button onClick={logout} className="px-4 py-2 text-gray-700 hover:text-indigo-600">Logout</button>
          ) : null}
          {userRole === "club-admin" && (
             <>
             <button
               onClick={handleCreateEventClick}
               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
             >
               Create Event
             </button>
             <button
               onClick={handleCertificate}
               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
             >
               Certificate
             </button>
             <button
               onClick={handleDashboard}
               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
             >
               Dashboard
             </button>
           </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">All Events</h1>
        {loading && <div className="text-center py-10">Loading...</div>}
        {error && <div className="text-center text-red-600 py-10">{error}</div>}
        {!loading && !error && events.length === 0 && <div className="text-center text-gray-600 py-10">No events found.</div>}

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Event Image */}
              <div className="relative group cursor-pointer">
                <img src={event.images?.[0]?.url || 'default-event-image.jpg'} alt={event.name} className="w-full h-64 object-cover group-hover:opacity-80 transition" onClick={() => handleEventClick(event._id)} />
                <button onClick={(e) => { e.stopPropagation(); handleLike(event._id); }} className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md">
                  {likedPosts[event._id] ? "❤️" : "🤍"}
                </button>
              </div>
              
              {/* Event Details */}
              <div className="p-4">
                <h2 className="font-bold text-lg text-gray-900 cursor-pointer" onClick={() => handleEventClick(event._id)}>{event.name}</h2>
                <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                <p className="text-gray-500 text-sm mt-2">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                
                {/* Action Buttons */}
                <div className="mt-4 flex justify-between items-center">
                  {userRole === "student" && (
                    <button onClick={() => handleRegisterClick(event._id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Register</button>
                  )}
                  {userRole === "club-admin" && (
                    <div className="flex space-x-2">
                      <button onClick={() => handleDeleteEvent(event._id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
                      <button onClick={() => handleViewAttendees(event._id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Attendees</button>
                      <button onClick={() => handleViewSponsors(event._id)} className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">Sponsors</button>
                    </div>
                  )}
                  {userRole === "sponsor" && (
                    <button onClick={() => handleSponsorClick(event._id)} className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">Sponsor</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllEvents;
