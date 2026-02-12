import { Router } from "express";
import {
  createComment,
  getAllComments,
  approveComment,
  deleteComment,
} from "../controllers/commentController.js";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();

router.post("/", createComment);
router.get("/", requireAdmin, getAllComments);
router.patch("/:id/approve", requireAdmin, approveComment);
router.delete("/:id", requireAdmin, deleteComment);

export default router;
