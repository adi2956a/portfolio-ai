import mongoose from "mongoose";
import Rating from "../models/Rating.js";
import { getAverageRating } from "../services/ratingService.js";
import { isValidObjectId } from "../utils/validators.js";

export const upsertRating = async (req, res, next) => {
  try {
    const { postId, value } = req.body;
    const numericValue = Number(value);

    if (!postId || Number.isNaN(numericValue)) {
      return res.status(400).json({ message: "postId and value are required" });
    }

    if (!isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }

    if (numericValue < 1 || numericValue > 5) {
      return res.status(400).json({ message: "Rating value must be between 1 and 5" });
    }

    const identifier = req.ip || req.headers["x-forwarded-for"] || "anonymous";

    await Rating.findOneAndUpdate(
      { post: postId, identifier },
      { value: numericValue },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const summary = await getAverageRating(new mongoose.Types.ObjectId(postId));
    return res.json(summary);
  } catch (error) {
    return next(error);
  }
};
