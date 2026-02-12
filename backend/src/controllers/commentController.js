import Comment from "../models/Comment.js";
import { isValidObjectId } from "../utils/validators.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createComment = async (req, res, next) => {
  try {
    const { postId, name, email, text } = req.body;

    if (!postId || !name || !email) {
      return res.status(400).json({ message: "postId, name, and email are required" });
    }

    if (!isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const comment = await Comment.create({
      post: postId,
      name: normalizedName,
      email: normalizedEmail,
      text: text?.trim() || "",
    });
    return res.status(201).json(comment);
  } catch (error) {
    return next(error);
  }
};

export const getAllComments = async (_req, res, next) => {
  try {
    const comments = await Comment.find()
      .populate("post", "title slug")
      .sort({ createdAt: -1 });
    return res.json(comments);
  } catch (error) {
    return next(error);
  }
};

export const approveComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.json(comment);
  } catch (error) {
    return next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
