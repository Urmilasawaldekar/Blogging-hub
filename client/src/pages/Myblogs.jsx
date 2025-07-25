import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
import Homepost from '../components/Homepost';
import { UserContext } from '../components/context/UserContext';
import { URL } from '../url';

function Myblogs() {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError('User not logged in');
      return;
    }
    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(`${URL}/api/posts/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
          withCredentials: true,
        });
        setPosts(res.data);
      } catch (err) {
        setError('Failed to fetch user posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, [user]);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 mt-8">
        <h1 className="text-3xl font-bold mb-6">My Blogs</h1>
        {loading && <p>Loading your posts...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && posts.length === 0 && <p>You have no posts yet.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Homepost key={post._id} post={post} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Myblogs;
