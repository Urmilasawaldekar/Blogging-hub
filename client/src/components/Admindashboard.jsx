import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from './Loader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Admindashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/admin/getuser', { withCredentials: true });
      setUsers(res.data.users || []);
    } catch (err) {
      setError('Failed to fetch users.');
      toast.error('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/admin/logout", { withCredentials: true })
      setUser(null)
      navigate("/login")
    } catch (err) {
      console.log(err)
    }
  }


  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/api/admin/deletuser/${userId}`, { withCredentials: true });
      toast.success('User deleted');
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-black hover:text-gray-700 transition">
                    <Link to='/'>Blogging Hub</Link>
        
        </h1>
        <button
          onClick={handleLogout}
          className="text-black border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition duration-200"
        >
          Logout
        </button>
      </nav>

      {/* Content */}
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Admin Dashboard - Users</h2>
        <button
          onClick={fetchUsers}
          className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          🔄 Refresh Users
        </button>

        {loading ? (
          <div className="h-[60vh] flex justify-center items-center w-full">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-red-600 font-semibold">{error}</div>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 capitalize">{user.role}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admindashboard;