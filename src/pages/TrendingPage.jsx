// src/pages/TrendingPage.jsx
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useState, useEffect } from 'react';
import { 
  HeartIcon, 
  ChatBubbleOvalLeftIcon, 
  ShareIcon, 
  CurrencyDollarIcon, 
  EllipsisHorizontalIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import SearchEvents from '../components/SearchEvents';

const TrendingPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [topPosts, setTopPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem('likedPosts');
    return saved ? JSON.parse(saved) : {};
  });

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };
  let likeCount = topPosts.reduce((count, post) => count + (likedPosts[post._id] ? 1 : 0), 0);

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        setLoading(true);
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/events/all/top-events`; // Updated endpoint
        console.log('Fetching from:', apiUrl); // Debug log

        const response = await fetch(apiUrl);
        console.log('Response status:', response.status); // Debug log

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        console.log('Fetched data:', data.data); // Debug log

        if (Array.isArray(data.data)) { // Updated to match your backend response
          setTopPosts(data.data);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPosts();
  }, []);

  const handleLike = async (postId) => {
    
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      setTopPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? { ...post, likeCount: (post.likeCount || 0) + (likedPosts[postId] ? -1 : 1) }
            : post
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
          'Authorization': `Bearer ${currentUser.token}` // Add token if you're using JWT
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }

      // Refetch the updated events
      const updatedResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}events/all/top-events`);
      const updatedData = await updatedResponse.json();
      if (Array.isArray(updatedData.data)) {
        setTopPosts(updatedData.data);
      }

    } catch (error) {
      console.error('Error updating like:', error);
      // Revert optimistic update on error
      setTopPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? { ...post, likeCount: post.likeCount - (likedPosts[postId] ? -1 : 1) }
            : post
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              CampusConnect
            </Link>
            <SearchEvents onSearch={() => {}} />
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <Link to="/create-event" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Create Event
                  </Link>
                  <button onClick={logout} className="px-4 py-2 text-gray-700 hover:text-indigo-600">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-indigo-600">
                    Sign In
                  </Link>
                  <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4 px-1.5">
          <Link to="/chat" className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition transform hover:scale-105">Ask to AI</Link>
        </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Top Trending Events 🔥</h1>

        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 py-10">
            {error}
          </div>
        )}

        {!loading && !error && topPosts.length === 0 && (
          <div className="text-center text-gray-600 py-10">
            No events found. Be the first to create one!
          </div>
        )}

        <div className="space-y-6">
          {topPosts.map((post) => (
            <div 
              key={post._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {post.clubName?.charAt(0) || 'E'}
                  </div>
                  <div>
                    <h3 className="font-semibold">{post.clubName || 'Event Club'}</h3>
                    <p className="text-gray-500 text-sm">{post.venue || 'Location'}</p>
                  </div>
                </div>
              </div>

              {/* Event Image */}
              <div className="relative">
                <img 
                  src={post.images?.[0]?.url || 'default-event-image.jpg'} 
                  alt={post.name} 
                  className="w-full h-64 object-cover cursor-pointer"
                  onClick={() => handleEventClick(post._id)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(post._id);
                  }}
                  className="absolute bottom-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                  {likedPosts[post._id] ? (
                    <HeartSolidIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                </button>
              </div>

              {/* Post Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <HeartIcon className="h-5 w-5" />
                      <span>{post.likeCount || 0}</span>
                    </span>
                  </div>
                  <span className="flex items-center space-x-1">
                    {/* <CurrencyDollarIcon className="h-5 w-5" /> */}
                    <span>{post.isFree ? 'Free' : `₹${post.price}`}</span>
                  </span>
                </div>

                <h2 
                  className="font-bold text-lg cursor-pointer"
                  onClick={() => handleEventClick(post._id)}
                >{post.name}</h2>
                <p className="text-gray-600">{post.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString()} at {post.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TrendingPage;
