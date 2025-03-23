import { useAuth } from '../context/authcontext';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    venue: '',
    date: '',
    time: '',
    isFree: true,
    price: '',
    description: '',
    clubName: '',
    performer: '',
    images: []  // New field for images
  });
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Ensure at least 1 and at most 3 images are selected
    if (files.length < 1 || files.length > 3) {
      alert("Please select between 1 to 3 images.");
      return;
    }
  
    setFormData((prev) => ({
      ...prev,
      images: files
    }));
  };
  

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Adjust the URL to your backend endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/getEvent`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.images.length < 1 || formData.images.length > 3) {
      alert("You must upload between 1 to 3 images.");
      return;
    }
  
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((image) => data.append("images", image));
      } else {
        data.append(key, value);
      }
    });
  
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/create`, {
        method: 'POST',
        body: data  // No need to set `Content-Type`, FormData handles it automatically
      });
  
      // Reset the form
      setFormData({
        name: '',
        institution: '',
        venue: '',
        date: '',
        time: '',
        isFree: true,
        price: '',
        description: '',
        clubName: '',
        performer: '',
        images: []
      });
  
      setShowCreateForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };
  

  const openEventDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Club Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {currentUser?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Club Management Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Your Clubs</h2>
            {/* Club management content would go here */}
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Events</h2>
            <button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {showCreateForm ? 'Cancel' : 'Create Event'}
            </button>
          </div>

          {/* Create Event Form */}
          {showCreateForm && (
            <div className="mb-8 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-md font-medium mb-4">Create New Event</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
                    <input
                      type="text"
                      name="clubName"
                      value={formData.clubName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Performer</label>
                    <input
                      type="text"
                      name="performer"
                      value={formData.performer}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFree"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="isFree" className="text-sm font-medium text-gray-700">Free Event</label>
                  </div>
                  {!formData.isFree && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required={!formData.isFree}
                      />
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    ></textarea>
                  </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Images (1-3)</label>
                      <input
                       type="file"
                        accept="image/*"
                        multiple
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                       />
                    </div>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Events List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.length > 0 ? (
              events.map((event) => (
                <div 
                  key={event._id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                  onClick={() => openEventDetails(event)}
                >
                  <h3 className="font-medium text-lg">{event.name}</h3>
                  <p className="text-gray-600">{event.venue}</p>
                  <p className="text-gray-600">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                  <p className="text-gray-600">{event.isFree ? 'Free' : `$${event.price}`}</p>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{event.description}</p>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-8">No events found. Create your first event!</p>
            )}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{selectedEvent.name}</h2>
                <button 
                  onClick={closeEventDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">{selectedEvent.institution}</p>
                  <p className="text-gray-600">{selectedEvent.venue}</p>
                  <p className="text-gray-600">
                    {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}
                  </p>
                  <p className="text-gray-600">
                    {selectedEvent.isFree ? 'Free Entry' : `Price: $${selectedEvent.price}`}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg">Description</h3>
                  <p className="text-gray-700">{selectedEvent.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg">Performer</h3>
                  <p className="text-gray-700">{selectedEvent.performer || 'No performer specified'}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg">Organized by</h3>
                  <p className="text-gray-700">{selectedEvent.clubName}</p>
                </div>
                
                {/* Sponsors Section - You'll need to adjust based on your data structure */}
                <div>
                  <h3 className="font-medium text-lg">Sponsors</h3>
                  {selectedEvent.sponsors && selectedEvent.sponsors.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {selectedEvent.sponsors.map((sponsor, index) => (
                        <li key={index} className="text-gray-700">{sponsor.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No sponsors</p>
                  )}
                </div>
                
                {/* Participants Section - You'll need to adjust based on your data structure */}
                <div>
                  <h3 className="font-medium text-lg">Participants</h3>
                  {selectedEvent.participants && selectedEvent.participants.length > 0 ? (
                    <div>
                      <p className="text-gray-700">{selectedEvent.participants.length} registered participants</p>
                      {/* You might want to add a button to view all participants if needed */}
                    </div>
                  ) : (
                    <p className="text-gray-500">No participants registered yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
