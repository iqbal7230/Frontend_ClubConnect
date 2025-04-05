import { useEffect, useState } from 'react';
import TeamMemberItem from '../components/TeamMemberItem';
import { useParams } from 'react-router-dom';

const StudentRegisterPage = ({ onRegister }) => {
  const [leader, setLeader] = useState({ name: '', email: '', phone: '', college: '' });
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [eventData, setEventData] = useState(null);
  const { eventId } = useParams();

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/all/getEvent/${eventId}`);
        const data = await response.json();
        if (data.success) {
          setEventData(data.event);
        }
      } catch (error) {
        console.error('Failed to fetch event data:', error);
      }
    };

    if (eventId) fetchEventData();
  }, [eventId]);

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

    if (!eventData) {
      alert('Event details not loaded. Please try again.');
      return;
    }

    const isPaid = eventData.price > 0;
    let proceed = true;

    if (isPaid) {
      // Replace this with real payment gateway integration
      proceed = confirm(`This is a paid event. Price: ₹${eventData.price}. Proceed to payment?`);
    }

    if (!proceed) return;

    const payload = { eventId, leader, teamName, teamMembers };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ParticipantsReg/studentregister`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        alert('Registration successful!');
        onRegister();
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Something went wrong during registration.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 my-10">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold text-[#1D1D35]">Event Registration</h2>
        {eventData && (
          <p className="text-gray-500 mt-2">
            {eventData.name} {eventData.price > 0 ? `(₹${eventData.price})` : '(Free)'}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-[#1D1D35] border-b pb-2">Team Leader Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <inputField label="Full Name" value={leader.name} onChange={(e) => setLeader({ ...leader, name: e.target.value })} />
            <inputField label="Email Address" type="email" value={leader.email} onChange={(e) => setLeader({ ...leader, email: e.target.value })} />
            <inputField label="Phone Number" value={leader.phone} onChange={(e) => setLeader({ ...leader, phone: e.target.value })} />
            <inputField label="College / Institution" value={leader.college} onChange={(e) => setLeader({ ...leader, college: e.target.value })} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-[#1D1D35] border-b pb-2">Team Name</h3>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#1D1D35] focus:border-[#1D1D35]"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-[#1D1D35]">Team Members</h3>
            <button
              type="button"
              onClick={handleAddMember}
              className="px-4 py-2 bg-[#1D1D35] text-white rounded-lg hover:bg-opacity-90 transition"
            >
              + Add Member
            </button>
          </div>

          {teamMembers.length === 0 && (
            <p className="text-gray-500 text-center py-4">No team members added yet.</p>
          )}

          <div className="space-y-4">
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

        <div>
          <button
            type="submit"
            className="w-full py-4 text-white text-lg font-semibold bg-[#1D1D35] rounded-lg hover:bg-opacity-90 transition"
          >
            Complete Registration
          </button>
        </div>
      </form>
    </div>
  );
};

const inputField = ({ label, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600">{label}</label>
    <input
      type={type}
      className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-[#1D1D35] focus:border-[#1D1D35]"
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

export default StudentRegisterPage;
