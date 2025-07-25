import express from 'express';
import Post from '../models/Post.js';
import * as Comment from '../models/Comment.js';
import { VerifyToken } from '../middleware/verifiedtoken.js';
const router = express.Router();

// Create post
router.post("/create", VerifyToken, async (req, res) => {
  try {
    // Validate required fields
    let { title, desc, photo, name, userId, categories } = req.body;
    console.log("Received post creation request:", req.body);
    if (!title || !desc || !photo || !name || !userId) {
      console.log("Missing required fields in post creation request");
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Sanitize photo filename to replace spaces with underscores and remove special chars
    photo = photo.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\.-]/g, '');

    console.log("Sanitized photo filename:", photo);
    console.log("Categories received:", categories);

    // Check if photo file exists in Backend/images directory
    const fs = await import('fs/promises');
    const path = await import('path');
    const imagesDir = path.resolve('Backend/images');
    const photoPath = path.join(imagesDir, photo);
    try {
      await fs.access(photoPath);
      console.log("Photo file exists:", photoPath);
    } catch (fileErr) {
      console.warn("Photo file does not exist:", photoPath);
      // Optionally, you can reject the request or proceed with a default image
      // return res.status(400).json({ message: "Photo file does not exist on server" });
    }

    const newPost = new Post({ ...req.body, photo });
    const savedPost = await newPost.save();
    console.log("Post saved successfully:", savedPost);
    res.status(200).json(savedPost);
  } catch (err) {
    console.error("Post creation error:", err);
    res.status(500).json({ message: "Server error during post creation", error: err.message });
  }
});


import multer from 'multer';
import path from 'path';
import fs from 'fs';

const imagesDir = path.resolve('Backend/images');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const sanitized = Date.now() + '_' + originalName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\.-]/g, '');
    cb(null, sanitized);
  }
});

const upload = multer({ storage: storage });

// Update post with image upload support
router.put("/:id", VerifyToken, upload.single('file'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.photo = req.file.filename;
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete post
router.delete("/:id", VerifyToken, async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ postId: req.params.id });
    res.status(200).json(deletedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

import mongoose from 'mongoose';

// Get posts with optional search
router.get("/", async (req, res) => {
  try {
    const searchFilter = req.query.search
      ? { title: { $regex: req.query.search, $options: "i" } }
      : {};
    const posts = await Post.find(searchFilter);
    // Convert posts to plain objects and ensure _id is string
    const postsObj = posts.map(post => {
      const obj = post.toObject();
      obj._id = obj._id.toString();
      return obj;
    });
    res.status(200).json(postsObj);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get user posts
router.get("/user/:userId", async (req, res) => {
  try {
    const userPosts = await Post.find({ userId: req.params.userId });
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Existing routes...

// Diagnostic route to check posts in DB
router.get("/diagnostic", async (req, res) => {
  try {
    const count = await Post.countDocuments();
    const posts = await Post.find().limit(5).select('_id title');
    res.status(200).json({ count, posts });
  } catch (err) {
    console.error("Error in diagnostic route:", err);
    res.status(500).json({ message: "Server error in diagnostic route" });
  }
});

// Get post details
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Fetching post with ID:", id, "Type:", typeof id);
    console.log("Database name:", mongoose.connection.name);
    console.log("Post collection name:", Post.collection.name);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid post ID:", id);
      return res.status(400).json({ message: "Invalid post ID" });
    }
    
    const post = await Post.findById(id);
    if (!post) {
      console.log("Post not found for ID:", id);
      return res.status(404).json({ message: "Post not found" });
    }
    // Convert Mongoose document to plain object and remove __v field
    const postObj = post.toObject();
    delete postObj.__v;
    // Ensure photo field is a string and not undefined
    postObj.photo = postObj.photo || "";
    console.log("Post found:", postObj);
    res.status(200).json(postObj);
  } catch (err) {
    console.error("Error fetching post:", err.message);
    console.error("Stack trace:", err.stack);
    res.status(500).json({ message: "Server error fetching post", error: err.message });
  }
});

// import fs from 'fs/promises';
// import path from 'path';

// New diagnostic route to list image files and post photo filenames
router.get("/diagnostic/images", async (req, res) => {
  try {
    const imagesDir = path.resolve('../Backend/images');
    const files = await fs.readdir(imagesDir);
    const posts = await Post.find({}, 'photo').lean();
    const postPhotos = posts.map(p => p.photo).filter(Boolean);
    res.status(200).json({ files, postPhotos });
  } catch (err) {
    console.error("Error in images diagnostic route:", err);
    res.status(500).json({ message: "Server error in images diagnostic route" });
  }
});

export default router;
