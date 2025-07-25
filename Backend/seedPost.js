import mongoose from 'mongoose'
import Post from './models/Post.js';

const MONGODB_URI = process.env.MONGO_URL; // Use environment variable for MongoDB URI
const FIXED_POST_ID = '6874a8db19cc1f7385b20831'; // Fixed ID for testing

async function seedPost() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingPost = await Post.findById(FIXED_POST_ID);
    if (existingPost) {
      console.log('Test post already exists:', existingPost._id);
      process.exit(0);
    }

    const newPost = new Post({
      _id: mongoose.Types.ObjectId(FIXED_POST_ID),
      title: 'Test Post for Debugging',
      desc: 'This is a test post created to fix 404 and 500 errors.',
      photo: '1752423968226Screenshot_2025-07-13_213146.png',
      name: 'Test Author',
      userId: 'testuserid123',
      categories: ['test', 'debug'],
    });

    const savedPost = await newPost.save();
    console.log('Test post created with ID:', savedPost._id);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding test post:', error);
    process.exit(1);
  }
}

seedPost();
