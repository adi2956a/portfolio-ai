import mongoose from "mongoose";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Rating from "../models/Rating.js";
import { getAverageRating } from "../services/ratingService.js";

const toSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const postProjection = async (post) => {
  const rating = await getAverageRating(new mongoose.Types.ObjectId(post._id));
  return {
    ...post.toObject(),
    averageRating: rating.average,
    ratingCount: rating.count,
  };
};

export const getPosts = async (_req, res, next) => {
  try {
    const posts = await Post.find().sort({ publishedAt: -1 });
    const payload = await Promise.all(posts.map(postProjection));
    res.json(payload);
  } catch (error) {
    next(error);
  }
};

export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ post: post._id }).sort({ createdAt: -1 });
    const payload = await postProjection(post);

    return res.json({ ...payload, comments });
  } catch (error) {
    return next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, excerpt, content, tags = [], isTopPick = false } = req.body;

    if (!title || !excerpt || !content) {
      return res.status(400).json({ message: "Title, excerpt, and content are required" });
    }

    const slug = toSlug(title);
    const exists = await Post.findOne({ slug });
    if (exists) {
      return res.status(409).json({ message: "A post with this title already exists" });
    }

    const post = await Post.create({ title, slug, excerpt, content, tags, isTopPick });
    return res.status(201).json(post);
  } catch (error) {
    return next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, tags, isTopPick } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (title && title !== post.title) {
      const newSlug = toSlug(title);
      const duplicate = await Post.findOne({ slug: newSlug, _id: { $ne: id } });
      if (duplicate) {
        return res.status(409).json({ message: "Title conflicts with existing post" });
      }
      post.title = title;
      post.slug = newSlug;
    }

    if (typeof excerpt === "string") post.excerpt = excerpt;
    if (typeof content === "string") post.content = content;
    if (Array.isArray(tags)) post.tags = tags;
    if (typeof isTopPick === "boolean") post.isTopPick = isTopPick;

    await post.save();
    return res.json(post);
  } catch (error) {
    return next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Promise.all([Comment.deleteMany({ post: id }), Rating.deleteMany({ post: id })]);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
