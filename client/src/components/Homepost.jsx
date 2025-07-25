import React from 'react';
import { Link } from 'react-router-dom';
import { IF } from '../url';

function Homepost({ post }) {
  console.log("Rendering post with _id:", post._id);
  const fallbackImage = '/fallback-image.png';

  const photoUrl = post.photo
    ? post.photo.startsWith('http')
      ? post.photo
      : `/images/${encodeURIComponent(post.photo)}`
    : fallbackImage;

  return (
    <div className="max-w-md rounded overflow-hidden  h-[500px] shadow-lg m-4 bg-white">
      <img
        className="w-full h-48  object-cover"
        src={photoUrl}
        alt={post.title || 'Fallback Image'}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackImage;
        }}
      />
      <div className="px-6 py-4">
        <div className="font-bold  tracking-tightS text-xl mb-2">{post.title}</div>
        <div className="px-6 py-2 flex items-center text-gray-500 text-xl mb-2">
          <span>By :</span>
          <span className="ml-2">{post.name}</span>
        </div>
        <p className="text-gray-700 text-base">
          {post.desc && post.desc.length > 100 ? post.desc.substring(0, 100) + '...' : post.desc}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        {post.categories && Array.isArray(post.categories) && post.categories.filter(cat => cat && cat.toString().trim() !== '' && cat.toString() !== '0').map((cat, index) => (
          <span
            key={index}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >
            {cat}
          </span>
        ))}
      </div>
      <div className="px-6 pb-4">
        <Link
          to={`/posts/post/${post._id}`}
          className="text-blue-500 hover:text-blue-700 font-semibold"
        >
          Read More
        </Link>
      </div>
    </div>
  )
}

export default Homepost
