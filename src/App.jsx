import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authcontext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import './App.css';
import ProfilePage from './pages/ProfilePage.jsx';
import ChatRoom from './pages/ChatRoom.jsx';
import EventForm from './pages/EventForm.jsx';
import LandingPost from './pages/LandingPost.jsx';
import EventDetails from './pages/EventDetails.jsx';
import TrendingPage from './pages/TrendingPage.jsx';
import StudentRegisterPage from './pages/StudentRegisterPage.jsx';
import AllEvents from './pages/AllEvents.jsx';
import EventAttendees from './pages/EventAttendees.jsx';
import EventSponsors from './pages/EventSponsors.jsx';
import SponsorForm from './pages/SponsorForm.jsx'


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          
          <Route path="/" element={<TrendingPage/>} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<ChatRoom/>} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/event" element={<EventForm/>} />

          <Route path="/landingpost" element={<LandingPost/>} />

          <Route path="/event/:id" element={<EventDetails />} />
      
      
        <Route path="/register-event/:eventId" element={<PrivateRoute><StudentRegisterPage /></PrivateRoute>} />
        
        {/* Club Admin routes */}
        <Route path="/create-event" element={<PrivateRoute adminOnly={true}><EventForm /></PrivateRoute>} />
        {/* <Route path="/edit-event/:eventId" element={<PrivateRoute adminOnly={true}><EventForm /></PrivateRoute>} /> */}
        <Route path="/event/:eventId/attendees" element={<PrivateRoute adminOnly={true}><EventAttendees /></PrivateRoute>} />
        <Route path="/event/:eventId/sponsors" element={<PrivateRoute adminOnly={true}><EventSponsors /></PrivateRoute>} />
        
        {/* Sponsor routes */}
        <Route path="/sponsor-event/:eventId" element={<PrivateRoute sponsorOnly={true}><SponsorForm /></PrivateRoute>} />
          {/* Private routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

            <Route
            path="/all-events"
            element={
              // <PrivateRoute>
                <AllEvents />
              // </PrivateRoute>
            }
          />

          {/* Redirects */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
    
    
  );
}

export default App;