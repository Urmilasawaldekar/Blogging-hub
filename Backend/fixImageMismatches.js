import mongoose from 'mongoose';
import Post from './models/Post.js';
import path from 'path';
import fs from 'fs/promises';

const imagesDir = path.resolve('Backend/images');

async function fixMissingPhotos() {
  try {
    const mongoUri = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb+srv://urmilasawaldekar201087:Urmilablogging@cluster0.mhipk6i.mongodb.net';
    if (!mongoUri) {
      throw new Error('Missing MongoDB connection string in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const posts = await Post.find({});
    const files = await fs.readdir(imagesDir);

    let updatedCount = 0;

    for (const post of posts) {
      if (!post.photo || post.photo.trim() === '') {
        // Log posts with missing photo field
        console.log(`Post ${post._id} has missing photo field.`);
        // Optionally, set a default photo or leave as is
      } else {
        // Check if photo file exists
        if (!files.includes(post.photo)) {
          console.log(`Photo file ${post.photo} for post ${post._id} not found in images folder.`);
          // Clear photo field to avoid broken image links
          post.photo = '';
          await post.save();
          updatedCount++;
        }
      }
    }

    console.log(`Completed fixing image mismatches. Updated ${updatedCount} posts.`);
    process.exit(0);
  } catch (err) {
    console.error('Error fixing image mismatches:', err);
    process.exit(1);
  }
}

fixMissingPhotos();
