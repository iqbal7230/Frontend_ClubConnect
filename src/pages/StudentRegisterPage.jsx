import { useState } from 'react';
import TeamMemberItem from '../components/TeamMemberItem';
import { useParams } from 'react-router-dom';
const StudentRegisterPage = ({  onRegister }) => {
  const [leader, setLeader] = useState({ name: '', email: '' });
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  
  const { eventId } = useParams();

  const handleAddMember = () => {
    setTeamMembers([...teamMembers, { name: '' }]);
  };

  const handleRemoveMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleChangeMember = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index][field] = value;
    setTeamMembers(updatedMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { eventId, leader, teamName, teamMembers };
    console.log("payload:", payload);
    console.log("body:",JSON.stringify(payload));
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/studentregister`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        alert('Registration successful!');
        onRegister();
      } 
    } catch (error) {
      console.error('Error registering:', error);
     
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-black text-white p-8 rounded-xl shadow-2xl border border-purple-700 my-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-purple-400">Event Registration</h2>
        <div className="h-1 w-24 bg-purple-600 mx-auto mt-2 rounded-full"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
    
        <div className="bg-gray-900 p-6 rounded-lg border-l-4 border-purple-500">
          <h3 className="text-xl font-semibold mb-4 text-purple-300">Team Leader</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Full Name</label>
              <input 
                type="text" 
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white" 
                value={leader.name} 
                onChange={(e) => setLeader({ ...leader, name: e.target.value })} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email Address</label>
              <input 
                type="email" 
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white" 
                value={leader.email} 
                onChange={(e) => setLeader({ ...leader, email: e.target.value })} 
                required 
              />
            </div>
            {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Phone Number</label>
              <input 
                type="text" 
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white" 
                value={leader.phone} 
                onChange={(e) => setLeader({ ...leader, phone: e.target.value })} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">College / Institution</label>
              <input 
                type="text" 
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white" 
                value={leader.college} 
                onChange={(e) => setLeader({ ...leader, college: e.target.value })} 
                required 
              />
            </div> */}
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border-l-4 border-purple-500">
          <div className="space-y-2">
            <label className="block text-xl font-semibold text-purple-300">Team Name</label>
            <input 
              type="text" 
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-lg" 
              value={teamName} 
              onChange={(e) => setTeamName(e.target.value)} 
              required 
            />
          </div>
        </div>

        
        <div className="bg-gray-900 p-6 rounded-lg border-l-4 border-purple-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-purple-300">Team Members</h3>
            <button 
              type="button" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-1"
              onClick={handleAddMember}
            >
              <span>Add Member</span>
              <span className="text-lg">+</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {teamMembers.length === 0 && (
              <p className="text-gray-500 text-center py-6">No team members added yet. Click "Add Member" to add team members.</p>
            )}
            
            {teamMembers.map((member, index) => (
              <TeamMemberItem 
                key={index}
                member={member}
                index={index}
                onChangeMember={handleChangeMember}
                onRemoveMember={handleRemoveMember}
              />
            ))}
          </div>
        </div>

        
        <button 
          type="submit" 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg font-bold text-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg"
        >
          Complete Registration
        </button>
      </form>
    </div>
  );
};

export default StudentRegisterPage;