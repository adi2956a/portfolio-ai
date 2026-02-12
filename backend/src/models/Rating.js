import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    identifier: { type: String, required: true, index: true },
    value: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

ratingSchema.index({ post: 1, identifier: 1 }, { unique: true });

export default mongoose.model("Rating", ratingSchema);
