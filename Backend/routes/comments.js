
import express from 'express';
import Comment from '../models/Comment.js';
import { VerifyToken } from '../middleware/verifiedtoken.js';
const router = express.Router();

// Create comment
router.post("/create", VerifyToken, async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update comment
router.put("/:id", VerifyToken, async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete comment
router.delete("/:id", VerifyToken, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

import Post from '../models/Post.js';

import mongoose from 'mongoose';
// Get comments by post
router.get("/post/:postId", async (req, res) => {
  try {
    console.log("Fetching comments for post ID:", req.params.postId);
    // Validate postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      console.log("Invalid post ID:", req.params.postId);
      return res.status(400).json({ message: "Invalid post ID" });
    }
    // Check if post exists
    const post = await Post.findById(req.params.postId);
    if (!post) {
      console.log("Post not found for ID:", req.params.postId);
      return res.status(404).json({ message: "Post not found" });
    }
    const comments = await Comment.find({ postId: req.params.postId });
    console.log("Comments found:", comments.length);
    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err.message);
    console.error("Stack trace:", err.stack);
    res.status(500).json({ message: "Server error fetching comments", error: err.message });
  }
});

export default router;
