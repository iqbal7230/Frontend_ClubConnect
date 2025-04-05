import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthForm({ type }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password, formData.role);
      }
      navigate('/all-events');
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          {type === 'login' ? 'SIGN IN TO YOUR ACCOUNT' : 'CREATE A NEW ACCOUNT'}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <div className="space-y-4">
            {type === 'register' && (
              <div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500 text-gray-900 placeholder-gray-500 text-sm"
                  placeholder="full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}
            <div>
              <input
                id="email"
                name="email"
                type={type === 'login' ? 'text' : 'email'}
                required
                className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500 text-gray-900 placeholder-gray-500 text-sm"
                placeholder="user name"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500 text-gray-900 placeholder-gray-500 text-sm"
                placeholder="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            {type === 'register' && (
              <div>
                <select
                  id="role"
                  name="role"
                  required
                  className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500 text-gray-900 placeholder-gray-500 text-sm"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="">select role</option>
                  <option value="student">Student</option>
                  <option value="club-admin">Club Admin</option>
                  <option value="sponsor">Sponsor</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#202938] text-white rounded-md hover:bg-[#1a2330] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#202938] transition"
            >
              {type === 'login' ? 'Sign in' : 'Register'}
            </button>
          </div>
          <div className="text-center text-sm text-gray-600">
            {type === 'login' ? (
              <p>
                Don’t have an account?{' '}
                <Link to="/register" className="text-indigo-600 hover:text-indigo-500">
                  Register
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}