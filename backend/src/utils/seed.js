import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Rating from "../models/Rating.js";

dotenv.config();

const posts = [
  {
    title: "Designing a Scalable Portfolio API",
    excerpt: "How I structured a modular Express backend for content-heavy apps.",
    content: "This post walks through route design, service extraction, and validation patterns.",
    tags: ["node", "express", "architecture"],
    isTopPick: true,
  },
  {
    title: "React Patterns for Content Sites",
    excerpt: "Reusable UI and state boundaries for blogs and dashboards.",
    content: "This post covers route-level data fetching, API service wrappers, and protected routes.",
    tags: ["react", "frontend", "patterns"],
    isTopPick: false,
  },
];

const toSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const seed = async () => {
  await connectDb();

  await Promise.all([
    User.deleteMany({}),
    Post.deleteMany({}),
    Comment.deleteMany({}),
    Rating.deleteMany({}),
  ]);

  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await User.create({
    email: (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase(),
    passwordHash,
  });

  await Post.insertMany(posts.map((post) => ({ ...post, slug: toSlug(post.title) })));

  console.log("Seed complete");
  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
