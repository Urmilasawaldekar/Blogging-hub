import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
import Comment from '../components/comment'
import Loader from '../components/Loader';

import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { FcManager } from 'react-icons/fc';

import { URL, IF } from '../url';
import { UserContext } from '../components/context/UserContext';

function Postdetail() {
  const { id: postId } = useParams(); // Fix: destructure 'id' as 'postId'
  // Added state to track comments without full reload
  const [post, setPost] = useState({
    title: '',
    desc: '',
    photo: '',
    name: '',
    userId: '',
    categories: [],
    createdAt: '',
  });
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [loader, setLoader] = useState(false);
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);

  // 📥 Fetch post data
  const fetchPost = async () => {
    if (!postId) {
      toast.error('Invalid post ID.');
      setError('Invalid post ID.');
      return;
    }
    setLoadingPost(true);
    setError(null);
    try {
      const res = await axios.get(`${URL}/api/posts/${postId}`);
      if (!res.data || Object.keys(res.data).length === 0) {
        toast.error('Post not found.');
        setError('Post not found.');
        navigate('/');
      } else {
        console.log("Post photo filename:", res.data.photo);
        setPost({
          title: res.data.title || '',
          desc: res.data.desc || '',
          photo: res.data.photo || '',
          name: res.data.name || '',
          userId: res.data.userId || '',
          categories: Array.isArray(res.data.categories) ? res.data.categories : [],
          createdAt: res.data.createdAt || '',
        });
      }
    } catch (err) {
      toast.error('Error fetching post details.');
      console.error('Error fetching post details:', err);
      setError('Error fetching post details.');
    } finally {
      setLoadingPost(false);
    }
  };

  // 💬 Fetch comments
  const fetchPostComments = async () => {
    setLoader(true);
    try {
      const res = await axios.get(`${URL}/api/comments/post/${postId}`);
      setComments(res.data);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      toast.error('Error fetching comments.');
      console.error('Error fetching comments:', err);
    }
  };

  // 🗑 Delete post
  const handleDeletePost = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      setIsLoading(true); // Optional loading state
      const res = await axios.delete(`${URL}/api/posts/${postId}`, {
        withCredentials: true,
      });
      console.log(res.data);
      toast.success("Post deleted successfully"); // Optional toast
      navigate('/', { replace: true });
      // Force a reload to ensure navigation happens
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post"); // Optional toast
    } finally {
      setIsLoading(false);
    }
  };

  // 📝 Add comment
  const postComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }
    if (!user?.name || !user?._id) {
      toast.error('User information is missing. Please login again.');
      return;
    }

    try {
      const res = await axios.post(
        `${URL}/api/comments/create`,
        {
          comment,
          author: user.name,
          postId,
          userId: user._id,
        },
        { withCredentials: true }
      );
      // Update comments state without full reload
      setComments(prevComments => [...prevComments, res.data]);
      setComment('');
      toast.success('Comment added successfully.');
    } catch (err) {
      console.error('Error posting comment:', err);
      toast.error('Failed to post comment. Please try again.');
    }
  };

  useEffect(() => {
    fetchPost();
    fetchPostComments();
  }, [postId]);

  return (
    <div>
      <Navbar />
      {loadingPost || loader ? (
        <div className='h-[80vh] flex justify-center items-center w-full'>
          <Loader />
        </div>
      ) : error ? (
        <div className='h-[80vh] flex justify-center items-center w-full text-red-600 font-semibold'>
          {error}
        </div>
      ) : (
        <div className='px-8 md:px-[200px] mt-8'>
          <div className='border p-3 shadow'>
            <div className='flex justify-between items-center'>
              <h1 className='text-3xl font-bold text-black md:text-3xl'>
                {post.title}
                <div className='flex font-light flex-col justify-between text-sm text-gray-500 ml-4'>
                  By : {post.name}&nbsp;
                  Created at {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                </div>
              </h1>

              {user?._id === post?.userId && (
                <div className='flex items-center justify-center space-x-2'>
                  <p
                    className='cursor-pointer'
                    onClick={() => navigate(`/edit/${postId}`)}
                  >
                    <BiEdit />
                  </p>
                  <button
                    disabled={isLoading}
                    onClick={handleDeletePost}
                    className={`cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
                   >
                    {isLoading ? "Deleting..." : <MdDelete /> }
                    
                  </button>
                </div>
              )}
            </div>

            <div className='w-full flex flex-col justify-center'>
              <img
                src={post.photo ? `${URL}/images/${encodeURIComponent(post.photo)}` : '/fallback-image.png'}
                className='object-cover h-[45vh] mx-auto mt-8'
                alt='Post'
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/fallback-image.png';
                }}
              />

              <p className='mx-auto mt-8 w-[100vh] border p-5 shadow-xl md:space-x-8 w-200px'>
                {post.desc}
              </p>

              <div className='flex justify-center items-center mt-8 space-x-2 font-semibold'>
                <p>Categories :</p>
                <div className='flex justify-center items-center space-x-2'>
                  {post.categories?.map((c, i) => (
                    <div key={i} className='bg-gray-300 rounded-xl px-3 py-1'>
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              <div className='mt-8 flex flex-col items-center w-full'>
                <h3 className='font-semibold mb-4 text-center'>Comments:</h3>

                <div className='flex justify-center flex-wrap gap-4'>
                  {comments.map((c, index) => (
                    <Comment key={c.id ?? index} c={c} post={post} />
                  ))}
                </div>

                <div className='border flex flex-col md:flex-row justify-center items-center w-full md:w-[500px] space-y-2 md:space-y-0 md:space-x-2 mt-4 mb-4'>
                  <input
                    type='text'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='Write your comment'
                    className='w-full md:w-[80%] outline-none py-2 px-4'
                  />
                  <button
                    onClick={postComment}
                    className='bg-black text-sm text-white font-semibold px-4 py-2 w-full md:w-[40%]'
                  >
                    Add comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Postdetail;
