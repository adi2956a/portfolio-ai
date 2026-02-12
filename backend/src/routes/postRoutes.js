import { Router } from "express";
import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/", getPosts);
router.get("/:slug", getPostBySlug);
router.post("/", requireAdmin, createPost);
router.put("/:id", requireAdmin, updatePost);
router.delete("/:id", requireAdmin, deletePost);

export default router;
