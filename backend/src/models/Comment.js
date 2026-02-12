import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    text: { type: String, trim: true, default: "" },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
