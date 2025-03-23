// import { useState } from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import { toast } from 'react-toastify';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import 'react-toastify/dist/ReactToastify.css';
// import { HeartIcon, ChatBubbleOvalLeftIcon, BookmarkIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/authContext';

// // Initialize the localizer for react-big-calendar
// const localizer = momentLocalizer(moment);

// const LandingPage = () => {
//   const { currentUser, logout } = useAuth();

//   // Mock data for posts
//   const [posts] = useState([
//     {
//       id: 1,
//       title: 'Tech Symposium 2024',
//       date: '2024-03-15T09:00:00',
//       description: 'Join us for the biggest tech event of the year! 🚀',
//       image: 'https://d2rvgzn8c26h0v.cloudfront.net/new-year-eve-kochi-ignite-241703145773518.webp',
//       club: 'Tech Club',
//       profileImage: 'https://images.pexels.com/photos/30763767/pexels-photo-30763767/free-photo-of-thoughtful-young-man-in-dramatic-lighting.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load',
//       likes: 234,
//       comments: 56,
//       location: 'University Auditorium',
//     },
//     {
//       id: 2,
//       title: 'Cultural Fest',
//       date: '2024-03-20T09:00:00',
//       description: 'Experience a vibrant celebration of diversity with food, music, and performances from around the world! 🌍🎉',
//       image: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=300',
//       club: 'Cultural Society',
//       profileImage: 'https://images.pexels.com/photos/30246594/pexels-photo-30246594/free-photo-of-elegant-woman-in-red-dress-by-ornate-doorway.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load',
//       likes: 189,
//       comments: 42,
//       location: 'Main Campus Grounds',
//     },
//     // Add more posts as needed
//   ]);

//   // State to manage saved events for the calendar
//   const [savedEvents, setSavedEvents] = useState([]);

//   // Function to handle "Add to Calendar"
//   const handleAddToCalendar = (post) => {
//     const newEvent = {
//       title: post.title,
//       start: new Date(post.date),
//       end: new Date(new Date(post.date).setHours(new Date(post.date).getHours() + 8)), // 8-hour event
//       description: post.description,
//       location: post.location,
//     };

//     // Add the event to the savedEvents array
//     setSavedEvents([...savedEvents, newEvent]);

//     // Show a toast notification
//     toast.success('Event saved to your calendar! 🗓️', {
//       position: 'top-right',
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navigation Bar */}
//       <nav className="bg-white shadow-sm sticky top-0 z-50">
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16 items-center">
//             <Link to="/" className="text-2xl font-bold text-gray-900">
//               CampusConnect
//             </Link>
//             <div className="flex items-center space-x-4">
//               {currentUser ? (
//                 <button
//                   onClick={logout}
//                   className="px-4 py-2 text-gray-700 hover:text-indigo-600"
//                 >
//                   Logout
//                 </button>
//               ) : (
//                 <>
//                   <Link
//                     to="/login"
//                     className="px-4 py-2 text-gray-700 hover:text-indigo-600"
//                   >
//                     Sign In
//                   </Link>
//                   <Link
//                     to="/register"
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//                   >
//                     Sign Up
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
//           {posts.map((post) => (
//             <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//               {/* Post Header */}
//               <div className="flex items-center justify-between p-4 border-b">
//                 <div className="flex items-center space-x-3">
//                   <img
//                     src={post.profileImage}
//                     alt={post.club}
//                     className="w-10 h-10 rounded-full object-cover"
//                   />
//                   <div>
//                     <h3 className="font-semibold">{post.club}</h3>
//                     <p className="text-gray-500 text-sm">{post.location}</p>
//                   </div>
//                 </div>
//                 <button className="text-gray-500 hover:text-gray-700">
//                   <EllipsisHorizontalIcon className="h-6 w-6" />
//                 </button>
//               </div>

//               {/* Event Image */}
//               <img
//                 src={post.image}
//                 alt={post.title}
//                 className="w-full contain-layout"
//               />

//               {/* Interaction Buttons */}
//               <div className="p-4 space-y-2">
//                 <div className="flex items-center space-x-4">
//                   <button className="text-gray-700 hover:text-red-500">
//                     <HeartIcon className="h-7 w-7" />
//                   </button>
//                   <button className="text-gray-700 hover:text-blue-500">
//                     <ChatBubbleOvalLeftIcon className="h-7 w-7" />
//                   </button>
//                   <button
//                     onClick={() => handleAddToCalendar(post)}
//                     className="text-gray-700 hover:text-gray-900 ml-auto flex items-center space-x-2"
//                   >
//                     <BookmarkIcon className="h-7 w-7" /> Add to Calendar
//                   </button>
//                 </div>

//                 {/* Likes Count */}
//                 <p className="font-semibold">{post.likes.toLocaleString()} likes</p>

//                 {/* Event Description */}
//                 <div className="space-y-1">
//                   <p>
//                     <span className="font-semibold">{post.club}</span>{' '}
//                     <span className="text-gray-600">{post.description}</span>
//                   </p>
//                   <p className="text-gray-500 text-sm">
//                     {new Date(post.date).toLocaleDateString('en-US', {
//                       weekday: 'short',
//                       month: 'short',
//                       day: 'numeric',
//                     })}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>

//       {/* Inbuilt Calendar */}
//       <div className="fixed bottom-4 right-4 w-96 h-96 bg-white shadow-lg rounded-lg overflow-hidden">
//         <Calendar
//           localizer={localizer}
//           events={savedEvents}
//           startAccessor="start"
//           endAccessor="end"
//           defaultView="month"
//           views={['month', 'week', 'day']}
//           style={{ height: '100%' }}
//         />
//       </div>

//       {/* Toast Container */}
//       <ToastContainer />
//     </div>
//   );
// };

// export default LandingPage;