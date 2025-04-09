import { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Admin Login:', { email, password });

    if (email === "admin@example.com" && password === "admin123") {
      navigate('/AdminDashboard');
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="relative bg-gray-900 text-white min-h-screen flex flex-col items-center px-4 sm:px-6 py-8">
      <Navbar />
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-md bg-gray-800 rounded-lg shadow-lg mt-12 p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3 text-center">Admin Login</h2>
        <p className="text-gray-400 text-center mb-6 text-sm sm:text-base">
          Sign in to access the admin dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm mb-2">Email</label>
            <div className="flex items-center border border-gray-600 rounded-lg p-2 bg-gray-700">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="bg-transparent outline-none flex-1 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-2">Password</label>
            <div className="flex items-center border border-gray-600 rounded-lg p-2 bg-gray-700">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="bg-transparent outline-none flex-1 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition text-sm sm:text-base"
          >
            Sign In
          </button>
        </form>

        <footer className="mt-8 text-center text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2025 YouTube Downloader</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLogin;
