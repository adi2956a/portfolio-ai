import { Router } from "express";
import { upsertRating } from "../controllers/ratingController.js";

const router = Router();

router.post("/", upsertRating);

export default router;
