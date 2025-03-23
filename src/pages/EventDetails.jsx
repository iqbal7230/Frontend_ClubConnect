// src/pages/EventDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        console.log('API URL:', apiUrl);
        
        const url = `${apiUrl}/events/${id}`;
        console.log('Fetching from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Event data:', data);
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError(error.message);
      }
    };

    fetchEventDetails();
  }, [id]);

  const nextImage = () => {
    if (event?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === event.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (event?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? event.images.length - 1 : prevIndex - 1
      );
    }
  };

  if (error) return (
    <div className="container mx-auto p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
      </div>
    </div>
  );

  if (!event) return <div className="container mx-auto p-4 text-center">Loading...</div>;

  // Format date
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">{event.name}</h1>
        
        {/* Main content - responsive layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side - Event Details */}
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <div className="flex flex-row gap-6">
              <div className="w-1/2 mb-6">
                <h2 className="text-xl font-semibold mb-2">Event Details</h2>
                <p className="text-gray-700 mb-4">{event.description}</p>
                
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-semibold">Date:</span> {eventDate}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Time:</span> {event.time}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Institution:</span> {event.institution}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Price:</span> {event.isFree ? 'Free' : `₹${event.price}`}
                  </p>
                </div>
              </div>
              
              <div className="w-1/2">
                <h2 className="text-xl font-semibold mb-2">Organizer Information</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-semibold">Club:</span> {event.clubName}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Performer:</span> {event.performer}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Likes:</span> {event.likeCount || 0}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Created:</span> {new Date(event.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Image Gallery */}
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <div className="relative h-full flex items-center justify-center">
              {event.images && event.images.length > 0 ? (
                <div className="w-full">
                  <div className="relative">
                    <img 
                      src={event.images[currentImageIndex].url} 
                      alt={`${event.name} - Image ${currentImageIndex + 1}`} 
                      className="w-full rounded-lg object-contain max-h-80"
                    />
                    
                    {event.images.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between">
                        <button 
                          onClick={prevImage}
                          className="bg-black bg-opacity-50 text-white p-2 rounded-full ml-2 hover:bg-opacity-70"
                        >
                          &#10094;
                        </button>
                        <button 
                          onClick={nextImage}
                          className="bg-black bg-opacity-50 text-white p-2 rounded-full mr-2 hover:bg-opacity-70"
                        >
                          &#10095;
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Image Indicators */}
                  {event.images.length > 1 && (
                    <div className="flex justify-center mt-2">
                      {event.images.map((_, index) => (
                        <button 
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-2 w-2 mx-1 rounded-full ${
                            index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-60 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No images available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
