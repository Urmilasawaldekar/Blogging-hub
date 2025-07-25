import React, { useContext, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
import { UserContext } from '../components/context/UserContext';
import axios from 'axios';
import { URL } from '../url';

function Profile() {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl">Loading user profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const updateData = { name };
      if (password.trim() !== '') {
        updateData.password = password;
      }
      const res = await axios.put(`${URL}/api/users/${user._id}`, updateData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      setUser(res.data);
      setMessage('Profile updated successfully.');
      setPassword('');
    } catch (err) {
      setError('Failed to update profile.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow rounded">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="email">Email (read-only)</label>
            <input
              id="email"
              type="email"
              value={email}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Leave blank to keep current password"
            />
          </div>
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded font-semibold"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
